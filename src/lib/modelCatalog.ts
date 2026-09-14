import { PROVIDER_LIST, ProviderId, ProviderModel } from './providers'

const FALLBACK_MODELS: Record<ProviderId, ProviderModel[]> = {
	openai: [
		{ provider: 'openai', id: 'gpt-4o', name: 'GPT-4o', context_length: 128_000 },
		{ provider: 'openai', id: 'gpt-4o-mini', name: 'GPT-4o mini', context_length: 128_000 },
		{ provider: 'openai', id: 'gpt-4.1', name: 'GPT-4.1', context_length: 1_047_576 },
	],
	gemini: [
		{ provider: 'gemini', id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash', context_length: 1_048_576 },
		{ provider: 'gemini', id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', context_length: 1_048_576 },
		{ provider: 'gemini', id: 'gemini-flash-latest', name: 'Gemini Flash (latest)', context_length: 1_048_576 },
		{ provider: 'gemini', id: 'gemini-pro-latest', name: 'Gemini Pro (latest)', context_length: 1_048_576 },
	],
	groq: [
		{ provider: 'groq', id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', context_length: 131_072 },
		{ provider: 'groq', id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', context_length: 131_072 },
		{ provider: 'groq', id: 'qwen-2.5-coder-32b', name: 'Qwen 2.5 Coder 32B', context_length: 131_072 },
	],
	anthropic: [
		{ provider: 'anthropic', id: 'claude-opus-4-5', name: 'Claude Opus 4.5', context_length: 200_000 },
		{ provider: 'anthropic', id: 'claude-sonnet-5', name: 'Claude Sonnet 5', context_length: 200_000 },
		{ provider: 'anthropic', id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', context_length: 200_000 },
		{ provider: 'anthropic', id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', context_length: 200_000 },
	],
	openrouter: [
		{ provider: 'openrouter', id: 'openai/gpt-4o', name: 'GPT-4o', context_length: 128_000 },
		{ provider: 'openrouter', id: 'openai/gpt-4o-mini', name: 'GPT-4o mini', context_length: 128_000 },
		{ provider: 'openrouter', id: 'google/gemini-2.0-flash', name: 'Gemini 2.0 Flash', context_length: 1_048_576 },
		{ provider: 'openrouter', id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', context_length: 131_072 },
		{ provider: 'openrouter', id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', context_length: 200_000 },
	],
}

export async function getModelCatalog(
	apiKeys: Partial<Record<ProviderId, string>>
): Promise<ProviderModel[]> {
	const results = await Promise.all(
		PROVIDER_LIST.map(async (provider) => {
			const apiKey = apiKeys[provider.id]
			if (!apiKey) return []
			try {
				const models = await provider.fetchModels(apiKey)
				return models.length > 0 ? models : FALLBACK_MODELS[provider.id]
			} catch {
				return FALLBACK_MODELS[provider.id]
			}
		})
	)
	return results.flat()
}

export function displayName(model: ProviderModel): string {
	return model.name || model.id
}