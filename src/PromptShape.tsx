import { useEffect, useRef, useState } from 'react'
import {
	BaseBoxShapeUtil,
	createShapeId,
	HTMLContainer,
	renderPlaintextFromRichText,
	RichTextLabel,
	richTextValidator,
	T,
	TLHandleDragInfo,
	TLRichText,
	TLShape,
	TLShapeId,
	toRichText,
	useEditor,
	useValue,
} from 'tldraw'
import {
	cancelKnobArrow,
	dragKnobArrow,
	endKnobArrow,
	knobHandles,
	startKnobArrow,
} from './lib/knobArrow'
import { OpenRouterModel, displayName, getModelCatalog } from './lib/modelCatalog'
import { ChatMessage, chatCompletion } from './lib/openrouter'
import { useSettings } from './lib/settings'

const PROMPT_TYPE = 'prompt'

declare module 'tldraw' {
	export interface TLGlobalShapePropsMap {
		[PROMPT_TYPE]: { w: number; h: number; richText: TLRichText; models: string[] }
	}
}

export type PromptShape = TLShape<typeof PROMPT_TYPE>

const ARTEFACT_W = 300
const ARTEFACT_H = 200
const ARTEFACT_RADIUS = 420

const SYSTEM_PROMPT =
	'You are a design assistant. Respond with ONLY a single, self-contained HTML ' +
	'document that implements the described design. Do not wrap it in markdown code ' +
	'fences and do not add explanations.'

const GENERATING_CODE = `<style>
  body { font-family: sans-serif; display: flex; align-items: center;
         justify-content: center; height: 100vh; margin: 0; color: #888; }
</style>
<div>Generating...</div>`

const escapeHtml = (value: string) =>
	value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const errorCode = (message: string) => `<style>
  body { font-family: sans-serif; display: flex; align-items: center;
         justify-content: center; height: 100vh; margin: 0; padding: 24px;
         color: #b00020; text-align: center; }
</style>
<div>Error: ${escapeHtml(message)}</div>`

const stripCodeFences = (html: string) => {
	const match = html.match(/^\s*```(?:html)?\s*([\s\S]*?)\s*```\s*$/)
	return match ? match[1] : html
}

export class PromptShapeUtil extends BaseBoxShapeUtil<PromptShape> {
	static override type = PROMPT_TYPE
	static override props = {
		w: T.number,
		h: T.number,
		richText: richTextValidator,
		models: T.arrayOf(T.string),
	}

	override canEdit() {
		return true
	}

	getDefaultProps(): PromptShape['props'] {
		return {
			w: 260,
			h: 140,
			richText: toRichText('Describe what you want to design...'),
			models: [],
		}
	}

	override getText(shape: PromptShape) {
		return renderPlaintextFromRichText(this.editor, shape.props.richText)
	}

	component(shape: PromptShape) {
		return <PromptComponent shape={shape} />
	}

	getIndicatorPath(shape: PromptShape) {
		const path = new Path2D()
		path.rect(0, 0, shape.props.w, shape.props.h)
		return path
	}

	override getHandles(shape: PromptShape) {
		return knobHandles(shape.props.w, shape.props.h)
	}

	override onHandleDragStart(shape: PromptShape, info: TLHandleDragInfo<PromptShape>) {
		startKnobArrow(this.editor, shape, info.handle)
	}

	override onHandleDrag(shape: PromptShape) {
		dragKnobArrow(this.editor, shape)
	}

	override onHandleDragEnd(current: PromptShape) {
		endKnobArrow(this.editor, current)
	}

	override onHandleDragCancel(current: PromptShape) {
		cancelKnobArrow(this.editor, current)
	}
}

