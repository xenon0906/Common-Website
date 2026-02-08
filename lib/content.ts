// Content fetching layer - fetches from Firebase with static fallbacks
// All functions return static defaults if Firebase is not configured or data doesn't exist

import {
  getFirestoreDocument,
  getFirestoreCollection,
  isFirebaseConfigured,
} from './firebase-server'

import { SiteImagesConfig, DEFAULT_IMAGES } from './types/images'

// Re-export image types for convenience
export type { SiteImagesConfig }
export { DEFAULT_IMAGES }

// Types for content
export interface HeroContentData {
  id: string
  headline: string
  subtext: string
  badge: string | null
  ctaPrimary: string | null
  ctaSecondary: string | null
  isActive: boolean
}

export interface StatisticData {
  id: string
  label: string
  value: number
  prefix: string
  suffix: string
  icon: string | null
  order: number
  isActive: boolean
}

export interface FeatureData {
  id: string
  title: string
  description: string
  icon: string
  order: number
  isActive: boolean
}

export interface HowItWorksStepData {
  id: string
  step: number
  title: string
  description: string
  icon: string
  order: number
  isActive: boolean
}

export interface TestimonialData {
  id: string
  quote: string
  author: string
  role: string | null
  location: string | null
  avatarUrl: string | null
  rating: number
  order: number
  isActive: boolean
}

export interface AboutContentData {
  id: string
  key: string
  title: string | null
  content: string
  order: number
}

