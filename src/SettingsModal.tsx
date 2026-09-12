import { useSettings } from './lib/settings'
import { PROVIDER_LIST } from './lib/providers'

export function SettingsModal({ onClose }: { onClose: () => void }) {
	const { settings, setApiKey } = useSettings()

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
					width: 'min(460px, 92vw)',
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
				</div>
			</div>
		</div>
	)
}