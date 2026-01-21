import { generatePageMetadata, PAGE_SEO } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: PAGE_SEO.safety.title,
  description: PAGE_SEO.safety.description,
  path: PAGE_SEO.safety.path,
  keywords: PAGE_SEO.safety.keywords,
})

export default function SafetyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
