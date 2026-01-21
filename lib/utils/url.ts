/**
 * URL utility functions for consistent URL handling across the app
 */

/**
 * Get the site URL with protocol prefix
 * Handles cases where env variable might not have https://
 */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://snapgo.co.in'
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return `https://${url}`
}

/**
 * Get the canonical URL for a given path
 */
export function getCanonicalUrl(path: string = ''): string {
  const baseUrl = getSiteUrl()
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}
