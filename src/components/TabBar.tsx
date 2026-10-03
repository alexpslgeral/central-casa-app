import { IconCart, IconContacts, IconPin } from './icons'

export type TabId = 'mural' | 'compras' | 'contatos'

const TABS = [
  { id: 'mural', label: 'Mural', Icon: IconPin },
  { id: 'compras', label: 'Compras', Icon: IconCart },
  { id: 'contatos', label: 'Contatos', Icon: IconContacts },
] as const

type Props = {
  active: TabId
  onChange: (tab: TabId) => void
}

export function TabBar({ active, onChange }: Props) {
  return (
    <nav
      aria-label="Seções"
      className="fixed inset-x-0 bottom-0 z-20 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex max-w-md gap-1 rounded-3xl bg-surface p-2 shadow-bar">
        {TABS.map(({ id, label, Icon }) => {
          const selected = id === active
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={selected ? 'page' : undefined}
              className={`flex min-h-16 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl text-base font-bold transition-colors ${
                selected ? 'bg-brand-soft text-brand-strong' : 'text-muted active:bg-canvas'
              }`}
            >
              <Icon className="size-7" />
              {label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
