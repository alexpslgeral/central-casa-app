import { useEffect, useState, type FormEvent } from 'react'
import { IconParty, IconRepeat } from '../../components/icons'
import { BUTTON_DANGER, BUTTON_PRIMARY, BUTTON_SECONDARY, INPUT, Sheet } from '../../components/Sheet'
import type { ListKind, ShoppingList } from '../../lib/shopping'

type Props = {
  open: boolean
  /** The list being edited, or undefined to create a new one. */
  list?: ShoppingList
  itemCount: number
  onClose: () => void
  onSave: (fields: { name: string; kind: ListKind }) => void
  onDelete: () => void
}

const KINDS = [
  { kind: 'fixa', label: 'Fixa', text: 'Para as compras de sempre. Fica até alguém excluir.', Icon: IconRepeat },
  { kind: 'evento', label: 'Evento', text: 'Para uma festa ou ocasião. Pode ser encerrada no fim.', Icon: IconParty },
] as const

export function ListSheet({ open, list, itemCount, onClose, onSave, onDelete }: Props) {
  const [name, setName] = useState('')
  const [kind, setKind] = useState<ListKind>('fixa')
  const [error, setError] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useEffect(() => {
    if (!open) return
    setName(list?.name ?? '')
    setKind(list?.kind ?? 'fixa')
    setError(false)
    setConfirmingDelete(false)
  }, [open, list])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError(true)
      return
    }
    onSave({ name: trimmed, kind })
  }

  if (confirmingDelete && list) {
    return (
      <Sheet open={open} title={`Excluir "${list.name}"?`} onClose={onClose}>
        <p className="text-lg text-muted">
          {itemCount > 0
            ? `A lista e ${itemCount === 1 ? 'o item dela' : `os ${itemCount} itens dela`} serão apagados para sempre.`
            : 'A lista será apagada para sempre.'}
        </p>
        <div className="mt-6 space-y-3">
          <button type="button" onClick={onDelete} className={BUTTON_DANGER}>
            Excluir lista
          </button>
          <button type="button" onClick={() => setConfirmingDelete(false)} className={BUTTON_SECONDARY}>
            Cancelar
          </button>
        </div>
      </Sheet>
    )
  }

  return (
    <Sheet open={open} title={list ? 'Editar lista' : 'Nova lista'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="list-name" className="text-lg font-bold">
          Nome
        </label>
        <input
          id="list-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError(false)
          }}
          placeholder={kind === 'fixa' ? 'Ex.: Mercado' : 'Ex.: Aniversário da Ju'}
          autoFocus={!list}
          enterKeyHint="done"
          aria-invalid={error || undefined}
          className={`mt-2 ${INPUT}`}
        />
        {error && (
          <p role="alert" className="mt-2 text-base font-bold text-danger">
            Dê um nome para a lista.
          </p>
        )}

        <p className="mt-5 text-lg font-bold">Tipo</p>
        <div role="radiogroup" aria-label="Tipo de lista" className="mt-2 grid grid-cols-2 gap-3">
          {KINDS.map(({ kind: k, label, text, Icon }) => {
            const selected = kind === k
            return (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setKind(k)}
                className={`flex flex-col gap-2 rounded-2xl border-2 p-4 text-left ${
                  selected ? 'border-brand bg-brand-soft' : 'border-line bg-surface active:bg-canvas'
                }`}
              >
                <Icon className={`size-8 ${selected ? 'text-brand' : 'text-muted'}`} />
                <span className="text-xl font-extrabold">{label}</span>
                <span className="text-base leading-snug text-muted">{text}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-6 space-y-3">
          <button type="submit" className={BUTTON_PRIMARY}>
            {list ? 'Salvar' : 'Criar lista'}
          </button>
          {list && (
            <button type="button" onClick={() => setConfirmingDelete(true)} className={BUTTON_DANGER}>
              Excluir lista
            </button>
          )}
        </div>
      </form>
    </Sheet>
  )
}
