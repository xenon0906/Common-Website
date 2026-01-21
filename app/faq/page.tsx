import { getFAQs } from '@/lib/content'
import { FAQPageClient } from '@/components/pages/FAQPageClient'

export default async function FAQPage() {
  // Fetch FAQs from Firebase (with static fallbacks)
  const faqs = await getFAQs()

  return <FAQPageClient faqs={faqs} />
}
