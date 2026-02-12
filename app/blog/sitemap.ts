import { MetadataRoute } from 'next'
import { getBlogs } from '@/lib/content'
import { getSiteUrl } from '@/lib/utils/url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SITE_URL = getSiteUrl()
  const blogs = await getBlogs()

  // Filter to only published blogs
  const publishedBlogs = blogs.filter(blog =>
    blog.published === true
  )

  return publishedBlogs.map(blog => {
    // Get the most recent date (updatedAt or createdAt)
    let lastModified: Date
    if (blog.updatedAt) {
      lastModified = blog.updatedAt instanceof Date
        ? blog.updatedAt
        : new Date(blog.updatedAt)
    } else if (blog.createdAt) {
      lastModified = blog.createdAt instanceof Date
        ? blog.createdAt
        : new Date(blog.createdAt)
    } else {
      lastModified = new Date()
    }

    return {
      url: `${SITE_URL}/blog/${blog.slug}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  })
}
