// Simple in-memory cache for server-side data
// Works with Next.js and can be extended with Redis/other caching solutions

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<unknown>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes default

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Clear expired entries
  cleanup(): void {
    const now = Date.now()
    const entries = Array.from(this.cache.entries())
    for (let i = 0; i < entries.length; i++) {
      const [key, entry] = entries[i]
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // Get all keys (for iteration)
  keys(): string[] {
    return Array.from(this.cache.keys())
  }
}

// Singleton instance for server-side caching
export const cache = new SimpleCache()

// Helper function for caching async operations
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cached = cache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  const result = await fn()
  cache.set(key, result, ttl)
  return result
}

// Cache tags for invalidation
export const CACHE_TAGS = {
  BLOGS: 'blogs',
  BLOG_DETAIL: (slug: string) => `blog:${slug}`,
  TEAM: 'team',
  SEO: 'seo',
  SEO_PAGE: (slug: string) => `seo:${slug}`,
  CONTENT: 'content',
  SETTINGS: 'settings',
} as const

// Invalidate cache by tag pattern
export function invalidateCache(pattern: string): void {
  const keys = cache.keys()
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].startsWith(pattern)) {
      cache.delete(keys[i])
    }
  }
}

// TTL presets in milliseconds
export const CACHE_TTL = {
  SHORT: 30 * 1000, // 30 seconds
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
  HOUR: 60 * 60 * 1000, // 1 hour
  DAY: 24 * 60 * 60 * 1000, // 24 hours
} as const
