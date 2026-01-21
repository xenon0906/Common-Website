import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/api-auth'

// GET all media files
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where = category && category !== 'all' ? { category } : {}

    const files = await prisma.mediaFile.findMany({
      where,
      orderBy: { uploadedAt: 'desc' },
    })

    return NextResponse.json(files)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

// POST register new media file (after upload)
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const body = await request.json()
    const { filename, url, category, mimeType, size, alt } = body

    const file = await prisma.mediaFile.create({
      data: {
        filename,
        url,
        category: category || 'general',
        mimeType,
        size: size || 0,
        alt,
      },
    })

    return NextResponse.json(file, { status: 201 })
  } catch (error) {
    console.error('Error registering media:', error)
    return NextResponse.json({ error: 'Failed to register media' }, { status: 500 })
  }
}

// DELETE media file
export async function DELETE(request: NextRequest) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 })
    }

    // Get file info before deleting
    const file = await prisma.mediaFile.findUnique({ where: { id } })

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Delete from database
    await prisma.mediaFile.delete({ where: { id } })

    // Note: In production, you should also delete from cloud storage
    // For Vercel Blob: await del(file.url)
    // For Cloudinary: await cloudinary.uploader.destroy(publicId)
    // For S3: await s3.deleteObject({ Bucket, Key })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
  }
}
