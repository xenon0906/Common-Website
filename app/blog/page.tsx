import { Metadata } from 'next'
import { getBlogs } from '@/lib/content'
import { getSiteUrl } from '@/lib/utils/url'
import { BlogList } from './BlogList'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest articles about ride-sharing, saving money on commute, and sustainable travel tips from snapgo.',
}

// Revalidate every 60 seconds for faster updates
export const revalidate = 60

export default async function BlogPage() {
  const blogs = await getBlogs()
  const SITE_URL = getSiteUrl()

  // Transform to match BlogList expected format
  const formattedBlogs = blogs.map(blog => ({
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    imageUrl: blog.imageUrl || null,
    createdAt: blog.createdAt,
  }))

  const blogCollectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Snapgo Blog',
    description: 'Read the latest articles about ride-sharing, saving money on commute, and sustainable travel tips from Snapgo.',
    url: `${SITE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'Snapgo',
      url: SITE_URL,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: formattedBlogs.map((blog, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/blog/${blog.slug}`,
        name: blog.title,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogCollectionJsonLd) }}
      />
      <BlogList blogs={formattedBlogs} />
    </>
  )
}
