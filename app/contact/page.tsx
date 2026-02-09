import { getSiteUrl } from '@/lib/utils/url'
import { getSiteConfig, getContactInfo } from '@/lib/content'
import ContactPageClient from './ContactPageClient'

export default async function ContactPage() {
  const SITE_URL = getSiteUrl()
  const [siteConfig, contactInfo] = await Promise.all([
    getSiteConfig(),
    getContactInfo(),
  ])

  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${siteConfig.name}`,
    description: 'Get in touch with Snapgo. Send us a message and we will respond within 24 hours.',
    url: `${SITE_URL}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      url: SITE_URL,
      email: contactInfo.email,
      telephone: contactInfo.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: contactInfo.address,
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: contactInfo.phone,
        email: contactInfo.email,
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi'],
      },
    },
  }

  // JSON-LD is safe structured data from our own database - not user input
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <ContactPageClient
        contactEmail={contactInfo.email}
        contactPhone={contactInfo.phone}
        legalName={siteConfig.legalName}
      />
    </>
  )
}
