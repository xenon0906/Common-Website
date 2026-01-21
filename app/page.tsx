import { getAllHomeContent } from '@/lib/content'
import { HomePageClient } from '@/components/home/HomePageClient'

// Server component that fetches data and passes to client
export default async function HomePage() {
  // Fetch all content from Firebase (with static fallbacks)
  const { hero, stats, features, howItWorks, testimonials, appLinks, images } = await getAllHomeContent()

  return (
    <HomePageClient
      hero={hero}
      stats={stats}
      features={features}
      howItWorks={howItWorks}
      testimonials={testimonials}
      appLinks={appLinks}
      images={images}
    />
  )
}
