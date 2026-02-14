import { getAdminStorage } from './firebase-admin'

/**
 * Server-side upload to Firebase Storage using Admin SDK
 * Bypasses client-side authentication requirements
 *
 * @param fileBuffer - File content as Buffer
 * @param filename - Original filename
 * @param category - Storage category (blog, team, general, etc.)
 * @param contentType - MIME type of the file
 * @returns Object with public URL, filename, and storage path
 */
export async function uploadToStorageAdmin(
  fileBuffer: Buffer,
  filename: string,
  category: string = 'general',
  contentType: string
): Promise<{ url: string; filename: string; path: string }> {
  const storage = getAdminStorage()

  if (!storage) {
    throw new Error(
      'Firebase Admin Storage not initialized. ' +
      'Ensure FIREBASE_SERVICE_ACCOUNT_KEY is configured in .env.local. ' +
      'Run: npm run setup:service-account for instructions.'
    )
  }

  const bucket = storage.bucket()

  // Generate unique filename to prevent collisions
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  const nameParts = sanitized.split('.')
  const extension = nameParts.pop()
  const basename = nameParts.join('.')
  const uniqueFilename = `${basename}-${timestamp}-${random}.${extension}`

  // Storage path: category/filename
  const storagePath = `${category}/${uniqueFilename}`
  const file = bucket.file(storagePath)

  // Upload file with metadata
  await file.save(fileBuffer, {
    metadata: {
      contentType,
      metadata: {
        uploadedAt: new Date().toISOString(),
        category,
        originalFilename: filename,
        firebaseStorageDownloadTokens: undefined // No tokens needed for public files
      }
    },
    public: true, // Make file publicly readable
    validation: 'md5' // Verify upload integrity
  })

  // Make file publicly readable (double-check)
  await file.makePublic()

  // Get public URL
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`

  console.log(`[firebase-admin-storage] ✅ Uploaded: ${storagePath}`)

  return {
    url: publicUrl,
    filename: uniqueFilename,
    path: storagePath
  }
}

/**
 * Delete file from Firebase Storage using Admin SDK
 *
 * @param path - Storage path (e.g., "blog/image-123.jpg")
 */
export async function deleteFromStorageAdmin(path: string): Promise<void> {
  const storage = getAdminStorage()

  if (!storage) {
    throw new Error(
      'Firebase Admin Storage not initialized. ' +
      'Ensure FIREBASE_SERVICE_ACCOUNT_KEY is configured in .env.local.'
    )
  }

  const bucket = storage.bucket()
  const file = bucket.file(path)

  try {
    await file.delete()
    console.log(`[firebase-admin-storage] ✅ Deleted: ${path}`)
  } catch (error: any) {
    if (error.code === 404) {
      console.warn(`[firebase-admin-storage] ⚠️  File not found: ${path}`)
      return // File already deleted, not an error
    }
    throw error
  }
}

/**
 * List all files in a category
 *
 * @param category - Optional category filter (e.g., "blog", "team")
 * @returns Array of file metadata
 */
export async function listFilesAdmin(category?: string): Promise<Array<{
  name: string
  size: number
  contentType: string
  created: string
  updated: string
  publicUrl: string
}>> {
  const storage = getAdminStorage()

  if (!storage) {
    throw new Error(
      'Firebase Admin Storage not initialized. ' +
      'Ensure FIREBASE_SERVICE_ACCOUNT_KEY is configured in .env.local.'
    )
  }

  const bucket = storage.bucket()

  const [files] = await bucket.getFiles({
    prefix: category ? `${category}/` : undefined
  })

  return files.map(file => ({
    name: file.name,
    size: parseInt(file.metadata.size || '0'),
    contentType: file.metadata.contentType || 'application/octet-stream',
    created: file.metadata.timeCreated || '',
    updated: file.metadata.updated || '',
    publicUrl: `https://storage.googleapis.com/${bucket.name}/${file.name}`
  }))
}

/**
 * Check if a file exists in storage
 *
 * @param path - Storage path (e.g., "blog/image-123.jpg")
 * @returns true if file exists, false otherwise
 */
export async function fileExistsAdmin(path: string): Promise<boolean> {
  const storage = getAdminStorage()

  if (!storage) {
    return false
  }

  const bucket = storage.bucket()
  const file = bucket.file(path)

  try {
    const [exists] = await file.exists()
    return exists
  } catch (error) {
    return false
  }
}
