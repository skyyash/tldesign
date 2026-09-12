import { Editor, IndexKey, TLHandle, TLShape, TLShapeId, createShapeId } from 'tldraw'

const KNOB_OFFSET = 8

export function knobHandles(w: number, h: number): TLHandle[] {
	return [
		{ id: 'knob-top', index: 'a1' as IndexKey, type: 'vertex', x: w / 2, y: -KNOB_OFFSET },
		{ id: 'knob-right', index: 'a2' as IndexKey, type: 'vertex', x: w + KNOB_OFFSET, y: h / 2 },
		{ id: 'knob-bottom', index: 'a3' as IndexKey, type: 'vertex', x: w / 2, y: h + KNOB_OFFSET },
		{ id: 'knob-left', index: 'a4' as IndexKey, type: 'vertex', x: -KNOB_OFFSET, y: h / 2 },
	]
}

function isKnobHandle(handle: TLHandle) {
	return handle.id.startsWith('knob-')
}

function getKnobArrowId(shape: TLShape): TLShapeId | undefined {
	return (shape.meta as { knobArrowId?: TLShapeId }).knobArrowId
}

export function startKnobArrow(editor: Editor, shape: TLShape, handle: TLHandle) {
	if (!isKnobHandle(handle)) return
	const knobPage = editor.getShapePageTransform(shape.id)!.applyToPoint({
		x: handle.x,
		y: handle.y,
	})
	const arrowId = createShapeId()

	editor.createShape({
		id: arrowId,
		type: 'arrow',
		props: {
			start: { x: knobPage.x, y: knobPage.y },
			end: { x: knobPage.x, y: knobPage.y },
		},
	})

	editor.createBinding({
		type: 'arrow',
		fromId: arrowId,
		toId: shape.id,
		props: {
			terminal: 'start',
			normalizedAnchor: { x: 0.5, y: 0.5 },
			isPrecise: false,
			isExact: false,
			snap: 'none',
		},
	})

	editor.updateShape({
		id: shape.id,
		type: shape.type,
		meta: { ...shape.meta, knobArrowId: arrowId },
	})
}

export function dragKnobArrow(editor: Editor, shape: TLShape) {
	const arrowId = getKnobArrowId(shape)
	if (!arrowId) return
	const point = editor.inputs.getCurrentPagePoint()
	editor.updateShape({ id: arrowId, type: 'arrow', props: { end: { x: point.x, y: point.y } } })
}

export function endKnobArrow(editor: Editor, shape: TLShape) {
	const arrowId = getKnobArrowId(shape)
	if (!arrowId) return
	const point = editor.inputs.getCurrentPagePoint()
	const candidates = editor.getShapesAtPoint(point, { hitInside: true, margin: 8 })
	const target = candidates.find((candidate) => candidate.id !== shape.id && candidate.type !== 'arrow')

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

	editor.updateShape({
		id: shape.id,
		type: shape.type,
		meta: { ...shape.meta, knobArrowId: null },
	})
}

export function cancelKnobArrow(editor: Editor, shape: TLShape) {
	const arrowId = getKnobArrowId(shape)
	if (!arrowId) return
	editor.deleteShapes([arrowId])
	editor.updateShape({
		id: shape.id,
		type: shape.type,
		meta: { ...shape.meta, knobArrowId: null },
	})
}