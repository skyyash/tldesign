import { useEffect, useState } from 'react'
import { useSettings } from './lib/settings'
import { PROVIDER_LIST, ProviderModel, providerName } from './lib/providers'
import { displayName, getModelCatalog } from './lib/modelCatalog'

export function SettingsModal({ onClose }: { onClose: () => void }) {
	const { settings, setApiKey } = useSettings()
	const [catalog, setCatalog] = useState<ProviderModel[] | null>(null)
	const [search, setSearch] = useState('')

	useEffect(() => {
		let cancelled = false
		getModelCatalog(settings.apiKeys)
			.then((models) => {
				if (!cancelled) setCatalog(models)
			})
			.catch(() => {
				if (!cancelled) setCatalog([])
			})
		return () => {
			cancelled = true
		}
	}, [settings.apiKeys])

	const query = search.trim().toLowerCase()
	const filtered = (catalog ?? []).filter(
		(model) =>
			!query || model.name.toLowerCase().includes(query) || model.id.toLowerCase().includes(query)
	)
	const groups = new Map<string, ProviderModel[]>()
	for (const model of filtered) {
		const name = providerName(model.provider)
		const list = groups.get(name)
		if (list) list.push(model)
		else groups.set(name, [model])
	}
	const groupEntries = [...groups.entries()]

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
					width: 'min(520px, 92vw)',
					maxHeight: '84vh',
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
					<p style={{ margin: 0, fontSize: 12, opacity: 0.7, lineHeight: 1.4 }}>
						Add an API key for each provider you want to use. A provider with a key is
						enabled, and its models appear in the prompt's model dropdown. Keys are stored
						only for this browser session.
					</p>

					{PROVIDER_LIST.map((provider) => {
						const value = settings.apiKeys[provider.id] ?? ''
						return (
							<div key={provider.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
								<label style={{ fontWeight: 600, fontSize: 13 }}>{provider.name}</label>
								<input
									type="password"
									value={value}
									placeholder={`${provider.name} API key`}
									spellCheck={false}
									autoComplete="off"
									onChange={(e) => setApiKey(provider.id, e.target.value)}
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
							</div>
						)
					})}

					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<label style={{ fontWeight: 600, fontSize: 13 }}>Models</label>
							<span style={{ fontSize: 11, opacity: 0.6 }}>
								{catalog ? `${filtered.length} shown` : ''}
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
						<div
							style={{
								maxHeight: 320,
								overflow: 'auto',
								border: '1px solid var(--tl-color-divider)',
								borderRadius: 8,
							}}
						>
							{catalog === null ? (
								<div style={{ padding: 14, fontSize: 13, opacity: 0.6 }}>Loading models…</div>
							) : groupEntries.length === 0 ? (
								<div style={{ padding: 14, fontSize: 13, opacity: 0.6 }}>
									No models match your search.
								</div>
							) : (
								groupEntries.map(([name, models]) => (
									<div key={name}>
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
											{name}
										</div>
										{models.map((model) => (
											<div
												key={model.id}
												style={{
													display: 'flex',
													alignItems: 'baseline',
													justifyContent: 'space-between',
													gap: 8,
													padding: '7px 10px',
													borderBottom: '1px solid var(--tl-color-divider)',
												}}
											>
												<span style={{ fontSize: 13 }}>{displayName(model)}</span>
												<span style={{ fontSize: 11, opacity: 0.6, overflow: 'hidden', textOverflow: 'ellipsis' }}>
													{model.id}
												</span>
											</div>
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