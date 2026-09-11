export type Design = {
	id: string
	name: string
	updatedAt: number
}

const STORAGE_KEY = 'tldesign.designs'

export function listDesigns(): Design[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return []
		const parsed: unknown = JSON.parse(raw)
		if (!Array.isArray(parsed)) return []
		return (parsed as Design[])
			.filter((design) => design && typeof design.id === 'string')
			.sort((a, b) => b.updatedAt - a.updatedAt)
	} catch {
		return []
	}
}

function saveDesigns(designs: Design[]) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(designs))
}

export function createDesign(name: string): Design {
	const design: Design = { id: crypto.randomUUID(), name, updatedAt: Date.now() }
	saveDesigns([design, ...listDesigns()])
	return design
}

export function renameDesign(id: string, name: string) {
	saveDesigns(
		listDesigns().map((design) =>
			design.id === id ? { ...design, name, updatedAt: Date.now() } : design
		)
	)
}

export function touchDesign(id: string) {
	saveDesigns(
		listDesigns().map((design) =>
			design.id === id ? { ...design, updatedAt: Date.now() } : design
		)
	)
}

export function deleteDesign(id: string) {
	saveDesigns(listDesigns().filter((design) => design.id !== id))
}
