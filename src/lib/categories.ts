export const CATEGORIES = [
  'Mercado',
  'Hortifruti',
  'Carnes',
  'Limpeza',
  'Higiene',
  'Pets',
  'Outros',
] as const

export type Category = (typeof CATEGORIES)[number]

export const DEFAULT_CATEGORY: Category = 'Mercado'

export const CATEGORY_EMOJI: Record<Category, string> = {
  Mercado: '🛒',
  Hortifruti: '🥦',
  Carnes: '🥩',
  Limpeza: '🧽',
  Higiene: '🧴',
  Pets: '🐾',
  Outros: '📦',
}

export function toCategory(value: unknown): Category {
  return CATEGORIES.includes(value as Category) ? (value as Category) : 'Outros'
}
