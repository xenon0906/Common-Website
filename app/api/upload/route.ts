import { NextRequest, NextResponse } from 'next/server'
import { FileCategory, validateUpload, formatFileSize, UPLOAD_CONFIG } from '@/lib/upload'
import { uploadToStorageAdmin } from '@/lib/firebase-admin-storage'
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

    // Convert File to Buffer for Admin SDK
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Firebase Storage using Admin SDK (server-side)
    // This bypasses client-side authentication requirements
    const { url, filename, path } = await uploadToStorageAdmin(
      buffer,
      file.name,
      category,
      file.type
    )

    console.log(`[upload-api] ✅ Uploaded successfully: ${path}`)

    return NextResponse.json({
      success: true,
      url,
      filename,
      path,
      size: formatFileSize(file.size),
      type: file.type
    })
  } catch (error: any) {
    console.error('[upload-api] ❌ Upload error:', error)

    // Provide helpful error messages
    if (error.message?.includes('FIREBASE_SERVICE_ACCOUNT_KEY')) {
      return NextResponse.json(
        {
          error: 'Server configuration error: Firebase Admin SDK not configured',
          details: 'Contact administrator to set up Firebase service account key'
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Upload failed' },
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
