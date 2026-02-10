/**
 * Delete all blog documents from Firestore.
 * Usage: npm run delete:blogs
 * Uses anonymous auth to satisfy Firestore rules (request.auth != null).
 */
import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getFirestore, collection, getDocs, writeBatch } from 'firebase/firestore'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

if (!config.apiKey || !config.projectId) {
  console.error('ERROR: Firebase env vars not set.')
  process.exit(1)
}

const appId = process.env.NEXT_PUBLIC_APP_ID || 'default'
const blogsPath = `artifacts/${appId}/public/data/blogs`

async function deleteAllBlogs() {
  const app = initializeApp(config)

  // Sign in anonymously (Firestore rules require request.auth != null)
  const auth = getAuth(app)
  console.log('Signing in anonymously...')
  await signInAnonymously(auth)

  const db = getFirestore(app)
  console.log(`Fetching all blogs from: ${blogsPath}`)
  const colRef = collection(db, blogsPath)
  const snapshot = await getDocs(colRef)

  if (snapshot.empty) {
    console.log('No blog documents found. Nothing to delete.')
    return
  }

  console.log(`Found ${snapshot.size} blog(s). Deleting...`)

  const batch = writeBatch(db)
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref)
  })

  await batch.commit()
  console.log(`Successfully deleted ${snapshot.size} blog(s).`)
}

deleteAllBlogs()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to delete blogs:', err)
    process.exit(1)
  })
