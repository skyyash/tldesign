export function SettingsModal({ onClose }: { onClose: () => void }) {
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
					maxHeight: '80vh',
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
				<div style={{ padding: 16 }}>OpenRouter settings will live here.</div>
			</div>
		</div>
	)
}
