export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

export interface OpenRouterModel {
	id: string
	name: string
	context_length: number
	architecture: {
		input_modalities: string[]
		output_modalities: string[]
	}
	pricing: {
		prompt: string
		completion: string
	}
}

export async function fetchModels(): Promise<OpenRouterModel[]> {
	const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
		headers: {
			'HTTP-Referer': window.location.origin,
			'X-Title': 'tldesign',
		},
	})
	if (!response.ok) {
		throw new Error(`OpenRouter models request failed: ${response.status} ${response.statusText}`)
	}
	const body = (await response.json()) as { data?: OpenRouterModel[] }
	return body.data ?? []
}