import { useEffect, useState } from 'react'
import { useSettings } from './lib/settings'
import {
	CatalogSource,
	OpenRouterModel,
	authorOf,
	displayName,
	formatContextLength,
	getModelCatalog,
	isFreeModel,
	promptPricePerMillion,
} from './lib/modelCatalog'

const badge: React.CSSProperties = {
	padding: '1px 6px',
	border: '1px solid var(--tl-color-divider)',
	borderRadius: 999,
	background: 'var(--tl-color-panel-contrast)',
	color: 'var(--tl-color-text-1)',
	fontSize: 10,
	whiteSpace: 'nowrap',
}

function modalityLabel(model: OpenRouterModel): string {
	const modalities = model.architecture?.input_modalities
	if (!modalities || modalities.length === 0) return 'text'
	return modalities.join('+')
}

export function SettingsModal({ onClose }: { onClose: () => void }) {
	const { settings, setApiKey, toggleModel } = useSettings()
	const [catalog, setCatalog] = useState<OpenRouterModel[] | null>(null)
	const [source, setSource] = useState<CatalogSource | null>(null)
	const [search, setSearch] = useState('')

	useEffect(() => {
		let cancelled = false
		getModelCatalog()
			.then((result) => {
				if (cancelled) return
				setCatalog(result.models)
				setSource(result.source)
			})
			.catch(() => {
				if (cancelled) return
				setCatalog([])
				setSource('fallback')
			})
		return () => {
			cancelled = true
		}
	}, [])

	const query = search.trim().toLowerCase()
	const filtered = catalog
		? query
			? catalog.filter(
					(model) =>
						model.name.toLowerCase().includes(query) || model.id.toLowerCase().includes(query)
			  )
			: catalog
		: []

	const groups = new Map<string, OpenRouterModel[]>()
	for (const model of filtered) {
		const author = authorOf(model)
		const list = groups.get(author)
		if (list) list.push(model)
		else groups.set(author, [model])
	}
	const groupEntries = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))

	return (
		<div
			onClick={onClose}
			style={{
				position: 'fixed',
				inset: 0,
				zIndex: 2000,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'rgba(0, 0, 0, 0.4)',
			}}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				style={{
					width: 'min(560px, 92vw)',
					maxHeight: '82vh',
					overflow: 'auto',
					background: 'var(--tl-color-panel)',
					color: 'var(--tl-color-text-1)',
					border: '1px solid var(--tl-color-divider)',
					borderRadius: 12,
					boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '12px 16px',
						borderBottom: '1px solid var(--tl-color-divider)',
					}}
				>
					<strong>Settings</strong>
					<button
						type="button"
						aria-label="Close settings"
						onClick={onClose}
						style={{
							border: 'none',
							background: 'transparent',
							color: 'inherit',
							cursor: 'pointer',
							fontSize: 18,
							lineHeight: 1,
						}}
					>
						×
					</button>
				</div>

				<div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
						<label style={{ fontWeight: 600, fontSize: 13 }}>OpenRouter API key</label>
						<input
							type="password"
							value={settings.apiKey}
							placeholder="sk-or-v1-..."
							spellCheck={false}
							autoComplete="off"
							onChange={(e) => setApiKey(e.target.value)}
							style={{
								width: '100%',
								boxSizing: 'border-box',
								padding: '8px 10px',
								border: '1px solid var(--tl-color-divider)',
								borderRadius: 8,
								background: 'var(--tl-color-panel-contrast)',
								color: 'inherit',
								fontFamily: 'monospace',
								fontSize: 13,
							}}
						/>
						<p style={{ margin: 0, fontSize: 12, opacity: 0.6 }}>
							Stored only for this browser session; cleared when you close the tab.
						</p>
					</div>

					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<label style={{ fontWeight: 600, fontSize: 13 }}>Models</label>
							<span style={{ fontSize: 11, opacity: 0.6 }}>
								{settings.enabledModels.length} enabled
								{catalog ? ` · ${source === 'network' ? 'live' : source}` : ''}
							</span>
						</div>
						<input
							type="search"
							value={search}
							placeholder="Search models..."
							spellCheck={false}
							onChange={(e) => setSearch(e.target.value)}
							style={{
								width: '100%',
								boxSizing: 'border-box',
								padding: '6px 10px',
								border: '1px solid var(--tl-color-divider)',
								borderRadius: 8,
								background: 'var(--tl-color-panel-contrast)',
								color: 'inherit',
								fontSize: 13,
							}}
						/>
						<div style={{ maxHeight: 380, overflow: 'auto', border: '1px solid var(--tl-color-divider)', borderRadius: 8 }}>
							{catalog === null ? (
								<div style={{ padding: 16, fontSize: 13, opacity: 0.6 }}>Loading models…</div>
							) : groupEntries.length === 0 ? (
								<div style={{ padding: 16, fontSize: 13, opacity: 0.6 }}>No models match your search.</div>
							) : (
								groupEntries.map(([author, models]) => (
									<div key={author}>
										<div
											style={{
												padding: '6px 10px',
												fontSize: 11,
												fontWeight: 700,
												textTransform: 'uppercase',
												letterSpacing: '0.05em',
												opacity: 0.6,
												background: 'var(--tl-color-panel-contrast)',
												borderBottom: '1px solid var(--tl-color-divider)',
											}}
										>
											{author}
										</div>
										{models.map((model) => (
											<label
												key={model.id}
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: 8,
													padding: '7px 10px',
													borderBottom: '1px solid var(--tl-color-divider)',
													cursor: 'pointer',
												}}
											>
												<input
													type="checkbox"
													checked={settings.enabledModels.includes(model.id)}
													onChange={() => toggleModel(model.id)}
												/>
												<div style={{ flex: 1, minWidth: 0 }}>
													<div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
														{displayName(model)}
													</div>
													<div style={{ fontSize: 11, opacity: 0.6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
														{model.id}
													</div>
												</div>
												<div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
													{isFreeModel(model) && <span style={badge}>Free</span>}
													<span style={badge}>{formatContextLength(model.context_length)}</span>
													<span style={badge}>${promptPricePerMillion(model).toFixed(2)}/M</span>
													<span style={badge}>{modalityLabel(model)}</span>
												</div>
											</label>
										))}
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}