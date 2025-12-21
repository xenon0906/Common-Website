import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'
import { revalidateTag } from 'next/cache'

// GET - Fetch active hero content
export async function GET() {
  try {
    const hero = await prisma.heroContent.findFirst({
      where: { isActive: true },
    })

    if (!hero) {
      return NextResponse.json({
        id: 'default',
        headline: 'Share Rides. Save More.',
        subtext: 'Connect with verified co-riders heading your way. Save up to 75% on your daily commute while reducing your carbon footprint.',
        badge: "India's #1 Ride-Sharing Platform",
        ctaPrimary: 'Download Free',
        ctaSecondary: 'See How It Works',
        isActive: true,
      })
    }

    return NextResponse.json(hero)
  } catch (error) {
    console.error('Error fetching hero content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero content' },
      { status: 500 }
    )
  }
}

// PUT - Update hero content
export async function PUT(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { id, headline, subtext, badge, ctaPrimary, ctaSecondary, isActive } = body

    let hero
    if (id && id !== 'default') {
      // Update existing
      hero = await prisma.heroContent.update({
        where: { id },
        data: {
          headline,
          subtext,
          badge: badge || null,
          ctaPrimary: ctaPrimary || null,
          ctaSecondary: ctaSecondary || null,
          isActive: isActive ?? true,
        },
      })
    } else {
      // Create new (deactivate all others first)
      await prisma.heroContent.updateMany({
        data: { isActive: false },
      })
      hero = await prisma.heroContent.create({
        data: {
          headline,
          subtext,
          badge: badge || null,
          ctaPrimary: ctaPrimary || null,
          ctaSecondary: ctaSecondary || null,
          isActive: true,
        },
      })
    }

    revalidateTag('hero')
    return NextResponse.json(hero)
  } catch (error) {
    console.error('Error updating hero content:', error)
    return NextResponse.json(
      { error: 'Failed to update hero content' },
      { status: 500 }
    )
  }
}
