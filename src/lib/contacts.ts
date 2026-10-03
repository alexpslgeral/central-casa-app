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

export const CONTACT_CATEGORIES = [
  'Transporte',
  'Gás',
  'Segurança',
  'Saúde',
  'Farmácia',
  'Manutenção',
  'Limpeza',
  'Delivery',
  'Mercado',
  'Pets',
  'Viagens',
  'Outros',
] as const

export type ContactCategory = (typeof CONTACT_CATEGORIES)[number]

export const CONTACT_CATEGORY_EMOJI: Record<ContactCategory, string> = {
  Transporte: '🚕',
  Gás: '🔥',
  Segurança: '🛡️',
  Saúde: '🩺',
  Farmácia: '💊',
  Manutenção: '🔧',
  Limpeza: '🧹',
  Delivery: '🍕',
  Mercado: '🛒',
  Pets: '🐾',
  Viagens: '✈️',
  Outros: '📇',
}

export type ContactFields = {
  name: string
  category: ContactCategory
  whatsapp: string
  phone: string
  instagram: string
  website: string
  note: string
}

export type Contact = ContactFields & {
  id: string
  createdAt: Date | null
  createdBy: string | null
}

const str = (value: unknown) => (typeof value === 'string' ? value : '')
const toCategory = (value: unknown): ContactCategory =>
  CONTACT_CATEGORIES.includes(value as ContactCategory) ? (value as ContactCategory) : 'Outros'

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[] | null>(null)
  useEffect(
    () =>
      onSnapshot(
        collection(db, 'contacts'),
        (snap) =>
          setContacts(
            snap.docs.map((d): Contact => {
              const data = d.data({ serverTimestamps: 'estimate' })
              return {
                id: d.id,
                name: str(data.name),
                category: toCategory(data.category),
                whatsapp: str(data.whatsapp),
                phone: str(data.phone),
                instagram: str(data.instagram),
                website: str(data.website),
                note: str(data.note),
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
                createdBy: typeof data.createdBy === 'string' ? data.createdBy : null,
              }
            }),
          ),
        (error) => console.error('Listening to contacts failed', error),
      ),
    [],
  )
  return contacts
}

// Applied to the local cache immediately and synced later; never awaited in the UI.
function run(write: Promise<unknown>) {
  write.catch((error) => console.error('Firestore write failed', error))
}

export function createContact(fields: ContactFields, by: string | null) {
  run(setDoc(doc(collection(db, 'contacts')), { ...fields, createdAt: serverTimestamp(), createdBy: by }))
}

export function updateContact(id: string, fields: ContactFields) {
  run(updateDoc(doc(db, 'contacts', id), { ...fields, updatedAt: serverTimestamp() }))
}

export function deleteContact(id: string) {
  run(deleteDoc(doc(db, 'contacts', id)))
}

/** Recreates a deleted contact exactly as it was (used by "Desfazer"). */
export function restoreContact({ id, createdAt, ...rest }: Contact) {
  run(
    setDoc(doc(db, 'contacts', id), {
      ...rest,
      createdAt: createdAt ? Timestamp.fromDate(createdAt) : serverTimestamp(),
    }),
  )
}
