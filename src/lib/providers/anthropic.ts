import { fetchWithTimeout } from './robust'
import { readSSE } from './sse'
import { Provider, ProviderModel } from './types'

const BASE_URL = 'https://api.anthropic.com/v1'

const ANTHROPIC_MODELS: ProviderModel[] = [
	{ provider: 'anthropic', id: 'claude-opus-4-5', name: 'Claude Opus 4.5', context_length: 200_000 },
	{ provider: 'anthropic', id: 'claude-opus-4-6', name: 'Claude Opus 4.6', context_length: 200_000 },
	{ provider: 'anthropic', id: 'claude-sonnet-5', name: 'Claude Sonnet 5', context_length: 200_000 },
	{ provider: 'anthropic', id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', context_length: 200_000 },
	{ provider: 'anthropic', id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', context_length: 200_000 },
	{ provider: 'anthropic', id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', context_length: 200_000 },
]

export const anthropicProvider: Provider = {
	id: 'anthropic',
	name: 'Anthropic',

	async fetchModels(): Promise<ProviderModel[]> {
		return ANTHROPIC_MODELS
	},

	async chatCompletion({ apiKey, model, messages }) {
		const system = messages.find((message) => message.role === 'system')?.content
		const body: Record<string, unknown> = {
			model,
			max_tokens: 4096,
			messages: messages
				.filter((message) => message.role !== 'system')
				.map((message) => ({ role: message.role, content: message.content })),
		}
		if (system) body.system = system

		const response = await fetch(`${BASE_URL}/messages`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': apiKey,
				'anthropic-version': '2023-06-01',
			},
			body: JSON.stringify(body),
		})
		if (!response.ok) {
			throw new Error(`Anthropic request failed: ${response.status} ${response.statusText}`)
		}
		const json = (await response.json()) as {
			content?: { type: string; text?: string }[]
		}
		const text = json.content?.find((block) => block.type === 'text')?.text
		if (typeof text !== 'string') {
			throw new Error('Anthropic response missing content')
		}
		return text
	},

	async chatCompletionStream({ apiKey, model, messages, onDelta }) {
		const system = messages.find((message) => message.role === 'system')?.content
		const body: Record<string, unknown> = {
			model,
			max_tokens: 4096,
			stream: true,
			messages: messages
				.filter((message) => message.role !== 'system')
				.map((message) => ({ role: message.role, content: message.content })),
		}
		if (system) body.system = system

		const response = await fetchWithTimeout(`${BASE_URL}/messages`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': apiKey,
				'anthropic-version': '2023-06-01',
			},
			body: JSON.stringify(body),
		})

		let full = ''
		for await (const data of readSSE(response)) {
			try {
				const json = JSON.parse(data) as {
					type?: string
					delta?: { type?: string; text?: string }
				}
				const delta = json.type === 'content_block_delta' && json.delta?.type === 'text_delta' ? json.delta.text : undefined
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