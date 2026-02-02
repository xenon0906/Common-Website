import { getSiteUrl } from '@/lib/utils/url'
import { SITE_CONFIG } from '@/lib/constants'
import ContactPageClient from './ContactPageClient'

export default function ContactPage() {
  const SITE_URL = getSiteUrl()

  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${SITE_CONFIG.name}`,
    description: 'Get in touch with Snapgo. Send us a message and we will respond within 24 hours.',
    url: `${SITE_URL}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      legalName: SITE_CONFIG.legalName,
      url: SITE_URL,
      email: SITE_CONFIG.email,
      telephone: SITE_CONFIG.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE_CONFIG.address,
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: SITE_CONFIG.phone,
        email: SITE_CONFIG.email,
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi'],
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <ContactPageClient />
    </>
  )
}
