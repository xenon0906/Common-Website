import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogPost } from './BlogPost'
import { SITE_CONFIG } from '@/lib/constants'
import { getBlogBySlug, getBlogs, DEFAULT_BLOGS } from '@/lib/content'

// Generate static params for all blog posts (required for static export)
export async function generateStaticParams() {
  const blogs = await getBlogs()
  return blogs.map((blog) => ({
    slug: blog.slug,
  }))
}

// Static revalidation
export const revalidate = 3600
export const dynamicParams = false // Don't allow params not in generateStaticParams

interface Props {
  params: { slug: string }
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
  const { slug } = params
  const blog = await getBlog(slug)

  if (!blog) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: blog.title,
    description: blog.excerpt || `Read ${blog.title} on snapgo blog`,
    openGraph: {
      title: blog.title,
      description: blog.excerpt || undefined,
      type: 'article',
      publishedTime: blog.createdAt.toISOString(),
      modifiedTime: blog.updatedAt.toISOString(),
      images: blog.imageUrl ? [{ url: blog.imageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt || undefined,
      images: blog.imageUrl ? [blog.imageUrl] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = params
  const blog = await getBlog(slug)

  if (!blog) {
    notFound()
  }

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
    datePublished: blog.createdAt.toISOString(),
    dateModified: blog.updatedAt.toISOString(),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPost blog={blogForComponent} />
    </>
  )
}
