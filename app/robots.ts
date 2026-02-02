import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/utils/url'

const SITE_URL = getSiteUrl()

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/'],
        crawlDelay: 1,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
