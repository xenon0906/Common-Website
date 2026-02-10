import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Maximum slug length to prevent ENAMETOOLONG errors during build
export const MAX_SLUG_LENGTH = 100

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num)
}

export function slugify(text: string): string {
  let slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()

  // Truncate to MAX_SLUG_LENGTH, don't cut mid-word
  if (slug.length > MAX_SLUG_LENGTH) {
    slug = slug.substring(0, MAX_SLUG_LENGTH)
    const lastHyphen = slug.lastIndexOf('-')
    if (lastHyphen > MAX_SLUG_LENGTH - 20) {
      slug = slug.substring(0, lastHyphen)
    }
  }
  return slug.replace(/-$/, '')
}

/**
 * Sanitize a slug by removing URL prefixes like /blog/ and cleaning up
 * This prevents double-path issues like /blog//blog/slug
 * Also enforces MAX_SLUG_LENGTH to prevent filesystem errors
 */
export function sanitizeSlug(slug: string): string {
  if (!slug) return ''
  let sanitized = slug
    .replace(/^\/+/, '')           // Remove leading slashes
    .replace(/^blog\/+/i, '')      // Remove blog/ prefix
    .replace(/\/+$/, '')           // Remove trailing slashes
    .replace(/\/+/g, '-')          // Replace any remaining slashes with hyphens
    .toLowerCase()
    .trim()

  // Truncate to MAX_SLUG_LENGTH, don't cut mid-word
  if (sanitized.length > MAX_SLUG_LENGTH) {
    sanitized = sanitized.substring(0, MAX_SLUG_LENGTH)
    const lastHyphen = sanitized.lastIndexOf('-')
    if (lastHyphen > MAX_SLUG_LENGTH - 20) {
      sanitized = sanitized.substring(0, lastHyphen)
    }
  }
  return sanitized.replace(/-$/, '')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

export function calculateFareSplit(totalFare: number, riders: number): {
  perPerson: number
  savings: number
  savingsPercent: number
} {
  const perPerson = Math.round(totalFare / riders)
  const savings = totalFare - perPerson
  const savingsPercent = Math.round((savings / totalFare) * 100)
  return { perPerson, savings, savingsPercent }
}
