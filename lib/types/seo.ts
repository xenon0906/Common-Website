import { Timestamp } from 'firebase/firestore'

export interface SEOIssue {
  type: 'error' | 'warning' | 'info'
  message: string
  field?: string
}

export interface PageSEO {
  id?: string
  pageSlug: string
  pageName: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  canonicalUrl?: string
  noIndex: boolean
  noFollow: boolean
  ogImage?: string
  ogTitle?: string
  ogDescription?: string
  twitterCard?: 'summary' | 'summary_large_image'
  lastAnalyzed?: Timestamp | Date
  score: number
  issues: SEOIssue[]
  schemaType?: 'Organization' | 'Article' | 'WebPage' | 'FAQPage' | 'Product'
  customSchema?: string
  createdAt?: Timestamp | Date
  updatedAt?: Timestamp | Date
}

export interface GlobalSEO {
  siteName: string
  siteTagline: string
  defaultDescription: string
  defaultKeywords: string[]
  googleVerification?: string
  bingVerification?: string
  twitterHandle?: string
  facebookAppId?: string
  defaultOgImage?: string
  googleAnalyticsId?: string
  googleTagManagerId?: string
  robotsTxt: string
  updatedAt?: Timestamp | Date
}

export interface SEOAnalysisResult {
  score: number
  issues: SEOIssue[]
  suggestions: string[]
  keywordDensity?: Record<string, number>
  readabilityScore?: number
  wordCount?: number
}

export const DEFAULT_GLOBAL_SEO: GlobalSEO = {
  siteName: 'Snapgo',
  siteTagline: 'Share Rides, Save Money, Travel Together',
  defaultDescription: 'Snapgo is India\'s trusted ride-sharing platform. Join verified users, save up to 75% on cab fares, and travel safely with KYC-verified co-riders.',
  defaultKeywords: ['snapgo', 'ride sharing', 'cab sharing', 'carpool india', 'save money', 'verified rides', 'safe travel'],
  twitterHandle: '@snapgo_app',
  robotsTxt: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://snapgo.in/sitemap.xml`,
}

// Default pages with score: 0 - scores populate only after running analysis
export const DEFAULT_PAGES_SEO: Omit<PageSEO, 'id'>[] = [
  {
    pageSlug: 'home',
    pageName: 'Home',
    metaTitle: 'Snapgo - Share Rides, Save Money, Travel Together',
    metaDescription: 'Join thousands of verified users sharing cab rides across India. Save up to 75% on your daily commute with Snapgo ride-sharing.',
    keywords: ['snapgo', 'ride sharing', 'cab sharing', 'carpool india', 'save money commute'],
    noIndex: false,
    noFollow: false,
    score: 0,
    issues: [],
    schemaType: 'Organization',
  },
  {
    pageSlug: 'about',
    pageName: 'About',
    metaTitle: 'About Snapgo - Our Story & Mission',
    metaDescription: 'Learn about Snapgo, the DPIIT certified startup revolutionizing urban mobility in India through safe and affordable ride-sharing.',
    keywords: ['snapgo about', 'ride sharing startup', 'dpiit certified', 'indian startup'],
    noIndex: false,
    noFollow: false,
    score: 0,
    issues: [],
    schemaType: 'Organization',
  },
  {
    pageSlug: 'features',
    pageName: 'Features',
    metaTitle: 'Snapgo Features - Safe & Affordable Ride Sharing',
    metaDescription: 'Discover Snapgo features: KYC verification, female-only rides, SOS alerts, real-time matching, and up to 75% savings.',
    keywords: ['snapgo features', 'kyc verification', 'female only rides', 'sos alert'],
    noIndex: false,
    noFollow: false,
    score: 0,
    issues: [],
    schemaType: 'WebPage',
  },
  {
    pageSlug: 'safety',
    pageName: 'Safety',
    metaTitle: 'Safety First - Snapgo Verified Ride Sharing',
    metaDescription: 'Your safety is our priority. 100% KYC verified users, SOS alerts, female-only option, and 24/7 support.',
    keywords: ['safe ride sharing', 'verified users', 'sos alert', 'women safety'],
    noIndex: false,
    noFollow: false,
    score: 0,
    issues: [],
    schemaType: 'WebPage',
  },
  {
    pageSlug: 'how-it-works',
    pageName: 'How It Works',
    metaTitle: 'How Snapgo Works - Easy Ride Sharing Guide',
    metaDescription: 'Learn how to use Snapgo for real-time and scheduled rides. Match with verified users and save up to 75%.',
    keywords: ['how snapgo works', 'ride sharing guide', 'carpool tutorial'],
    noIndex: false,
    noFollow: false,
    score: 0,
    issues: [],
    schemaType: 'WebPage',
  },
  {
    pageSlug: 'blog',
    pageName: 'Blog',
    metaTitle: 'Snapgo Blog - Ride Sharing Tips & News',
    metaDescription: 'Read the latest tips, stories, and insights about ride-sharing, saving money, and sustainable travel in India.',
    keywords: ['snapgo blog', 'ride sharing tips', 'carpool news', 'travel stories'],
    noIndex: false,
    noFollow: false,
    score: 0,
    issues: [],
    schemaType: 'WebPage',
  },
  {
    pageSlug: 'contact',
    pageName: 'Contact',
    metaTitle: 'Contact Snapgo - Get in Touch',
    metaDescription: 'Have questions? Contact Snapgo support team for help with ride-sharing, partnerships, or feedback.',
    keywords: ['contact snapgo', 'snapgo support', 'ride sharing help'],
    noIndex: false,
    noFollow: false,
    score: 0,
    issues: [],
    schemaType: 'WebPage',
  },
]

