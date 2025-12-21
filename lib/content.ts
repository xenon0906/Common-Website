import { prisma } from './prisma'
import { unstable_cache } from 'next/cache'

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

// Default content (used when database is empty)
const DEFAULT_HERO: HeroContentData = {
  id: 'default',
  headline: 'Share Rides. Save More.',
  subtext: 'Connect with verified co-riders heading your way. Save up to 75% on your daily commute while reducing your carbon footprint.',
  badge: "India's #1 Ride-Sharing Platform",
  ctaPrimary: 'Download Free',
  ctaSecondary: 'See How It Works',
  isActive: true,
}

const DEFAULT_STATS: StatisticData[] = [
  { id: '1', label: 'App Downloads', value: 7000, prefix: '', suffix: '+', icon: 'Download', order: 1, isActive: true },
  { id: '2', label: 'Peak Daily Rides', value: 110, prefix: '', suffix: '+', icon: 'Car', order: 2, isActive: true },
  { id: '3', label: 'Cost Savings', value: 75, prefix: '', suffix: '%', icon: 'Wallet', order: 3, isActive: true },
  { id: '4', label: 'Active Users', value: 400, prefix: '', suffix: '+', icon: 'Users', order: 4, isActive: true },
]

const DEFAULT_FEATURES: FeatureData[] = [
  { id: '1', title: 'Save Up to 75%', description: 'Share cab fares and save significant money on your daily commute', icon: 'Wallet', order: 1, isActive: true },
  { id: '2', title: 'Aadhaar Verified', description: 'All users verified via Aadhaar KYC powered by DigiLocker', icon: 'ShieldCheck', order: 2, isActive: true },
  { id: '3', title: 'Female-Only Option', description: 'Women can connect only with verified female riders for added safety', icon: 'Users', order: 3, isActive: true },
  { id: '4', title: 'Real-time & Scheduled', description: 'Find rides instantly or plan ahead for your convenience', icon: 'Clock', order: 4, isActive: true },
  { id: '5', title: 'Eco-Friendly', description: 'Reduce carbon footprint by sharing rides with fellow travelers', icon: 'Leaf', order: 5, isActive: true },
  { id: '6', title: 'Smart Matching', description: 'Advanced algorithm matches within 750m radius for perfect routes', icon: 'MapPin', order: 6, isActive: true },
]

const DEFAULT_STEPS: HowItWorksStepData[] = [
  { id: '1', step: 1, title: 'Enter Your Destination', description: 'Set your pickup and drop location in the app', icon: 'MapPin', order: 1, isActive: true },
  { id: '2', step: 2, title: 'Find Your Match', description: 'Our algorithm finds people going to the same destination within 750m', icon: 'Search', order: 2, isActive: true },
  { id: '3', step: 3, title: 'Share & Save', description: 'Connect, chat, meet at a common point, share the fare, and save money', icon: 'Users', order: 3, isActive: true },
]

const DEFAULT_TESTIMONIALS: TestimonialData[] = [
  { id: '1', quote: 'Snapgo has saved me so much money! I used to spend Rs.400 for my daily commute, now I only pay Rs.100 by sharing with fellow students. Amazing concept!', author: 'Priya S.', role: 'College Student', location: 'Sharda University', avatarUrl: null, rating: 5, order: 1, isActive: true },
  { id: '2', quote: 'As a working professional, Snapgo has made my daily travel both affordable and social. I have made great connections with fellow commuters.', author: 'Rahul K.', role: 'IT Professional', location: 'Greater Noida', avatarUrl: null, rating: 5, order: 2, isActive: true },
  { id: '3', quote: 'The female-only option makes me feel safe. I can now travel without worrying about security while saving money.', author: 'Ananya M.', role: 'Graduate Student', location: 'Delhi NCR', avatarUrl: null, rating: 5, order: 3, isActive: true },
]

// Cached data fetching functions with ISR
export const getHeroContent = unstable_cache(
  async (): Promise<HeroContentData> => {
    try {
      const hero = await prisma.heroContent.findFirst({
        where: { isActive: true },
      })
      return hero || DEFAULT_HERO
    } catch (error) {
      console.error('Error fetching hero content:', error)
      return DEFAULT_HERO
    }
  },
  ['hero-content'],
  { revalidate: 60, tags: ['hero'] }
)

export const getStats = unstable_cache(
  async (): Promise<StatisticData[]> => {
    try {
      const stats = await prisma.statistic.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      })
      return stats.length > 0 ? stats : DEFAULT_STATS
    } catch (error) {
      console.error('Error fetching stats:', error)
      return DEFAULT_STATS
    }
  },
  ['stats'],
  { revalidate: 60, tags: ['stats'] }
)

export const getFeatures = unstable_cache(
  async (): Promise<FeatureData[]> => {
    try {
      const features = await prisma.feature.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      })
      return features.length > 0 ? features : DEFAULT_FEATURES
    } catch (error) {
      console.error('Error fetching features:', error)
      return DEFAULT_FEATURES
    }
  },
  ['features'],
  { revalidate: 60, tags: ['features'] }
)

export const getHowItWorksSteps = unstable_cache(
  async (): Promise<HowItWorksStepData[]> => {
    try {
      const steps = await prisma.howItWorksStep.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      })
      return steps.length > 0 ? steps : DEFAULT_STEPS
    } catch (error) {
      console.error('Error fetching how it works steps:', error)
      return DEFAULT_STEPS
    }
  },
  ['how-it-works'],
  { revalidate: 60, tags: ['how-it-works'] }
)

