import { generatePageMetadata, PAGE_SEO } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: PAGE_SEO.howItWorks.title,
  description: PAGE_SEO.howItWorks.description,
  path: PAGE_SEO.howItWorks.path,
  keywords: PAGE_SEO.howItWorks.keywords,
})

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
