import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cn, formatCurrency, formatNumber, slugify, truncate, calculateFareSplit } from '@/lib/utils'
import { getSiteUrl, getCanonicalUrl } from '@/lib/utils/url'

describe('Utility Functions (lib/utils.ts)', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      const result = cn('px-4', 'py-2')
      expect(result).toBe('px-4 py-2')
    })

    it('handles conditional classes', () => {
      const result = cn('base', false && 'hidden', 'visible')
      expect(result).toBe('base visible')
    })

    it('resolves Tailwind conflicts by keeping the last class', () => {
      const result = cn('px-4', 'px-6')
      expect(result).toBe('px-6')
    })

    it('returns empty string for no inputs', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('handles undefined and null values', () => {
      const result = cn('base', undefined, null, 'end')
      expect(result).toBe('base end')
    })
  })

  describe('formatCurrency', () => {
    it('formats number as INR currency', () => {
      const result = formatCurrency(1000)
      expect(result).toContain('1,000')
    })

    it('formats zero correctly', () => {
      const result = formatCurrency(0)
      expect(result).toContain('0')
    })

    it('formats large numbers with Indian grouping', () => {
      const result = formatCurrency(100000)
      expect(result).toContain('1,00,000')
    })
  })

  describe('formatNumber', () => {
    it('formats number with Indian locale grouping', () => {
      const result = formatNumber(100000)
      expect(result).toBe('1,00,000')
    })

    it('formats small numbers without grouping', () => {
      const result = formatNumber(999)
      expect(result).toBe('999')
    })
  })

  describe('slugify', () => {
    it('converts text to lowercase slug', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    it('removes special characters', () => {
      expect(slugify('Hello! @World#')).toBe('hello-world')
    })

    it('collapses multiple dashes', () => {
      expect(slugify('hello   world')).toBe('hello-world')
    })

    it('handles empty string', () => {
      expect(slugify('')).toBe('')
    })
  })

  describe('truncate', () => {
    it('truncates long text with ellipsis', () => {
      const result = truncate('This is a long text', 10)
      expect(result).toBe('This is a...')
    })

    it('does not truncate short text', () => {
      const result = truncate('Short', 10)
      expect(result).toBe('Short')
    })

    it('handles exact length text', () => {
      const result = truncate('Exact', 5)
      expect(result).toBe('Exact')
    })
  })

  describe('calculateFareSplit', () => {
    it('calculates correct fare split for 2 riders', () => {
      const result = calculateFareSplit(400, 2)
      expect(result.perPerson).toBe(200)
      expect(result.savings).toBe(200)
      expect(result.savingsPercent).toBe(50)
    })

    it('calculates correct fare split for 4 riders', () => {
      const result = calculateFareSplit(400, 4)
      expect(result.perPerson).toBe(100)
      expect(result.savings).toBe(300)
      expect(result.savingsPercent).toBe(75)
    })

    it('handles single rider with no savings', () => {
      const result = calculateFareSplit(400, 1)
      expect(result.perPerson).toBe(400)
      expect(result.savings).toBe(0)
      expect(result.savingsPercent).toBe(0)
    })
  })
})

describe('URL Utility Functions (lib/utils/url.ts)', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  describe('getSiteUrl', () => {
    it('returns the default URL when env is not set', () => {
      delete process.env.NEXT_PUBLIC_SITE_URL
      const result = getSiteUrl()
      expect(result).toBe('https://snapgo.co.in')
    })

    it('returns env URL when set with protocol', () => {
      process.env.NEXT_PUBLIC_SITE_URL = 'https://custom.example.com'
      const result = getSiteUrl()
      expect(result).toBe('https://custom.example.com')
    })

    it('prepends https:// when env URL lacks protocol', () => {
      process.env.NEXT_PUBLIC_SITE_URL = 'custom.example.com'
      const result = getSiteUrl()
      expect(result).toBe('https://custom.example.com')
    })

    it('preserves http:// protocol if explicitly set', () => {
      process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
      const result = getSiteUrl()
      expect(result).toBe('http://localhost:3000')
    })
  })

  describe('getCanonicalUrl', () => {
    it('returns base URL for empty path', () => {
      delete process.env.NEXT_PUBLIC_SITE_URL
      const result = getCanonicalUrl('')
      expect(result).toBe('https://snapgo.co.in/')
    })

    it('appends path with leading slash', () => {
      delete process.env.NEXT_PUBLIC_SITE_URL
      const result = getCanonicalUrl('/about')
      expect(result).toBe('https://snapgo.co.in/about')
    })

    it('adds leading slash if missing from path', () => {
      delete process.env.NEXT_PUBLIC_SITE_URL
      const result = getCanonicalUrl('blog/test')
      expect(result).toBe('https://snapgo.co.in/blog/test')
    })

    it('returns base URL with slash when called with no arguments', () => {
      delete process.env.NEXT_PUBLIC_SITE_URL
      const result = getCanonicalUrl()
      expect(result).toBe('https://snapgo.co.in/')
    })
  })
})
