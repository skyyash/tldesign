import { openaiCompatibleStream } from './openaiCompat'
import { Provider, ProviderModel } from './types'

const BASE_URL = 'https://api.openai.com/v1'

export const openaiProvider: Provider = {
	id: 'openai',
	name: 'OpenAI',

	async fetchModels(apiKey): Promise<ProviderModel[]> {
		const response = await fetch(`${BASE_URL}/models`, {
			headers: { Authorization: `Bearer ${apiKey}` },
		})
		if (!response.ok) {
			throw new Error(`OpenAI models request failed: ${response.status} ${response.statusText}`)
		}
		const body = (await response.json()) as { data?: { id: string }[] }
		return (body.data ?? []).map((model) => ({
			provider: 'openai',
			id: model.id,
			name: model.id,
			context_length: 0,
		}))
	},

	async chatCompletion({ apiKey, model, messages }) {
		const response = await fetch(`${BASE_URL}/chat/completions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({ model, messages }),
		})
		if (!response.ok) {
			throw new Error(`OpenAI request failed: ${response.status} ${response.statusText}`)
		}
		const body = (await response.json()) as {
			choices?: { message?: { content?: string } }[]
		}
		const content = body.choices?.[0]?.message?.content
		if (typeof content !== 'string') {
			throw new Error('OpenAI response missing content')
		}
		return content
	},

	async chatCompletionStream(opts) {
		return openaiCompatibleStream(BASE_URL, opts)
	},
}