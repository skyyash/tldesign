import { chatCompletion, fetchModels } from '../openrouter'
import { Provider, ProviderModel } from './types'

export const openrouterProvider: Provider = {
	id: 'openrouter',
	name: 'OpenRouter',

	async fetchModels(): Promise<ProviderModel[]> {
		const models = await fetchModels()
		return models.map((model) => ({
			provider: 'openrouter',
			id: model.id,
			name: model.name,
			context_length: model.context_length,
		}))
	},

	async chatCompletion({ apiKey, model, messages }) {
		return chatCompletion({ apiKey, model, messages })
	},
}