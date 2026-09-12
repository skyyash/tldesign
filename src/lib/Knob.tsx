import { useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Editor, TLShape, TLShapeId, createShapeId } from 'tldraw'

const KNOB_SIZE = 16

export function Knob({
	editor,
	shape,
	x,
	y,
}: {
	editor: Editor
	shape: TLShape
	x: number
	y: number
}) {
	const [arrowId, setArrowId] = useState<TLShapeId | null>(null)

	const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
		if (e.button !== 0) return
		e.stopPropagation()
		const knobPage = editor.getShapePageTransform(shape.id)!.applyToPoint({ x, y })
		const id = createShapeId()

		editor.createShape({
			id,
			type: 'arrow',
			props: {
				start: { x: knobPage.x, y: knobPage.y },
				end: { x: knobPage.x, y: knobPage.y },
			},
		})

		editor.createBinding({
			type: 'arrow',
			fromId: id,
			toId: shape.id,
			props: {
				terminal: 'start',
				normalizedAnchor: { x: 0.5, y: 0.5 },
				isPrecise: false,
				isExact: false,
				snap: 'none',
			},
		})

		setArrowId(id)
		e.currentTarget.setPointerCapture(e.pointerId)
	}

	const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
		if (!arrowId) return
		const point = editor.screenToPage({ x: e.clientX, y: e.clientY })
		editor.updateShape({ id: arrowId, type: 'arrow', props: { end: { x: point.x, y: point.y } } })
	}

	const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
		if (!arrowId) return
		const point = editor.screenToPage({ x: e.clientX, y: e.clientY })
		const candidates = editor.getShapesAtPoint(point, { hitInside: true, margin: 8 })
		const target = candidates.find(
			(candidate) => candidate.id !== shape.id && candidate.type !== 'arrow'
		)

		if (target) {
			editor.createBinding({
				type: 'arrow',
				fromId: arrowId,
				toId: target.id,
				props: {
					terminal: 'end',
					normalizedAnchor: { x: 0.5, y: 0.5 },
					isPrecise: false,
					isExact: false,
					snap: 'none',
				},
			})
		}

		setArrowId(null)
	}

	const handlePointerCancel = () => {
		if (!arrowId) return
		editor.deleteShapes([arrowId])
		setArrowId(null)
	}

	return (
		<div
			data-knob="true"
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerCancel}
			style={{
				position: 'absolute',
				left: x - KNOB_SIZE / 2,
				top: y - KNOB_SIZE / 2,
				width: KNOB_SIZE,
				height: KNOB_SIZE,
				boxSizing: 'border-box',
				borderRadius: '50%',
				background: 'var(--tl-color-primary)',
				border: '2px solid var(--tl-color-panel)',
				boxShadow: '0 1px 4px rgba(0, 0, 0, 0.35)',
				cursor: 'crosshair',
				pointerEvents: 'all',
				zIndex: 10,
				touchAction: 'none',
			}}
		/>
	)
}