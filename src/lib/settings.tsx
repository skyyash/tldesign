import { createContext, useContext, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'tldesign.settings'
const SESSION_KEY = 'tldesign.apiKey'

export type Settings = {
	apiKey: string
	enabledModels: string[]
}

function loadSettings(): Settings {
	let enabledModels: string[] = []
	let legacyApiKey = ''
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (raw) {
			const parsed = JSON.parse(raw) as Partial<Settings>
			if (Array.isArray(parsed.enabledModels)) {
				enabledModels = parsed.enabledModels.filter((id): id is string => typeof id === 'string')
			}
			if (typeof parsed.apiKey === 'string') legacyApiKey = parsed.apiKey
		}
	} catch {
		// ignore storage errors
	}

	let apiKey = ''
	try {
		apiKey = sessionStorage.getItem(SESSION_KEY) ?? ''
	} catch {
		// ignore storage errors
	}

	// The API key is session-only. Migrate a legacy localStorage key into the
	// session once, then clear it from localStorage.
	if (!apiKey && legacyApiKey) {
		apiKey = legacyApiKey
		try {
			sessionStorage.setItem(SESSION_KEY, apiKey)
			localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabledModels }))
		} catch {
			// ignore storage errors
		}
	}

	return { apiKey, enabledModels }
}

interface SettingsContextValue {
	settings: Settings
	setApiKey: (key: string) => void
	toggleModel: (id: string) => void
	setEnabledModels: (ids: string[]) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
	const [settings, setSettings] = useState<Settings>(() => loadSettings())

	const update = (next: Settings) => {
		setSettings(next)
		try {
			// apiKey lives only in sessionStorage: cleared when the tab closes.
			if (next.apiKey) sessionStorage.setItem(SESSION_KEY, next.apiKey)
			else sessionStorage.removeItem(SESSION_KEY)
			localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabledModels: next.enabledModels }))
		} catch {
			// ignore storage errors
		}
	}

	const setApiKey = (apiKey: string) => update({ ...settings, apiKey })

	const toggleModel = (id: string) => {
		const has = settings.enabledModels.includes(id)
		const enabledModels = has
			? settings.enabledModels.filter((model) => model !== id)
			: [...settings.enabledModels, id]
		update({ ...settings, enabledModels })
	}

	const setEnabledModels = (enabledModels: string[]) => update({ ...settings, enabledModels })

	return (
		<SettingsContext.Provider value={{ settings, setApiKey, toggleModel, setEnabledModels }}>
			{children}
		</SettingsContext.Provider>
	)
}

export function useSettings(): SettingsContextValue {
	const context = useContext(SettingsContext)
	if (!context) throw new Error('useSettings must be used within SettingsProvider')
	return context
}