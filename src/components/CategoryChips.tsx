import { CATEGORIES, CATEGORY_EMOJI, type Category } from '../lib/categories'

type Props = {
  value: Category
  onChange: (category: Category) => void
  /** Single scrolling row (under the add field) or wrapped (in the edit sheet). */
  wrap?: boolean
}

export function CategoryChips({ value, onChange, wrap = false }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Categoria"
      className={`flex gap-2 ${wrap ? 'flex-wrap' : '-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none]'}`}
    >
      {CATEGORIES.map((category) => {
        const selected = category === value
        return (
          <button
            key={category}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(category)}
            className={`flex h-14 shrink-0 items-center gap-1.5 rounded-full border-2 px-4 text-lg font-bold transition-colors ${
              selected ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-ink active:bg-canvas'
            }`}
          >
            <span aria-hidden="true">{CATEGORY_EMOJI[category]}</span>
            {category}
          </button>
        )
      })}
    </div>
  )
}
