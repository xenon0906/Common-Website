import { getFAQs } from '@/lib/content'
import { FAQPageClient } from '@/components/pages/FAQPageClient'

export default async function FAQPage() {
  // Fetch FAQs from Firebase (with static fallbacks)
  const faqs = await getFAQs()

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FAQPageClient faqs={faqs} />
    </>
  )
}
