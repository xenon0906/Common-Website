/**
 * @deprecated This file serves ONLY as fallback when Firebase is unavailable.
 *
 * All constants here now serve as DEFAULT fallback values when:
 * 1. Firebase is not configured
 * 2. Firestore data fetch fails
 * 3. Running in development without Firebase
 *
 * To update content, use the admin panel at /admin instead of editing this file.
 * Changes made here will NOT appear on the website unless Firebase is unavailable.
 *
 * See lib/content.ts for the primary data fetching layer.
 */

export const SITE_CONFIG = {
  name: 'Snapgo',
  legalName: 'Snapgo Service Private Limited',
  tagline: 'Pool Cabs, Save Money, Go Green',
  description: "India's #1 Cab Pooling Platform. Pool a commercial cab with verified co-riders - 100% legal, eco-friendly, and up to 75% cheaper. Why pay for the full cab when you can save money AND the environment?",
  url: 'https://snapgo.co.in',
  email: 'info@snapgo.co.in',
  phone: '+91 6398786105',
  address: 'Block 45, Sharda University, Knowledge Park 3, Greater Noida, Uttar Pradesh, India',
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61578285621863',
    instagram: 'https://www.instagram.com/snapgo.co.in/',
    linkedin: 'https://www.linkedin.com/company/snapgo-service-private-limited/',
  },
  founders: ['Mohit Purohit', 'Surya Purohit'],
}

export const HERO_CONTENT = {
  headline: 'Pool Cabs, Not Cars. Save Money AND the Planet.',
  subtext: "Unlike carpooling with private cars, Snapgo pools commercial cabs — 100% legal, driver-friendly, and eco-conscious. Connect with verified co-riders heading your way, split the fare, and reduce road emissions by 75%. Same destination, shared cab, triple the benefit.",
}

export const STATS = [
  { label: 'App Downloads', value: 10000, suffix: '+', prefix: '' },
  { label: 'Peak Daily Rides', value: 150, suffix: '+', prefix: '' },
  { label: 'Cost Savings', value: 75, suffix: '%', prefix: '' },
  { label: 'Trees Equivalent', value: 500, suffix: '+', prefix: '', isEco: true },
]

export const FEATURES = [
  {
    title: 'Save Up to 75%',
    description: 'Share cab fares and save significant money on your daily commute',
    icon: 'Wallet',
  },
  {
    title: 'Aadhaar Verified',
    description: 'All users verified via Aadhaar KYC powered by DigiLocker',
    icon: 'ShieldCheck',
  },
  {
    title: 'Female-Only Option',
    description: 'Women can connect only with verified female riders for added safety',
    icon: 'Users',
  },
  {
    title: 'Real-time & Scheduled',
    description: 'Find rides instantly or plan ahead for your convenience',
    icon: 'Clock',
  },
  {
    title: 'Green Cab Pooling',
    description: '4 people, 1 cab = 75% less pollution. We pool commercial cabs, not private cars — legal AND eco-friendly',
    icon: 'Leaf',
  },
  {
    title: 'Pool Your Way',
    description: 'No car? Book a cab together. Have a car? Offer rides. Two options, same savings, one green mission.',
    icon: 'Shuffle',
  },
]

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Enter Your Destination',
    description: 'Set your pickup and drop location in the app',
    icon: 'MapPin',
  },
  {
    step: 2,
    title: 'Find Your Match',
    description: 'Our algorithm finds people going to the same destination within 750m',
    icon: 'Search',
  },
  {
    step: 3,
    title: 'Pool Together & Save',
    description: 'Book a cab together or join a self-drive ride — split costs and save up to 75%',
    icon: 'Users',
  },
]

export const TESTIMONIALS = [
  {
    quote: 'Snapgo has saved me so much money! I used to spend ₹400 for my daily commute, now I only pay ₹100 by sharing with fellow students. Amazing concept!',
    author: 'College Student',
    location: 'Sharda University',
  },
  {
    quote: 'As a working professional, Snapgo has made my daily travel both affordable and social. I have made great connections with fellow commuters.',
    author: 'IT Professional',
    location: 'Greater Noida',
  },
  {
    quote: 'The female-only option makes me feel safe. I can now travel without worrying about security while saving money.',
    author: 'Graduate Student',
    location: 'Delhi NCR',
  },
]

