export class RequestError extends Error {
	constructor(
		message: string,
		public status?: number
	) {
		super(message)
		this.name = 'RequestError'
	}
}

export async function fetchWithTimeout(
	input: string,
	init: RequestInit = {},
	timeoutMs = 90_000
): Promise<Response> {
	const controller = new AbortController()
	const timeout = setTimeout(() => controller.abort(), timeoutMs)
	try {
		const response = await fetch(input, { ...init, signal: controller.signal })
		if (!response.ok) {
			throw new RequestError(`Request failed: ${response.status} ${response.statusText}`, response.status)
		}
		return response
	} finally {
		clearTimeout(timeout)
	}
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
	let lastError: unknown
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			return await fn()
		} catch (err) {
			lastError = err
			if (attempt >= retries || !isRetryable(err)) throw err
			await sleep(1000 * Math.pow(2, attempt))
		}
	}
	throw lastError
}

function isRetryable(err: unknown): boolean {
	if (err instanceof RequestError) {
		return err.status === 429 || (err.status !== undefined && err.status >= 500)
	}
	// Network/abort errors (fetch threw without a status) are retryable.
	return true
}

export async function runPool<T>(
	items: T[],
	concurrency: number,
	fn: (item: T) => Promise<void>
): Promise<void> {
	const queue = [...items]
	const workers = Array.from(
		{ length: Math.max(1, Math.min(concurrency, items.length)) },
		async () => {
			while (queue.length > 0) {
				const item = queue.shift()!
				await fn(item)
			}
		}
	)
	await Promise.all(workers)
}