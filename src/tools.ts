import { createShapeId, StateNode, TLPointerEventInfo } from 'tldraw'

export class PromptTool extends StateNode {
	static override id = 'prompt'

	override onEnter() {
		this.editor.setCursor({ type: 'cross' })
	}

	override onExit() {
		this.editor.setCursor({ type: 'default' })
	}

	override onPointerDown(info: TLPointerEventInfo) {
		if (this.editor.getIsReadonly() || info.button !== 0) return
		const point = this.editor.inputs.getCurrentPagePoint()
		const props = this.editor.getShapeUtil('prompt').getDefaultProps()
		const id = createShapeId()
		this.editor.markHistoryStoppingPoint('create prompt')
		this.editor.createShape({
			id,
			type: 'prompt',
			x: point.x - props.w / 2,
			y: point.y - props.h / 2,
		})
		this.editor.select(id)
		this.editor.setCurrentTool('select')
	}
}

export class ArtefactTool extends StateNode {
	static override id = 'artefact'

	override onEnter() {
		this.editor.setCursor({ type: 'cross' })
	}

	override onExit() {
		this.editor.setCursor({ type: 'default' })
	}

	override onPointerDown(info: TLPointerEventInfo) {
		if (this.editor.getIsReadonly() || info.button !== 0) return
		const point = this.editor.inputs.getCurrentPagePoint()
		const props = this.editor.getShapeUtil('artefact').getDefaultProps()
		const id = createShapeId()
		this.editor.markHistoryStoppingPoint('create artefact')
		this.editor.createShape({
			id,
			type: 'artefact',
			x: point.x - props.w / 2,
			y: point.y - props.h / 2,
		})
		this.editor.select(id)
		this.editor.setCurrentTool('select')
	}
}