import { generatePageMetadata, PAGE_SEO } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: PAGE_SEO.features.title,
  description: PAGE_SEO.features.description,
  path: PAGE_SEO.features.path,
  keywords: PAGE_SEO.features.keywords,
})

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
