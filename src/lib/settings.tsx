import { createContext, useContext, useState, type ReactNode } from 'react'
import { ProviderId } from './providers/types'

const SESSION_KEY = 'tldesign.apiKeys'

export type Settings = {
	apiKeys: Partial<Record<ProviderId, string>>
}

function loadSettings(): Settings {
	let apiKeys: Partial<Record<ProviderId, string>> = {}
	try {
		const raw = sessionStorage.getItem(SESSION_KEY)
		if (raw) {
			const parsed = JSON.parse(raw) as Partial<Record<ProviderId, string>>
			if (parsed && typeof parsed === 'object') apiKeys = parsed
		}
	} catch {
		// ignore storage errors
	}

	// Migrate a legacy OpenRouter key into the per-provider store once.
	try {
		const legacy = sessionStorage.getItem('tldesign.apiKey')
		if (legacy && !apiKeys.openrouter) {
			apiKeys = { ...apiKeys, openrouter: legacy }
			sessionStorage.removeItem('tldesign.apiKey')
		}
	} catch {
		// ignore storage errors
	}

	return { apiKeys }
}

interface SettingsContextValue {
	settings: Settings
	setApiKey: (provider: ProviderId, key: string) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
	const [settings, setSettings] = useState<Settings>(() => loadSettings())

	const update = (next: Settings) => {
		setSettings(next)
		try {
			sessionStorage.setItem(SESSION_KEY, JSON.stringify(next.apiKeys))
		} catch {
			// ignore storage errors
		}
	}

	const setApiKey = (provider: ProviderId, key: string) => {
		const apiKeys = { ...settings.apiKeys, [provider]: key }
		update({ apiKeys })
	}

	return (
		<SettingsContext.Provider value={{ settings, setApiKey }}>
			{children}
		</SettingsContext.Provider>
	)
}

export function useSettings(): SettingsContextValue {
	const context = useContext(SettingsContext)
	if (!context) throw new Error('useSettings must be used within SettingsProvider')
	return context
}