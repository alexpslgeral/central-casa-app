import { EmptyState } from '../../components/EmptyState'
import { IconCart, IconChevronRight, IconParty, IconPlus, IconRepeat } from '../../components/icons'
import type { Item, ShoppingList } from '../../lib/shopping'
import { useLongPress } from '../../lib/useLongPress'

type Props = {
  lists: ShoppingList[]
  items: Item[]
  onOpen: (list: ShoppingList) => void
  onEdit: (list: ShoppingList) => void
  onCreate: () => void
}

export function ListsOverview({ lists, items, onOpen, onEdit, onCreate }: Props) {
  // Fixed lists first, then events, each in creation order.
  const sorted = [...lists].sort(
    (a, b) =>
      (a.kind === b.kind ? 0 : a.kind === 'fixa' ? -1 : 1) ||
      (a.createdAt?.getTime() ?? Infinity) - (b.createdAt?.getTime() ?? Infinity),
  )

  return (
    <section>
      <h1 className="mb-4 text-3xl font-extrabold">Compras</h1>

      {sorted.length === 0 ? (
        <EmptyState
          icon={<IconCart className="size-10" />}
          title="Nenhuma lista ainda"
          text="Crie a primeira lista de compras."
        />
      ) : (
        <ul className="space-y-3">
          {sorted.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              items={items.filter((i) => i.listId === list.id)}
              onOpen={() => onOpen(list)}
              onEdit={() => onEdit(list)}
            />
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onCreate}
        className="mt-4 flex h-16 w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-brand/40 text-xl font-extrabold text-brand active:bg-brand-soft"
      >
        <IconPlus className="size-7" />
        Nova lista
      </button>
    </section>
  )
}

type CardProps = {
  list: ShoppingList
  items: Item[]
  onOpen: () => void
  onEdit: () => void
}

function ListCard({ list, items, onOpen, onEdit }: CardProps) {
  const press = useLongPress(onEdit, onOpen)
  const total = items.length
  const done = items.filter((i) => i.checked).length
  const left = total - done
  const status =
    total === 0
      ? 'Vazia'
      : left === 0
        ? 'Tudo comprado'
        : `${left} ${left === 1 ? 'item' : 'itens'} para comprar`
  const fixed = list.kind === 'fixa'

  return (
    <li>
      <button
        type="button"
        {...press}
        className="w-full rounded-3xl bg-surface p-5 text-left shadow-card transition-transform active:scale-[0.99]"
      >
        <span className="flex items-center gap-4">
          <span
            className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${
              fixed ? 'bg-brand-soft text-brand' : 'bg-pink-100 text-pink-700'
            }`}
          >
            {fixed ? <IconRepeat className="size-7" /> : <IconParty className="size-7" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xl font-extrabold">{list.name}</span>
            <span className="block text-base font-semibold text-muted">
              {fixed ? 'Fixa' : 'Evento'} · {status}
            </span>
          </span>
          <IconChevronRight className="size-6 shrink-0 text-muted" />
        </span>
        {total > 0 && (
          <span className="mt-4 block h-2.5 overflow-hidden rounded-full bg-canvas" aria-hidden="true">
            <span
              className="block h-full rounded-full bg-emerald-600 transition-[width]"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </span>
        )}
      </button>
    </li>
  )
}
