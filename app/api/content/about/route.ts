import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'
import { revalidateTag } from 'next/cache'

const DEFAULT_ABOUT = {
  origin: { id: 'default-origin', key: 'origin', title: 'Our Origin', content: "It was a regular day when we, Mohit and Surya Purohit, were heading to Ghaziabad Railway Station from our society. We booked a cab and noticed another person also taking a cab from our area. When we reached the station, we saw the same person at the parking lot. That's when it hit us - we both paid Rs.300 separately for the same route. If we had known we were going to the same place, we could have shared the ride and paid just Rs.300 total, saving Rs.300 together!", order: 1 },
  spark: { id: 'default-spark', key: 'spark', title: 'The Spark', content: "This simple observation sparked an idea: What if there was an app that could connect people traveling to the same destination? And that's how Snapgo was born - from a personal experience that we knew thousands of others faced every day.", order: 2 },
  mission: { id: 'default-mission', key: 'mission', title: 'Our Mission', content: 'To make travel affordable and accessible for everyone by connecting people who share similar routes, reducing costs and environmental impact.', order: 3 },
  vision: { id: 'default-vision', key: 'vision', title: 'Our Vision', content: "To become India's most trusted ride-sharing platform, creating a community where safety, affordability, and sustainability go hand in hand.", order: 4 },
  values: { id: 'default-values', key: 'values', title: 'Our Values', content: 'Safety first, user-centric design, transparency, sustainability, and creating value for our community at every step.', order: 5 },
}

// GET - Fetch about content
export async function GET() {
  try {
    const content = await prisma.aboutContent.findMany({
      orderBy: { order: 'asc' },
    })

    if (content.length === 0) {
      return NextResponse.json(DEFAULT_ABOUT)
    }

    const result = content.reduce((acc, item) => {
      acc[item.key] = item
      return acc
    }, {} as Record<string, typeof content[0]>)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching about content:', error)
    return NextResponse.json(DEFAULT_ABOUT)
  }
}

// PUT - Update about content
export async function PUT(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { key, title, content, order } = body

    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      )
    }

    const aboutContent = await prisma.aboutContent.upsert({
      where: { key },
      update: {
        title: title || null,
        content,
        order: order || 0,
      },
      create: {
        key,
        title: title || null,
        content,
        order: order || 0,
      },
    })

    revalidateTag('about')
    return NextResponse.json(aboutContent)
  } catch (error) {
    console.error('Error updating about content:', error)
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    )
  }
}

// POST - Bulk update about content
export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()

    // Body should be an object with keys: origin, spark, mission, vision, values
    const results = []
    for (const [key, value] of Object.entries(body)) {
      const data = value as { title?: string; content: string; order?: number }
      const aboutContent = await prisma.aboutContent.upsert({
        where: { key },
        update: {
          title: data.title || null,
          content: data.content,
          order: data.order || 0,
        },
        create: {
          key,
          title: data.title || null,
          content: data.content,
          order: data.order || 0,
        },
      })
      results.push(aboutContent)
    }

    revalidateTag('about')
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error updating about content:', error)
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    )
  }
}
