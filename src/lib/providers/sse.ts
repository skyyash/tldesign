export async function* readSSE(response: Response): AsyncGenerator<string> {
	if (!response.body) return
	const reader = response.body.getReader()
	const decoder = new TextDecoder()
	let buffer = ''
	try {
		while (true) {
			const { done, value } = await reader.read()
			if (done) break
			buffer += decoder.decode(value, { stream: true })
			const lines = buffer.split('\n')
			buffer = lines.pop() ?? ''
			for (const line of lines) {
				const trimmed = line.trim()
				if (!trimmed.startsWith('data:')) continue
				const data = trimmed.slice(5).trim()
				if (data === '[DONE]') return
				yield data
			}
		}
	} finally {
		reader.releaseLock()
	}
}