function PromptComponent({ shape }: { shape: PromptShape }) {
	const editor = useEditor()
	const { settings } = useSettings()
	const isSelected = useValue(
		'is selected',
		() => shape.id === editor.getOnlySelectedShapeId(),
		[editor, shape.id]
	)

	const [catalog, setCatalog] = useState<OpenRouterModel[] | null>(null)
	const [open, setOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const runIdRef = useRef(0)

	useEffect(() => {
		let cancelled = false
		getModelCatalog()
			.then((result) => {
				if (!cancelled) setCatalog(result.models)
			})
			.catch(() => {
				// leave catalog as null; ids are shown as-is
			})
		return () => {
			cancelled = true
		}
	}, [])

	useEffect(() => {
		if (!open) return
		const onPointerDown = (e: PointerEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false)
		}
		document.addEventListener('pointerdown', onPointerDown, true)
		return () => document.removeEventListener('pointerdown', onPointerDown, true)
	}, [open])

	const hasKey = settings.apiKey.length > 0
	const selectedModels = shape.props.models.filter((id) => settings.enabledModels.includes(id))

	const modelName = (id: string) => {
		const model = catalog?.find((m) => m.id === id)
		return model ? displayName(model) : id
	}

	const toggleModel = (model: string) => {
		const has = shape.props.models.includes(model)
		const models = has
			? shape.props.models.filter((m) => m !== model)
			: [...shape.props.models, model]
		editor.updateShape({ id: shape.id, type: shape.type, props: { models } })
	}

	const run = () => {
		const current = editor.getShape<PromptShape>(shape.id)
		if (!current) return
		const bounds = editor.getShapePageBounds(current)
		if (!bounds) return
		const models = selectedModels
		if (models.length === 0) return
		const apiKey = settings.apiKey
		if (!apiKey) return

		const promptText = renderPlaintextFromRichText(editor, current.props.richText).trim()
		const messages: ChatMessage[] = [
			{ role: 'system', content: SYSTEM_PROMPT },
			{ role: 'user', content: promptText || 'Create a simple, attractive design.' },
		]

		const runId = ++runIdRef.current
		const promptCenter = { x: bounds.x + bounds.w / 2, y: bounds.y + bounds.h / 2 }

		const outputs: { model: string; outputId: TLShapeId }[] = []

		editor.run(() => {
			const spawnedIds = (current.meta as { spawnedIds?: TLShapeId[] }).spawnedIds
			if (spawnedIds && spawnedIds.length > 0) {
				editor.deleteShapes(spawnedIds)
			}

			const nextSpawnedIds: TLShapeId[] = []

			models.forEach((model, i) => {
				const angle = -Math.PI / 2 + (2 * Math.PI * i) / models.length
				const outputMidX = promptCenter.x + ARTEFACT_RADIUS * Math.cos(angle)
				const outputMidY = promptCenter.y + ARTEFACT_RADIUS * Math.sin(angle)
				const outputId = createShapeId()
				const arrowId = createShapeId()

				editor.createShape({
					id: outputId,
					type: 'artefact',
					x: outputMidX - ARTEFACT_W / 2,
					y: outputMidY - ARTEFACT_H / 2,
					props: {
						w: ARTEFACT_W,
						h: ARTEFACT_H,
						code: GENERATING_CODE,
					},
				})

				editor.createShape({
					id: arrowId,
					type: 'arrow',
					props: {
						start: { x: promptCenter.x, y: promptCenter.y },
						end: { x: outputMidX, y: outputMidY },
						size: 's',
						richText: toRichText(modelName(model)),
					},
				})

				const bindingProps = {
					normalizedAnchor: { x: 0.5, y: 0.5 },
					isPrecise: false,
					isExact: false,
					snap: 'none' as const,
				}

				editor.createBinding({
					type: 'arrow',
					fromId: arrowId,
					toId: current.id,
					props: { ...bindingProps, terminal: 'start' },
				})
				editor.createBinding({
					type: 'arrow',
					fromId: arrowId,
					toId: outputId,
					props: { ...bindingProps, terminal: 'end' },
				})

				nextSpawnedIds.push(outputId, arrowId)
				outputs.push({ model, outputId })
			})

			editor.updateShape({ id: current.id, type: current.type, meta: { spawnedIds: nextSpawnedIds } })
		})

		const updateArtefact = (outputId: TLShapeId, code: string) => {
			if (runIdRef.current !== runId) return
			if (!editor.getShape(outputId)) return
			editor.updateShape({ id: outputId, type: 'artefact', props: { code } })
		}

		outputs.forEach(({ model, outputId }) => {
			chatCompletion({ apiKey, model, messages })
				.then((content) => updateArtefact(outputId, stripCodeFences(content)))
				.catch((error: Error) => updateArtefact(outputId, errorCode(error.message)))
		})
	}

	const modelCount = selectedModels.length
	const triggerLabel = !hasKey
		? 'Connect'
		: modelCount > 0
			? `${modelCount} model${modelCount > 1 ? 's' : ''}`
			: 'Models'

	return (
		<HTMLContainer
			style={{
				display: 'flex',
				flexDirection: 'column',
				boxSizing: 'border-box',
				background: 'var(--tl-color-panel)',
				border: '2px solid var(--tl-color-text-1)',
				borderRadius: 10,
				color: 'var(--tl-color-text-1)',
				fontSize: 14,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 8,
					padding: '8px 12px',
					borderBottom: '1px solid var(--tl-color-divider)',
					pointerEvents: 'all',
				}}
			>
				<span
					style={{
						fontWeight: 600,
						fontSize: 13,
						letterSpacing: '0.05em',
						textTransform: 'uppercase',
					}}
				>
					Prompt
				</span>
				<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
					<div ref={dropdownRef}>
						<button
							type="button"
							aria-label="Select models"
							onPointerDown={(e) => e.stopPropagation()}
							onClick={() => setOpen(!open)}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 4,
								padding: '4px 8px',
								border: '1px solid var(--tl-color-divider)',
								borderRadius: 6,
								background: 'transparent',
								color: 'var(--tl-color-text-1)',
								fontSize: 12,
								cursor: 'pointer',
							}}
						>
							<span>{triggerLabel}</span>
							<svg
								width="10"
								height="10"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path d="M6 9l6 6 6-6" />
							</svg>
						</button>
						{open && (
							<div
								onPointerDown={(e) => e.stopPropagation()}
								style={{
									position: 'absolute',
									bottom: 'calc(100% + 6px)',
									right: 12,
									minWidth: 170,
									padding: 4,
									background: 'var(--tl-color-panel)',
									border: '1px solid var(--tl-color-divider)',
									borderRadius: 8,
									boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
									zIndex: 100,
									pointerEvents: 'all',
									userSelect: 'none',
								}}
							>
								{!hasKey ? (
									<div
										style={{
											padding: '10px 12px',
											fontSize: 13,
											opacity: 0.85,
											maxWidth: 220,
											lineHeight: 1.4,
										}}
									>
										Add your OpenRouter API key in Settings (gear icon) to connect models.
									</div>
								) : settings.enabledModels.length === 0 ? (
									<div
										style={{
											padding: '10px 12px',
											fontSize: 13,
											opacity: 0.85,
											maxWidth: 220,
											lineHeight: 1.4,
										}}
									>
										No models enabled yet. Enable models in Settings.
									</div>
								) : (
									settings.enabledModels.map((model) => (
										<label
											key={model}
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: 8,
												padding: '6px 8px',
												borderRadius: 6,
												cursor: 'pointer',
												fontSize: 13,
												color: 'var(--tl-color-text-1)',
											}}
										>
											<input
												type="checkbox"
												checked={selectedModels.includes(model)}
												onChange={() => toggleModel(model)}
											/>
											{modelName(model)}
										</label>
									))
								)}
							</div>
						)}
					</div>
					<button
						type="button"
						aria-label="Run prompt"
						onPointerDown={(e) => e.stopPropagation()}
						onClick={run}
						disabled={!hasKey || modelCount === 0}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: 26,
							height: 26,
							padding: 0,
							border: 'none',
							borderRadius: 6,
							background: 'var(--tl-color-primary)',
							color: '#fff',
							cursor: !hasKey || modelCount === 0 ? 'default' : 'pointer',
							opacity: !hasKey || modelCount === 0 ? 0.5 : 1,
						}}
					>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path d="M8 5v14l11-7z" />
						</svg>
					</button>
				</div>
			</div>
			<div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden' }}>
				<RichTextLabel
					shapeId={shape.id}
					type={shape.type}
					fontFamily="sans-serif"
					fontSize={14}
					lineHeight={1.35}
					textAlign="start"
					verticalAlign="start"
					richText={shape.props.richText}
					isSelected={isSelected}
					labelColor="var(--tl-color-text-1)"
					wrap
					padding={12}
				/>
			</div>
		</HTMLContainer>
	)
}