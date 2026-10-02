import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore'
import { FAMILY_EMAIL, firebaseConfig } from '../firebase-config'

export const isFirebaseConfigured =
  !firebaseConfig.apiKey.startsWith('REPLACE_') && !FAMILY_EMAIL.startsWith('REPLACE_')

export const app = initializeApp(firebaseConfig)

// getAuth uses local (IndexedDB) persistence by default, so a device stays signed in
// across restarts until someone explicitly signs out.
export const auth = getAuth(app)

// Persistent cache keeps data readable offline and queues writes until the connection returns.
// The multi-tab manager lets several open tabs share that cache safely.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
})
