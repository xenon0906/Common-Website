'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc as firestoreDeleteDoc,
  query,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  Timestamp,
  serverTimestamp,
  getCountFromServer,
} from 'firebase/firestore'
import { getFirebaseDb, getCollectionPath } from '@/lib/firebase'
import { sanitizeSlug, MAX_SLUG_LENGTH } from '@/lib/utils'

// Generic type for Firestore documents
export interface FirestoreDoc {
  id: string
  createdAt?: Date | Timestamp
  updatedAt?: Date | Timestamp
  [key: string]: any
}

// Convert Firestore timestamps to JS Dates
function convertTimestamps<T>(data: DocumentData): T {
  const converted: any = { ...data }
  for (const key of Object.keys(converted)) {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate()
    }
  }
  return converted as T
}

// Hook to subscribe to a collection with real-time updates
export function useCollection<T extends FirestoreDoc>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const db = getFirebaseDb()
    const collectionPath = getCollectionPath(collectionName)
    const collectionRef = collection(db, collectionPath)
    const q = query(collectionRef, ...constraints)

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: T[] = []
        snapshot.forEach((doc) => {
          items.push({
            ...convertTimestamps<T>(doc.data()),
            id: doc.id,
          } as T)
        })
        setData(items)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [collectionName, JSON.stringify(constraints)])

  return { data, loading, error }
}

// Hook to subscribe to a single document
export function useDocument<T extends FirestoreDoc>(
  collectionName: string,
  documentId: string | null
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!documentId) {
      setData(null)
      setLoading(false)
      return
    }

    const db = getFirebaseDb()
    const collectionPath = getCollectionPath(collectionName)
    const docRef = doc(db, collectionPath, documentId)

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({
            ...convertTimestamps<T>(snapshot.data()),
            id: snapshot.id,
          } as T)
        } else {
          setData(null)
        }
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error(`Error fetching document ${documentId}:`, err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [collectionName, documentId])

  return { data, loading, error }
}

// CRUD helper functions
export async function createDoc<T extends Omit<FirestoreDoc, 'id'>>(
  collectionName: string,
  data: T
): Promise<string> {
  const db = getFirebaseDb()
  const collectionPath = getCollectionPath(collectionName)
  const collectionRef = collection(db, collectionPath)

  const docRef = await addDoc(collectionRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return docRef.id
}

export async function updateDocument<T extends Partial<FirestoreDoc>>(
  collectionName: string,
  documentId: string,
  data: T
): Promise<void> {
  const db = getFirebaseDb()
  const collectionPath = getCollectionPath(collectionName)
  const docRef = doc(db, collectionPath, documentId)

  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteDocument(
  collectionName: string,
  documentId: string
): Promise<void> {
  const db = getFirebaseDb()
  const collectionPath = getCollectionPath(collectionName)
  const docRef = doc(db, collectionPath, documentId)

  await firestoreDeleteDoc(docRef)
}

// Fetch collection once (non-realtime)
export async function fetchCollection<T extends FirestoreDoc>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const db = getFirebaseDb()
  const collectionPath = getCollectionPath(collectionName)
  const collectionRef = collection(db, collectionPath)
  const q = query(collectionRef, ...constraints)

  const snapshot = await getDocs(q)
  const items: T[] = []

  snapshot.forEach((doc) => {
    items.push({
      ...convertTimestamps<T>(doc.data()),
      id: doc.id,
    } as T)
  })

  return items
}

// Fetch single document once
export async function fetchDocument<T extends FirestoreDoc>(
  collectionName: string,
  documentId: string
): Promise<T | null> {
  const db = getFirebaseDb()
  const collectionPath = getCollectionPath(collectionName)
  const docRef = doc(db, collectionPath, documentId)

  const snapshot = await getDoc(docRef)

  if (snapshot.exists()) {
    return {
      ...convertTimestamps<T>(snapshot.data()),
      id: snapshot.id,
    } as T
  }

  return null
}

// Get collection count
export async function getCollectionCount(collectionName: string): Promise<number> {
  const db = getFirebaseDb()
  const collectionPath = getCollectionPath(collectionName)
  const collectionRef = collection(db, collectionPath)

  const snapshot = await getCountFromServer(collectionRef)
  return snapshot.data().count
}

// Hook for fetching collection counts (useful for dashboard)
export function useCollectionCounts(collectionNames: string[]) {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchCounts() {
      try {
        const results: Record<string, number> = {}
        await Promise.all(
          collectionNames.map(async (name) => {
            try {
              results[name] = await getCollectionCount(name)
            } catch (err) {
              console.error(`Error counting ${name}:`, err)
              results[name] = 0
            }
          })
        )
        setCounts(results)
        setError(null)
      } catch (err) {
        console.error('Error fetching counts:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchCounts()
  }, [JSON.stringify(collectionNames)])

  return { counts, loading, error }
}

// Validation error class
export class BlogValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BlogValidationError'
  }
}

// Validated blog data interface
export interface BlogData {
  title: string
  slug: string
  content: string
  metaDesc?: string
  excerpt?: string
  keywords?: string
  imageUrl?: string
  published?: boolean
  status?: 'draft' | 'published'
  wordCount?: number
  readingTime?: number
  category?: string
  tags?: string[]
  author?: {
    id: string
    name: string
    avatar?: string
    bio?: string
  }
  contentBlocks?: any[]
  contentVersion?: 1 | 2
}

/**
 * Validates and sanitizes blog data before writing to Firestore
 * Throws BlogValidationError if validation fails
 */
export function validateBlogData(data: BlogData): BlogData {
  // Validate title
  if (!data.title || data.title.trim().length < 10) {
    throw new BlogValidationError('Title must be at least 10 characters')
  }

  // Sanitize and validate slug
  const sanitizedSlug = sanitizeSlug(data.slug)
  if (!sanitizedSlug || sanitizedSlug.length < 3) {
    throw new BlogValidationError('Slug must be at least 3 characters')
  }
  if (sanitizedSlug.length > MAX_SLUG_LENGTH) {
    throw new BlogValidationError(`Slug cannot exceed ${MAX_SLUG_LENGTH} characters`)
  }

  // Validate content
  if (!data.content || data.content.trim().length < 100) {
    throw new BlogValidationError('Content must be at least 100 characters')
  }

  return {
    ...data,
    slug: sanitizedSlug,
    title: data.title.trim(),
    content: data.content.trim(),
  }
}

/**
 * Create a blog post with validation
 * Enforces slug length limits to prevent filesystem errors
 */
export async function createBlogPost(data: BlogData): Promise<string> {
  const validatedData = validateBlogData(data)
  return createDoc('blogs', validatedData)
}

/**
 * Update a blog post with validation
 * Enforces slug length limits to prevent filesystem errors
 */
export async function updateBlogPost(
  documentId: string,
  data: Partial<BlogData>
): Promise<void> {
  // If slug is being updated, validate it
  if (data.slug) {
    const sanitizedSlug = sanitizeSlug(data.slug)
    if (sanitizedSlug.length > MAX_SLUG_LENGTH) {
      throw new BlogValidationError(`Slug cannot exceed ${MAX_SLUG_LENGTH} characters`)
    }
    data.slug = sanitizedSlug
  }

  return updateDocument('blogs', documentId, data)
}

// Export Firestore query helpers for convenience
export { orderBy, limit, query } from 'firebase/firestore'