export const ABOUT_STORY = {
  origin: "It was a regular day when we, Mohit and Surya Purohit, were heading to Ghaziabad Railway Station from our society. We booked a cab and noticed another person also taking a cab from our area. When we reached the station, we saw the same person at the parking lot. That's when it hit us - we both paid ₹300 separately for the same route. If we had known we were going to the same place, we could have shared the ride and paid just ₹300 total, saving ₹300 together!",
  spark: "This sparked an idea, but we didn't want to do traditional carpooling with private cars — that's not legal for commercial use and bypasses taxi drivers who depend on fares. Instead, we pioneered 'Cab Pooling' — pooling commercial cabs among verified riders. It's 100% legal, supports drivers, AND reduces road emissions by 75%. That's how Snapgo was born.",
  mission: 'To make travel affordable and accessible for everyone through cab pooling — connecting people who share similar routes while supporting drivers and reducing environmental impact.',
  vision: "To become India's most trusted cab pooling platform, where every shared ride means savings for riders, earnings for drivers, and a greener planet for everyone.",
  values: 'Legal and ethical operations, driver-friendly ecosystem, environmental sustainability, user safety, and creating value for our entire community.',
}

export const JOURNEY_TIMELINE = [
  {
    title: 'WhatsApp Pilot',
    description: '1000+ members in pilot group, proving the concept works',
    icon: 'MessageCircle',
  },
  {
    title: '150+ Daily Rides',
    description: 'Peak daily rides achieved during pilot project',
    icon: 'Car',
  },
  {
    title: 'Startup Recognition',
    description: 'Officially recognized by Startup India, Startup Uttarakhand & received DPIIT number',
    icon: 'Award',
  },
  {
    title: 'Growing Demand',
    description: 'Multiple colleges requested expansion and creation of groups',
    icon: 'TrendingUp',
  },
]

export const SAFETY_FEATURES = [
  {
    title: 'Aadhaar KYC Verification',
    description: 'Every user must complete Aadhaar-based KYC verification powered by DigiLocker before using Snapgo.',
    points: [
      'Real Identities - No fake profiles or anonymous users',
      'Gender Verification - Users cannot change or fake their gender',
      'Government Backed - Verified through official DigiLocker system',
      'KYC Badge - Verified users display prominent KYC-approved badge',
    ],
    icon: 'ShieldCheck',
  },
  {
    title: 'Female Safety Features',
    description: 'Special features designed for women travelers.',
    points: [
      'Female-Only Filter - Women can enable filter to see/connect only with verified female riders',
      'No Gender Manipulation - Thanks to Aadhaar KYC, users cannot fake/change gender',
      'Verified Profiles - Every profile shows KYC verification status',
    ],
    icon: 'UserCheck',
  },
  {
    title: 'Emergency SOS Feature',
    description: 'One tap to alert emergency contacts with your location and trip details.',
    points: [
      'Add up to 3 emergency contacts',
      'One-tap SOS activation',
      'Instant SMS & app notification',
      'Live location tracking link',
    ],
    icon: 'AlertTriangle',
  },
]

