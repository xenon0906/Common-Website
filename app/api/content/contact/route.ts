import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'
import { revalidateTag } from 'next/cache'

const DEFAULT_CONTACT = {
  email: 'info@snapgo.co.in',
  phone: '+91 6398786105',
  address: 'Block 45, Sharda University, Knowledge Park 3, Greater Noida, Uttar Pradesh, India',
}

// GET - Fetch contact info
export async function GET() {
  try {
    const info = await prisma.contactInfo.findMany()

    if (info.length === 0) {
      return NextResponse.json(DEFAULT_CONTACT)
    }

    const result = info.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching contact info:', error)
    return NextResponse.json(DEFAULT_CONTACT)
  }
}

// PUT - Update contact info
export async function PUT(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const { key, value, label } = body

    if (!key || !value) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      )
    }

    const contactInfo = await prisma.contactInfo.upsert({
      where: { key },
      update: {
        value,
        label: label || null,
      },
      create: {
        key,
        value,
        label: label || null,
      },
    })

    revalidateTag('contact')
    return NextResponse.json(contactInfo)
  } catch (error) {
    console.error('Error updating contact info:', error)
    return NextResponse.json(
      { error: 'Failed to update contact info' },
      { status: 500 }
    )
  }
}

// POST - Bulk update contact info
export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const results = []

    for (const [key, value] of Object.entries(body)) {
      const contactInfo = await prisma.contactInfo.upsert({
        where: { key },
        update: {
          value: value as string,
        },
        create: {
          key,
          value: value as string,
        },
      })
      results.push(contactInfo)
    }

    revalidateTag('contact')
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error updating contact info:', error)
    return NextResponse.json(
      { error: 'Failed to update contact info' },
      { status: 500 }
    )
  }
}
