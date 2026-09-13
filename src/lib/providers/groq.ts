import { openaiCompatibleStream } from './openaiCompat'
import { Provider, ProviderModel } from './types'

const BASE_URL = 'https://api.groq.com/openai/v1'

export const groqProvider: Provider = {
	id: 'groq',
	name: 'Groq',

	async fetchModels(apiKey): Promise<ProviderModel[]> {
		const response = await fetch(`${BASE_URL}/models`, {
			headers: { Authorization: `Bearer ${apiKey}` },
		})
		if (!response.ok) {
			throw new Error(`Groq models request failed: ${response.status} ${response.statusText}`)
		}
		const body = (await response.json()) as { data?: { id: string }[] }
		return (body.data ?? []).map((model) => ({
			provider: 'groq',
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
			throw new Error(`Groq request failed: ${response.status} ${response.statusText}`)
		}
		const body = (await response.json()) as {
			choices?: { message?: { content?: string } }[]
		}
		const content = body.choices?.[0]?.message?.content
		if (typeof content !== 'string') {
			throw new Error('Groq response missing content')
		}
		return content
	},

	async chatCompletionStream(opts) {
		return openaiCompatibleStream(BASE_URL, opts)
	},
}