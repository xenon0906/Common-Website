import { generatePageMetadata, PAGE_SEO } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: PAGE_SEO.blog.title,
  description: PAGE_SEO.blog.description,
  path: PAGE_SEO.blog.path,
  keywords: PAGE_SEO.blog.keywords,
})

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