export interface BlogData {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FAQData {
  id: string
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
}

export interface SiteConfigData {
  name: string
  legalName: string
  tagline: string
  description: string
  url: string
  email: string
  phone: string
  address: string
  founders: string[]
  social: {
    facebook: string
    instagram: string
    linkedin: string
    twitter?: string
    youtube?: string
  }
}

export interface AppStoreLinksData {
  android: {
    url: string
    isLive: boolean
    qrCodeUrl: string
  }
  ios: {
    url: string
    isLive: boolean
    qrCodeUrl: string
  }
}

export interface TeamMemberData {
  id: string
  name: string
  role: string
  category?: string
  bio: string
  details?: string
  imageUrl: string | null
  portraitUrl?: string | null
  email?: string | null
  linkedin: string | null
  twitter: string | null
  order: number
  isActive: boolean
}

// Default content (static data fallbacks)
const DEFAULT_HERO: HeroContentData = {
  id: 'default',
  headline: 'Pool Cabs. Save Money. Go Green.',
  subtext: 'Pool and go — with or without a car. Match with verified co-riders, share the journey, and save up to 75%. Join India\'s greenest commuting movement.',
  badge: "India's #1 Cab Pooling Platform",
  ctaPrimary: 'Download Free',
  ctaSecondary: 'See How It Works',
  isActive: true,
}

const DEFAULT_STATS: StatisticData[] = [
  { id: '1', label: 'App Downloads', value: 10000, prefix: '', suffix: '+', icon: 'Download', order: 1, isActive: true },
  { id: '2', label: 'Peak Daily Rides', value: 150, prefix: '', suffix: '+', icon: 'Car', order: 2, isActive: true },
  { id: '3', label: 'Cost Savings', value: 75, prefix: '', suffix: '%', icon: 'Wallet', order: 3, isActive: true },
  { id: '4', label: 'Trees Equivalent', value: 500, prefix: '', suffix: '+', icon: 'TreePine', order: 4, isActive: true },
]

const DEFAULT_FEATURES: FeatureData[] = [
  { id: '1', title: 'Save Up to 75%', description: 'Share cab fares and save significant money on your daily commute', icon: 'Wallet', order: 1, isActive: true },
  { id: '2', title: 'Aadhaar Verified', description: 'All users verified via Aadhaar KYC powered by DigiLocker', icon: 'ShieldCheck', order: 2, isActive: true },
  { id: '3', title: 'Female-Only Option', description: 'Women can connect only with verified female riders for added safety', icon: 'Users', order: 3, isActive: true },
  { id: '4', title: 'Real-time & Scheduled', description: 'Find rides instantly or plan ahead for your convenience', icon: 'Clock', order: 4, isActive: true },
  { id: '5', title: 'Green Cab Pooling', description: '4 people, 1 cab = 75% less pollution. We pool commercial cabs, not private cars — legal AND eco-friendly', icon: 'Leaf', order: 5, isActive: true },
  { id: '6', title: 'Pool Your Way', description: 'No car? Book a cab together. Have a car? Offer rides. Two options, same savings, one green mission.', icon: 'Shuffle', order: 6, isActive: true },
]

const DEFAULT_STEPS: HowItWorksStepData[] = [
  { id: '1', step: 1, title: 'Enter Your Destination', description: 'Set your pickup and drop location in the app', icon: 'MapPin', order: 1, isActive: true },
  { id: '2', step: 2, title: 'Find Your Match', description: 'Our algorithm finds people going to the same destination within 750m', icon: 'Search', order: 2, isActive: true },
  { id: '3', step: 3, title: 'Pool Together & Save', description: 'Book a cab together or join a self-drive ride. Split costs and save up to 75%', icon: 'Users', order: 3, isActive: true },
]

const DEFAULT_TESTIMONIALS: TestimonialData[] = [
  { id: '1', quote: 'Snapgo has saved me so much money! I used to spend Rs.400 for my daily commute, now I only pay Rs.100 by sharing with fellow students. Amazing concept!', author: 'Priya S.', role: 'College Student', location: 'Sharda University', avatarUrl: null, rating: 5, order: 1, isActive: true },
  { id: '2', quote: 'As a working professional, Snapgo has made my daily travel both affordable and social. I have made great connections with fellow commuters.', author: 'Rahul K.', role: 'IT Professional', location: 'Greater Noida', avatarUrl: null, rating: 5, order: 2, isActive: true },
  { id: '3', quote: 'The female-only option makes me feel safe. I can now travel without worrying about security while saving money.', author: 'Ananya M.', role: 'Graduate Student', location: 'Delhi NCR', avatarUrl: null, rating: 5, order: 3, isActive: true },
]

const DEFAULT_ABOUT: Record<string, AboutContentData> = {
  origin: { id: 'default-origin', key: 'origin', title: 'Our Origin', content: "It was a regular day when we, Mohit and Surya Purohit, were heading to Ghaziabad Railway Station from our society. We booked a cab and noticed another person also taking a cab from our area. When we reached the station, we saw the same person at the parking lot. That's when it hit us - we both paid Rs.300 separately for the same route. If we had known we were going to the same place, we could have shared the ride and paid just Rs.300 total, saving Rs.300 together!", order: 1 },
  spark: { id: 'default-spark', key: 'spark', title: 'The Spark', content: "This sparked an idea, but we didn't want to do traditional carpooling with private cars — that's not legal for commercial use and bypasses taxi drivers who depend on fares. Instead, we pioneered 'Cab Pooling' — pooling commercial cabs among verified riders. It's 100% legal, supports drivers, AND reduces road emissions by 75%. That's how Snapgo was born.", order: 2 },
  mission: { id: 'default-mission', key: 'mission', title: 'Our Mission', content: 'To make travel affordable and accessible for everyone through cab pooling — connecting people who share similar routes while supporting drivers and reducing environmental impact.', order: 3 },
  vision: { id: 'default-vision', key: 'vision', title: 'Our Vision', content: "To become India's most trusted cab pooling platform, where every shared ride means savings for riders, earnings for drivers, and a greener planet for everyone.", order: 4 },
  values: { id: 'default-values', key: 'values', title: 'Our Values', content: 'Legal and ethical operations, driver-friendly ecosystem, environmental sustainability, user safety, and creating value for our entire community.', order: 5 },
}

const DEFAULT_APP_LINKS: AppStoreLinksData = {
  android: { url: 'https://play.google.com/store/apps/details?id=in.snapgo.app&hl=en_IN', isLive: true, qrCodeUrl: '/images/qr code/playstore-qr.png' },
  ios: { url: 'https://apps.apple.com/in/app/snapgo-connect-split-fare/id6748761741', isLive: true, qrCodeUrl: '/images/qr code/appstore-qr.png' },
}

const DEFAULT_SOCIAL = {
  facebook: 'https://www.facebook.com/profile.php?id=61578285621863',
  instagram: 'https://www.instagram.com/snapgo.co.in/',
  linkedin: 'https://www.linkedin.com/company/snapgo-service-private-limited/',
}

const DEFAULT_CONTACT = {
  email: 'info@snapgo.co.in',
  phone: '+91 6398786105',
  address: 'Block 45, Sharda University, Knowledge Park 3, Greater Noida, Uttar Pradesh, India',
  supportEmail: 'support@snapgo.co.in',
  businessEmail: 'business@snapgo.co.in',
}

const DEFAULT_SITE_CONFIG: SiteConfigData = {
  name: 'Snapgo',
  legalName: 'Snapgo Service Private Limited',
  tagline: 'Pool Cabs, Save Money, Go Green',
  description: "India's #1 Cab Pooling Platform. Pool a commercial cab with verified co-riders - 100% legal, eco-friendly, and up to 75% cheaper.",
  url: 'https://snapgo.co.in',
  email: 'info@snapgo.co.in',
  phone: '+91 6398786105',
  address: 'Block 45, Sharda University, Knowledge Park 3, Greater Noida, Uttar Pradesh, India',
  founders: ['Mohit Purohit', 'Surya Purohit'],
  social: DEFAULT_SOCIAL,
}

// Legal page content types
export interface LegalSection {
  id: string
  title: string
  content: string
}

export interface LegalPageData {
  lastUpdated: string
  sections: LegalSection[]
}

// Safety page content types
export interface SafetyFeatureData {
  id: string
  title: string
  description: string
  points: string[]
  icon: string
  order: number
  isActive: boolean
}

export interface SafetyContentData {
  hero: {
    headline: string
    subtext: string
    points: string[]
    stats: Array<{ value: string; label: string }>
  }
  features: SafetyFeatureData[]
  sos: {
    headline: string
    subtext: string
    steps: string[]
    shares: Array<{ icon: string; label: string }>
  }
  trust: {
    headline: string
    subtext: string
    certifications: Array<{ title: string; description: string }>
  }
  cta: {
    quote: string
    badge: string
    buttonText: string
    buttonLink: string
  }
}

// Homepage sections configuration
export interface HomepageSectionConfig {
  id: string
  label: string
  visible: boolean
  order: number
}

export interface HomepageConfig {
  sections: HomepageSectionConfig[]
}

// No default blogs - all blogs come from Firestore
const DEFAULT_BLOGS: BlogData[] = []

const DEFAULT_FAQS: FAQData[] = [
  { id: '1', question: 'How does Snapgo work?', answer: 'Snapgo offers two ways to pool: No car? Match with verified co-riders, book a cab together via any app (Ola, Uber, etc.), and split the fare. Have a car? Create a ride for others to join. Either way, save up to 75% while reducing your carbon footprint.', category: 'general', order: 1, isActive: true },
  { id: '2', question: 'Is Snapgo safe to use?', answer: 'Yes! Safety is our top priority. All users are verified through Aadhaar KYC powered by DigiLocker. We also offer a female-only option for women riders, real-time ride tracking, emergency SOS features, and a rating system for accountability.', category: 'safety', order: 2, isActive: true },
  { id: '3', question: 'How much can I save with Snapgo?', answer: 'You can save up to 75% on your cab fares! For example, a ₹400 solo ride becomes just ₹100 when shared with 3 other riders. Regular users save ₹3,000-5,000 per month on average.', category: 'pricing', order: 3, isActive: true },
  { id: '4', question: 'What is the female-only option?', answer: 'The female-only option allows women riders to match exclusively with other verified female riders. This feature provides an extra layer of comfort and security for women commuters.', category: 'safety', order: 4, isActive: true },
  { id: '5', question: 'Is cab pooling legal?', answer: 'Yes! Unlike carpooling with private vehicles (which is not legal for commercial use in India), cab pooling uses commercial taxis and cabs that are already licensed for passenger transport. Snapgo simply helps riders find others heading the same way to share the fare.', category: 'general', order: 5, isActive: true },
]

const DEFAULT_TEAM: TeamMemberData[] = [
  { id: '1', name: 'Mohit Purohit', role: 'Co-Founder & CEO', bio: 'Driving the vision and strategy of Snapgo.', imageUrl: null, linkedin: null, twitter: null, order: 1, isActive: true },
  { id: '2', name: 'Surya Purohit', role: 'Co-Founder & COO', bio: 'Managing operations and business growth.', imageUrl: null, linkedin: null, twitter: null, order: 2, isActive: true },
]

// Data fetching functions - fetch from Firebase with static fallbacks

export async function getHeroContent(): Promise<HeroContentData> {
  if (!isFirebaseConfigured()) return DEFAULT_HERO
  return getFirestoreDocument<HeroContentData>('content', 'hero', DEFAULT_HERO)
}

export async function getStats(): Promise<StatisticData[]> {
  if (!isFirebaseConfigured()) return DEFAULT_STATS
  // Path: stats - stored at artifacts/{appId}/public/data/stats
  const stats = await getFirestoreCollection<StatisticData>('stats', DEFAULT_STATS, 'order')
  return stats.filter(s => s.isActive !== false)
}

export async function getFeatures(): Promise<FeatureData[]> {
  if (!isFirebaseConfigured()) return DEFAULT_FEATURES
  // Path: features - stored at artifacts/{appId}/public/data/features
  const features = await getFirestoreCollection<FeatureData>('features', DEFAULT_FEATURES, 'order')
  return features.filter(f => f.isActive !== false)
}

export async function getHowItWorksSteps(): Promise<HowItWorksStepData[]> {
  if (!isFirebaseConfigured()) return DEFAULT_STEPS
  // Path: howItWorks - stored at artifacts/{appId}/public/data/howItWorks
  const steps = await getFirestoreCollection<HowItWorksStepData>('howItWorks', DEFAULT_STEPS, 'order')
  return steps.filter(s => s.isActive !== false)
}

export async function getTestimonials(): Promise<TestimonialData[]> {
  if (!isFirebaseConfigured()) return DEFAULT_TESTIMONIALS
  // Path: testimonials - stored at artifacts/{appId}/public/data/testimonials
  const testimonials = await getFirestoreCollection<TestimonialData>('testimonials', DEFAULT_TESTIMONIALS, 'order')
  return testimonials.filter(t => t.isActive !== false)
}

export async function getAboutContent(): Promise<Record<string, AboutContentData>> {
  if (!isFirebaseConfigured()) return DEFAULT_ABOUT

  // Firestore may store values as strings or as objects with {title, content}
  type AboutValue = string | { title?: string; content?: string }

  interface AboutDoc {
    origin: AboutValue
    spark: AboutValue
    mission: AboutValue
    vision: AboutValue
    values: AboutValue
  }

  const about = await getFirestoreDocument<AboutDoc>('content', 'about', {
    origin: DEFAULT_ABOUT.origin.content,
    spark: DEFAULT_ABOUT.spark.content,
    mission: DEFAULT_ABOUT.mission.content,
    vision: DEFAULT_ABOUT.vision.content,
    values: DEFAULT_ABOUT.values.content,
  })

  // Helper to extract content string from either format
  const getContentString = (value: AboutValue, fallback: string): string => {
    if (typeof value === 'string') return value
    if (value && typeof value === 'object' && 'content' in value) {
      return value.content || fallback
    }
    return fallback
  }

  return {
    origin: { id: 'origin', key: 'origin', title: 'Our Origin', content: getContentString(about.origin, DEFAULT_ABOUT.origin.content), order: 1 },
    spark: { id: 'spark', key: 'spark', title: 'The Spark', content: getContentString(about.spark, DEFAULT_ABOUT.spark.content), order: 2 },
    mission: { id: 'mission', key: 'mission', title: 'Our Mission', content: getContentString(about.mission, DEFAULT_ABOUT.mission.content), order: 3 },
    vision: { id: 'vision', key: 'vision', title: 'Our Vision', content: getContentString(about.vision, DEFAULT_ABOUT.vision.content), order: 4 },
    values: { id: 'values', key: 'values', title: 'Our Values', content: getContentString(about.values, DEFAULT_ABOUT.values.content), order: 5 },
  }
}

export async function getAppStoreLinks(): Promise<AppStoreLinksData> {
  if (!isFirebaseConfigured()) return DEFAULT_APP_LINKS
  return getFirestoreDocument<AppStoreLinksData>('content', 'apps', DEFAULT_APP_LINKS)
}

export async function getSocialLinks() {
  if (!isFirebaseConfigured()) return DEFAULT_SOCIAL
  return getFirestoreDocument('content', 'social', DEFAULT_SOCIAL)
}

export async function getContactInfo() {
  if (!isFirebaseConfigured()) return DEFAULT_CONTACT
  return getFirestoreDocument('content', 'contact', DEFAULT_CONTACT)
}

export async function getSiteConfig(): Promise<SiteConfigData> {
  if (!isFirebaseConfigured()) return DEFAULT_SITE_CONFIG

  interface SettingsDoc {
    site?: {
      name?: string
      legalName?: string
      tagline?: string
      description?: string
      url?: string
    }
    contact?: {
      email?: string
      phone?: string
      address?: string
    }
    social?: {
      facebook?: string
      instagram?: string
      linkedin?: string
    }
    founders?: string[]
  }

  const settings = await getFirestoreDocument<SettingsDoc>('settings', 'config', {})

  return {
    name: settings.site?.name || DEFAULT_SITE_CONFIG.name,
    legalName: settings.site?.legalName || DEFAULT_SITE_CONFIG.legalName,
    tagline: settings.site?.tagline || DEFAULT_SITE_CONFIG.tagline,
    description: settings.site?.description || DEFAULT_SITE_CONFIG.description,
    url: settings.site?.url || DEFAULT_SITE_CONFIG.url,
    email: settings.contact?.email || DEFAULT_SITE_CONFIG.email,
    phone: settings.contact?.phone || DEFAULT_SITE_CONFIG.phone,
    address: settings.contact?.address || DEFAULT_SITE_CONFIG.address,
    founders: settings.founders || DEFAULT_SITE_CONFIG.founders,
    social: {
      facebook: settings.social?.facebook || DEFAULT_SOCIAL.facebook,
      instagram: settings.social?.instagram || DEFAULT_SOCIAL.instagram,
      linkedin: settings.social?.linkedin || DEFAULT_SOCIAL.linkedin,
    },
  }
}

export async function getBlogs(): Promise<BlogData[]> {
  if (!isFirebaseConfigured()) return []
  const blogs = await getFirestoreCollection<BlogData>('blogs', [], 'createdAt')
  return blogs.filter(blog => blog.published)
}

export async function getBlogBySlug(slug: string): Promise<BlogData | null> {
  const blogs = await getBlogs()
  // Normalize the search slug (strip leading slashes and /blog/ prefix if present)
  const normalizedSlug = slug.replace(/^\/+/, '').replace(/^blog\/+/i, '')
  return blogs.find(blog => {
    const blogSlug = blog.slug.replace(/^\/+/, '').replace(/^blog\/+/i, '')
    return blogSlug === normalizedSlug
  }) || null
}

export async function getFAQs(): Promise<FAQData[]> {
  if (!isFirebaseConfigured()) return DEFAULT_FAQS.filter(faq => faq.isActive)
  const faqs = await getFirestoreCollection<FAQData>('faq', DEFAULT_FAQS, 'order')
  return faqs.filter(faq => faq.isActive !== false)
}

export async function getFAQsByCategory(category: string): Promise<FAQData[]> {
  const faqs = await getFAQs()
  return faqs.filter(faq => faq.category === category)
}

export async function getTeamMembers(): Promise<TeamMemberData[]> {
  if (!isFirebaseConfigured()) return DEFAULT_TEAM
  const team = await getFirestoreCollection<TeamMemberData>('team', DEFAULT_TEAM, 'order')
  return team.filter(m => m.isActive !== false)
}

// Get images configuration
export async function getImagesConfig(): Promise<SiteImagesConfig> {
  if (!isFirebaseConfigured()) return DEFAULT_IMAGES
  return getFirestoreDocument<SiteImagesConfig>('images', 'config', DEFAULT_IMAGES)
}

// Helper to get all content at once (for home page)
export async function getAllHomeContent() {
  const [hero, stats, features, howItWorks, testimonials, appLinks, siteConfig, images] = await Promise.all([
    getHeroContent(),
    getStats(),
    getFeatures(),
    getHowItWorksSteps(),
    getTestimonials(),
    getAppStoreLinks(),
    getSiteConfig(),
    getImagesConfig(),
  ])

  return { hero, stats, features, howItWorks, testimonials, appLinks, siteConfig, images }
}

// Default safety content
const DEFAULT_SAFETY: SafetyContentData = {
  hero: {
    headline: 'Your Safety is Our Priority',
    subtext: 'Every feature is designed with your security in mind. From verified riders to instant emergency support.',
    points: [
      '100% KYC verification for all users',
      'One-tap SOS with instant location sharing',
      'Dedicated female-only ride option',
    ],
    stats: [
      { value: '100%', label: 'KYC Verified' },
      { value: '<30s', label: 'SOS Response' },
      { value: '24/7', label: 'Support' },
    ],
  },
  features: [
    {
      id: '1',
      title: 'Aadhaar KYC Verification',
      description: 'Every user must complete Aadhaar-based KYC verification powered by DigiLocker before using Snapgo.',
      points: [
        'Real Identities - No fake profiles or anonymous users',
        'Gender Verification - Users cannot change or fake their gender',
        'Government Backed - Verified through official DigiLocker system',
        'KYC Badge - Verified users display prominent KYC-approved badge',
      ],
      icon: 'ShieldCheck',
      order: 1,
      isActive: true,
    },
    {
      id: '2',
      title: 'Female Safety Features',
      description: 'Special features designed for women travelers.',
      points: [
        'Female-Only Filter - Women can enable filter to see/connect only with verified female riders',
        'No Gender Manipulation - Thanks to Aadhaar KYC, users cannot fake/change gender',
        'Verified Profiles - Every profile shows KYC verification status',
      ],
      icon: 'UserCheck',
      order: 2,
      isActive: true,
    },
    {
      id: '3',
      title: 'Emergency SOS Feature',
      description: 'One tap to alert emergency contacts with your location and trip details.',
      points: [
        'Add up to 3 emergency contacts',
        'One-tap SOS activation',
        'Instant SMS & app notification',
        'Live location tracking link',
      ],
      icon: 'AlertTriangle',
      order: 3,
      isActive: true,
    },
  ],
  sos: {
    headline: 'Emergency SOS Feature',
    subtext: 'Your safety net in emergencies. Instantly alert trusted contacts with your location.',
    steps: [
      'Add up to 3 emergency contacts',
      'One-tap SOS activation',
      'Instant SMS & app notification',
      'Live location tracking shared',
    ],
    shares: [
      { icon: 'MapPin', label: 'Your live GPS location' },
      { icon: 'Users', label: 'Trip details & co-riders' },
      { icon: 'Clock', label: 'Timestamp of alert' },
    ],
  },
  trust: {
    headline: 'Trusted & Certified',
    subtext: 'Snapgo is officially recognized and meets the highest standards of safety and security.',
    certifications: [
      { title: 'DPIIT Recognized', description: 'Government certified startup' },
      { title: 'Startup India', description: 'Official initiative member' },
      { title: 'Data Protected', description: 'Industry-standard encryption' },
    ],
  },
  cta: {
    quote: 'From day one, safety has been our top priority. Every feature, every verification is designed to ensure your journey is secure.',
    badge: '100% KYC Verified Platform',
    buttonText: 'Download Snapgo',
    buttonLink: '/#download',
  },
}

// Default homepage sections config
const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  sections: [
    { id: 'hero', label: 'Hero Section', visible: true, order: 1 },
    { id: 'stats', label: 'Statistics Counter', visible: true, order: 2 },
    { id: 'features', label: 'Features Grid', visible: true, order: 3 },
    { id: 'howItWorks', label: 'How It Works', visible: true, order: 4 },
    { id: 'comparison', label: 'Cab Pooling Comparison', visible: true, order: 5 },
    { id: 'testimonials', label: 'Testimonials', visible: true, order: 6 },
    { id: 'whySnapgo', label: 'Why Snapgo', visible: true, order: 7 },
    { id: 'download', label: 'Download Section', visible: true, order: 8 },
    { id: 'instagram', label: 'Instagram Feed', visible: true, order: 9 },
    { id: 'trustBadges', label: 'Trust Badges', visible: true, order: 10 },
    { id: 'cta', label: 'Call to Action', visible: true, order: 11 },
  ],
}

