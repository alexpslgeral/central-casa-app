// Firebase web config for the family project. These values are public by design:
// access to the data is enforced by firestore.rules, not by keeping this secret.
// Paste the config from Firebase console > Project settings > Your apps.
export const firebaseConfig = {
  apiKey: "AIzaSyChKE0Kr4F2gUc-fEP0oDI3RDk5GKjWRWc",
  authDomain: "central-casa-app.firebaseapp.com",
  projectId: "central-casa-app",
  storageBucket: "central-casa-app.firebasestorage.app",
  messagingSenderId: "993393047047",
  appId: "1:993393047047:web:26e76e2348006a1ad1dca2"
}

// The single shared family account (Email/Password provider).
// Only the email lives here; the password is never committed.
export const FAMILY_EMAIL = 'alexpslgeral@gmail.com'
