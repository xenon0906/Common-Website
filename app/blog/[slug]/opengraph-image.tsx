import { ImageResponse } from 'next/og'
import { getBlogBySlug } from '@/lib/content'

export const runtime = 'nodejs'
export const alt = 'Snapgo Blog'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  const title = blog?.title || 'Snapgo Blog'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: 60,
          backgroundColor: '#0066B3',
          backgroundImage: 'linear-gradient(135deg, #0066B3 0%, #1a1a2e 100%)',
        }}
      >
        <div
          style={{
            padding: '8px 20px',
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.8)',
            fontSize: 18,
            marginBottom: 20,
          }}
        >
          Snapgo Blog
        </div>
        <h1
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: 'white',
            margin: 0,
            lineHeight: 1.2,
            maxWidth: '80%',
          }}
        >
          {title}
        </h1>
      </div>
    ),
    { ...size }
  )
}
