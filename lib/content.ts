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
  bio: string
  imageUrl: string | null
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

const DEFAULT_BLOGS: BlogData[] = [
  {
    id: '1',
    title: 'How Carpooling Saves You Money Every Month',
    slug: 'carpooling-saves-money',
    excerpt: 'Learn how sharing rides can reduce your travel costs by up to 75% and put more money back in your pocket.',
    content: `Carpooling has become one of the most effective ways to cut down on daily commute expenses. With Snapgo, users are saving an average of ₹3,000-5,000 per month on their travel costs.

## The Math Behind Savings

When you share a cab with 3 other verified riders:
- A ₹400 solo cab ride becomes ₹100 per person
- That's 75% savings on every single trip
- Over 20 working days, that's ₹6,000 saved monthly

## Getting Started

Download Snapgo today and start matching with verified co-riders heading your way. Your wallet will thank you!`,
    imageUrl: '/images/blog/carpooling-savings.jpg',
    published: true,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: '2',
    title: 'Safety First: How Snapgo Keeps You Protected',
    slug: 'safety-first-snapgo',
    excerpt: 'Discover the safety features that make Snapgo the most trusted ride-sharing platform in India.',
    content: `At Snapgo, your safety is our top priority. We've built multiple layers of protection to ensure every ride is secure.

## Aadhaar Verification

Every user on Snapgo is verified through Aadhaar KYC powered by DigiLocker.

## Female-Only Option

Women riders can choose to match only with other verified female riders.`,
    imageUrl: '/images/blog/safety-features.jpg',
    published: true,
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15'),
  },
]

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

  interface AboutDoc {
    origin: string
    spark: string
    mission: string
    vision: string
    values: string
  }

  const about = await getFirestoreDocument<AboutDoc>('content', 'about', {
    origin: DEFAULT_ABOUT.origin.content,
    spark: DEFAULT_ABOUT.spark.content,
    mission: DEFAULT_ABOUT.mission.content,
    vision: DEFAULT_ABOUT.vision.content,
    values: DEFAULT_ABOUT.values.content,
  })

  return {
    origin: { id: 'origin', key: 'origin', title: 'Our Origin', content: about.origin, order: 1 },
    spark: { id: 'spark', key: 'spark', title: 'The Spark', content: about.spark, order: 2 },
    mission: { id: 'mission', key: 'mission', title: 'Our Mission', content: about.mission, order: 3 },
    vision: { id: 'vision', key: 'vision', title: 'Our Vision', content: about.vision, order: 4 },
    values: { id: 'values', key: 'values', title: 'Our Values', content: about.values, order: 5 },
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
  if (!isFirebaseConfigured()) return DEFAULT_BLOGS.filter(blog => blog.published)
  const blogs = await getFirestoreCollection<BlogData>('blogs', DEFAULT_BLOGS, 'createdAt')
  return blogs.filter(blog => blog.published)
}

export async function getBlogBySlug(slug: string): Promise<BlogData | null> {
  const blogs = await getBlogs()
  return blogs.find(blog => blog.slug === slug) || null
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
}
