// Google Analytics 4 Integration
// Uses NEXT_PUBLIC_GA_MEASUREMENT_ID from environment variables

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

// Check if GA is configured
export const isGAConfigured = (): boolean => {
  return !!GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX'
}

// Page view tracking
export const pageview = (url: string): void => {
  if (!isGAConfigured()) return

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

// Event tracking
interface GtagEvent {
  action: string
  category: string
  label?: string
  value?: number
}

export const event = ({ action, category, label, value }: GtagEvent): void => {
  if (!isGAConfigured()) return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Common events for Snapgo
export const trackDownloadClick = (platform: 'android' | 'ios'): void => {
  event({
    action: 'download_click',
    category: 'engagement',
    label: platform,
  })
}

export const trackContactFormSubmit = (): void => {
  event({
    action: 'contact_form_submit',
    category: 'lead_generation',
  })
}

export const trackBlogView = (slug: string): void => {
  event({
    action: 'blog_view',
    category: 'content',
    label: slug,
  })
}

export const trackFeatureClick = (featureName: string): void => {
  event({
    action: 'feature_click',
    category: 'engagement',
    label: featureName,
  })
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
    dataLayer: unknown[]
  }
}
