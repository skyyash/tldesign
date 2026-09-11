import {
	createShapeId,
	HTMLContainer,
	Rectangle2d,
	renderPlaintextFromRichText,
	RichTextLabel,
	richTextValidator,
	ShapeUtil,
	T,
	TLRichText,
	TLShape,
	toRichText,
	useEditor,
	useValue,
} from 'tldraw'

const PROMPT_TYPE = 'prompt'

declare module 'tldraw' {
	export interface TLGlobalShapePropsMap {
		[PROMPT_TYPE]: { w: number; h: number; richText: TLRichText }
	}
}

export type PromptShape = TLShape<typeof PROMPT_TYPE>

const OUTPUTS = ['Model A', 'Model B', 'Model C']

const ARTEFACT_W = 300
const ARTEFACT_H = 200
const ARTEFACT_GAP = 240
const ARTEFACT_OFFSET_X = 300

const artefactCode = (label: string) =>
	`<style>body{font-family:sans-serif;padding:24px}</style><h1>${label}</h1><p>Model output placeholder.</p>`

export class PromptShapeUtil extends ShapeUtil<PromptShape> {
	static override type = PROMPT_TYPE
	static override props = { w: T.number, h: T.number, richText: richTextValidator }

	override canEdit() {
		return true
	}

	getDefaultProps(): PromptShape['props'] {
		return { w: 260, h: 140, richText: toRichText('Describe what you want to design...') }
	}

	getGeometry(shape: PromptShape) {
		return new Rectangle2d({ width: shape.props.w, height: shape.props.h, isFilled: true })
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
}

function PromptComponent({ shape }: { shape: PromptShape }) {
	const editor = useEditor()
	const isSelected = useValue(
		'is selected',
		() => shape.id === editor.getOnlySelectedShapeId(),
		[editor, shape.id]
	)

	const run = () => {
		const bounds = editor.getShapePageBounds(shape)
		if (!bounds) return
		if (editor.getBindingsInvolvingShape(shape.id, 'arrow').length > 0) return

		const promptX = bounds.maxX
		const promptY = bounds.midY
		const outputX = bounds.maxX + ARTEFACT_OFFSET_X
		const totalH = (OUTPUTS.length - 1) * ARTEFACT_GAP

		editor.run(() => {
			OUTPUTS.forEach((label, i) => {
				const outputMidY = promptY - totalH / 2 + i * ARTEFACT_GAP
				const outputId = createShapeId()

				editor.createShape({
					id: outputId,
					type: 'artefact',
					x: outputX,
					y: outputMidY - ARTEFACT_H / 2,
					props: {
						w: ARTEFACT_W,
						h: ARTEFACT_H,
						code: artefactCode(label),
					},
				})

				const arrowId = createShapeId()
				editor.createShape({
					id: arrowId,
					type: 'arrow',
					props: {
						start: { x: promptX, y: promptY },
						end: { x: outputX, y: outputMidY },
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
					toId: shape.id,
					props: { ...bindingProps, terminal: 'start' },
				})
				editor.createBinding({
					type: 'arrow',
					fromId: arrowId,
					toId: outputId,
					props: { ...bindingProps, terminal: 'end' },
				})
			})
		})
	}

	return (
		<HTMLContainer
			style={{
				display: 'flex',
				flexDirection: 'column',
				boxSizing: 'border-box',
				background: 'var(--tl-color-panel)',
				border: '2px solid var(--tl-color-text-1)',
				borderRadius: 10,
				overflow: 'hidden',
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
				<button
					type="button"
					aria-label="Run prompt"
					onPointerDown={(e) => e.stopPropagation()}
					onClick={run}
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
						cursor: 'pointer',
					}}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M8 5v14l11-7z" />
					</svg>
				</button>
			</div>
			<div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
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