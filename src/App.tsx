import { Tldraw } from 'tldraw'
import { PromptShapeUtil } from './PromptShape'

const shapeUtils = [PromptShapeUtil]

function App() {
	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw
				shapeUtils={shapeUtils}
				onMount={(editor) => {
					if (editor.getCurrentPageShapes().some((shape) => shape.type === 'prompt')) return
					editor.createShape({ type: 'prompt', x: 120, y: 240 })
				}}
			/>
		</div>
	)
}

export default App
