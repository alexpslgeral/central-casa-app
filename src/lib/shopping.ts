import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { toCategory, type Category } from './categories'
import { db } from './firebase'

// "fixa" lists live until someone deletes them; "evento" lists are closed when done.
export type ListKind = 'fixa' | 'evento'

export type ShoppingList = {
  id: string
  name: string
  kind: ListKind
  createdAt: Date | null
  createdBy: string | null
}

export type Item = {
  id: string
  listId: string
  name: string
  category: Category
  /** Member ids of who consumes the item; empty means everyone in the house. */
  consumers: string[]
  note: string
  checked: boolean
  checkedAt: Date | null
  checkedBy: string | null
  createdAt: Date | null
  createdBy: string | null
}

const toDate = (value: unknown) => (value instanceof Timestamp ? value.toDate() : null)
const toStringOrNull = (value: unknown) => (typeof value === 'string' ? value : null)

function mapList(d: QueryDocumentSnapshot<DocumentData>): ShoppingList {
  // Estimate pending server timestamps so new docs sort correctly before they sync.
  const data = d.data({ serverTimestamps: 'estimate' })
  return {
    id: d.id,
    name: typeof data.name === 'string' ? data.name : '',
    kind: data.kind === 'evento' ? 'evento' : 'fixa',
    createdAt: toDate(data.createdAt),
    createdBy: toStringOrNull(data.createdBy),
  }
}

function mapItem(d: QueryDocumentSnapshot<DocumentData>): Item {
  const data = d.data({ serverTimestamps: 'estimate' })
  return {
    id: d.id,
    listId: typeof data.listId === 'string' ? data.listId : '',
    name: typeof data.name === 'string' ? data.name : '',
    category: toCategory(data.category),
    consumers: Array.isArray(data.consumers)
      ? data.consumers.filter((c: unknown): c is string => typeof c === 'string')
      : [],
    note: typeof data.note === 'string' ? data.note : '',
    checked: data.checked === true,
    checkedAt: toDate(data.checkedAt),
    checkedBy: toStringOrNull(data.checkedBy),
    createdAt: toDate(data.createdAt),
    createdBy: toStringOrNull(data.createdBy),
  }
}

function useLiveCollection<T>(name: string, map: (d: QueryDocumentSnapshot<DocumentData>) => T) {
  const [docs, setDocs] = useState<T[] | null>(null)
  useEffect(
    () =>
      onSnapshot(
        collection(db, name),
        (snap) => setDocs(snap.docs.map(map)),
        (error) => console.error(`Listening to ${name} failed`, error),
      ),
    [name, map],
  )
  return docs
}

export const useLists = () => useLiveCollection('lists', mapList)
export const useItems = () => useLiveCollection('items', mapItem)

// Writes are applied to the local cache immediately and synced later, so we never
// await them in the UI (awaiting would hang while offline).
function run(write: Promise<unknown>) {
  write.catch((error) => console.error('Firestore write failed', error))
}

export function normalizeName(name: string) {
  return name
    .trim()
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

export function createList(name: string, kind: ListKind, by: string | null): string {
  const ref = doc(collection(db, 'lists'))
  run(setDoc(ref, { name, kind, createdAt: serverTimestamp(), createdBy: by }))
  return ref.id
}

export function updateList(id: string, fields: { name: string; kind: ListKind }) {
  run(updateDoc(doc(db, 'lists', id), fields))
}

/** Permanently deletes a list together with all of its items. */
export function deleteList(id: string, items: Item[]) {
  const batch = writeBatch(db)
  items.forEach((item) => batch.delete(doc(db, 'items', item.id)))
  batch.delete(doc(db, 'lists', id))
  run(batch.commit())
}

export function addItem(
  listId: string,
  name: string,
  category: Category,
  consumers: string[],
  by: string | null,
) {
  run(
    setDoc(doc(collection(db, 'items')), {
      listId,
      name,
      category,
      consumers,
      note: '',
      checked: false,
      checkedAt: null,
      checkedBy: null,
      createdAt: serverTimestamp(),
      createdBy: by,
    }),
  )
}

export function setItemChecked(id: string, checked: boolean, by: string | null) {
  run(
    updateDoc(doc(db, 'items', id), {
      checked,
      checkedAt: checked ? serverTimestamp() : null,
      checkedBy: checked ? by : null,
    }),
  )
}

/** Puts an item's checked state back to what it was (used by "Desfazer"). */
export function restoreChecked(item: Item) {
  run(
    updateDoc(doc(db, 'items', item.id), {
      checked: item.checked,
      checkedAt: item.checkedAt ? Timestamp.fromDate(item.checkedAt) : null,
      checkedBy: item.checkedBy,
    }),
  )
}

export function updateItem(
  id: string,
  fields: { name: string; category: Category; consumers: string[]; note: string },
) {
  run(updateDoc(doc(db, 'items', id), fields))
}

export function deleteItems(items: Item[]) {
  const batch = writeBatch(db)
  items.forEach((item) => batch.delete(doc(db, 'items', item.id)))
  run(batch.commit())
}

/** Recreates deleted items exactly as they were (used by "Desfazer"). */
export function restoreItems(items: Item[]) {
  const batch = writeBatch(db)
  items.forEach(({ id, checkedAt, createdAt, ...rest }) =>
    batch.set(doc(db, 'items', id), {
      ...rest,
      checkedAt: checkedAt ? Timestamp.fromDate(checkedAt) : null,
      createdAt: createdAt ? Timestamp.fromDate(createdAt) : serverTimestamp(),
    }),
  )
  run(batch.commit())
}

/** Unchecks every given item so a fixed list can be bought again. */
export function resetItems(items: Item[]) {
  const batch = writeBatch(db)
  items.forEach((item) =>
    batch.update(doc(db, 'items', item.id), { checked: false, checkedAt: null, checkedBy: null }),
  )
  run(batch.commit())
}

/** Puts several items' checked state back to what it was (used by "Desfazer"). */
export function restoreCheckedMany(items: Item[]) {
  const batch = writeBatch(db)
  items.forEach((item) =>
    batch.update(doc(db, 'items', item.id), {
      checked: item.checked,
      checkedAt: item.checkedAt ? Timestamp.fromDate(item.checkedAt) : null,
      checkedBy: item.checkedBy,
    }),
  )
  run(batch.commit())
}
