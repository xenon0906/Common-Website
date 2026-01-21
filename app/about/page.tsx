import { getAboutContent, getTeamMembers, getSiteConfig } from '@/lib/content'
import { AboutPageClient } from '@/components/pages/AboutPageClient'

export default async function AboutPage() {
  // Fetch about content and team from Firebase (with static fallbacks)
  const [about, team, siteConfig] = await Promise.all([
    getAboutContent(),
    getTeamMembers(),
    getSiteConfig(),
  ])

  return (
    <AboutPageClient
      about={about}
      team={team}
      siteConfig={siteConfig}
    />
  )
}
