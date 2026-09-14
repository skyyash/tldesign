import { PROVIDER_LIST, ProviderId, ProviderModel } from './providers'

const FALLBACK_MODELS: Record<ProviderId, ProviderModel[]> = {
	openai: [
		{ provider: 'openai', id: 'gpt-5.6-luna', name: 'GPT-5.6 Luna', context_length: 200_000 },
		{ provider: 'openai', id: 'gpt-5.6', name: 'GPT-5.6', context_length: 200_000 },
		{ provider: 'openai', id: 'gpt-5.4-mini', name: 'GPT-5.4 Mini', context_length: 200_000 },
	],
	gemini: [
		{ provider: 'gemini', id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash', context_length: 1_048_576 },
		{ provider: 'gemini', id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', context_length: 1_048_576 },
		{ provider: 'gemini', id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', context_length: 1_048_576 },
		{ provider: 'gemini', id: 'gemini-flash-latest', name: 'Gemini Flash (latest)', context_length: 1_048_576 },
		{ provider: 'gemini', id: 'gemini-pro-latest', name: 'Gemini Pro (latest)', context_length: 1_048_576 },
	],
	groq: [
		{ provider: 'groq', id: 'openai/gpt-oss-120b', name: 'GPT-OSS 120B', context_length: 131_072 },
		{ provider: 'groq', id: 'openai/gpt-oss-20b', name: 'GPT-OSS 20B', context_length: 131_072 },
		{ provider: 'groq', id: 'qwen/qwen3.8-27b', name: 'Qwen 3.8 27B', context_length: 131_072 },
		{ provider: 'groq', id: 'groq/compound', name: 'Groq Compound', context_length: 131_072 },
	],
	anthropic: [
		{ provider: 'anthropic', id: 'claude-sonnet-5', name: 'Claude Sonnet 5', context_length: 200_000 },
		{ provider: 'anthropic', id: 'claude-opus-5', name: 'Claude Opus 5', context_length: 200_000 },
		{ provider: 'anthropic', id: 'claude-haiku-4.5', name: 'Claude Haiku 4.5', context_length: 200_000 },
	],
	openrouter: [
		{ provider: 'openrouter', id: 'openai/gpt-5.6-luna', name: 'GPT-5.6 Luna', context_length: 200_000 },
		{ provider: 'openrouter', id: 'anthropic/claude-sonnet-5', name: 'Claude Sonnet 5', context_length: 200_000 },
		{ provider: 'openrouter', id: 'google/gemini-3.6-flash', name: 'Gemini 3.6 Flash', context_length: 1_048_576 },
		{ provider: 'openrouter', id: 'deepseek/deepseek-v4-pro', name: 'DeepSeek V4 Pro', context_length: 131_072 },
		{ provider: 'openrouter', id: 'mistralai/mistral-large-2512', name: 'Mistral Large 3', context_length: 128_000 },
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