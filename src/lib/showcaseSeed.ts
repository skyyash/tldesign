import { Editor, TLShapeId, createBindingId, createShapeId, toRichText } from 'tldraw'

const LANDING_A = `<style>
  body { font-family: -apple-system, 'Inter', sans-serif; margin: 0; padding: 24px; }
  h1 { font-size: 22px; margin: 0 0 6px; }
  p { font-size: 13px; color: #666; margin: 0 0 16px; }
  button { background: #2563eb; color: #fff; border: 0; border-radius: 6px; padding: 8px 14px; font-weight: 600; }
</style>
<h1>Acme</h1>
<p>A clean landing page for your product.</p>
<button>Get started</button>`

const LANDING_B = `<style>
  body { font-family: -apple-system, 'Inter', sans-serif; margin: 0; padding: 24px; background: #111; color: #fff; }
  .badge { display: inline-block; background: #22c55e; border-radius: 999px; padding: 2px 10px; font-size: 12px; }
  h1 { font-size: 20px; margin: 12px 0 6px; }
  p { font-size: 13px; color: #aaa; margin: 0; }
</style>
<span class="badge">New</span>
<h1>Dark theme hero</h1>
<p>Bold, high-contrast design.</p>`

export function seedShowcase(editor: Editor) {
	if (editor.getCurrentPageShapes().some((shape) => shape.type === 'prompt')) return

	const promptA = createShapeId()
	const promptB = createShapeId()
	const artefactA = createShapeId()
	const artefactB = createShapeId()

	editor.createShapes([
		{
			id: promptA,
			type: 'prompt',
			x: 120,
			y: 220,
			props: {
				w: 260,
				h: 140,
				richText: toRichText('Design a landing page for a SaaS product.'),
				models: ['openai:gpt-4o', 'gemini:gemini-2.0-flash'],
			},
		},
		{
			id: promptB,
			type: 'prompt',
			x: 120,
			y: 620,
			props: {
				w: 260,
				h: 140,
				richText: toRichText('Improve the design using the previous outputs.'),
				models: ['openai:gpt-4o'],
			},
		},
		{
			id: artefactA,
			type: 'artefact',
			x: 560,
			y: 80,
			props: { w: 320, h: 240, code: LANDING_A },
		},
		{
			id: artefactB,
			type: 'artefact',
			x: 560,
			y: 420,
			props: { w: 320, h: 240, code: LANDING_B },
		},
	])

	const arrowA = createShapeId()
	const arrowB = createShapeId()
	const chainA = createShapeId()
	const chainB = createShapeId()

	editor.createShapes([
		{
			id: arrowA,
			type: 'arrow',
			props: { start: { x: 380, y: 290 }, end: { x: 560, y: 200 }, size: 's', richText: toRichText('GPT-4o') },
		},
		{
			id: arrowB,
			type: 'arrow',
			props: { start: { x: 380, y: 290 }, end: { x: 560, y: 540 }, size: 's', richText: toRichText('Gemini') },
		},
		{ id: chainA, type: 'arrow', props: { start: { x: 560, y: 200 }, end: { x: 380, y: 650 }, size: 's' } },
		{ id: chainB, type: 'arrow', props: { start: { x: 560, y: 540 }, end: { x: 380, y: 650 }, size: 's' } },
	])

	const arrowBinding = (fromId: TLShapeId, toId: TLShapeId, terminal: 'start' | 'end') => ({
		id: createBindingId(),
		type: 'arrow' as const,
		fromId,
		toId,
		props: {
			terminal,
			normalizedAnchor: { x: 0.5, y: 0.5 },
			isPrecise: false,
			isExact: false,
			snap: 'none' as const,
		},
	})

	editor.createBindings([
		arrowBinding(arrowA, promptA, 'start'),
		arrowBinding(arrowA, artefactA, 'end'),
		arrowBinding(arrowB, promptA, 'start'),
		arrowBinding(arrowB, artefactB, 'end'),
		arrowBinding(chainA, artefactA, 'start'),
		arrowBinding(chainA, promptB, 'end'),
		arrowBinding(chainB, artefactB, 'start'),
		arrowBinding(chainB, promptB, 'end'),
	])

	const bounds = editor.getCurrentPageBounds()
	if (bounds) editor.zoomToBounds(bounds, { targetZoom: 0.9, immediate: true })
}