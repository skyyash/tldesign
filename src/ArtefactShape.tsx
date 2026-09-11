import { useEffect, useState, type ChangeEvent } from 'react'
import {
	HTMLContainer,
	Rectangle2d,
	ShapeUtil,
	T,
	TLShape,
	useEditor,
	useValue,
} from 'tldraw'

const ARTEFACT_TYPE = 'artefact'

declare module 'tldraw' {
	export interface TLGlobalShapePropsMap {
		[ARTEFACT_TYPE]: { w: number; h: number; code: string }
	}
}

export type ArtefactShape = TLShape<typeof ARTEFACT_TYPE>

const DEFAULT_CODE = `<style>
  body { font-family: sans-serif; padding: 24px; }
</style>
<h1>Hello from your artefact</h1>
<p>Double-click to edit the code.</p>`

export class ArtefactShapeUtil extends ShapeUtil<ArtefactShape> {
	static override type = ARTEFACT_TYPE
	static override props = { w: T.number, h: T.number, code: T.string }

	override canEdit() {
		return true
	}

	getDefaultProps(): ArtefactShape['props'] {
		return { w: 320, h: 240, code: DEFAULT_CODE }
	}

	getGeometry(shape: ArtefactShape) {
		return new Rectangle2d({ width: shape.props.w, height: shape.props.h, isFilled: true })
	}

	override getText(shape: ArtefactShape) {
		return shape.props.code
	}

	component(shape: ArtefactShape) {
		return <ArtefactComponent shape={shape} />
	}

	getIndicatorPath(shape: ArtefactShape) {
		const path = new Path2D()
		path.rect(0, 0, shape.props.w, shape.props.h)
		return path
	}
}

function ArtefactComponent({ shape }: { shape: ArtefactShape }) {
	const editor = useEditor()
	const isEditing = useValue(
		'is editing',
		() => editor.getEditingShapeId() === shape.id,
		[editor, shape.id]
	)

	return (
		<HTMLContainer
			style={{
				boxSizing: 'border-box',
				background: '#fff',
				border: '2px solid var(--tl-color-text-1)',
				borderRadius: 8,
				overflow: 'hidden',
			}}
		>
			{isEditing ? (
				<CodeEditor shape={shape} />
			) : (
				<iframe
					srcDoc={shape.props.code}
					sandbox="allow-scripts"
					title="Artefact preview"
					style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
				/>
			)}
		</HTMLContainer>
	)
}

function CodeEditor({ shape }: { shape: ArtefactShape }) {
	const editor = useEditor()
	const [draft, setDraft] = useState(shape.props.code)

	useEffect(() => {
		setDraft(shape.props.code)
	}, [shape.props.code])

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const code = e.target.value
		setDraft(code)
		editor.updateShape({ id: shape.id, type: shape.type, props: { code } })
	}

	return (
		<textarea
			autoFocus
			value={draft}
			onChange={handleChange}
			onPointerDown={(e) => e.stopPropagation()}
			spellCheck={false}
			style={{
				width: '100%',
				height: '100%',
				boxSizing: 'border-box',
				resize: 'none',
				border: 'none',
				outline: 'none',
				padding: 10,
				background: '#1e1e1e',
				color: '#d4d4d4',
				fontFamily: 'monospace',
				fontSize: 12,
				lineHeight: 1.5,
				tabSize: 2,
				pointerEvents: 'all',
			}}
		/>
	)
}