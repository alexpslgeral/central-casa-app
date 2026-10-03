import { useState, type ReactNode } from 'react'
import { EmptyState } from '../components/EmptyState'
import {
  IconContacts,
  IconGlobe,
  IconInstagram,
  IconPencil,
  IconPhone,
  IconPlus,
  IconSearch,
  IconTrash,
  IconWhatsapp,
} from '../components/icons'
import { useSnackbar } from '../components/Snackbar'
import { instagramUrl, phoneUrl, websiteUrl, whatsappUrl } from '../lib/contactLinks'
import {
  CONTACT_CATEGORIES,
  CONTACT_CATEGORY_EMOJI,
  createContact,
  deleteContact,
  restoreContact,
  updateContact,
  type Contact,
} from '../lib/contacts'
import { normalizeName } from '../lib/shopping'
import { LoadingScreen } from '../screens/LoadingScreen'
import { ContactSheet } from './contatos/ContactSheet'

type Props = {
  contacts: Contact[] | null
  memberId: string | null
}

export function ContatosTab({ contacts, memberId }: Props) {
  const snackbar = useSnackbar()
  const [query, setQuery] = useState('')
  // undefined: sheet closed; null: creating; a contact: editing it.
  const [editing, setEditing] = useState<Contact | null | undefined>(undefined)

  if (!contacts) return <LoadingScreen />

  const q = normalizeName(query)
  const visible = q
    ? contacts.filter((c) => normalizeName(`${c.name} ${c.category} ${c.note}`).includes(q))
    : contacts

  function remove(contact: Contact) {
    deleteContact(contact.id)
    snackbar(`${contact.name} excluído`, () => restoreContact(contact))
  }

  return (
    <section>
      <h1 className="mb-4 text-3xl font-extrabold">Contatos</h1>

      <button
        type="button"
        onClick={() => setEditing(null)}
        className="flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-brand text-xl font-extrabold text-white shadow-card active:bg-brand-strong"
      >
        <IconPlus className="size-7" />
        Novo contato
      </button>

      {contacts.length > 0 && (
        <label className="mt-4 flex h-14 items-center gap-3 rounded-2xl border-2 border-line bg-surface px-4 focus-within:border-brand">
          <IconSearch className="size-6 shrink-0 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar contato"
            aria-label="Buscar contato"
            className="h-full min-w-0 flex-1 bg-transparent text-xl outline-none"
          />
        </label>
      )}

      {contacts.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            icon={<IconContacts className="size-10" />}
            title="Nenhum contato ainda"
            text="Guarde aqui o gás, o táxi, o encanador e outros contatos da casa."
          />
        </div>
      ) : visible.length === 0 ? (
        <p className="mt-8 text-center text-lg text-muted">Nenhum contato encontrado.</p>
      ) : (
        CONTACT_CATEGORIES.map((category) => {
          const group = visible
            .filter((c) => c.category === category)
            .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
          if (group.length === 0) return null
          return (
            <div key={category} className="mt-6">
              <h2 className="mb-3 flex items-center gap-3 text-xl font-extrabold">
                <span
                  aria-hidden="true"
                  className="flex size-11 items-center justify-center rounded-xl bg-surface text-2xl shadow-card"
                >
                  {CONTACT_CATEGORY_EMOJI[category]}
                </span>
                {category}
                <span className="rounded-full bg-line px-2.5 text-base font-bold text-muted">{group.length}</span>
              </h2>
              <ul className="space-y-3">
                {group.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onEdit={() => setEditing(contact)}
                    onDelete={() => remove(contact)}
                  />
                ))}
              </ul>
            </div>
          )
        })
      )}

      <ContactSheet
        open={editing !== undefined}
        contact={editing ?? undefined}
        onClose={() => setEditing(undefined)}
        onSave={(fields) => {
          if (editing) updateContact(editing.id, fields)
          else createContact(fields, memberId)
          setEditing(undefined)
        }}
      />
    </section>
  )
}

type CardProps = { contact: Contact; onEdit: () => void; onDelete: () => void }

function ContactCard({ contact, onEdit, onDelete }: CardProps) {
  const whatsapp = whatsappUrl(contact.whatsapp)
  const phone = phoneUrl(contact.phone)
  const instagram = instagramUrl(contact.instagram)
  const website = websiteUrl(contact.website)
  const hasLinks = whatsapp || phone || instagram || website

  return (
    <li className="rounded-3xl bg-surface p-5 shadow-card">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-soft text-3xl"
        >
          {CONTACT_CATEGORY_EMOJI[contact.category]}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xl font-extrabold break-words">{contact.name}</p>
          <p className="text-sm font-bold tracking-wide text-muted uppercase">{contact.category}</p>
        </div>
        {contact.note && (
          <span className="max-w-[40%] shrink-0 rounded-full border border-pink-300 bg-pink-50 px-3 py-1 text-sm font-bold break-words text-pink-800">
            {contact.note}
          </span>
        )}
      </div>

      {hasLinks && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {whatsapp && (
            <LinkButton href={whatsapp} className="bg-[#15803d] text-white active:bg-[#166534]" icon={<IconWhatsapp />}>
              WhatsApp
            </LinkButton>
          )}
          {phone && (
            <LinkButton href={phone} className="bg-brand text-white active:bg-brand-strong" icon={<IconPhone />}>
              Ligar
            </LinkButton>
          )}
          {instagram && (
            <LinkButton href={instagram} className="bg-[#be185d] text-white active:bg-[#9d174d]" icon={<IconInstagram />}>
              Instagram
            </LinkButton>
          )}
          {website && (
            <LinkButton href={website} className="bg-brand-soft text-brand-strong active:bg-line" icon={<IconGlobe />}>
              Site
            </LinkButton>
          )}
        </div>
      )}

      <div className="mt-4 flex justify-end gap-1 border-t border-line pt-2">
        <button
          type="button"
          onClick={onEdit}
          className="flex h-12 items-center gap-1.5 rounded-xl px-3 text-base font-bold text-muted active:bg-canvas"
        >
          <IconPencil className="size-5" />
          Editar
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex h-12 items-center gap-1.5 rounded-xl px-3 text-base font-bold text-danger active:bg-danger-soft"
        >
          <IconTrash className="size-5" />
          Excluir
        </button>
      </div>
    </li>
  )
}

function LinkButton({ href, className, icon, children }: { href: string; className: string; icon: ReactNode; children: ReactNode }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`flex h-14 items-center justify-center gap-2 rounded-2xl text-lg font-extrabold ${className}`}
    >
      {icon}
      {children}
    </a>
  )
}
