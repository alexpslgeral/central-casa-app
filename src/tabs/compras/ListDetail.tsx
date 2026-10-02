import { useState } from 'react'
import { Avatar, EveryoneAvatar } from '../../components/Avatar'
import { IconArrowLeft, IconCheck, IconPencil, IconPlus, IconRepeat, IconTrash } from '../../components/icons'
import { BUTTON_PRIMARY, BUTTON_SECONDARY, Sheet } from '../../components/Sheet'
import { useSnackbar } from '../../components/Snackbar'
import type { Member } from '../../lib/members'
import { CATEGORIES, CATEGORY_EMOJI } from '../../lib/categories'
import {
  deleteItems,
  resetItems,
  restoreChecked,
  restoreCheckedMany,
  restoreItems,
  setItemChecked,
  type Item,
  type ShoppingList,
} from '../../lib/shopping'
import { AddItemSheet } from './AddItemSheet'
import { ItemSheet } from './ItemSheet'

type Props = {
  list: ShoppingList
  items: Item[]
  members: Member[]
  memberId: string | null
  onBack: () => void
  onEdit: () => void
  /** Closes an event list for good (deletes it). */
  onFinish: () => void
}

export function ListDetail({ list, items, members, memberId, onBack, onEdit, onFinish }: Props) {
  const snackbar = useSnackbar()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<Item | null>(null)
  const [askAllDone, setAskAllDone] = useState(false)

  const pending = items.filter((i) => !i.checked)
  const bought = items
    .filter((i) => i.checked)
    .sort((a, b) => (b.checkedAt?.getTime() ?? 0) - (a.checkedAt?.getTime() ?? 0))
  const isEvent = list.kind === 'evento'

  function toggle(item: Item) {
    const checked = !item.checked
    setItemChecked(item.id, checked, memberId)
    snackbar(checked ? `${item.name} comprado` : `${item.name} voltou para a lista`, () => restoreChecked(item))
    if (checked && items.every((i) => i.id === item.id || i.checked)) setAskAllDone(true)
  }

  function removeItem(item: Item) {
    deleteItems([item])
    snackbar(`${item.name} excluído`, () => restoreItems([item]))
  }

  function resetList() {
    const checked = items.filter((i) => i.checked)
    if (checked.length === 0) {
      snackbar('Nenhum item marcado')
      return
    }
    resetItems(checked)
    snackbar('Lista resetada', () => restoreCheckedMany(checked))
  }

  function clearBought(toClear: Item[]) {
    if (toClear.length === 0) return
    deleteItems(toClear)
    snackbar(
      toClear.length === 1 ? '1 item removido' : `${toClear.length} itens removidos`,
      () => restoreItems(toClear),
    )
  }

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar para as listas"
          className="-ml-2 flex size-14 shrink-0 items-center justify-center rounded-2xl active:bg-surface"
        >
          <IconArrowLeft className="size-7" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-3xl font-extrabold">{list.name}</h1>
          <p className="text-base font-semibold text-muted">{isEvent ? 'Lista de evento' : 'Lista fixa'}</p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Editar ou excluir a lista"
          className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-surface text-muted shadow-card active:bg-brand-soft"
        >
          <IconPencil />
        </button>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex h-16 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-2xl px-2 whitespace-nowrap bg-brand text-lg font-extrabold text-white shadow-card active:bg-brand-strong"
        >
          <IconPlus className="size-6" />
          Novo item
        </button>
        {!isEvent && (
          <button
            type="button"
            onClick={resetList}
            className="flex h-16 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-2xl px-2 whitespace-nowrap bg-surface text-lg font-extrabold text-brand shadow-card active:bg-brand-soft"
          >
            <IconRepeat className="size-5" />
            Resetar lista
          </button>
        )}
      </div>

      {items.length === 0 && (
        <p className="mt-8 text-center text-lg text-muted">Lista vazia. Toque em "Novo item" para começar.</p>
      )}

      {CATEGORIES.map((cat) => {
        const group = pending
          .filter((i) => i.category === cat)
          .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
        if (group.length === 0) return null
        return (
          <div key={cat}>
            <h2 className="mt-6 mb-2 flex items-center gap-2 text-lg font-extrabold text-muted">
              <span aria-hidden="true">{CATEGORY_EMOJI[cat]}</span>
              {cat}
            </h2>
            <ul className="space-y-2">
              {group.map((item) => (
                <ItemRow key={item.id} item={item} members={members} onToggle={() => toggle(item)} onEdit={() => setEditing(item)} onDelete={() => removeItem(item)} />
              ))}
            </ul>
          </div>
        )
      })}

      {bought.length > 0 && (
        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-muted">Comprados ({bought.length})</h2>
            {isEvent && (
              <button
                type="button"
                onClick={() => clearBought(bought)}
                className="h-14 rounded-2xl px-4 text-lg font-bold text-brand active:bg-brand-soft"
              >
                Limpar
              </button>
            )}
          </div>
          <ul className="space-y-2">
            {bought.map((item) => (
              <ItemRow key={item.id} item={item} members={members} onToggle={() => toggle(item)} onEdit={() => setEditing(item)} onDelete={() => removeItem(item)} />
            ))}
          </ul>
        </div>
      )}

      <AddItemSheet
        open={adding}
        listId={list.id}
        items={items}
        members={members}
        memberId={memberId}
        onClose={() => setAdding(false)}
      />

      <ItemSheet item={editing} members={members} onClose={() => setEditing(null)} />

      <Sheet open={askAllDone} title="Tudo comprado! 🎉" onClose={() => setAskAllDone(false)}>
        <p className="text-lg text-muted">
          {isEvent
            ? `Quer encerrar a lista "${list.name}"? Ela será apagada.`
            : 'Quer resetar a lista? Todos os itens voltam a ficar desmarcados para a próxima compra.'}
        </p>
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => {
              setAskAllDone(false)
              if (isEvent) onFinish()
              else resetList()
            }}
            className={BUTTON_PRIMARY}
          >
            {isEvent ? 'Encerrar lista' : 'Resetar lista'}
          </button>
          <button type="button" onClick={() => setAskAllDone(false)} className={BUTTON_SECONDARY}>
            Agora não
          </button>
        </div>
      </Sheet>
    </section>
  )
}

