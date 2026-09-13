import { ChatMessage } from '../openrouter'
import { fetchWithTimeout } from './robust'
import { readSSE } from './sse'

export async function openaiCompatibleStream(
	baseUrl: string,
	{
		apiKey,
		model,
		messages,
		onDelta,
	}: {
		apiKey: string
		model: string
		messages: ChatMessage[]
		onDelta: (text: string) => void
	}
): Promise<string> {
	const response = await fetchWithTimeout(`${baseUrl}/chat/completions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({ model, messages, stream: true }),
	})

	let full = ''
	for await (const data of readSSE(response)) {
		try {
			const json = JSON.parse(data)
			const delta = json.choices?.[0]?.delta?.content
			if (typeof delta === 'string') {
				full += delta
				onDelta(delta)
			}
		} catch {
			// ignore partial JSON chunks
		}
	}
	return full
}