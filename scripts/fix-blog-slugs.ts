/**
 * Fix Blog Slugs Script
 *
 * Finds and deletes corrupted blog posts with excessively long slugs.
 * Run with: npm run fix:blog-slugs
 */

const APP_ID = process.env.NEXT_PUBLIC_APP_ID || 'default'
const MAX_SLUG_LENGTH = 100

function getCollectionPath(...segments: string[]): string {
  return ['artifacts', APP_ID, 'public', 'data', ...segments].join('/')
}

async function createAdapter() {
  // Try Admin SDK first
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (serviceAccountKey) {
    try {
      const admin = await import('firebase-admin')
      const serviceAccount = JSON.parse(serviceAccountKey)
      admin.default.initializeApp({
        credential: admin.default.credential.cert(serviceAccount),
      })
      const db = admin.default.firestore()
      console.log('  Using: Firebase Admin SDK')
      return {
        async getAll(collectionPath: string) {
          const snapshot = await db.collection(collectionPath).get()
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        },
        async deleteDoc(collectionPath: string, docId: string) {
          await db.doc(`${collectionPath}/${docId}`).delete()
        },
        async updateDoc(collectionPath: string, docId: string, data: Record<string, unknown>) {
          await db.doc(`${collectionPath}/${docId}`).update(data)
        },
      }
    } catch (error) {
      console.warn('Admin SDK init failed:', error)
    }
  }

  // Fallback to Client SDK
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  if (!config.apiKey || !config.projectId) return null

  try {
    const { initializeApp } = await import('firebase/app')
    const { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } = await import('firebase/firestore')
    const app = initializeApp(config)
    const db = getFirestore(app)
    console.log('  Using: Firebase Client SDK')

    return {
      async getAll(collectionPath: string) {
        const colRef = collection(db, collectionPath)
        const snapshot = await getDocs(colRef)
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      },
      async deleteDoc(collectionPath: string, docId: string) {
        const docRef = doc(db, collectionPath, docId)
        await deleteDoc(docRef)
      },
      async updateDoc(collectionPath: string, docId: string, data: Record<string, unknown>) {
        const docRef = doc(db, collectionPath, docId)
        await updateDoc(docRef, data)
      },
    }
  } catch (error) {
    console.warn('Client SDK init failed:', error)
    return null
  }
}

async function fixBlogSlugs() {
  console.log('='.repeat(60))
  console.log('Fix Blog Slugs Script')
  console.log('='.repeat(60))
  console.log(`App ID: ${APP_ID}`)
  console.log(`Max slug length: ${MAX_SLUG_LENGTH}`)
  console.log('')

  console.log('Initializing Firebase...')
  const adapter = await createAdapter()

  if (!adapter) {
    console.error('ERROR: No Firebase credentials found!')
    console.error('Set NEXT_PUBLIC_FIREBASE_* env vars or FIREBASE_SERVICE_ACCOUNT_KEY')
    process.exit(1)
  }

  console.log('')

  try {
    const blogsPath = getCollectionPath('blogs')
    console.log(`Reading blogs from: ${blogsPath}`)

    const blogs = await adapter.getAll(blogsPath)
    console.log(`Found ${blogs.length} blog(s)`)
    console.log('')

    let deleted = 0
    let fixed = 0

    for (const blog of blogs) {
      const slug = (blog as Record<string, unknown>).slug as string
      const title = (blog as Record<string, unknown>).title as string
      const id = (blog as Record<string, unknown>).id as string

      if (!slug || slug.length > MAX_SLUG_LENGTH) {
        console.log(`CORRUPTED: "${(title || '(no title)').substring(0, 50)}"`)
        console.log(`  ID: ${id}`)
        console.log(`  Slug length: ${slug ? slug.length : 0}`)
        console.log(`  Slug preview: "${(slug || '').substring(0, 80)}..."`)

        // If slug is extremely long (garbage data), delete the whole document
        if (!slug || slug.length > 500) {
          console.log(`  Action: DELETING (slug is garbage data)`)
          await adapter.deleteDoc(blogsPath, id)
          deleted++
        } else {
          // Truncate the slug
          const truncated = slug
            .substring(0, MAX_SLUG_LENGTH)
            .replace(/-$/, '')
          console.log(`  Action: TRUNCATING slug to "${truncated}"`)
          await adapter.updateDoc(blogsPath, id, { slug: truncated })
          fixed++
        }
        console.log('')
      } else {
        console.log(`OK: "${(title || '(no title)').substring(0, 50)}" (slug: ${slug.length} chars)`)
      }
    }

    console.log('')
    console.log('='.repeat(60))
    console.log('Results:')
    console.log(`  Total blogs: ${blogs.length}`)
    console.log(`  Deleted: ${deleted}`)
    console.log(`  Fixed (truncated): ${fixed}`)
    console.log(`  OK: ${blogs.length - deleted - fixed}`)
    console.log('='.repeat(60))
  } catch (error) {
    console.error('Error fixing blog slugs:', error)
    process.exit(1)
  }
}

fixBlogSlugs().then(() => {
  console.log('')
  console.log('Done!')
  process.exit(0)
})
