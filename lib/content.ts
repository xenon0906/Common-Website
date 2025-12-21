// Static content for frontend-only deployment
// Database calls are disabled - all functions return static defaults
// To enable database: see lib/config.ts

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

// Default content (static data)
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

const DEFAULT_ABOUT: Record<string, AboutContentData> = {
  origin: { id: 'default-origin', key: 'origin', title: 'Our Origin', content: "It was a regular day when we, Mohit and Surya Purohit, were heading to Ghaziabad Railway Station from our society. We booked a cab and noticed another person also taking a cab from our area. When we reached the station, we saw the same person at the parking lot. That's when it hit us - we both paid Rs.300 separately for the same route. If we had known we were going to the same place, we could have shared the ride and paid just Rs.300 total, saving Rs.300 together!", order: 1 },
  spark: { id: 'default-spark', key: 'spark', title: 'The Spark', content: "This simple observation sparked an idea: What if there was an app that could connect people traveling to the same destination? And that's how Snapgo was born - from a personal experience that we knew thousands of others faced every day.", order: 2 },
  mission: { id: 'default-mission', key: 'mission', title: 'Our Mission', content: 'To make travel affordable and accessible for everyone by connecting people who share similar routes, reducing costs and environmental impact.', order: 3 },
  vision: { id: 'default-vision', key: 'vision', title: 'Our Vision', content: "To become India's most trusted ride-sharing platform, creating a community where safety, affordability, and sustainability go hand in hand.", order: 4 },
  values: { id: 'default-values', key: 'values', title: 'Our Values', content: 'Safety first, user-centric design, transparency, sustainability, and creating value for our community at every step.', order: 5 },
}

const DEFAULT_APP_LINKS = {
  android: { url: 'https://play.google.com/store/apps/details?id=com.snapgo.app', isLive: true, qrCodeUrl: '/images/qr code/playstore-qr.png' },
  ios: { url: 'https://apps.apple.com/app/snapgo/id6739696498', isLive: true, qrCodeUrl: '/images/qr code/appstore-qr.png' },
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

## Real Stories from Our Users

"I was spending ₹8,000/month on cabs alone. With Snapgo, I now spend just ₹2,000. The extra money helps me save for my future." - Rahul, IT Professional

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

Every user on Snapgo is verified through Aadhaar KYC powered by DigiLocker. This means:
- Government-verified identity
- Real photos matched to profiles
- No fake accounts or anonymous users

## Female-Only Option

Women riders can choose to match only with other verified female riders, providing an extra layer of comfort and security.

## In-App Safety Features

- Real-time ride tracking
- Emergency SOS button
- Share ride details with family
- Rating system for accountability

## Our Commitment

We're building a community based on trust and transparency. Every feature we develop prioritizes your safety above all else.`,
    imageUrl: '/images/blog/safety-features.jpg',
    published: true,
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15'),
  },
  {
    id: '3',
    title: 'Reduce Your Carbon Footprint with Ride Sharing',
    slug: 'eco-friendly-commuting',
    excerpt: 'Join the green revolution. Every shared ride reduces emissions and helps protect our environment.',
    content: `Climate change is real, and every action counts. By sharing rides instead of traveling alone, you're making a significant environmental impact.

## The Environmental Impact

- A single car emits about 4.6 metric tons of CO2 per year
- Sharing rides can reduce this by up to 75%
- Together, Snapgo users have prevented over 500 tons of CO2 emissions

## Small Changes, Big Impact

When 4 people share a cab instead of taking 4 separate ones:
- 75% fewer vehicles on the road
- 75% less fuel consumed
- 75% fewer emissions released

## Join the Movement

Every time you use Snapgo, you're not just saving money - you're contributing to a cleaner, greener future. Download the app and be part of the solution.`,
    imageUrl: '/images/blog/eco-friendly.jpg',
    published: true,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
  },
]

