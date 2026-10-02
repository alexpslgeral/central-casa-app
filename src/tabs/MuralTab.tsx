import { useState } from 'react'
import { Avatar } from '../components/Avatar'
import { EmptyState } from '../components/EmptyState'
import { IconPencil, IconPin, IconPlus, IconTrash } from '../components/icons'
import { useSnackbar } from '../components/Snackbar'
import type { Member } from '../lib/members'
import { createNote, deleteNote, PAPER_COLORS, restoreNote, updateNote, type Note } from '../lib/notes'
import { sanitizeHtml } from '../lib/sanitize'
import { LoadingScreen } from '../screens/LoadingScreen'
import { NoteEditorSheet } from './mural/NoteEditorSheet'

type Props = {
  notes: Note[] | null
  members: Member[]
  memberId: string | null
}

export function MuralTab({ notes, members, memberId }: Props) {
  const snackbar = useSnackbar()
  // undefined: editor closed; null: writing a new note; a note: editing it.
  const [editing, setEditing] = useState<Note | null | undefined>(undefined)

  if (!notes) return <LoadingScreen />

  function remove(note: Note) {
    deleteNote(note.id)
    snackbar('Aviso excluído', () => restoreNote(note))
  }

  return (
    <section>
      <h1 className="mb-4 text-3xl font-extrabold">Mural</h1>

      <button
        type="button"
        onClick={() => setEditing(null)}
        className="mb-5 flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-brand text-xl font-extrabold text-white shadow-card active:bg-brand-strong"
      >
        <IconPlus className="size-7" />
        Novo aviso
      </button>

      {notes.length === 0 ? (
        <EmptyState
          icon={<IconPin className="size-10" />}
          title="Mural vazio"
          text="Escreva um aviso para a casa, como a senha do Wi-Fi ou uma tarefa."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {notes.map((note) => {
            const author = members.find((m) => m.id === note.createdBy)
            return (
              <li
                key={note.id}
                className="flex flex-col rounded-3xl p-5 shadow-card"
                style={{ backgroundColor: PAPER_COLORS[note.color] }}
              >
                <div
                  className="rich text-lg leading-relaxed break-words"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(note.html) }}
                />
                <div className="mt-4 flex items-center gap-2 border-t border-black/10 pt-3">
                  {author && <Avatar member={author} size="sm" />}
                  <span className="min-w-0 flex-1 truncate text-base font-bold text-muted">
                    {author?.name ?? 'Cozinha'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditing(note)}
                    aria-label="Editar aviso"
                    className="flex size-12 items-center justify-center rounded-xl text-muted active:bg-black/5"
                  >
                    <IconPencil className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(note)}
                    aria-label="Excluir aviso"
                    className="flex size-12 items-center justify-center rounded-xl text-muted active:bg-black/5"
                  >
                    <IconTrash className="size-6" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <NoteEditorSheet
        open={editing !== undefined}
        note={editing ?? undefined}
        onClose={() => setEditing(undefined)}
        onSave={(html, color) => {
          if (editing) updateNote(editing.id, html, color, memberId)
          else createNote(html, color, memberId)
          setEditing(undefined)
        }}
      />
    </section>
  )
}
