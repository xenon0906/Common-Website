import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogPost } from './BlogPost'
import { SITE_CONFIG } from '@/lib/constants'
import { getBlogBySlug, getBlogs, getRelatedPosts } from '@/lib/content'

function toISOStringSafe(date: unknown): string {
  if (!date) return new Date().toISOString()
  if (date instanceof Date) return date.toISOString()
  if (typeof date === 'string') return new Date(date).toISOString()
  if (typeof date === 'object' && date !== null && 'toDate' in date) {
    return (date as { toDate(): Date }).toDate().toISOString()
  }
  return new Date().toISOString()
}

// Generate static params for all blog posts (required for static export)
export async function generateStaticParams() {
  const blogs = await getBlogs()
  return blogs.map((blog) => ({
    slug: blog.slug,
  }))
}

// Static revalidation - 60 seconds for faster updates after admin changes
export const revalidate = 60
export const dynamicParams = true

interface Props {
  params: Promise<{ slug: string }>
}

async function getBlog(slug: string) {
  try {
    const blog = await getBlogBySlug(slug)
    return blog
  } catch (error) {
    console.error('Error fetching blog:', error)
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  const canonicalUrl = `${SITE_CONFIG.url}/blog/${blog.slug}`
  const description = blog.excerpt || `Read ${blog.title} on Snapgo blog`
  const keywords = blog.tags?.join(', ') || undefined

  return {
    title: blog.title,
    description,
    keywords,
    authors: blog.author
      ? [{ name: blog.author.name }]
      : [{ name: SITE_CONFIG.name }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: blog.title,
      description,
      type: 'article',
      url: canonicalUrl,
      publishedTime: toISOStringSafe(blog.createdAt),
      modifiedTime: toISOStringSafe(blog.updatedAt || blog.createdAt),
      authors: blog.author ? [blog.author.name] : [SITE_CONFIG.name],
      section: blog.categoryName,
      tags: blog.tags,
      images: blog.imageUrl
        ? [
            {
              url: blog.imageUrl,
              width: 1200,
              height: 630,
              alt: blog.title,
            },
          ]
        : undefined,
      siteName: SITE_CONFIG.name,
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description,
      images: blog.imageUrl ? [blog.imageUrl] : undefined,
      creator: '@snapgo_india', // Update with actual Twitter handle if different
      site: '@snapgo_india',
    },
    robots: {
      index: blog.published,
      follow: blog.published,
      googleBot: {
        index: blog.published,
        follow: blog.published,
      },
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    notFound()
  }

  // Fetch related posts
  const relatedPosts = await getRelatedPosts(blog.slug, blog.category, 3)

  // Convert to format expected by BlogPost component
  const blogForComponent = {
    ...blog,
    metaDesc: blog.excerpt,
    keywords: null,
  }

  // JSON-LD structured data for the article
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.imageUrl,
    datePublished: toISOStringSafe(blog.createdAt),
    dateModified: toISOStringSafe(blog.updatedAt),
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/images/logo/Snapgo%20Logo%20White.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/blog/${blog.slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        // Escape angle brackets to prevent XSS via </script> injection in JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <BlogPost blog={blogForComponent} relatedPosts={relatedPosts} />
    </>
  )
}
