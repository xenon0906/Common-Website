import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

// Allowed file types and their MIME types
export const ALLOWED_IMAGE_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
} as const

export const ALLOWED_DOCUMENT_TYPES = {
  'application/pdf': '.pdf',
} as const

export type AllowedMimeType = keyof typeof ALLOWED_IMAGE_TYPES | keyof typeof ALLOWED_DOCUMENT_TYPES

// Upload configuration
export const UPLOAD_CONFIG = {
  maxImageSize: 5 * 1024 * 1024, // 5MB
  maxDocumentSize: 10 * 1024 * 1024, // 10MB
  uploadDir: 'public/uploads',
  publicPath: '/uploads',
}

// File categories for organization
export type FileCategory = 'blog' | 'team' | 'achievements' | 'logo' | 'general'

interface UploadResult {
  success: boolean
  path?: string
  publicUrl?: string
  error?: string
  filename?: string
}

interface UploadOptions {
  category: FileCategory
  filename?: string // Optional custom filename
  generateUnique?: boolean // Generate unique filename (default: true)
}

/**
 * Validates file type against allowed types
 */
export function validateFileType(
  mimeType: string,
  allowedTypes: Record<string, string>
): boolean {
  return Object.keys(allowedTypes).includes(mimeType)
}

/**
 * Validates file size
 */
export function validateFileSize(size: number, maxSize: number): boolean {
  return size <= maxSize
}

/**
 * Generates a unique filename
 */
export function generateUniqueFilename(originalName: string, mimeType: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = ALLOWED_IMAGE_TYPES[mimeType as keyof typeof ALLOWED_IMAGE_TYPES] ||
                    ALLOWED_DOCUMENT_TYPES[mimeType as keyof typeof ALLOWED_DOCUMENT_TYPES] ||
                    path.extname(originalName)

  // Sanitize original name for use in filename
  const sanitizedName = originalName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace special chars
    .substring(0, 30) // Limit length
    .toLowerCase()

  return `${sanitizedName}-${timestamp}-${random}${extension}`
}

/**
 * Ensures the upload directory exists
 */
export async function ensureUploadDir(category: FileCategory): Promise<string> {
  const uploadPath = path.join(process.cwd(), UPLOAD_CONFIG.uploadDir, category)

  if (!existsSync(uploadPath)) {
    await mkdir(uploadPath, { recursive: true })
  }

  return uploadPath
}

/**
 * Uploads a file to the server
 */
export async function uploadFile(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  const { category, filename, generateUnique = true } = options

  try {
    // Validate file type
    const isImage = validateFileType(file.type, ALLOWED_IMAGE_TYPES)
    const isDocument = validateFileType(file.type, ALLOWED_DOCUMENT_TYPES)

    if (!isImage && !isDocument) {
      return {
        success: false,
        error: `Invalid file type: ${file.type}. Allowed types: ${[
          ...Object.keys(ALLOWED_IMAGE_TYPES),
          ...Object.keys(ALLOWED_DOCUMENT_TYPES)
        ].join(', ')}`
      }
    }

    // Validate file size
    const maxSize = isImage ? UPLOAD_CONFIG.maxImageSize : UPLOAD_CONFIG.maxDocumentSize
    if (!validateFileSize(file.size, maxSize)) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024))
      return {
        success: false,
        error: `File too large. Maximum size is ${maxSizeMB}MB`
      }
    }

    // Generate filename
    const finalFilename = generateUnique
      ? generateUniqueFilename(filename || file.name, file.type)
      : (filename || file.name)

    // Ensure upload directory exists
    const uploadDir = await ensureUploadDir(category)
    const filePath = path.join(uploadDir, finalFilename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Generate public URL
    const publicUrl = `${UPLOAD_CONFIG.publicPath}/${category}/${finalFilename}`

    return {
      success: true,
      path: filePath,
      publicUrl,
      filename: finalFilename
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Validates an uploaded file before processing
 */
export function validateUpload(file: File, isImage = true): { valid: boolean; error?: string } {
  const allowedTypes = isImage ? ALLOWED_IMAGE_TYPES : { ...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES }
  const maxSize = isImage ? UPLOAD_CONFIG.maxImageSize : UPLOAD_CONFIG.maxDocumentSize

  if (!validateFileType(file.type, allowedTypes)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${Object.keys(allowedTypes).join(', ')}`
    }
  }

  if (!validateFileSize(file.size, maxSize)) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024))
    return {
      valid: false,
      error: `File too large. Maximum: ${maxSizeMB}MB`
    }
  }

  return { valid: true }
}

/**
 * Gets the file extension from MIME type
 */
export function getExtensionFromMime(mimeType: string): string | null {
  return ALLOWED_IMAGE_TYPES[mimeType as keyof typeof ALLOWED_IMAGE_TYPES] ||
         ALLOWED_DOCUMENT_TYPES[mimeType as keyof typeof ALLOWED_DOCUMENT_TYPES] ||
         null
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
