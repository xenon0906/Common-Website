import {
  getAllHomeContent,
  DEFAULT_HERO,
  DEFAULT_STATS,
  DEFAULT_FEATURES,
  DEFAULT_STEPS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_APP_LINKS,
  DEFAULT_IMAGES,
} from '@/lib/content'
import { HomePageClient } from '@/components/home/HomePageClient'

// Server component that fetches data and passes to client
export default async function HomePage() {
  try {
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
  } catch (err) {
    console.error('HomePage: content fetch failed, using defaults', err)
    return (
      <HomePageClient
        hero={DEFAULT_HERO}
        stats={DEFAULT_STATS}
        features={DEFAULT_FEATURES}
        howItWorks={DEFAULT_STEPS}
        testimonials={DEFAULT_TESTIMONIALS}
        appLinks={DEFAULT_APP_LINKS}
        images={DEFAULT_IMAGES}
      />
    )
  }
}
