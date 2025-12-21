import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'
import { revalidateTag } from 'next/cache'

const DEFAULT_SOCIAL = {
  facebook: 'https://www.facebook.com/profile.php?id=61578285621863',
  instagram: 'https://www.instagram.com/snapgo.co.in/',
  linkedin: 'https://www.linkedin.com/company/snapgo-service-private-limited/',
}

// GET - Fetch social links
export async function GET() {
  try {
    const links = await prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })

    if (links.length === 0) {
      return NextResponse.json(DEFAULT_SOCIAL)
    }

    const result = links.reduce((acc, link) => {
      acc[link.platform] = link.url
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching social links:', error)
    return NextResponse.json(DEFAULT_SOCIAL)
  }
}

// PUT - Update social link
export async function PUT(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { platform, url, isActive, order } = body

    if (!platform || !url) {
      return NextResponse.json(
        { error: 'Platform and URL are required' },
        { status: 400 }
      )
    }

    const link = await prisma.socialLink.upsert({
      where: { platform },
      update: {
        url,
        isActive: isActive ?? true,
        order: order || 0,
      },
      create: {
        platform,
        url,
        isActive: isActive ?? true,
        order: order || 0,
      },
    })

    revalidateTag('social')
    return NextResponse.json(link)
  } catch (error) {
    console.error('Error updating social link:', error)
    return NextResponse.json(
      { error: 'Failed to update social link' },
      { status: 500 }
    )
  }
}

// POST - Bulk update social links
export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const results = []
    let orderIndex = 0

    for (const [platform, url] of Object.entries(body)) {
      const link = await prisma.socialLink.upsert({
        where: { platform },
        update: {
          url: url as string,
          order: orderIndex,
        },
        create: {
          platform,
          url: url as string,
          isActive: true,
          order: orderIndex,
        },
      })
      results.push(link)
      orderIndex++
    }

    revalidateTag('social')
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error updating social links:', error)
    return NextResponse.json(
      { error: 'Failed to update social links' },
      { status: 500 }
    )
  }
}

// DELETE - Delete social link
export async function DELETE(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform is required' },
        { status: 400 }
      )
    }

    await prisma.socialLink.delete({
      where: { platform },
    })

    revalidateTag('social')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting social link:', error)
    return NextResponse.json(
      { error: 'Failed to delete social link' },
      { status: 500 }
    )
  }
}