export function calculateSEOScore(page: Partial<PageSEO>): SEOAnalysisResult {
  const issues: SEOIssue[] = []
  const suggestions: string[] = []
  let score = 100

  // Title analysis
  const titleLength = page.metaTitle?.length || 0
  if (titleLength === 0) {
    issues.push({ type: 'error', message: 'Missing meta title', field: 'metaTitle' })
    score -= 20
  } else if (titleLength < 30) {
    issues.push({ type: 'warning', message: 'Title is too short (< 30 chars)', field: 'metaTitle' })
    score -= 5
  } else if (titleLength > 60) {
    issues.push({ type: 'warning', message: 'Title is too long (> 60 chars)', field: 'metaTitle' })
    score -= 5
  }

  // Description analysis
  const descLength = page.metaDescription?.length || 0
  if (descLength === 0) {
    issues.push({ type: 'error', message: 'Missing meta description', field: 'metaDescription' })
    score -= 20
  } else if (descLength < 120) {
    issues.push({ type: 'warning', message: 'Description is too short (< 120 chars)', field: 'metaDescription' })
    score -= 5
  } else if (descLength > 160) {
    issues.push({ type: 'warning', message: 'Description is too long (> 160 chars)', field: 'metaDescription' })
    score -= 5
  }

  // Keywords analysis
  const keywordsCount = page.keywords?.length || 0
  if (keywordsCount === 0) {
    issues.push({ type: 'warning', message: 'No keywords defined', field: 'keywords' })
    score -= 10
  } else if (keywordsCount < 3) {
    issues.push({ type: 'info', message: 'Consider adding more keywords (3-8 recommended)', field: 'keywords' })
    score -= 3
  } else if (keywordsCount > 10) {
    issues.push({ type: 'info', message: 'Too many keywords (3-8 recommended)', field: 'keywords' })
    score -= 3
  }

  // Open Graph analysis
  if (!page.ogImage) {
    suggestions.push('Add an Open Graph image for better social sharing')
    score -= 3
  }

  // Schema analysis
  if (!page.schemaType) {
    suggestions.push('Add structured data (JSON-LD) for better search visibility')
    score -= 5
  }

  // Canonical URL
  if (page.canonicalUrl) {
    suggestions.push('Canonical URL is set correctly')
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
    suggestions,
  }
}
