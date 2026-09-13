import { ChatMessage } from '../openrouter'

export type ProviderId = 'openai' | 'gemini' | 'groq' | 'anthropic' | 'openrouter'

export interface ProviderModel {
	provider: ProviderId
	id: string
	name: string
	context_length: number
}

export interface Provider {
	id: ProviderId
	name: string
	fetchModels(apiKey: string): Promise<ProviderModel[]>
	chatCompletion(opts: {
		apiKey: string
		model: string
		messages: ChatMessage[]
	}): Promise<string>
	chatCompletionStream(opts: {
		apiKey: string
		model: string
		messages: ChatMessage[]
		onDelta: (text: string) => void
	}): Promise<string>
}