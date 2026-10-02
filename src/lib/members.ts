import { useEffect, useState } from 'react'
import { collection, doc, onSnapshot, runTransaction } from 'firebase/firestore'
import { db } from './firebase'

export type Member = {
  id: string
  name: string
  color: string
  order: number
}

// Fixed ids make seeding idempotent if two devices open the app at the same moment.
const PLACEHOLDER_MEMBERS: Member[] = [
  { id: 'pessoa-1', name: 'Pessoa 1', color: '#7c3aed', order: 1 },
  { id: 'pessoa-2', name: 'Pessoa 2', color: '#c2410c', order: 2 },
  { id: 'pessoa-3', name: 'Pessoa 3', color: '#047857', order: 3 },
]

async function seedMembers() {
  await runTransaction(db, async (tx) => {
    const refs = PLACEHOLDER_MEMBERS.map((m) => doc(db, 'members', m.id))
    const snaps = await Promise.all(refs.map((ref) => tx.get(ref)))
    snaps.forEach((snap, i) => {
      if (snap.exists()) return
      const { name, color, order } = PLACEHOLDER_MEMBERS[i]
      tx.set(refs[i], { name, color, order })
    })
  })
}

export type MembersState = {
  members: Member[] | null
  errorCode: string | null
}

/** Live list of family members, seeded with placeholders the first time. */
export function useMembers(): MembersState {
  const [state, setState] = useState<MembersState>({ members: null, errorCode: null })

  useEffect(() => {
    let seeding = false
    return onSnapshot(
      collection(db, 'members'),
      // Metadata changes let us see when an empty cached result is confirmed by the server.
      { includeMetadataChanges: true },
      (snap) => {
        if (snap.empty) {
          // Only seed once the server confirms the collection is really empty.
          if (!snap.metadata.fromCache && !seeding) {
            seeding = true
            seedMembers().catch((error) => {
              seeding = false
              setState((s) => ({ ...s, errorCode: error?.code ?? 'unknown' }))
            })
          }
          return
        }
        const members = snap.docs
          .map((d): Member => {
            const data = d.data()
            return {
              id: d.id,
              name: typeof data.name === 'string' ? data.name : '',
              color: typeof data.color === 'string' ? data.color : '#64748b',
              order: typeof data.order === 'number' ? data.order : 0,
            }
          })
          .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'pt-BR'))
        setState({ members, errorCode: null })
      },
      (error) => setState((s) => ({ ...s, errorCode: error.code })),
    )
  }, [])

  return state
}
