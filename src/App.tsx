import { useMemo, useState } from 'react'
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
import { AppNavbar } from './AppNavbar'
import { ArtefactShapeUtil } from './ArtefactShape'
import { DesignsHome } from './DesignsHome'
import { PromptShapeUtil } from './PromptShape'
import { SettingsModal } from './SettingsModal'
import { createDesign, createShowcaseDesign, deleteDesign, deleteDesignDocument, listDesigns, renameDesign, touchDesign } from './lib/designs'
import { SettingsProvider } from './lib/settings'
import { seedShowcase } from './lib/showcaseSeed'
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
	const [designs, setDesigns] = useState(() => listDesigns())
	const [activeDesignId, setActiveDesignId] = useState<string | null>(null)
	const [settingsOpen, setSettingsOpen] = useState(false)

	const activeDesign = useMemo(
		() => designs.find((design) => design.id === activeDesignId),
		[designs, activeDesignId]
	)

	const refreshDesigns = () => setDesigns(listDesigns())

	const handleNew = () => {
		const design = createDesign('Untitled design')
		refreshDesigns()
		setActiveDesignId(design.id)
	}

	const handleShowcase = () => {
		const design = createShowcaseDesign()
		refreshDesigns()
		setActiveDesignId(design.id)
	}

	const handleOpen = (id: string) => {
		setActiveDesignId(id)
	}

	const handleBack = () => {
		if (activeDesignId) touchDesign(activeDesignId)
		refreshDesigns()
		setActiveDesignId(null)
	}

	const handleRename = (id: string, name: string) => {
		renameDesign(id, name)
		refreshDesigns()
	}

	const handleDelete = async (id: string) => {
		if (!window.confirm('Delete this design?')) return
		await deleteDesignDocument(id)
		deleteDesign(id)
		refreshDesigns()
	}

	return (
		<SettingsProvider>
			<div
				className="tl-theme__light"
				style={{
					position: 'fixed',
					inset: 0,
					background: 'var(--tl-color-background)',
					color: 'var(--tl-color-text-1)',
				}}
			>
				{activeDesign ? (
					<div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
						<AppNavbar
							name={activeDesign.name}
							onBack={handleBack}
							onOpenSettings={() => setSettingsOpen(true)}
						/>
						<div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
							<Tldraw
								key={activeDesign.id}
								persistenceKey={activeDesign.id}
								shapeUtils={shapeUtils}
								tools={tools}
								components={components}
								overrides={overrides}
								onMount={(editor) => {
									if (activeDesign.showcase) {
										setTimeout(() => seedShowcase(editor), 50)
									}
								}}
							/>
						</div>
					</div>
				) : (
					<DesignsHome
						designs={designs}
						onOpen={handleOpen}
						onNew={handleNew}
						onShowcase={handleShowcase}
						onRename={handleRename}
						onDelete={handleDelete}
					/>
				)}
				{settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
			</div>
		</SettingsProvider>
	)
}

export default App