const DEFAULT_FAQS: FAQData[] = [
  {
    id: '1',
    question: 'How does Snapgo work?',
    answer: 'Snapgo connects people traveling to similar destinations. Enter your pickup and drop location, and our smart algorithm matches you with verified co-riders within a 750m radius. You then share a cab and split the fare, saving up to 75% on your travel costs.',
    category: 'general',
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    question: 'Is Snapgo safe to use?',
    answer: 'Yes! Safety is our top priority. All users are verified through Aadhaar KYC powered by DigiLocker. We also offer a female-only option for women riders, real-time ride tracking, emergency SOS features, and a rating system for accountability.',
    category: 'safety',
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    question: 'How much can I save with Snapgo?',
    answer: 'You can save up to 75% on your cab fares! For example, a ₹400 solo ride becomes just ₹100 when shared with 3 other riders. Regular users save ₹3,000-5,000 per month on average.',
    category: 'pricing',
    order: 3,
    isActive: true,
  },
  {
    id: '4',
    question: 'What is the female-only option?',
    answer: 'The female-only option allows women riders to match exclusively with other verified female riders. This feature provides an extra layer of comfort and security for women commuters.',
    category: 'safety',
    order: 4,
    isActive: true,
  },
  {
    id: '5',
    question: 'Can I schedule rides in advance?',
    answer: 'Yes! Snapgo supports both real-time and scheduled rides. You can plan your rides ahead of time for regular commutes or upcoming trips, ensuring you always have a match when you need one.',
    category: 'features',
    order: 5,
    isActive: true,
  },
  {
    id: '6',
    question: 'Where is Snapgo available?',
    answer: 'Snapgo is currently available in Delhi NCR, including Greater Noida, Noida, and surrounding areas. We are rapidly expanding to more cities across India.',
    category: 'general',
    order: 6,
    isActive: true,
  },
  {
    id: '7',
    question: 'How do I verify my account?',
    answer: 'Account verification is done through Aadhaar KYC powered by DigiLocker. Simply follow the in-app prompts to complete your verification. The process is quick, secure, and protects everyone in our community.',
    category: 'account',
    order: 7,
    isActive: true,
  },
  {
    id: '8',
    question: 'What happens if my match cancels?',
    answer: 'If your co-rider cancels, we immediately search for another match. You can also choose to proceed solo or wait for a new match. Our algorithm works quickly to minimize any inconvenience.',
    category: 'features',
    order: 8,
    isActive: true,
  },
]

// Static data functions (no database calls)
export async function getHeroContent(): Promise<HeroContentData> {
  return DEFAULT_HERO
}

export async function getStats(): Promise<StatisticData[]> {
  return DEFAULT_STATS
}

export async function getFeatures(): Promise<FeatureData[]> {
  return DEFAULT_FEATURES
}

export async function getHowItWorksSteps(): Promise<HowItWorksStepData[]> {
  return DEFAULT_STEPS
}

export async function getTestimonials(): Promise<TestimonialData[]> {
  return DEFAULT_TESTIMONIALS
}

export async function getAboutContent(): Promise<Record<string, AboutContentData>> {
  return DEFAULT_ABOUT
}

export async function getAppStoreLinks() {
  return DEFAULT_APP_LINKS
}

export async function getSocialLinks() {
  return DEFAULT_SOCIAL
}

export async function getContactInfo() {
  return DEFAULT_CONTACT
}

export async function getBlogs(): Promise<BlogData[]> {
  return DEFAULT_BLOGS.filter(blog => blog.published)
}

export async function getBlogBySlug(slug: string): Promise<BlogData | null> {
  return DEFAULT_BLOGS.find(blog => blog.slug === slug && blog.published) || null
}

export async function getFAQs(): Promise<FAQData[]> {
  return DEFAULT_FAQS.filter(faq => faq.isActive)
}

export async function getFAQsByCategory(category: string): Promise<FAQData[]> {
  return DEFAULT_FAQS.filter(faq => faq.category === category && faq.isActive)
}

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
}
