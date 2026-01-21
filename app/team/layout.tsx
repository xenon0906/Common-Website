import { generatePageMetadata, PAGE_SEO } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: PAGE_SEO.team.title,
  description: PAGE_SEO.team.description,
  path: PAGE_SEO.team.path,
  keywords: PAGE_SEO.team.keywords,
})

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
