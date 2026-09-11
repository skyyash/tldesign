import { OpenRouterModel, fetchModels } from './openrouter'

const CACHE_KEY = 'tldesign.modelCatalog'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

interface CatalogCache {
	fetchedAt: number
	models: OpenRouterModel[]
}

const FALLBACK_MODELS: OpenRouterModel[] = [
	{
		id: 'openai/gpt-4o',
		name: 'GPT-4o',
		context_length: 128_000,
		architecture: { input_modalities: ['text', 'image'], output_modalities: ['text'] },
		pricing: { prompt: '0.0000025', completion: '0.00001' },
	},
	{
		id: 'openai/gpt-4o-mini',
		name: 'GPT-4o mini',
		context_length: 128_000,
		architecture: { input_modalities: ['text', 'image'], output_modalities: ['text'] },
		pricing: { prompt: '0.00000015', completion: '0.0000006' },
	},
	{
		id: 'openai/gpt-4.1',
		name: 'GPT-4.1',
		context_length: 1_047_576,
		architecture: { input_modalities: ['text'], output_modalities: ['text'] },
		pricing: { prompt: '0.000002', completion: '0.000008' },
	},
	{
		id: 'anthropic/claude-3.5-sonnet',
		name: 'Claude 3.5 Sonnet',
		context_length: 200_000,
		architecture: { input_modalities: ['text', 'image'], output_modalities: ['text'] },
		pricing: { prompt: '0.000003', completion: '0.000015' },
	},
	{
		id: 'anthropic/claude-3.5-haiku',
		name: 'Claude 3.5 Haiku',
		context_length: 200_000,
		architecture: { input_modalities: ['text', 'image'], output_modalities: ['text'] },
		pricing: { prompt: '0.0000008', completion: '0.000004' },
	},
	{
		id: 'google/gemini-2.0-flash',
		name: 'Gemini 2.0 Flash',
		context_length: 1_048_576,
		architecture: { input_modalities: ['text', 'image'], output_modalities: ['text'] },
		pricing: { prompt: '0.0000001', completion: '0.0000004' },
	},
	{
		id: 'google/gemini-2.5-flash',
		name: 'Gemini 2.5 Flash',
		context_length: 1_048_576,
		architecture: { input_modalities: ['text', 'image'], output_modalities: ['text'] },
		pricing: { prompt: '0.0000003', completion: '0.0000025' },
	},
	{
		id: 'meta-llama/llama-3.1-8b-instruct:free',
		name: 'Llama 3.1 8B Instruct (free)',
		context_length: 131_072,
		architecture: { input_modalities: ['text'], output_modalities: ['text'] },
		pricing: { prompt: '0', completion: '0' },
	},
	{
		id: 'meta-llama/llama-3.1-70b-instruct',
		name: 'Llama 3.1 70B Instruct',
		context_length: 131_072,
		architecture: { input_modalities: ['text'], output_modalities: ['text'] },
		pricing: { prompt: '0.00000042', completion: '0.00000042' },
	},
	{
		id: 'mistralai/mistral-small-24b-instruct',
		name: 'Mistral Small 24B',
		context_length: 32_768,
		architecture: { input_modalities: ['text'], output_modalities: ['text'] },
		pricing: { prompt: '0.0000001', completion: '0.0000003' },
	},
	{
		id: 'deepseek/deepseek-chat',
		name: 'DeepSeek Chat',
		context_length: 131_072,
		architecture: { input_modalities: ['text'], output_modalities: ['text'] },
		pricing: { prompt: '0.00000014', completion: '0.00000028' },
	},
	{
		id: 'qwen/qwen-2.5-coder-32b-instruct',
		name: 'Qwen 2.5 Coder 32B',
		context_length: 131_072,
		architecture: { input_modalities: ['text'], output_modalities: ['text'] },
		pricing: { prompt: '0.00000018', completion: '0.00000036' },
	},
]

function readCache(): CatalogCache | null {
	try {
		const raw = localStorage.getItem(CACHE_KEY)
		if (!raw) return null
		const parsed = JSON.parse(raw) as CatalogCache
		if (!parsed || !Array.isArray(parsed.models)) return null
		return parsed
	} catch {
		return null
	}
}

function writeCache(models: OpenRouterModel[]) {
	localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), models }))
}

function isFresh(cache: CatalogCache) {
	return Date.now() - cache.fetchedAt < CACHE_TTL_MS
}

export type CatalogSource = 'cache' | 'network' | 'fallback'

export async function getModelCatalog(): Promise<{
	models: OpenRouterModel[]
	source: CatalogSource
}> {
	const cached = readCache()
	if (cached && isFresh(cached)) {
		return { models: cached.models, source: 'cache' }
	}

	try {
		const models = await fetchModels()
		if (models.length > 0) {
			writeCache(models)
			return { models, source: 'network' }
		}
	} catch {
		// fall through to stale cache or static fallback
	}

	if (cached) {
		return { models: cached.models, source: 'cache' }
	}

	return { models: FALLBACK_MODELS, source: 'fallback' }
}

export function authorOf(model: OpenRouterModel): string {
	return model.id.split('/')[0] || 'unknown'
}

export function isFreeModel(model: OpenRouterModel): boolean {
	return model.id.endsWith(':free') || Number(model.pricing.prompt) === 0
}

export function promptPricePerMillion(model: OpenRouterModel): number {
	return Number(model.pricing.prompt) * 1_000_000
}

export function formatContextLength(contextLength: number): string {
	if (contextLength >= 1_000_000) return `${(contextLength / 1_000_000).toFixed(1)}M`
	if (contextLength >= 1000) return `${Math.round(contextLength / 1000)}K`
	return String(contextLength)
}

export function displayName(model: OpenRouterModel): string {
	return model.name || model.id
}