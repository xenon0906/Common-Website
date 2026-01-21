import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Seed data from existing constants
const heroContent = {
  headline: 'Share Rides. Save More.',
  subtext: 'Connect with verified co-riders heading your way. Save up to 75% on your daily commute while reducing your carbon footprint.',
  badge: "India's #1 Ride-Sharing Platform",
  ctaPrimary: 'Download Free',
  ctaSecondary: 'See How It Works',
  isActive: true,
}

const stats = [
  { label: 'App Downloads', value: 7000, prefix: '', suffix: '+', icon: 'Download', order: 1, isActive: true },
  { label: 'Peak Daily Rides', value: 110, prefix: '', suffix: '+', icon: 'Car', order: 2, isActive: true },
  { label: 'Cost Savings', value: 75, prefix: '', suffix: '%', icon: 'Wallet', order: 3, isActive: true },
  { label: 'Active Users', value: 400, prefix: '', suffix: '+', icon: 'Users', order: 4, isActive: true },
]

const features = [
  { title: 'Save Up to 75%', description: 'Share cab fares and save significant money on your daily commute', icon: 'Wallet', order: 1, isActive: true },
  { title: 'Aadhaar Verified', description: 'All users verified via Aadhaar KYC powered by DigiLocker', icon: 'ShieldCheck', order: 2, isActive: true },
  { title: 'Female-Only Option', description: 'Women can connect only with verified female riders for added safety', icon: 'Users', order: 3, isActive: true },
  { title: 'Real-time & Scheduled', description: 'Find rides instantly or plan ahead for your convenience', icon: 'Clock', order: 4, isActive: true },
  { title: 'Eco-Friendly', description: 'Reduce carbon footprint by sharing rides with fellow travelers', icon: 'Leaf', order: 5, isActive: true },
  { title: 'Smart Matching', description: 'Advanced algorithm matches within 750m radius for perfect routes', icon: 'MapPin', order: 6, isActive: true },
]

const howItWorksSteps = [
  { step: 1, title: 'Enter Your Destination', description: 'Set your pickup and drop location in the app', icon: 'MapPin', order: 1, isActive: true },
  { step: 2, title: 'Find Your Match', description: 'Our algorithm finds people going to the same destination within 750m', icon: 'Search', order: 2, isActive: true },
  { step: 3, title: 'Share & Save', description: 'Connect, chat, meet at a common point, share the fare, and save money', icon: 'Users', order: 3, isActive: true },
]

const testimonials = [
  { quote: 'Snapgo has saved me so much money! I used to spend Rs.400 for my daily commute, now I only pay Rs.100 by sharing with fellow students. Amazing concept!', author: 'Priya S.', role: 'College Student', location: 'Sharda University', avatarUrl: null, rating: 5, order: 1, isActive: true },
  { quote: 'As a working professional, Snapgo has made my daily travel both affordable and social. I have made great connections with fellow commuters.', author: 'Rahul K.', role: 'IT Professional', location: 'Greater Noida', avatarUrl: null, rating: 5, order: 2, isActive: true },
  { quote: 'The female-only option makes me feel safe. I can now travel without worrying about security while saving money.', author: 'Ananya M.', role: 'Graduate Student', location: 'Delhi NCR', avatarUrl: null, rating: 5, order: 3, isActive: true },
]

const aboutContent = [
  { key: 'origin', title: 'Our Origin', content: "It was a regular day when we, Mohit and Surya Purohit, were heading to Ghaziabad Railway Station from our society. We booked a cab and noticed another person also taking a cab from our area. When we reached the station, we saw the same person at the parking lot. That's when it hit us - we both paid Rs.300 separately for the same route. If we had known we were going to the same place, we could have shared the ride and paid just Rs.300 total, saving Rs.300 together!", order: 1 },
  { key: 'spark', title: 'The Spark', content: "This simple observation sparked an idea: What if there was an app that could connect people traveling to the same destination? And that's how Snapgo was born - from a personal experience that we knew thousands of others faced every day.", order: 2 },
  { key: 'mission', title: 'Our Mission', content: 'To make travel affordable and accessible for everyone by connecting people who share similar routes, reducing costs and environmental impact.', order: 3 },
  { key: 'vision', title: 'Our Vision', content: "To become India's most trusted ride-sharing platform, creating a community where safety, affordability, and sustainability go hand in hand.", order: 4 },
  { key: 'values', title: 'Our Values', content: 'Safety first, user-centric design, transparency, sustainability, and creating value for our community at every step.', order: 5 },
]

