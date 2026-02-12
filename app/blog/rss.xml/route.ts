import { NextResponse } from 'next/server'
import { getBlogs } from '@/lib/content'
import { getSiteUrl } from '@/lib/utils/url'

// XML escape helper
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toISOString(date: Date | string | undefined): string {
  if (!date) return new Date().toISOString()
  const d = date instanceof Date ? date : new Date(date)
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

export async function GET() {
  const SITE_URL = getSiteUrl()
  const blogs = await getBlogs()

  // Filter to only published blogs and sort by date (newest first)
  const publishedBlogs = blogs
    .filter(blog => blog.published === true)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })

  const lastBuildDate = publishedBlogs.length > 0
    ? toISOString(publishedBlogs[0].createdAt)
    : new Date().toISOString()

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml('Snapgo Blog')}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml('Tips, stories, and insights about ride-sharing, saving money, and sustainable travel.')}</description>
    <language>en-IN</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/images/logo/Snapgo%20Logo%20White.png</url>
      <title>${escapeXml('Snapgo')}</title>
      <link>${SITE_URL}</link>
    </image>
${publishedBlogs.map(blog => `    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${SITE_URL}/blog/${blog.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${blog.slug}</guid>
      <description>${escapeXml(blog.excerpt || '')}</description>
      <pubDate>${toISOString(blog.createdAt)}</pubDate>
      ${blog.author ? `<dc:creator>${escapeXml(blog.author.name)}</dc:creator>` : ''}
      ${blog.categoryName ? `<category>${escapeXml(blog.categoryName)}</category>` : ''}
      ${blog.imageUrl ? `<enclosure url="${blog.imageUrl}" type="image/jpeg"/>` : ''}
    </item>`).join('\n')}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
