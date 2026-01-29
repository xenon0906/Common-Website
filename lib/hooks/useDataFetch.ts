'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Query keys for consistent cache management
export const queryKeys = {
  blogs: ['blogs'] as const,
  blog: (id: string) => ['blogs', id] as const,
  blogBySlug: (slug: string) => ['blogs', 'slug', slug] as const,
  team: ['team'] as const,
  teamMember: (id: string) => ['team', id] as const,
  seo: ['seo'] as const,
  seoPage: (slug: string) => ['seo', 'page', slug] as const,
  content: (section: string) => ['content', section] as const,
  settings: ['settings'] as const,
  instagramReels: ['instagram-reels'] as const,
  faq: ['faq'] as const,
}

// Generic fetch function with error handling
async function fetchAPI<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP error ${response.status}`)
  }
  return response.json()
}

// Generic mutation function
async function mutateAPI<T, D = unknown>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  data?: D
): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: data ? { 'Content-Type': 'application/json' } : undefined,
    body: data ? JSON.stringify(data) : undefined,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP error ${response.status}`)
  }
  return response.json()
}

// Blogs hooks
export function useBlogs() {
  return useQuery({
    queryKey: queryKeys.blogs,
    queryFn: () => fetchAPI<BlogListItem[]>('/api/blogs'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useBlog(id: string) {
  return useQuery({
    queryKey: queryKeys.blog(id),
    queryFn: () => fetchAPI<BlogDetail>(`/api/blogs/${id}`),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useBlogBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.blogBySlug(slug),
    queryFn: () => fetchAPI<BlogDetail>(`/api/blogs/slug/${slug}`),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBlogData) =>
      mutateAPI<BlogDetail, CreateBlogData>('/api/blogs', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs })
    },
  })
}

export function useUpdateBlog(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateBlogData) =>
      mutateAPI<BlogDetail, UpdateBlogData>(`/api/blogs/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs })
      queryClient.invalidateQueries({ queryKey: queryKeys.blog(id) })
    },
  })
}

export function useDeleteBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      mutateAPI<void>(`/api/blogs/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs })
    },
  })
}

// Team hooks
export function useTeam() {
  return useQuery({
    queryKey: queryKeys.team,
    queryFn: () => fetchAPI<TeamMember[]>('/api/team'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// SEO hooks
export function useSEOSettings() {
  return useQuery({
    queryKey: queryKeys.seo,
    queryFn: () => fetchAPI<SEOSettings>('/api/admin/seo'),
    staleTime: 5 * 60 * 1000,
  })
}

// Instagram Reels
export function useInstagramReels() {
  return useQuery({
    queryKey: queryKeys.instagramReels,
    queryFn: () => fetchAPI<InstagramReel[]>('/api/instagram-reels'),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// FAQ
export function useFAQ() {
  return useQuery({
    queryKey: queryKeys.faq,
    queryFn: () => fetchAPI<FAQItem[]>('/api/faq'),
    staleTime: 10 * 60 * 1000,
  })
}

// Types (you can move these to a separate types file)
interface BlogListItem {
  id: string
  title: string
  slug: string
  excerpt?: string
  published: boolean
  createdAt: string
  category?: string
  tags?: string[]
}

interface BlogDetail extends BlogListItem {
  content: string
  metaTitle?: string
  metaDescription?: string
  featuredImage?: string
  author?: {
    id: string
    name: string
    avatar?: string
  }
}

interface CreateBlogData {
  title: string
  content: string
  slug?: string
  excerpt?: string
  published?: boolean
  category?: string
  tags?: string[]
  metaTitle?: string
  metaDescription?: string
  featuredImage?: string
}

interface UpdateBlogData extends Partial<CreateBlogData> {}

interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string
  imageUrl?: string
}

interface SEOSettings {
  globalSEO: {
    siteName: string
    defaultDescription: string
    defaultKeywords: string[]
  }
  pages: Array<{
    pageSlug: string
    metaTitle: string
    metaDescription: string
    score: number
  }>
}

interface InstagramReel {
  id: string
  url: string
  thumbnailUrl?: string
  caption?: string
}

interface FAQItem {
  id: string
  question: string
  answer: string
  category?: string
  order?: number
}
