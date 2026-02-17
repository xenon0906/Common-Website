/**
 * Homepage Content Type Definitions
 *
 * Types for all homepage sections that are admin-editable.
 * These replace hardcoded data in components.
 */

// ============================================
// Cab Pooling Comparison Types
// ============================================

export interface ComparisonPoint {
  text: string // max 200 chars
  negative: boolean
}

export interface ComparisonSide {
  title: string // max 100 chars
  subtitle: string // max 50 chars
  iconName: string // lucide-react icon name (e.g., "Check", "X")
  colorScheme: 'red' | 'green'
  points: ComparisonPoint[]
}

export interface ComparisonBenefit {
  iconName: string // lucide-react icon name
  title: string // max 100 chars
  description: string // max 300 chars
  colorScheme: 'emerald' | 'blue' | 'purple'
  order: number
}

export interface CabPoolingComparisonData {
  id?: string
  carpooling: ComparisonSide
  cabPooling: ComparisonSide
  benefits: ComparisonBenefit[]
  tagline: string // max 200 chars
  isActive: boolean
  updatedAt?: string
}

// ============================================
// Why Snapgo Types
// ============================================

export interface WhySnapgoReason {
  id: string
  iconName: string // lucide-react icon name
  title: string // max 100 chars
  description: string // max 300 chars
  gradient: string // Tailwind gradient class (e.g., "from-teal-50 to-primary-50")
  order: number
  isActive: boolean
  updatedAt?: string
}

export interface WhySnapgoData {
  sectionTitle?: string // max 100 chars
  sectionSubtitle?: string // max 200 chars
  reasons: WhySnapgoReason[]
}

// ============================================
// CO2 Impact Tracker Types
// ============================================

export interface CO2ImpactData {
  id?: string
  headline: string // max 100 chars
  subheadline: string // max 200 chars
  defaultRides: number // default number of rides for calculation
  co2PerRide: number // kg of CO2 saved per pooled ride
  treesEquivalent: number // equivalent trees planted per pooled ride
  metricsLabels: {
    rides: string // max 50 chars
    co2Saved: string // max 50 chars
    treesEquiv: string // max 50 chars
  }
  isActive: boolean
  updatedAt?: string
}

// ============================================
// Savings Calculator Types
// ============================================

export interface SavingsCalculatorData {
  id?: string
  headline: string // max 100 chars
  subheadline: string // max 200 chars
  defaultFare: number // default fare amount for calculation
  defaultRiders: number // default number of riders
  riderOptions: number[] // available rider options (e.g., [2, 3, 4])
  currencySymbol: string // e.g., "₹", "$"
  isActive: boolean
  updatedAt?: string
}

// ============================================
// Trust Badges Types
// ============================================

export interface TrustBadge {
  id: string
  iconName: string // lucide-react icon name
  title: string // max 100 chars
  description: string // max 200 chars
  order: number
  isActive: boolean
  updatedAt?: string
}

// ============================================
// CTA Section Types
// ============================================

export interface CTASectionData {
  id: string
  quote: string // max 200 chars
  badge: string // max 50 chars (e.g., "10,000+ Downloads")
  buttonText: string // max 30 chars
  buttonLink: string // URL or anchor link
  backgroundStyle: 'gradient' | 'solid'
  order: number
  isActive: boolean
  updatedAt?: string
}

// ============================================
// App Preview Types
// ============================================

export interface AppPreviewFeature {
  title: string // max 100 chars
  description: string // max 200 chars
}

export interface AppPreviewData {
  id?: string
  headline: string // max 100 chars
  subheadline: string // max 200 chars
  features: AppPreviewFeature[]
  mockupImages: {
    primary: string // image URL
    secondary: string // image URL
  }
  isActive: boolean
  updatedAt?: string
}

// ============================================
// Homepage Section Config Types
// ============================================

export interface HomepageSectionConfig {
  componentName: string // e.g., "hero", "stats", "comparison", "whySnapgo"
  label: string // display name for admin panel
  visible: boolean // show/hide section on frontend
  order: number // section ordering (lower = earlier in page)
}

export interface HomepageConfig {
  sections: HomepageSectionConfig[]
  updatedAt?: string
}

// ============================================
// Component Names for Section Mapping
// ============================================

export const HOMEPAGE_SECTION_COMPONENTS = {
  hero: 'Hero Section',
  trustBadges: 'Trust Badges',
  whySnapgo: 'Why Snapgo',
  comparison: 'Cab Pooling Comparison',
  stats: 'Statistics Counter',
  co2Impact: 'CO2 Impact Tracker',
  savingsCalc: 'Savings Calculator',
  features: 'Features Grid',
  howItWorks: 'How It Works',
  appPreview: 'App Preview',
  download: 'Download Section',
  testimonials: 'Testimonials',
  instagram: 'Instagram Feed',
  cta: 'Call to Action',
} as const

export type HomepageSectionComponentName = keyof typeof HOMEPAGE_SECTION_COMPONENTS
