import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'
import { revalidateTag } from 'next/cache'

const DEFAULT_APPS = {
  android: { url: 'https://play.google.com/store/apps/details?id=com.snapgo.app', isLive: true, qrCodeUrl: '/images/qr code/playstore-qr.png' },
  ios: { url: 'https://apps.apple.com/app/snapgo/id6739696498', isLive: true, qrCodeUrl: '/images/qr code/appstore-qr.png' },
}

// GET - Fetch app store links
export async function GET() {
  try {
    const links = await prisma.appStoreLink.findMany()

    if (links.length === 0) {
      return NextResponse.json(DEFAULT_APPS)
    }

    const result = links.reduce((acc, link) => {
      acc[link.platform] = {
        url: link.url,
        isLive: link.isLive,
        qrCodeUrl: link.qrCodeUrl,
      }
      return acc
    }, {} as Record<string, { url: string; isLive: boolean; qrCodeUrl: string | null }>)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching app store links:', error)
    return NextResponse.json(DEFAULT_APPS)
  }
}

// PUT - Update app store links
export async function PUT(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { platform, url, isLive, qrCodeUrl } = body

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform is required' },
        { status: 400 }
      )
    }

    const link = await prisma.appStoreLink.upsert({
      where: { platform },
      update: {
        url,
        isLive: isLive ?? true,
        qrCodeUrl: qrCodeUrl || null,
      },
      create: {
        platform,
        url,
        isLive: isLive ?? true,
        qrCodeUrl: qrCodeUrl || null,
      },
    })

    revalidateTag('apps')
    return NextResponse.json(link)
  } catch (error) {
    console.error('Error updating app store link:', error)
    return NextResponse.json(
      { error: 'Failed to update app store link' },
      { status: 500 }
    )
  }
}

// POST - Bulk update app store links
export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const results = []

    for (const [platform, data] of Object.entries(body)) {
      const linkData = data as { url: string; isLive?: boolean; qrCodeUrl?: string }
      const link = await prisma.appStoreLink.upsert({
        where: { platform },
        update: {
          url: linkData.url,
          isLive: linkData.isLive ?? true,
          qrCodeUrl: linkData.qrCodeUrl || null,
        },
        create: {
          platform,
          url: linkData.url,
          isLive: linkData.isLive ?? true,
          qrCodeUrl: linkData.qrCodeUrl || null,
        },
      })
      results.push(link)
    }

    revalidateTag('apps')
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error updating app store links:', error)
    return NextResponse.json(
      { error: 'Failed to update app store links' },
      { status: 500 }
    )
  }
}
