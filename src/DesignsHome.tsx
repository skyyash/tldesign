import { useState } from 'react'
import { Design } from './lib/designs'

const smallButton: React.CSSProperties = {
	padding: '4px 10px',
	border: '1px solid var(--tl-color-divider)',
	borderRadius: 6,
	background: 'transparent',
	color: 'inherit',
	cursor: 'pointer',
	fontSize: 12,
}

export function DesignsHome({
	designs,
	onOpen,
	onNew,
	onShowcase,
	onRename,
	onDelete,
}: {
	designs: Design[]
	onOpen: (id: string) => void
	onNew: () => void
	onShowcase: () => void
	onRename: (id: string, name: string) => void
	onDelete: (id: string) => void
}) {
	const [renamingId, setRenamingId] = useState<string | null>(null)
	const [draft, setDraft] = useState('')

	const startRename = (design: Design) => {
		setRenamingId(design.id)
		setDraft(design.name)
	}

	const commitRename = () => {
		if (renamingId && draft.trim()) onRename(renamingId, draft.trim())
		setRenamingId(null)
	}

	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				display: 'flex',
				flexDirection: 'column',
				background: 'var(--tl-color-background)',
				color: 'var(--tl-color-text-1)',
			}}
		>
			<header
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					height: 60,
					padding: '0 20px',
					borderBottom: '1px solid var(--tl-color-divider)',
				}}
			>
				<h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Designs</h1>
				<div style={{ display: 'flex', gap: 8 }}>
					<button
						type="button"
						onClick={onShowcase}
						style={{
							padding: '8px 14px',
							border: '1px solid var(--tl-color-divider)',
							borderRadius: 8,
							background: 'transparent',
							color: 'inherit',
							fontWeight: 600,
							cursor: 'pointer',
						}}
					>
						Showcase
					</button>
					<button
						type="button"
						onClick={onNew}
						style={{
							padding: '8px 14px',
							border: 'none',
							borderRadius: 8,
							background: 'var(--tl-color-primary)',
							color: '#fff',
							fontWeight: 600,
							cursor: 'pointer',
						}}
					>
						New design
					</button>
				</div>
			</header>
			<div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
				{designs.length === 0 ? (
					<p style={{ opacity: 0.6 }}>No designs yet. Create your first one.</p>
				) : (
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
							gap: 12,
						}}
					>
						{designs.map((design) => (
							<div
								key={design.id}
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: 8,
									padding: 12,
									border: '1px solid var(--tl-color-divider)',
									borderRadius: 10,
									background: 'var(--tl-color-panel)',
								}}
							>
								{renamingId === design.id ? (
									<input
										autoFocus
										value={draft}
										onChange={(e) => setDraft(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === 'Enter') commitRename()
											if (e.key === 'Escape') setRenamingId(null)
										}}
										onBlur={commitRename}
										style={{
											width: '100%',
											boxSizing: 'border-box',
											padding: '4px 6px',
											border: '1px solid var(--tl-color-divider)',
											borderRadius: 6,
											background: 'transparent',
											color: 'inherit',
											fontWeight: 600,
											fontSize: 15,
										}}
									/>
								) : (
									<button
										type="button"
										onClick={() => onOpen(design.id)}
										style={{
											padding: 0,
											border: 'none',
											background: 'transparent',
											color: 'inherit',
											cursor: 'pointer',
											textAlign: 'left',
											fontWeight: 600,
											fontSize: 15,
										}}
									>
										{design.name}
									</button>
								)}
								<div style={{ fontSize: 12, opacity: 0.6 }}>
									{new Date(design.updatedAt).toLocaleString()}
								</div>
								<div style={{ display: 'flex', gap: 8 }}>
									<button type="button" onClick={() => startRename(design)} style={smallButton}>
										Rename
									</button>
									<button type="button" onClick={() => onDelete(design.id)} style={smallButton}>
										Delete
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