export const getTestimonials = unstable_cache(
  async (): Promise<TestimonialData[]> => {
    try {
      const testimonials = await prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      })
      return testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      return DEFAULT_TESTIMONIALS
    }
  },
  ['testimonials'],
  { revalidate: 60, tags: ['testimonials'] }
)

export const getAboutContent = unstable_cache(
  async (): Promise<Record<string, AboutContentData>> => {
    try {
      const content = await prisma.aboutContent.findMany({
        orderBy: { order: 'asc' },
      })

      if (content.length === 0) {
        return {
          origin: { id: 'default-origin', key: 'origin', title: 'Our Origin', content: "It was a regular day when we, Mohit and Surya Purohit, were heading to Ghaziabad Railway Station from our society. We booked a cab and noticed another person also taking a cab from our area. When we reached the station, we saw the same person at the parking lot. That's when it hit us - we both paid Rs.300 separately for the same route. If we had known we were going to the same place, we could have shared the ride and paid just Rs.300 total, saving Rs.300 together!", order: 1 },
          spark: { id: 'default-spark', key: 'spark', title: 'The Spark', content: "This simple observation sparked an idea: What if there was an app that could connect people traveling to the same destination? And that's how Snapgo was born - from a personal experience that we knew thousands of others faced every day.", order: 2 },
          mission: { id: 'default-mission', key: 'mission', title: 'Our Mission', content: 'To make travel affordable and accessible for everyone by connecting people who share similar routes, reducing costs and environmental impact.', order: 3 },
          vision: { id: 'default-vision', key: 'vision', title: 'Our Vision', content: "To become India's most trusted ride-sharing platform, creating a community where safety, affordability, and sustainability go hand in hand.", order: 4 },
          values: { id: 'default-values', key: 'values', title: 'Our Values', content: 'Safety first, user-centric design, transparency, sustainability, and creating value for our community at every step.', order: 5 },
        }
      }

      return content.reduce((acc, item) => {
        acc[item.key] = item
        return acc
      }, {} as Record<string, AboutContentData>)
    } catch (error) {
      console.error('Error fetching about content:', error)
      return {}
    }
  },
  ['about-content'],
  { revalidate: 60, tags: ['about'] }
)

export const getAppStoreLinks = unstable_cache(
  async () => {
    try {
      const links = await prisma.appStoreLink.findMany()

      if (links.length === 0) {
        return {
          android: { url: 'https://play.google.com/store/apps/details?id=com.snapgo.app', isLive: true, qrCodeUrl: '/images/qr code/playstore-qr.png' },
          ios: { url: 'https://apps.apple.com/app/snapgo/id6739696498', isLive: true, qrCodeUrl: '/images/qr code/appstore-qr.png' },
        }
      }

      return links.reduce((acc, link) => {
        acc[link.platform] = { url: link.url, isLive: link.isLive, qrCodeUrl: link.qrCodeUrl }
        return acc
      }, {} as Record<string, { url: string; isLive: boolean; qrCodeUrl: string | null }>)
    } catch (error) {
      console.error('Error fetching app store links:', error)
      return {
        android: { url: 'https://play.google.com/store/apps/details?id=com.snapgo.app', isLive: true, qrCodeUrl: null },
        ios: { url: 'https://apps.apple.com/app/snapgo/id6739696498', isLive: true, qrCodeUrl: null },
      }
    }
  },
  ['app-store-links'],
  { revalidate: 60, tags: ['apps'] }
)

export const getSocialLinks = unstable_cache(
  async () => {
    try {
      const links = await prisma.socialLink.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      })

      if (links.length === 0) {
        return {
          facebook: 'https://www.facebook.com/profile.php?id=61578285621863',
          instagram: 'https://www.instagram.com/snapgo.co.in/',
          linkedin: 'https://www.linkedin.com/company/snapgo-service-private-limited/',
        }
      }

      return links.reduce((acc, link) => {
        acc[link.platform] = link.url
        return acc
      }, {} as Record<string, string>)
    } catch (error) {
      console.error('Error fetching social links:', error)
      return {}
    }
  },
  ['social-links'],
  { revalidate: 60, tags: ['social'] }
)

export const getContactInfo = unstable_cache(
  async () => {
    try {
      const info = await prisma.contactInfo.findMany()

      if (info.length === 0) {
        return {
          email: 'info@snapgo.co.in',
          phone: '+91 6398786105',
          address: 'Block 45, Sharda University, Knowledge Park 3, Greater Noida, Uttar Pradesh, India',
        }
      }

      return info.reduce((acc, item) => {
        acc[item.key] = item.value
        return acc
      }, {} as Record<string, string>)
    } catch (error) {
      console.error('Error fetching contact info:', error)
      return {
        email: 'info@snapgo.co.in',
        phone: '+91 6398786105',
        address: 'Block 45, Sharda University, Knowledge Park 3, Greater Noida, Uttar Pradesh, India',
      }
    }
  },
  ['contact-info'],
  { revalidate: 60, tags: ['contact'] }
)

// Helper to get all content at once (for home page)
export async function getAllHomeContent() {
  const [hero, stats, features, howItWorks, testimonials, appLinks] = await Promise.all([
    getHeroContent(),
    getStats(),
    getFeatures(),
    getHowItWorksSteps(),
    getTestimonials(),
    getAppStoreLinks(),
  ])

  return { hero, stats, features, howItWorks, testimonials, appLinks }
}
