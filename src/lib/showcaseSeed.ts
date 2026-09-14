import { Editor, TLShapeId, createBindingId, createShapeId, toRichText } from 'tldraw'

const ARTEFACT_OPENROUTER = `<!doctype html><style>
body{margin:0;font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#f8fafc;color:#0f172a;padding:28px}
.badge{font-size:11px;color:#2563eb;background:#dbeafe;padding:3px 10px;border-radius:999px;font-weight:600}
h1{font-size:26px;margin:14px 0 8px;line-height:1.1}
p{color:#64748b;font-size:13px;margin:0 0 20px;line-height:1.5}
.btn{background:#2563eb;color:#fff;border:0;padding:10px 18px;border-radius:8px;font-weight:600;font-size:13px}
.meta{font-size:12px;color:#94a3b8;margin-top:22px}
</style>
<span class="badge">Fintech</span>
<h1>Pulse: money that moves with you</h1>
<p>Real-time banking, instant transfers, and smart savings in one app.</p>
<button class="btn">Get started</button>
<div class="meta">Pulse Finance · Light theme</div>`

const ARTEFACT_GEMINI = `<!doctype html><style>
body{margin:0;font-family:-apple-system,Segoe UI,Inter,sans-serif;background:linear-gradient(135deg,#0f172a,#1e1b4b);color:#fff;padding:28px;min-height:100%;box-sizing:border-box}
.stats{display:flex;gap:18px;margin-top:22px}
.stat b{font-size:20px;display:block}
.stat span{font-size:11px;color:#c7d2fe}
h1{font-size:24px;margin:14px 0 8px;background:linear-gradient(90deg,#a5b4fc,#f0abfc);-webkit-background-clip:text;background-clip:text;color:transparent}
p{color:#a5b4fc;font-size:13px;margin:0 0 18px;line-height:1.5}
.btn{background:#f0abfc;color:#1e1b4b;border:0;padding:10px 18px;border-radius:8px;font-weight:700;font-size:13px}
</style>
<h1>Pulse</h1>
<p>Banking infrastructure for the next generation.</p>
<button class="btn">Start building</button>
<div class="stats"><div class="stat"><b>2M+</b><span>users</span></div><div class="stat"><b>$4B</b><span>processed</span></div><div class="stat"><b>99.9%</b><span>uptime</span></div></div>`

const ARTEFACT_GROQ = `<!doctype html><style>
body{margin:0;font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#fef3c7;color:#451a03;padding:28px}
h1{font-size:22px;margin:0 0 16px}
.cards{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.card{background:#fff;border-radius:10px;padding:12px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.card b{font-size:13px;display:block}
.card span{font-size:11px;color:#b45309}
</style>
<h1>Pulse in action</h1>
<div class="cards">
 <div class="card"><b>Instant pay</b><span>Send money globally in seconds</span></div>
 <div class="card"><b>Smart save</b><span>Auto-rules for your goals</span></div>
 <div class="card"><b>Insights</b><span>Spending analytics</span></div>
 <div class="card"><b>Security</b><span>Bank-grade encryption</span></div>
</div>`

const ARTEFACT_FINAL = `<!doctype html><style>
body{margin:0;font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#0f172a;color:#fff;padding:32px}
.badge{font-size:11px;color:#22c55e;background:#052e16;padding:3px 10px;border-radius:999px;font-weight:600}
h1{font-size:30px;margin:16px 0 10px;line-height:1.1}
h1 em{font-style:normal;color:#f0abfc}
p{color:#94a3b8;font-size:14px;margin:0 0 22px;line-height:1.6;max-width:340px}
.btn{background:linear-gradient(90deg,#2563eb,#7c3aed);color:#fff;border:0;padding:12px 22px;border-radius:10px;font-weight:700;font-size:14px}
.stats{display:flex;gap:20px;margin-top:24px}
.stat b{font-size:18px;display:block}
.stat span{font-size:11px;color:#64748b}
</style>
<span class="badge">Refined by synthesis</span>
<h1>Pulse <em>reimagined.</em></h1>
<p>One app for banking, saving, and insight. The best of every model, combined.</p>
<button class="btn">Get started</button>
<div class="stats"><div class="stat"><b>2M+</b><span>users</span></div><div class="stat"><b>$4B</b><span>processed</span></div><div class="stat"><b>99.9%</b><span>uptime</span></div></div>`

