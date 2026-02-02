import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { getApp, getApps, initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
}

function getFirebaseApp() {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
}

function getFirebaseAuth() {
  return getAuth(getFirebaseApp())
}

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
