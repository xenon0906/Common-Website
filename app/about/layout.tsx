import { generatePageMetadata, PAGE_SEO, generatePageJsonLd } from '@/lib/seo'

export const metadata = generatePageMetadata({
  title: PAGE_SEO.about.title,
  description: PAGE_SEO.about.description,
  path: PAGE_SEO.about.path,
  keywords: PAGE_SEO.about.keywords,
})

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = generatePageJsonLd('about')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