const appStoreLinks = [
  { platform: 'android', url: 'https://play.google.com/store/apps/details?id=in.snapgo.app&hl=en_IN', isLive: true, qrCodeUrl: '/images/qr code/playstore-qr.png' },
  { platform: 'ios', url: 'https://apps.apple.com/in/app/snapgo-connect-split-fare/id6748761741', isLive: true, qrCodeUrl: '/images/qr code/appstore-qr.png' },
]

const socialLinks = [
  { platform: 'facebook', url: 'https://www.facebook.com/profile.php?id=61578285621863', isActive: true, order: 1 },
  { platform: 'instagram', url: 'https://www.instagram.com/snapgo.co.in/', isActive: true, order: 2 },
  { platform: 'linkedin', url: 'https://www.linkedin.com/company/snapgo-service-private-limited/', isActive: true, order: 3 },
]

const contactInfo = [
  { key: 'email', value: 'info@snapgo.co.in', label: 'Email' },
  { key: 'phone', value: '+91 6398786105', label: 'Phone' },
  { key: 'address', value: 'Block 45, Sharda University, Knowledge Park 3, Greater Noida, Uttar Pradesh, India', label: 'Address' },
]

async function main() {
  console.log('Starting content seed...')

  // Seed Hero Content
  console.log('Seeding hero content...')
  const existingHero = await prisma.heroContent.findFirst()
  if (!existingHero) {
    await prisma.heroContent.create({ data: heroContent })
    console.log('  Created hero content')
  } else {
    console.log('  Hero content already exists, skipping')
  }

  // Seed Statistics
  console.log('Seeding statistics...')
  const existingStats = await prisma.statistic.count()
  if (existingStats === 0) {
    for (const stat of stats) {
      await prisma.statistic.create({ data: stat })
    }
    console.log(`  Created ${stats.length} statistics`)
  } else {
    console.log('  Statistics already exist, skipping')
  }

  // Seed Features
  console.log('Seeding features...')
  const existingFeatures = await prisma.feature.count()
  if (existingFeatures === 0) {
    for (const feature of features) {
      await prisma.feature.create({ data: feature })
    }
    console.log(`  Created ${features.length} features`)
  } else {
    console.log('  Features already exist, skipping')
  }

  // Seed How It Works Steps
  console.log('Seeding how it works steps...')
  const existingSteps = await prisma.howItWorksStep.count()
  if (existingSteps === 0) {
    for (const step of howItWorksSteps) {
      await prisma.howItWorksStep.create({ data: step })
    }
    console.log(`  Created ${howItWorksSteps.length} steps`)
  } else {
    console.log('  How it works steps already exist, skipping')
  }

  // Seed Testimonials
  console.log('Seeding testimonials...')
  const existingTestimonials = await prisma.testimonial.count()
  if (existingTestimonials === 0) {
    for (const testimonial of testimonials) {
      await prisma.testimonial.create({ data: testimonial })
    }
    console.log(`  Created ${testimonials.length} testimonials`)
  } else {
    console.log('  Testimonials already exist, skipping')
  }

  // Seed About Content
  console.log('Seeding about content...')
  const existingAbout = await prisma.aboutContent.count()
  if (existingAbout === 0) {
    for (const about of aboutContent) {
      await prisma.aboutContent.create({ data: about })
    }
    console.log(`  Created ${aboutContent.length} about sections`)
  } else {
    console.log('  About content already exists, skipping')
  }

  // Seed App Store Links
  console.log('Seeding app store links...')
  const existingApps = await prisma.appStoreLink.count()
  if (existingApps === 0) {
    for (const link of appStoreLinks) {
      await prisma.appStoreLink.create({ data: link })
    }
    console.log(`  Created ${appStoreLinks.length} app store links`)
  } else {
    console.log('  App store links already exist, skipping')
  }

  // Seed Social Links
  console.log('Seeding social links...')
  const existingSocial = await prisma.socialLink.count()
  if (existingSocial === 0) {
    for (const link of socialLinks) {
      await prisma.socialLink.create({ data: link })
    }
    console.log(`  Created ${socialLinks.length} social links`)
  } else {
    console.log('  Social links already exist, skipping')
  }

  // Seed Contact Info
  console.log('Seeding contact info...')
  const existingContact = await prisma.contactInfo.count()
  if (existingContact === 0) {
    for (const info of contactInfo) {
      await prisma.contactInfo.create({ data: info })
    }
    console.log(`  Created ${contactInfo.length} contact info entries`)
  } else {
    console.log('  Contact info already exists, skipping')
  }

  console.log('\nContent seed completed!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
