import { useState, type FormEvent } from 'react'
import { CategoryChips } from '../../components/CategoryChips'
import { ConsumerChips } from '../../components/ConsumerChips'
import { BUTTON_PRIMARY, BUTTON_SECONDARY, INPUT, Sheet } from '../../components/Sheet'
import { useSnackbar } from '../../components/Snackbar'
import { DEFAULT_CATEGORY, type Category } from '../../lib/categories'
import type { Member } from '../../lib/members'
import { addItem, normalizeName, restoreChecked, setItemChecked, type Item } from '../../lib/shopping'

type Props = {
  open: boolean
  listId: string
  items: Item[]
  members: Member[]
  memberId: string | null
  onClose: () => void
}

export function AddItemSheet({ open, listId, items, members, memberId, onClose }: Props) {
  const snackbar = useSnackbar()
  const [name, setName] = useState('')
  // Category and consumers are kept between items, so several similar items are quick to add.
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORY)
  const [consumers, setConsumers] = useState<string[]>([])
  const [error, setError] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError(true)
      return
    }
    setName('')
    // Avoid duplicates: reuse an item with the same name already on this list.
    const existing = items.find((i) => normalizeName(i.name) === normalizeName(trimmed))
    if (!existing) {
      addItem(listId, trimmed, category, consumers, memberId)
      snackbar(`${trimmed} adicionado`)
    } else if (existing.checked) {
      setItemChecked(existing.id, false, memberId)
      snackbar(`${existing.name} voltou para a lista`, () => restoreChecked(existing))
    } else {
      snackbar(`${existing.name} já está na lista`)
    }
  }

  function close() {
    setName('')
    setError(false)
    onClose()
  }

  return (
    <Sheet open={open} title="Novo item" onClose={close}>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="new-item-name" className="text-lg font-bold">
          Nome
        </label>
        <input
          id="new-item-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError(false)
          }}
          placeholder="Ex.: Café"
          autoFocus
          enterKeyHint="done"
          autoCapitalize="sentences"
          aria-invalid={error || undefined}
          className={`mt-2 ${INPUT}`}
        />
        {error && (
          <p role="alert" className="mt-2 text-base font-bold text-danger">
            Digite o nome do item.
          </p>
        )}

        <p className="mt-5 mb-2 text-lg font-bold">Categoria</p>
        <CategoryChips value={category} onChange={setCategory} wrap />

        <p className="mt-5 mb-2 text-lg font-bold">Para quem</p>
        <ConsumerChips members={members} value={consumers} onChange={setConsumers} wrap />

        <div className="mt-6 space-y-3">
          <button type="submit" className={BUTTON_PRIMARY}>
            Adicionar
          </button>
          <button type="button" onClick={close} className={BUTTON_SECONDARY}>
            Fechar
          </button>
        </div>
      </form>
    </Sheet>
  )
}
