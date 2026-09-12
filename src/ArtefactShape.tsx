import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import {
	BaseBoxShapeUtil,
	HTMLContainer,
	T,
	TLShape,
	useEditor,
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

export class ArtefactShapeUtil extends BaseBoxShapeUtil<ArtefactShape> {
	static override type = ARTEFACT_TYPE
	static override props = { w: T.number, h: T.number, code: T.string }

	getDefaultProps(): ArtefactShape['props'] {
		return { w: 320, h: 240, code: DEFAULT_CODE }
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
	const [editing, setEditing] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!editing) return
		const onPointerDown = (e: PointerEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setEditing(false)
			}
		}
		document.addEventListener('pointerdown', onPointerDown, true)
		return () => document.removeEventListener('pointerdown', onPointerDown, true)
	}, [editing])

	const copy = () => {
		navigator.clipboard.writeText(shape.props.code)
	}

	return (
		<HTMLContainer
			style={{
				display: 'flex',
				flexDirection: 'column',
				boxSizing: 'border-box',
				background: '#fff',
				border: '2px solid var(--tl-color-text-1)',
				borderRadius: 8,
				overflow: 'hidden',
			}}
		>
			<div ref={containerRef} style={{ display: 'contents' }}>
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
					Artefact
				</span>
				<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
					<button
						type="button"
						aria-label="Edit code"
						onPointerDown={(e) => e.stopPropagation()}
						onClick={() => setEditing(!editing)}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: 26,
							height: 26,
							padding: 0,
							border: '1px solid var(--tl-color-divider)',
							borderRadius: 6,
							background: 'transparent',
							color: 'var(--tl-color-text-1)',
							cursor: 'pointer',
						}}
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
						</svg>
					</button>
					<button
						type="button"
						aria-label="Copy code"
						onPointerDown={(e) => e.stopPropagation()}
						onClick={copy}
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
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<rect x="9" y="9" width="13" height="13" rx="2" />
							<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
						</svg>
					</button>
				</div>
			</div>
			<div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
				{editing ? (
					<CodeEditor shape={shape} onDone={() => setEditing(false)} />
				) : (
					<iframe
						srcDoc={shape.props.code}
						sandbox="allow-scripts"
						title="Artefact preview"
						style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'all' }}
					/>
				)}
			</div>
			</div>
		</HTMLContainer>
	)
}

function CodeEditor({ shape, onDone }: { shape: ArtefactShape; onDone: () => void }) {
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
			onKeyDown={(e) => {
				if (e.key === 'Escape') onDone()
			}}
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