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

export interface ChatMessage {
	role: 'system' | 'user' | 'assistant'
	content: string
}

export interface ChatCompletionOptions {
	apiKey: string
	model: string
	messages: ChatMessage[]
}

export async function chatCompletion({
	apiKey,
	model,
	messages,
}: ChatCompletionOptions): Promise<string> {
	const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
			'HTTP-Referer': window.location.origin,
			'X-Title': 'tldesign',
		},
		body: JSON.stringify({ model, messages }),
	})
	if (!response.ok) {
		throw new Error(`OpenRouter chat request failed: ${response.status} ${response.statusText}`)
	}
	const body = (await response.json()) as {
		choices?: { message?: { content?: string } }[]
	}
	const content = body.choices?.[0]?.message?.content
	if (typeof content !== 'string') {
		throw new Error('OpenRouter chat response missing content')
	}
	return content
}