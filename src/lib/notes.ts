import { useEffect, useState } from 'react'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'

export const PAPER_COLORS = {
  amarelo: '#fef3c7',
  rosa: '#fce7f3',
  azul: '#dbeafe',
  verde: '#dcfce7',
  branco: '#ffffff',
} as const

export type PaperColor = keyof typeof PAPER_COLORS

export type Note = {
  id: string
  /** Rich text as HTML; always sanitized before rendering. */
  html: string
  color: PaperColor
  createdAt: Date | null
  createdBy: string | null
  updatedBy: string | null
}

const toPaper = (value: unknown): PaperColor =>
  typeof value === 'string' && value in PAPER_COLORS ? (value as PaperColor) : 'amarelo'

export function useNotes() {
  const [notes, setNotes] = useState<Note[] | null>(null)
  useEffect(
    () =>
      onSnapshot(
        collection(db, 'notes'),
        (snap) =>
          setNotes(
            snap.docs
              .map((d): Note => {
                const data = d.data({ serverTimestamps: 'estimate' })
                return {
                  id: d.id,
                  html: typeof data.html === 'string' ? data.html : '',
                  color: toPaper(data.color),
                  createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
                  createdBy: typeof data.createdBy === 'string' ? data.createdBy : null,
                  updatedBy: typeof data.updatedBy === 'string' ? data.updatedBy : null,
                }
              })
              // Newest first.
              .sort((a, b) => (b.createdAt?.getTime() ?? Infinity) - (a.createdAt?.getTime() ?? Infinity)),
          ),
        (error) => console.error('Listening to notes failed', error),
      ),
    [],
  )
  return notes
}

// Applied to the local cache immediately and synced later; never awaited in the UI.
function run(write: Promise<unknown>) {
  write.catch((error) => console.error('Firestore write failed', error))
}

export function createNote(html: string, color: PaperColor, by: string | null) {
  run(
    setDoc(doc(collection(db, 'notes')), {
      html,
      color,
      createdAt: serverTimestamp(),
      createdBy: by,
      updatedAt: serverTimestamp(),
      updatedBy: by,
    }),
  )
}

export function updateNote(id: string, html: string, color: PaperColor, by: string | null) {
  run(updateDoc(doc(db, 'notes', id), { html, color, updatedAt: serverTimestamp(), updatedBy: by }))
}

export function deleteNote(id: string) {
  run(deleteDoc(doc(db, 'notes', id)))
}

/** Recreates a deleted note exactly as it was (used by "Desfazer"). */
export function restoreNote(note: Note) {
  run(
    setDoc(doc(db, 'notes', note.id), {
      html: note.html,
      color: note.color,
      createdAt: note.createdAt ? Timestamp.fromDate(note.createdAt) : serverTimestamp(),
      createdBy: note.createdBy,
      updatedAt: serverTimestamp(),
      updatedBy: note.updatedBy,
    }),
  )
}
