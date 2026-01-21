import { generatePageMetadata, PAGE_SEO } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: PAGE_SEO.contact.title,
  description: PAGE_SEO.contact.description,
  path: PAGE_SEO.contact.path,
  keywords: PAGE_SEO.contact.keywords,
})

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
