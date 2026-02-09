import { NextRequest, NextResponse } from 'next/server'
import { uploadFile, FileCategory, validateUpload, formatFileSize, UPLOAD_CONFIG } from '@/lib/upload'
import { requireAuth } from '@/lib/api-auth'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, 'upload', { maxRequests: 20, windowMs: 10 * 60 * 1000 })
  if (rateLimited) return rateLimited

  const authError = await requireAuth()
  if (authError) return authError

  try {

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const category = formData.get('category') as FileCategory | null

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!category) {
      return NextResponse.json(
        { error: 'No category provided' },
        { status: 400 }
      )
    }

    // Validate category
    const validCategories: FileCategory[] = ['blog', 'team', 'achievements', 'logo', 'general']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate file before upload
    const validation = validateUpload(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Upload the file
    const result = await uploadFile(file, { category })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: result.publicUrl,
      filename: result.filename,
      size: formatFileSize(file.size),
      type: file.type
    })
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Return upload configuration
export async function GET() {
  return NextResponse.json({
    maxImageSize: UPLOAD_CONFIG.maxImageSize,
    maxDocumentSize: UPLOAD_CONFIG.maxDocumentSize,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedDocumentTypes: ['application/pdf'],
    categories: ['blog', 'team', 'achievements', 'logo', 'general']
  })
}
