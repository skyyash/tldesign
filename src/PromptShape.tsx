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

const OUTPUT_W = 200
const OUTPUT_H = 60
const OUTPUT_GAP = 90
const OUTPUT_OFFSET_X = 260

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
		const outputX = bounds.maxX + OUTPUT_OFFSET_X
		const totalH = (OUTPUTS.length - 1) * OUTPUT_GAP

		editor.run(() => {
			OUTPUTS.forEach((label, i) => {
				const outputMidY = promptY - totalH / 2 + i * OUTPUT_GAP
				const outputId = createShapeId()

				editor.createShape({
					id: outputId,
					type: 'geo',
					x: outputX,
					y: outputMidY - OUTPUT_H / 2,
					props: {
						geo: 'rectangle',
						w: OUTPUT_W,
						h: OUTPUT_H,
						richText: toRichText(label),
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
				justifyContent: 'space-between',
				boxSizing: 'border-box',
				padding: 14,
				background: 'var(--tl-color-panel)',
				border: '2px solid var(--tl-color-text-1)',
				borderRadius: 10,
				color: 'var(--tl-color-text-1)',
				fontSize: 14,
			}}
		>
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
			/>
			<button
				type="button"
				onPointerDown={(e) => e.stopPropagation()}
				onClick={run}
				style={{
					alignSelf: 'flex-start',
					position: 'relative',
					zIndex: 4,
					pointerEvents: 'all',
					cursor: 'pointer',
					padding: '6px 14px',
					border: 'none',
					borderRadius: 6,
					background: 'var(--tl-color-primary)',
					color: '#fff',
					fontWeight: 600,
				}}
			>
				Run
			</button>
		</HTMLContainer>
	)
}