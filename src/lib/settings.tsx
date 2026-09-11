import { createContext, useContext, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'tldesign.settings'

export type Settings = {
	apiKey: string
	enabledModels: string[]
}

const DEFAULT_SETTINGS: Settings = {
	apiKey: '',
	enabledModels: [],
}

function loadSettings(): Settings {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return DEFAULT_SETTINGS
		const parsed = JSON.parse(raw) as Partial<Settings>
		return {
			apiKey: typeof parsed.apiKey === 'string' ? parsed.apiKey : '',
			enabledModels: Array.isArray(parsed.enabledModels)
				? parsed.enabledModels.filter((id): id is string => typeof id === 'string')
				: [],
		}
	} catch {
		return DEFAULT_SETTINGS
	}
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
		// TODO: apiKey is stored in plaintext for now; move to secure storage in
		// the next increment (see CONTEXT.md "Known issues").
		localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
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