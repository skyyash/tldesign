import { ChatMessage } from '../openrouter'
import { anthropicProvider } from './anthropic'
import { geminiProvider } from './gemini'
import { groqProvider } from './groq'
import { openaiProvider } from './openai'
import { openrouterProvider } from './openrouter'
import { Provider, ProviderId, ProviderModel } from './types'

export const PROVIDERS: Record<ProviderId, Provider> = {
	openai: openaiProvider,
	gemini: geminiProvider,
	groq: groqProvider,
	anthropic: anthropicProvider,
	openrouter: openrouterProvider,
}

export const PROVIDER_LIST: Provider[] = Object.values(PROVIDERS)

export function modelKey(provider: ProviderId, id: string): string {
	return `${provider}:${id}`
}

export function splitModelKey(key: string): { provider: ProviderId; id: string } {
	const sep = key.indexOf(':')
	return { provider: key.slice(0, sep) as ProviderId, id: key.slice(sep + 1) }
}

export function providerName(provider: ProviderId): string {
	return PROVIDERS[provider]?.name ?? provider
}

export async function chatCompletionForProvider(opts: {
	provider: ProviderId
	apiKey: string
	model: string
	messages: ChatMessage[]
}): Promise<string> {
	return PROVIDERS[opts.provider].chatCompletion(opts)
}

export type { Provider, ProviderId, ProviderModel }