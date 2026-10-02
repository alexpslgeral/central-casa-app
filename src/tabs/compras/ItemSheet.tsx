import { useEffect, useState, type FormEvent } from 'react'
import { CategoryChips } from '../../components/CategoryChips'
import { ConsumerChips } from '../../components/ConsumerChips'
import { BUTTON_DANGER, BUTTON_PRIMARY, BUTTON_SECONDARY, INPUT, Sheet } from '../../components/Sheet'
import { DEFAULT_CATEGORY, type Category } from '../../lib/categories'
import type { Member } from '../../lib/members'
import { deleteItems, updateItem, type Item } from '../../lib/shopping'

type Props = {
  item: Item | null
  members: Member[]
  onClose: () => void
}

export function ItemSheet({ item, members, onClose }: Props) {
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORY)
  const [consumers, setConsumers] = useState<string[]>([])
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useEffect(() => {
    if (!item) return
    setName(item.name)
    setNote(item.note)
    setCategory(item.category)
    setConsumers(item.consumers)
    setConfirmingDelete(false)
  }, [item])

  if (!item) return null

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!item || !name.trim()) return
    updateItem(item.id, { name: name.trim(), note: note.trim(), category, consumers })
    onClose()
  }

  if (confirmingDelete) {
    return (
      <Sheet open title={`Excluir "${item.name}"?`} onClose={onClose}>
        <p className="text-lg text-muted">O item será apagado da lista para sempre.</p>
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => {
              deleteItems([item])
              onClose()
            }}
            className={BUTTON_DANGER}
          >
            Excluir item
          </button>
          <button type="button" onClick={() => setConfirmingDelete(false)} className={BUTTON_SECONDARY}>
            Cancelar
          </button>
        </div>
      </Sheet>
    )
  }

  return (
    <Sheet open title="Editar item" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="item-name" className="text-lg font-bold">
          Nome
        </label>
        <input id="item-name" value={name} onChange={(e) => setName(e.target.value)} className={`mt-2 ${INPUT}`} />

        <label htmlFor="item-note" className="mt-5 block text-lg font-bold">
          Observação <span className="font-semibold text-muted">(opcional)</span>
        </label>
        <input
          id="item-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ex.: 2 kg, marca preferida"
          className={`mt-2 ${INPUT}`}
        />

        <p className="mt-5 mb-2 text-lg font-bold">Categoria</p>
        <CategoryChips value={category} onChange={setCategory} wrap />

        <p className="mt-5 mb-2 text-lg font-bold">Para quem</p>
        <ConsumerChips members={members} value={consumers} onChange={setConsumers} wrap />

        <div className="mt-6 space-y-3">
          <button type="submit" className={BUTTON_PRIMARY}>
            Salvar
          </button>
          <button type="button" onClick={() => setConfirmingDelete(true)} className={BUTTON_DANGER}>
            Excluir item
          </button>
        </div>
      </form>
    </Sheet>
  )
}
