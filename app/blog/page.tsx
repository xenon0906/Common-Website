import { Metadata } from 'next'
import { getBlogs } from '@/lib/content'
import { BlogList } from './BlogList'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest articles about ride-sharing, saving money on commute, and sustainable travel tips from snapgo.',
}

export default async function BlogPage() {
  const blogs = await getBlogs()

  // Transform to match BlogList expected format
  const formattedBlogs = blogs.map(blog => ({
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    imageUrl: blog.imageUrl,
    createdAt: blog.createdAt,
  }))

  return <BlogList blogs={formattedBlogs} />
}