export const INDIAN_CITIES = [
  { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { name: 'Delhi', lat: 28.6139, lng: 77.209 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Hyderabad', lat: 17.385, lng: 78.4867 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Greater Noida', lat: 28.4744, lng: 77.504 },
]

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/team', label: 'Team' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/features', label: 'Features' },
  { href: '/safety', label: 'Safety' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export const TEAM_MEMBERS = [
  { name: 'Mohit Purohit', role: 'Founder & CTO', details: 'Serial entrepreneur with experience building, scaling, and selling mobile applications. Drives product development and technology strategy for Snapgo.', linkedin: 'https://www.linkedin.com/in/mohitpurohitbr/', imageUrl: '/images/team/mohit.png', order: 1 },
  { name: 'Surya Purohit', role: 'Co-Founder & CEO', details: 'Digital marketing specialist expert in Meta Ads, Google Ads, and performance marketing. Drives growth and strategic partnerships.', linkedin: 'https://www.linkedin.com/in/snapgosurya/', imageUrl: '/images/team/surya.png', order: 2 },
  { name: 'Anurag Tiwari', role: 'Chief Marketing Officer', details: 'Multi-business founder with deep knowledge of traditional and digital marketing channels. Leads strategic communications and market intelligence.', linkedin: 'https://www.linkedin.com/in/snapgoanurag/', imageUrl: '/images/team/anurag.png', order: 3 },
]

export const COLORS = {
  primary: '#0e4493',
  secondary: '#1a5cb8',
  teal: '#0d9488',
  tealDark: '#0f766e',
  purple: '#7c3aed',
  dark: '#111827',
  light: '#f3f4f6',
  white: '#ffffff',
}

// ============================================
// NEW DEFAULT CONSTANTS (ADMIN-EDITABLE CONTENT)
// ============================================

/**
 * Cab Pooling Comparison - Default Data
 * Used in CabPoolingComparison component
 */
export const DEFAULT_COMPARISON = {
  carpooling: {
    title: 'Traditional Carpooling',
    subtitle: 'Private Cars',
    iconName: 'X',
    colorScheme: 'red' as const,
    points: [
      { text: 'Uses private vehicles for commercial use', negative: true },
      { text: 'Not legal in India', negative: true },
      { text: 'Bypasses taxi drivers', negative: true },
      { text: 'Same emissions per car', negative: true },
    ],
  },
  cabPooling: {
    title: 'Snapgo Cab Pooling',
    subtitle: 'Commercial Cabs',
    iconName: 'Check',
    colorScheme: 'green' as const,
    points: [
      { text: 'Uses licensed commercial cabs', negative: false },
      { text: '100% legal and regulated', negative: false },
      { text: "Doesn't bypass taxi drivers", negative: false },
      { text: '75% less emissions per person', negative: false },
    ],
  },
  benefits: [
    {
      iconName: 'Leaf',
      title: 'Planet Wins',
      description: '4 people in 1 cab instead of 4 separate cabs = 75% less pollution',
      colorScheme: 'emerald' as const,
      order: 0
    },
    {
      iconName: 'Wallet',
      title: 'You Win',
      description: 'Split the fare and save up to 75% on every ride',
      colorScheme: 'blue' as const,
      order: 1
    },
    {
      iconName: 'Users',
      title: 'Flexible Pooling',
      description: 'No car? Book together. Have a car? Offer rides. Your choice, same savings.',
      colorScheme: 'purple' as const,
      order: 2
    },
  ],
  tagline: 'Why pay for the full cab when you can save money AND the environment?',
  isActive: true,
}

/**
 * Why Snapgo - Default Reasons
 * Used in WhySnapgoSection component
 */
export const DEFAULT_WHY_SNAPGO = [
  {
    id: 'reason_1',
    iconName: 'Wallet',
    title: 'Save Up to 75%',
    description: 'Pool a cab with verified co-riders and split the fare',
    gradient: 'from-teal-50 to-primary-50',
    order: 0,
    isActive: true
  },
  {
    id: 'reason_2',
    iconName: 'Shield',
    title: '100% Legal & Verified',
    description: 'We pool commercial cabs with Aadhaar-verified riders',
    gradient: 'from-primary-50 to-purple-50',
    order: 1,
    isActive: true
  },
  {
    id: 'reason_3',
    iconName: 'Car',
    title: 'Pool Your Way',
    description: 'No car? Book together. Have a car? Share your ride',
    gradient: 'from-purple-50 to-teal-50',
    order: 2,
    isActive: true
  },
  {
    id: 'reason_4',
    iconName: 'Leaf',
    title: 'Green Cab Pooling',
    description: '4 people, 1 cab = 75% less emissions',
    gradient: 'from-teal-50 to-primary-50',
    order: 3,
    isActive: true
  },
]

/**
 * CO2 Impact Tracker - Default Config
 * Used in CO2ImpactTracker component
 */
export const DEFAULT_CO2_CONFIG = {
  headline: 'Your Green Impact',
  subheadline: 'Track your contribution to a cleaner planet',
  defaultRides: 10,
  co2PerRide: 2.5, // kg
  treesEquivalent: 0.1, // trees per ride
  metricsLabels: {
    rides: 'Pooled Rides',
    co2Saved: 'CO₂ Saved (kg)',
    treesEquiv: 'Trees Equivalent',
  },
  isActive: true,
}

/**
 * Savings Calculator - Default Config
 * Used in SavingsCalculator component
 */
export const DEFAULT_SAVINGS_CONFIG = {
  headline: 'Calculate Your Savings',
  subheadline: 'See how much you can save by pooling cabs',
  defaultFare: 400,
  defaultRiders: 4,
  riderOptions: [2, 3, 4],
  currencySymbol: '₹',
  isActive: true,
}

/**
 * Trust Badges - Default Data
 * Used in TrustBadgesSection component
 */
export const DEFAULT_TRUST_BADGES = [
  {
    id: 'badge_1',
    iconName: 'Award',
    title: 'DPIIT Recognized',
    description: 'Government certified startup',
    order: 0,
    isActive: true
  },
  {
    id: 'badge_2',
    iconName: 'Shield',
    title: 'Startup India',
    description: 'Official initiative member',
    order: 1,
    isActive: true
  },
  {
    id: 'badge_3',
    iconName: 'Lock',
    title: 'Data Protected',
    description: 'Industry-standard encryption',
    order: 2,
    isActive: true
  },
]

/**
 * CTA Sections - Default Data
 * Used in CTASection component
 */
export const DEFAULT_CTA_SECTIONS = [
  {
    id: 'cta_1',
    quote: 'Join thousands saving money while saving the planet',
    badge: '10,000+ Downloads',
    buttonText: 'Download Now',
    buttonLink: '/#download',
    backgroundStyle: 'gradient' as const,
    order: 0,
    isActive: true,
  },
]

/**
 * App Preview - Default Data
 * Used in AppPreviewSection component
 */
export const DEFAULT_APP_PREVIEW = {
  headline: 'Experience Snapgo',
  subheadline: 'Simple, safe, and eco-friendly cab pooling',
  features: [
    { title: 'Real-time Matching', description: 'Find co-riders instantly' },
    { title: 'Verified Profiles', description: 'Aadhaar KYC for all users' },
    { title: 'Secure Payments', description: 'Split fares seamlessly' },
  ],
  mockupImages: {
    primary: '/images/mockups/home-screen.png',
    secondary: '/images/mockups/matching-screen.png',
  },
  isActive: true,
}

/**
 * Homepage Config - Default Section Visibility & Order
 * Controls which sections appear on homepage and in what order
 */
export const DEFAULT_HOMEPAGE_CONFIG = {
  sections: [
    { componentName: 'hero', label: 'Hero Section', visible: true, order: 1 },
    { componentName: 'trustBadges', label: 'Trust Badges', visible: true, order: 2 },
    { componentName: 'whySnapgo', label: 'Why Snapgo', visible: true, order: 3 },
    { componentName: 'comparison', label: 'Cab Pooling Comparison', visible: true, order: 4 },
    { componentName: 'stats', label: 'Statistics Counter', visible: true, order: 5 },
    { componentName: 'co2Impact', label: 'CO2 Impact Tracker', visible: true, order: 6 },
    { componentName: 'savingsCalc', label: 'Savings Calculator', visible: true, order: 7 },
    { componentName: 'features', label: 'Features Grid', visible: true, order: 8 },
    { componentName: 'howItWorks', label: 'How It Works', visible: true, order: 9 },
    { componentName: 'appPreview', label: 'App Preview', visible: true, order: 10 },
    { componentName: 'download', label: 'Download Section', visible: true, order: 11 },
    { componentName: 'testimonials', label: 'Testimonials', visible: true, order: 12 },
    { componentName: 'instagram', label: 'Instagram Feed', visible: true, order: 13 },
    { componentName: 'cta', label: 'Call to Action', visible: true, order: 14 },
  ],
}
