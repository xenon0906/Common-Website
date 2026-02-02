import { getAboutContent, getTeamMembers, getSiteConfig } from '@/lib/content'
import { getSiteUrl } from '@/lib/utils/url'
import { AboutPageClient } from '@/components/pages/AboutPageClient'

export default async function AboutPage() {
  // Fetch about content and team from Firebase (with static fallbacks)
  const [about, team, siteConfig] = await Promise.all([
    getAboutContent(),
    getTeamMembers(),
    getSiteConfig(),
  ])

  const SITE_URL = getSiteUrl()

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${siteConfig.name}`,
    description: about.mission?.content || siteConfig.description,
    url: `${SITE_URL}/about`,
    mainEntity: {
      '@type': 'Organization',
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      url: SITE_URL,
      description: siteConfig.description,
      email: siteConfig.email,
      telephone: siteConfig.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.address,
        addressCountry: 'IN',
      },
      founders: siteConfig.founders.map(name => ({
        '@type': 'Person',
        name,
      })),
      sameAs: [
        siteConfig.social.facebook,
        siteConfig.social.instagram,
        siteConfig.social.linkedin,
      ].filter(Boolean),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <AboutPageClient
        about={about}
        team={team}
        siteConfig={siteConfig}
      />
    </>
  )
}
