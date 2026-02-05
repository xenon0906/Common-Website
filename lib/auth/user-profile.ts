import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { getFirebaseDb, getAppId } from '@/lib/firebase'

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
  const db = getFirebaseDb()
  const appId = getAppId()
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
  const db = getFirebaseDb()
  const appId = getAppId()
  const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', uid)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) return null
  return docSnap.data() as UserProfile
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const db = getFirebaseDb()
  const appId = getAppId()
  const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', uid)

  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  })
}
