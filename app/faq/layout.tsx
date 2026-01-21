import { generatePageMetadata, PAGE_SEO } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: PAGE_SEO.faq.title,
  description: PAGE_SEO.faq.description,
  path: PAGE_SEO.faq.path,
  keywords: PAGE_SEO.faq.keywords,
})

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
