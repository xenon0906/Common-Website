// Server-side prefetching utilities for Next.js
// Use these in server components to prefetch data for client components

import { cache } from 'react'

// React cache wrapper for deduplication
export const getServerBlogs = cache(async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/blogs`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })
    if (!response.ok) throw new Error('Failed to fetch blogs')
    return response.json()
  } catch (error) {
    console.error('Error prefetching blogs:', error)
    return []
  }
})

export const getServerBlog = cache(async (slug: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/blogs/slug/${slug}`,
      { next: { revalidate: 300 } }
    )
    if (!response.ok) throw new Error('Failed to fetch blog')
    return response.json()
  } catch (error) {
    console.error('Error prefetching blog:', error)
    return null
  }
})

export const getServerTeam = cache(async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/team`, {
      next: { revalidate: 600 }, // Revalidate every 10 minutes
    })
    if (!response.ok) throw new Error('Failed to fetch team')
    return response.json()
  } catch (error) {
    console.error('Error prefetching team:', error)
    return []
  }
})

export const getServerFAQ = cache(async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/faq`, {
      next: { revalidate: 600 },
    })
    if (!response.ok) throw new Error('Failed to fetch FAQ')
    return response.json()
  } catch (error) {
    console.error('Error prefetching FAQ:', error)
    return []
  }
})

// Content prefetching with static revalidation
export const getServerContent = cache(async (section: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/content/${section}`,
      { next: { revalidate: 300 } }
    )
    if (!response.ok) throw new Error(`Failed to fetch content: ${section}`)
    return response.json()
  } catch (error) {
    console.error(`Error prefetching content ${section}:`, error)
    return null
  }
})

// Instagram reels with longer cache time
export const getServerInstagramReels = cache(async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/instagram-reels`,
      { next: { revalidate: 1800 } } // Revalidate every 30 minutes
    )
    if (!response.ok) throw new Error('Failed to fetch Instagram reels')
    return response.json()
  } catch (error) {
    console.error('Error prefetching Instagram reels:', error)
    return []
  }
})
