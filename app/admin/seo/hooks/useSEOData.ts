'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getFirebaseDb,
  getCollectionPath,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from '@/lib/firebase'
import {
  PageSEO,
  GlobalSEO,
  DEFAULT_GLOBAL_SEO,
  DEFAULT_PAGES_SEO,
  calculateSEOScore,
} from '@/lib/types/seo'

export function useSEOData() {
  const [pages, setPages] = useState<PageSEO[]>([])
  const [globalSEO, setGlobalSEO] = useState<GlobalSEO>(DEFAULT_GLOBAL_SEO)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all SEO data
  const fetchSEOData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const db = getFirebaseDb()

      // Fetch global SEO settings
      const globalDocRef = doc(db, getCollectionPath('seo'), 'config')
      const globalDocSnap = await getDoc(globalDocRef)

      if (globalDocSnap.exists()) {
        setGlobalSEO({ ...DEFAULT_GLOBAL_SEO, ...globalDocSnap.data() } as GlobalSEO)
      } else {
        // Initialize with defaults
        await setDoc(globalDocRef, DEFAULT_GLOBAL_SEO)
        setGlobalSEO(DEFAULT_GLOBAL_SEO)
      }

      // Fetch page SEO settings
      const pagesCollectionRef = collection(db, getCollectionPath('seo/pages'))
      const pagesQuery = query(pagesCollectionRef, orderBy('pageName'))
      const pagesSnapshot = await getDocs(pagesQuery)

      if (pagesSnapshot.empty) {
        // Initialize with default pages
        const initialPages: PageSEO[] = []
        for (const defaultPage of DEFAULT_PAGES_SEO) {
          const pageDocRef = doc(db, getCollectionPath('seo/pages'), defaultPage.pageSlug)
          await setDoc(pageDocRef, {
            ...defaultPage,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          initialPages.push({ ...defaultPage, id: defaultPage.pageSlug })
        }
        setPages(initialPages)
      } else {
        const fetchedPages = pagesSnapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
        })) as PageSEO[]
        setPages(fetchedPages)
      }
    } catch (err) {
      console.error('Error fetching SEO data:', err)
      setError('Failed to load SEO data')
      // Use defaults on error
      setGlobalSEO(DEFAULT_GLOBAL_SEO)
      setPages(DEFAULT_PAGES_SEO.map(p => ({ ...p, id: p.pageSlug })))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save global SEO settings
  const saveGlobalSEO = useCallback(async (data: Partial<GlobalSEO>) => {
    setIsSaving(true)
    setError(null)

    try {
      const db = getFirebaseDb()
      const globalDocRef = doc(db, getCollectionPath('seo'), 'config')

      const updatedData = {
        ...globalSEO,
        ...data,
        updatedAt: new Date(),
      }

      await setDoc(globalDocRef, updatedData)
      setGlobalSEO(updatedData)

      return true
    } catch (err) {
      console.error('Error saving global SEO:', err)
      setError('Failed to save global SEO settings')
      return false
    } finally {
      setIsSaving(false)
    }
  }, [globalSEO])

  // Save page SEO
  const savePageSEO = useCallback(async (pageSlug: string, data: Partial<PageSEO>) => {
    setIsSaving(true)
    setError(null)

    try {
      const db = getFirebaseDb()
      const pageDocRef = doc(db, getCollectionPath('seo/pages'), pageSlug)

      // Recalculate score
      const analysis = calculateSEOScore({ ...data })

      const updatedData = {
        ...data,
        pageSlug,
        score: analysis.score,
        issues: analysis.issues,
        updatedAt: new Date(),
      }

      await setDoc(pageDocRef, updatedData, { merge: true })

      // Update local state
      setPages(prev =>
        prev.map(p =>
          p.pageSlug === pageSlug
            ? { ...p, ...updatedData, id: pageSlug }
            : p
        )
      )

      return true
    } catch (err) {
      console.error('Error saving page SEO:', err)
      setError('Failed to save page SEO settings')
      return false
    } finally {
      setIsSaving(false)
    }
  }, [])

  // Add new page
  const addPage = useCallback(async (data: Omit<PageSEO, 'id' | 'score' | 'issues'>) => {
    setIsSaving(true)
    setError(null)

    try {
      const db = getFirebaseDb()
      const pageDocRef = doc(db, getCollectionPath('seo/pages'), data.pageSlug)

      // Check if page already exists
      const existingDoc = await getDoc(pageDocRef)
      if (existingDoc.exists()) {
        setError('Page already exists')
        return false
      }

      // Calculate initial score
      const analysis = calculateSEOScore(data)

      const newPage: PageSEO = {
        ...data,
        id: data.pageSlug,
        score: analysis.score,
        issues: analysis.issues,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await setDoc(pageDocRef, newPage)
      setPages(prev => [...prev, newPage])

      return true
    } catch (err) {
      console.error('Error adding page:', err)
      setError('Failed to add page')
      return false
    } finally {
      setIsSaving(false)
    }
  }, [])

  // Delete page
  const deletePage = useCallback(async (pageSlug: string) => {
    setIsSaving(true)
    setError(null)

    try {
      const db = getFirebaseDb()
      const pageDocRef = doc(db, getCollectionPath('seo/pages'), pageSlug)

      await deleteDoc(pageDocRef)
      setPages(prev => prev.filter(p => p.pageSlug !== pageSlug))

      return true
    } catch (err) {
      console.error('Error deleting page:', err)
      setError('Failed to delete page')
      return false
    } finally {
      setIsSaving(false)
    }
  }, [])

  // Analyze all pages
  const analyzeAllPages = useCallback(async () => {
    setIsSaving(true)

    try {
      const updatedPages = pages.map(page => {
        const analysis = calculateSEOScore(page)
        return {
          ...page,
          score: analysis.score,
          issues: analysis.issues,
          lastAnalyzed: new Date(),
        }
      })

      // Save all updates
      const db = getFirebaseDb()
      for (const page of updatedPages) {
        const pageDocRef = doc(db, getCollectionPath('seo/pages'), page.pageSlug)
        await setDoc(pageDocRef, page, { merge: true })
      }

      setPages(updatedPages)
      return true
    } catch (err) {
      console.error('Error analyzing pages:', err)
      setError('Failed to analyze pages')
      return false
    } finally {
      setIsSaving(false)
    }
  }, [pages])

  // Initial fetch
  useEffect(() => {
    fetchSEOData()
  }, [fetchSEOData])

  return {
    pages,
    globalSEO,
    isLoading,
    isSaving,
    error,
    fetchSEOData,
    saveGlobalSEO,
    savePageSEO,
    addPage,
    deletePage,
    analyzeAllPages,
    clearError: () => setError(null),
  }
}
