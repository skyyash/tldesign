import {
	ArrowDownToolbarItem,
	ArrowLeftToolbarItem,
	ArrowRightToolbarItem,
	ArrowToolbarItem,
	ArrowUpToolbarItem,
	AssetToolbarItem,
	CheckBoxToolbarItem,
	CloudToolbarItem,
	DefaultToolbar,
	DiamondToolbarItem,
	DrawToolbarItem,
	EllipseToolbarItem,
	EraserToolbarItem,
	FrameToolbarItem,
	HandToolbarItem,
	HeartToolbarItem,
	HexagonToolbarItem,
	HighlightToolbarItem,
	LaserToolbarItem,
	LineToolbarItem,
	NoteToolbarItem,
	OvalToolbarItem,
	RectangleToolbarItem,
	RhombusToolbarItem,
	SelectToolbarItem,
	StarToolbarItem,
	TextToolbarItem,
	TLComponents,
	TLUiOverrides,
	Tldraw,
	ToolbarItem,
	TriangleToolbarItem,
	XBoxToolbarItem,
} from 'tldraw'
import { ArtefactShapeUtil } from './ArtefactShape'
import { PromptShapeUtil } from './PromptShape'
import { ArtefactTool, PromptTool } from './tools'

const shapeUtils = [PromptShapeUtil, ArtefactShapeUtil]
const tools = [PromptTool, ArtefactTool]

function CustomToolbar() {
	return (
		<DefaultToolbar>
			<SelectToolbarItem />
			<HandToolbarItem />
			<DrawToolbarItem />
			<EraserToolbarItem />
			<ToolbarItem tool="prompt" />
			<ToolbarItem tool="artefact" />
			<ArrowToolbarItem />
			<TextToolbarItem />
			<NoteToolbarItem />
			<AssetToolbarItem />
			<RectangleToolbarItem />
			<EllipseToolbarItem />
			<TriangleToolbarItem />
			<DiamondToolbarItem />
			<HexagonToolbarItem />
			<OvalToolbarItem />
			<RhombusToolbarItem />
			<StarToolbarItem />
			<CloudToolbarItem />
			<HeartToolbarItem />
			<XBoxToolbarItem />
			<CheckBoxToolbarItem />
			<ArrowLeftToolbarItem />
			<ArrowUpToolbarItem />
			<ArrowDownToolbarItem />
			<ArrowRightToolbarItem />
			<LineToolbarItem />
			<HighlightToolbarItem />
			<LaserToolbarItem />
			<FrameToolbarItem />
		</DefaultToolbar>
	)
}

const components: TLComponents = {
	Toolbar: CustomToolbar,
}

const overrides: TLUiOverrides = {
	tools(editor, tools) {
		tools.prompt = {
			id: 'prompt',
			label: 'Prompt',
			icon: 'comment',
			onSelect: () => editor.setCurrentTool('prompt'),
		}
		tools.artefact = {
			id: 'artefact',
			label: 'HTML artefact',
			icon: 'code',
			onSelect: () => editor.setCurrentTool('artefact'),
		}
		return tools
	},
}

function App() {
	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw
				shapeUtils={shapeUtils}
				tools={tools}
				components={components}
				overrides={overrides}
				onMount={(editor) => {
					if (editor.getCurrentPageShapes().some((shape) => shape.type === 'prompt')) return
					editor.createShape({ type: 'prompt', x: 120, y: 240 })
				}}
			/>
		</div>
	)
}

export default App