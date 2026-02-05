import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'

export async function signUpWithEmail(email: string, password: string) {
  const auth = getFirebaseAuth()
  return createUserWithEmailAndPassword(auth, email, password)
}

export async function signInWithEmail(email: string, password: string) {
  const auth = getFirebaseAuth()
  return signInWithEmailAndPassword(auth, email, password)
}

export async function signInWithGoogle() {
  const auth = getFirebaseAuth()
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

export async function resetPassword(email: string) {
  const auth = getFirebaseAuth()
  return sendPasswordResetEmail(auth, email)
}

export async function signOut() {
  const auth = getFirebaseAuth()
  return firebaseSignOut(auth)
}

export function getCurrentUser(): User | null {
  const auth = getFirebaseAuth()
  return auth.currentUser
}

export function onAuthChange(callback: (user: User | null) => void) {
  const auth = getFirebaseAuth()
  return onAuthStateChanged(auth, callback)
}