export function seedShowcase(editor: Editor) {
	if (editor.getCurrentPageShapes().some((shape) => shape.type === 'prompt')) return

	const promptA = createShapeId()
	const promptB = createShapeId()
	const artefact1 = createShapeId()
	const artefact2 = createShapeId()
	const artefact3 = createShapeId()
	const artefactFinal = createShapeId()

	editor.createShapes([
		{
			id: promptA,
			type: 'prompt',
			x: 80,
			y: 140,
			props: {
				w: 280,
				h: 140,
				richText: toRichText('Design a landing page for a fintech app called Pulse.'),
				models: [
					'openrouter:openai/gpt-4o',
					'gemini:gemini-3.6-flash',
					'groq:llama-3.3-70b-versatile',
				],
			},
		},
		{
			id: promptB,
			type: 'prompt',
			x: 560,
			y: 460,
			props: {
				w: 280,
				h: 140,
				richText: toRichText('Synthesize the strongest ideas from the three designs into one refined landing page.'),
				models: ['openrouter:openai/gpt-4o'],
			},
		},
		{
			id: artefact1,
			type: 'artefact',
			x: 540,
			y: -30,
			props: { w: 340, h: 260, code: ARTEFACT_OPENROUTER },
		},
		{
			id: artefact2,
			type: 'artefact',
			x: 960,
			y: -30,
			props: { w: 340, h: 260, code: ARTEFACT_GEMINI },
		},
		{
			id: artefact3,
			type: 'artefact',
			x: 1380,
			y: -30,
			props: { w: 340, h: 260, code: ARTEFACT_GROQ },
		},
		{
			id: artefactFinal,
			type: 'artefact',
			x: 1000,
			y: 400,
			props: { w: 400, h: 300, code: ARTEFACT_FINAL },
		},
	])

	const arrow = (
		id: TLShapeId,
		start: { x: number; y: number },
		end: { x: number; y: number },
		label?: string
	) => ({
		id,
		type: 'arrow' as const,
		props: {
			start: { x: start.x, y: start.y },
			end: { x: end.x, y: end.y },
			size: 's' as const,
			richText: label ? toRichText(label) : toRichText(''),
		},
	})

	const a1 = createShapeId()
	const a2 = createShapeId()
	const a3 = createShapeId()
	const c1 = createShapeId()
	const c2 = createShapeId()
	const c3 = createShapeId()
	const synth = createShapeId()

	editor.createShapes([
		arrow(a1, { x: 370, y: 210 }, { x: 540, y: 100 }, 'GPT-4o'),
		arrow(a2, { x: 370, y: 210 }, { x: 960, y: 100 }, 'Gemini'),
		arrow(a3, { x: 370, y: 210 }, { x: 1380, y: 100 }, 'Groq'),
		arrow(c1, { x: 540, y: 230 }, { x: 650, y: 460 }),
		arrow(c2, { x: 960, y: 230 }, { x: 700, y: 460 }),
		arrow(c3, { x: 1380, y: 230 }, { x: 750, y: 460 }),
		arrow(synth, { x: 700, y: 460 }, { x: 1000, y: 520 }, 'Synthesize'),
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
		arrowBinding(a1, promptA, 'start'),
		arrowBinding(a1, artefact1, 'end'),
		arrowBinding(a2, promptA, 'start'),
		arrowBinding(a2, artefact2, 'end'),
		arrowBinding(a3, promptA, 'start'),
		arrowBinding(a3, artefact3, 'end'),
		arrowBinding(c1, artefact1, 'start'),
		arrowBinding(c1, promptB, 'end'),
		arrowBinding(c2, artefact2, 'start'),
		arrowBinding(c2, promptB, 'end'),
		arrowBinding(c3, artefact3, 'start'),
		arrowBinding(c3, promptB, 'end'),
		arrowBinding(synth, promptB, 'start'),
		arrowBinding(synth, artefactFinal, 'end'),
	])

	const bounds = editor.getCurrentPageBounds()
	if (bounds) editor.zoomToBounds(bounds, { targetZoom: 0.7, immediate: true })
}