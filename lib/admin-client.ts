/**
 * Unified client-side API for admin operations
 * All admin CRUD should use these methods instead of direct Firestore access
 */

import type { TeamMemberData } from './content'

export interface ApiResponse<T> {
  data?: T
  error?: string
}

// Generic fetcher with error handling
async function apiFetch<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Request failed' }))
      return { error: errorData.error || `HTTP ${res.status}` }
    }

    const data = await res.json()
    return { data }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Network error' }
  }
}

// Team operations
export const teamAPI = {
  list: () => apiFetch<TeamMemberData[]>('/api/team'),
  get: (id: string) => apiFetch<TeamMemberData>(`/api/team/${id}`),
  create: (data: Partial<TeamMemberData>) => apiFetch<TeamMemberData>('/api/team', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<TeamMemberData>) => apiFetch<TeamMemberData>(`/api/team/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiFetch<void>(`/api/team/${id}`, { method: 'DELETE' }),
}

// Content operations (hero, stats, etc.) - to be added as needed
export const contentAPI = {
  hero: {
    get: () => apiFetch<any>('/api/content/hero'),
    update: (data: any) => apiFetch<any>('/api/content/hero', { method: 'PUT', body: JSON.stringify(data) }),
  },
  stats: {
    get: () => apiFetch<any>('/api/content/stats'),
    update: (data: any) => apiFetch<any>('/api/content/stats', { method: 'PUT', body: JSON.stringify(data) }),
  },
  features: {
    get: () => apiFetch<any>('/api/content/features'),
    update: (data: any) => apiFetch<any>('/api/content/features', { method: 'PUT', body: JSON.stringify(data) }),
  },
}
