import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { getApp, getApps, initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
}

function getDb() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  return getFirestore(app)
}

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  phone: string | null
  createdAt: string
  updatedAt: string
}

export async function createUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const db = getDb()
  const appId = process.env.NEXT_PUBLIC_APP_ID || 'default'
  const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', uid)

  await setDoc(docRef, {
    uid,
    email: data.email || null,
    displayName: data.displayName || null,
    photoURL: data.photoURL || null,
    phone: data.phone || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getDb()
  const appId = process.env.NEXT_PUBLIC_APP_ID || 'default'
  const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', uid)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) return null
  return docSnap.data() as UserProfile
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const db = getDb()
  const appId = process.env.NEXT_PUBLIC_APP_ID || 'default'
  const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', uid)

  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  })
}
