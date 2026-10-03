import { useEffect, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { BUTTON_PRIMARY, BUTTON_SECONDARY, INPUT, Sheet } from '../../components/Sheet'
import {
  CONTACT_CATEGORIES,
  CONTACT_CATEGORY_EMOJI,
  type Contact,
  type ContactCategory,
  type ContactFields,
} from '../../lib/contacts'

type Props = {
  open: boolean
  /** The contact being edited, or undefined to create one. */
  contact?: Contact
  onClose: () => void
  onSave: (fields: ContactFields) => void
}

const EMPTY: ContactFields = {
  name: '',
  category: 'Outros',
  whatsapp: '',
  phone: '',
  instagram: '',
  website: '',
  note: '',
}

export function ContactSheet({ open, contact, onClose, onSave }: Props) {
  const [fields, setFields] = useState<ContactFields>(EMPTY)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!open) return
    setFields(contact ? { ...contact } : EMPTY)
    setError(false)
  }, [open, contact])

  const set = (key: keyof ContactFields) => (value: string) => setFields((f) => ({ ...f, [key]: value }))

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!fields.name.trim()) {
      setError(true)
      return
    }
    const trimmed = Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]),
    ) as ContactFields
    onSave(trimmed)
  }

  return (
    <Sheet open={open} title={contact ? 'Editar contato' : 'Novo contato'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Field id="contact-name" label="Nome">
          <input
            id="contact-name"
            value={fields.name}
            onChange={(e) => {
              set('name')(e.target.value)
              setError(false)
            }}
            placeholder="Ex.: Gás do Seu Zé"
            autoFocus={!contact}
            aria-invalid={error || undefined}
            className={INPUT}
          />
          {error && (
            <p role="alert" className="mt-2 text-base font-bold text-danger">
              Dê um nome para o contato.
            </p>
          )}
        </Field>

        <div>
          <p className="mb-2 text-lg font-bold">Categoria</p>
          <div role="radiogroup" aria-label="Categoria" className="flex flex-wrap gap-2">
            {CONTACT_CATEGORIES.map((category: ContactCategory) => {
              const selected = fields.category === category
              return (
                <button
                  key={category}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => set('category')(category)}
                  className={`flex h-14 items-center gap-1.5 rounded-full border-2 px-4 text-lg font-bold transition-colors ${
                    selected ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-ink active:bg-canvas'
                  }`}
                >
                  <span aria-hidden="true">{CONTACT_CATEGORY_EMOJI[category]}</span>
                  {category}
                </button>
              )
            })}
          </div>
        </div>

        <TextField
          id="contact-whatsapp"
          label="WhatsApp"
          value={fields.whatsapp}
          onChange={set('whatsapp')}
          type="tel"
          inputMode="tel"
          placeholder="(11) 98765-4321"
        />
        <TextField
          id="contact-phone"
          label="Telefone fixo"
          value={fields.phone}
          onChange={set('phone')}
          type="tel"
          inputMode="tel"
          placeholder="(11) 3333-4444"
        />
        <TextField
          id="contact-instagram"
          label="Instagram"
          value={fields.instagram}
          onChange={set('instagram')}
          autoCapitalize="none"
          autoCorrect="off"
          placeholder="@perfil"
        />
        <TextField
          id="contact-website"
          label="Site"
          value={fields.website}
          onChange={set('website')}
          type="url"
          inputMode="url"
          autoCapitalize="none"
          placeholder="exemplo.com.br"
        />
        <TextField
          id="contact-note"
          label="Observação"
          value={fields.note}
          onChange={set('note')}
          placeholder="Ex.: Chile, só à tarde"
        />

        <div className="space-y-3 pt-1">
          <button type="submit" className={BUTTON_PRIMARY}>
            {contact ? 'Salvar' : 'Adicionar contato'}
          </button>
          <button type="button" onClick={onClose} className={BUTTON_SECONDARY}>
            Cancelar
          </button>
        </div>
      </form>
    </Sheet>
  )
}

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-lg font-bold">
        {label}
      </label>
      {children}
    </div>
  )
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

function TextField({ id, label, value, onChange, ...rest }: TextFieldProps) {
  return (
    <Field id={id} label={label}>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} className={INPUT} {...rest} />
    </Field>
  )
}
