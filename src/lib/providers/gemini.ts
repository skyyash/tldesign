import { fetchWithTimeout } from './robust'
import { readSSE } from './sse'
import { Provider, ProviderModel } from './types'

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta'

export const geminiProvider: Provider = {
	id: 'gemini',
	name: 'Google Gemini',

	async fetchModels(apiKey): Promise<ProviderModel[]> {
		const response = await fetch(`${BASE_URL}/models?key=${encodeURIComponent(apiKey)}`)
		if (!response.ok) {
			throw new Error(`Gemini models request failed: ${response.status} ${response.statusText}`)
		}
		const body = (await response.json()) as {
			models?: { name: string; displayName?: string; inputTokenLimit?: number }[]
		}
		return (body.models ?? []).map((model) => ({
			provider: 'gemini',
			id: model.name.replace(/^models\//, ''),
			name: model.displayName || model.name.replace(/^models\//, ''),
			context_length: model.inputTokenLimit ?? 0,
		}))
	},

	async chatCompletion({ apiKey, model, messages }) {
		const system = messages.find((message) => message.role === 'system')?.content
		const contents = messages
			.filter((message) => message.role !== 'system')
			.map((message) => ({
				role: message.role === 'assistant' ? 'model' : 'user',
				parts: [{ text: message.content }],
			}))

		const body: Record<string, unknown> = { contents }
		if (system) body.systemInstruction = { parts: [{ text: system }] }

		const response = await fetch(
			`${BASE_URL}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			}
		)
		if (!response.ok) {
			throw new Error(`Gemini request failed: ${response.status} ${response.statusText}`)
		}
		const json = (await response.json()) as {
			candidates?: { content?: { parts?: { text?: string }[] } }[]
		}
		const text = json.candidates?.[0]?.content?.parts?.[0]?.text
		if (typeof text !== 'string') {
			throw new Error('Gemini response missing content')
		}
		return text
	},

	async chatCompletionStream({ apiKey, model, messages, onDelta }) {
		const system = messages.find((message) => message.role === 'system')?.content
		const contents = messages
			.filter((message) => message.role !== 'system')
			.map((message) => ({
				role: message.role === 'assistant' ? 'model' : 'user',
				parts: [{ text: message.content }],
			}))
		const body: Record<string, unknown> = { contents }
		if (system) body.systemInstruction = { parts: [{ text: system }] }

		const response = await fetchWithTimeout(
			`${BASE_URL}/models/${model}:streamGenerateContent?key=${encodeURIComponent(apiKey)}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			}
		)

		let full = ''
		for await (const data of readSSE(response)) {
			try {
				const json = JSON.parse(data) as {
					candidates?: { content?: { parts?: { text?: string }[] } }[]
				}
				const delta = json.candidates?.[0]?.content?.parts?.[0]?.text
				if (typeof delta === 'string') {
					full += delta
					onDelta(delta)
				}
			} catch {
				// Ignore partial SSE JSON chunks.
			}
		}
		return full
	},
}