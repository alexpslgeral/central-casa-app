import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, type User } from 'firebase/auth'
import { FAMILY_EMAIL } from '../firebase-config'
import { auth } from './firebase'

/** undefined while Firebase restores the saved session, then the user or null. */
export function useAuthUser(): User | null | undefined {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  useEffect(() => onAuthStateChanged(auth, setUser), [])
  return user
}

export function signInFamily(password: string) {
  return signInWithEmailAndPassword(auth, FAMILY_EMAIL, password)
}

export function signInErrorMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/wrong-password':
      return 'Senha incorreta.'
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Espere alguns minutos e tente de novo.'
    case 'auth/network-request-failed':
      return 'Sem internet. Conecte e tente de novo.'
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return 'A conta da família não foi encontrada.'
    default:
      return 'Não foi possível entrar. Tente de novo.'
  }
}