// Fetch legal page content
export async function getLegalContent(type: 'terms' | 'privacy' | 'refund'): Promise<LegalPageData> {
  // Import defaults from legal-content.ts
  const { TERMS_OF_SERVICE, PRIVACY_POLICY, REFUND_POLICY } = await import('./legal-content')
  const defaults: Record<string, LegalPageData> = {
    terms: TERMS_OF_SERVICE,
    privacy: PRIVACY_POLICY,
    refund: REFUND_POLICY,
  }
  const defaultValue = defaults[type]

  if (!isFirebaseConfigured()) return defaultValue
  return getFirestoreDocument<LegalPageData>('legal', type, defaultValue)
}

// Fetch safety page content
export async function getSafetyContent(): Promise<SafetyContentData> {
  if (!isFirebaseConfigured()) return DEFAULT_SAFETY
  return getFirestoreDocument<SafetyContentData>('content', 'safety', DEFAULT_SAFETY)
}

// Fetch homepage sections config
export async function getHomepageConfig(): Promise<HomepageConfig> {
  if (!isFirebaseConfigured()) return DEFAULT_HOMEPAGE_CONFIG
  return getFirestoreDocument<HomepageConfig>('content', 'homepage', DEFAULT_HOMEPAGE_CONFIG)
}

// Export defaults for direct access if needed
export {
  DEFAULT_HERO,
  DEFAULT_STATS,
  DEFAULT_FEATURES,
  DEFAULT_STEPS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_ABOUT,
  DEFAULT_APP_LINKS,
  DEFAULT_SOCIAL,
  DEFAULT_CONTACT,
  DEFAULT_BLOGS,
  DEFAULT_FAQS,
  DEFAULT_SITE_CONFIG,
  DEFAULT_TEAM,
  DEFAULT_SAFETY,
  DEFAULT_HOMEPAGE_CONFIG,
}
