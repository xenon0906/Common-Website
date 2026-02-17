/**
 * Content Type Definitions
 *
 * Types for page-specific content (safety, legal, features page, etc.)
 */

// ============================================
// Safety Page Types
// ============================================

export interface SafetyHeroPoint {
  text: string // max 200 chars
}

export interface SafetyHeroStat {
  value: string // e.g., "24/7"
  label: string // max 50 chars
}

export interface SafetyHero {
  headline: string // max 150 chars
  subheadline: string // max 300 chars
  points: SafetyHeroPoint[]
  stats: SafetyHeroStat[]
}

export interface SafetyFeaturePoint {
  text: string // max 200 chars
}

export interface SafetyFeature {
  id: string
  title: string // max 100 chars
  description: string // max 300 chars
  points: SafetyFeaturePoint[]
  iconName: string // lucide-react icon name
  order: number
  isActive: boolean
}

export interface SOSStep {
  title: string // max 100 chars
  description: string // max 200 chars
  order: number
}

export interface SOSShare {
  iconName: string // lucide-react icon name
  label: string // max 50 chars
}

export interface SOSSection {
  headline: string // max 150 chars
  subheadline: string // max 300 chars
  steps: SOSStep[]
  shares: SOSShare[]
}

export interface TrustCertification {
  id: string
  iconName: string // lucide-react icon name
  title: string // max 100 chars
  description: string // max 200 chars
  order: number
  isActive: boolean
}

export interface TrustSection {
  headline: string // max 150 chars
  subheadline: string // max 300 chars
  certifications: TrustCertification[]
}

export interface SafetyCTA {
  quote: string // max 200 chars
  badge: string // max 50 chars
  buttonText: string // max 30 chars
  buttonLink: string // URL or anchor
}

export interface SafetyContent {
  hero: SafetyHero
  features: SafetyFeature[]
  sos: SOSSection
  trust: TrustSection
  cta: SafetyCTA
  updatedAt?: string
}

// ============================================
// Legal Page Types
// ============================================

export interface LegalSection {
  id: string
  title: string // max 200 chars
  content: string // rich text / markdown
  order: number
}

export interface LegalContent {
  type: 'terms' | 'privacy' | 'refund'
  title: string // page title, max 150 chars
  lastUpdated: string // ISO date string
  sections: LegalSection[]
  updatedAt?: string
}

// ============================================
// Features Page Types
// ============================================

export interface FeaturesPageItem {
  id: string
  iconName: string // lucide-react icon name
  title: string // max 100 chars
  description: string // max 300 chars
  highlight: boolean // featured/highlighted feature
  order: number
  isActive: boolean
  updatedAt?: string
}

export interface FeaturesPageData {
  hero?: {
    headline: string // max 150 chars
    subheadline: string // max 300 chars
  }
  features: FeaturesPageItem[]
}

// ============================================
// How It Works Page Types
// ============================================

export interface HowItWorksDetailedStep {
  id: string
  iconName: string // lucide-react icon name
  title: string // max 100 chars
  description: string // max 300 chars
  details: string[] // array of detail points, max 200 chars each
  mode: 'realtime' | 'scheduled' // which mode this step belongs to
  order: number
  isActive: boolean
  updatedAt?: string
}

export interface HowItWorksComparison {
  id: string
  feature: string // max 100 chars
  realtime: string // max 100 chars
  scheduled: string // max 100 chars
  iconName: string // lucide-react icon name
  order: number
  isActive: boolean
  updatedAt?: string
}

export interface HowItWorksPageData {
  hero?: {
    headline: string // max 150 chars
    subheadline: string // max 300 chars
  }
  realtimeSteps: HowItWorksDetailedStep[]
  scheduledSteps: HowItWorksDetailedStep[]
  comparisons: HowItWorksComparison[]
}

// ============================================
// About Page Types (extending existing)
// ============================================

export interface AboutSection {
  title: string // max 100 chars
  content: string // rich text / markdown, max 2000 chars
}

export interface AboutContent {
  origin: AboutSection
  spark: AboutSection
  mission: string // max 500 chars
  vision: string // max 500 chars
  values: Array<{
    title: string // max 100 chars
    description: string // max 300 chars
  }>
  updatedAt?: string
}

// ============================================
// Team Member Types (already exist but re-export)
// ============================================

export interface TeamMember {
  id: string
  name: string // max 100 chars
  role: string // max 100 chars
  bio: string // max 500 chars
  imageUrl: string | null
  linkedin: string | null // URL
  twitter: string | null // URL
  order: number
  isActive: boolean
  updatedAt?: string
}