type ItemRowProps = {
  item: Item
  members: Member[]
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}

const ICON_BUTTON =
  'flex h-14 w-11 shrink-0 items-center justify-center rounded-2xl text-muted active:bg-canvas'

function ItemRow({ item, members, onToggle, onEdit, onDelete }: ItemRowProps) {
  const consumers = members.filter((m) => item.consumers.includes(m.id))
  return (
    <li className="flex items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center rounded-2xl bg-surface pr-1 shadow-card">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={item.checked}
          className="flex min-h-16 min-w-0 flex-1 items-center gap-3 rounded-2xl py-3 pr-1 pl-4 text-left active:bg-canvas"
        >
          <span
            className={`flex size-9 shrink-0 items-center justify-center rounded-full border-[3px] ${
              item.checked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-line'
            }`}
          >
            {item.checked && <IconCheck className="size-6" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className={`block text-xl font-bold break-words ${item.checked ? 'text-muted line-through' : ''}`}>
              {item.name}
            </span>
            {item.note && <span className="block text-base text-muted">{item.note}</span>}
          </span>
        </button>
        <button type="button" onClick={onEdit} aria-label={`Editar ${item.name}`} className={ICON_BUTTON}>
          <IconPencil className="size-6" />
        </button>
        <button type="button" onClick={onDelete} aria-label={`Excluir ${item.name}`} className={ICON_BUTTON}>
          <IconTrash className="size-6" />
        </button>
      </div>
      {/* Fixed column outside the card, so every card has the same width. */}
      <span
        className="flex w-10 shrink-0 flex-col items-center -space-y-2"
        aria-label={consumers.length > 0 ? `Para ${consumers.map((m) => m.name).join(', ')}` : 'Para todos'}
      >
        {consumers.length === 0 ? (
          <EveryoneAvatar />
        ) : (
          consumers.map((m) => (
            <span key={m.id} className="flex rounded-full ring-[3px] ring-canvas">
              <Avatar member={m} />
            </span>
          ))
        )}
      </span>
    </li>
  )
}
