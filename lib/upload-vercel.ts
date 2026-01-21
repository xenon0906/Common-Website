/**
 * Vercel Blob Upload Handler
 *
 * This file handles file uploads for Vercel deployment using Vercel Blob Storage.
 *
 * SETUP REQUIRED:
 * 1. Install: npm install @vercel/blob
 * 2. Add to Vercel project: Settings > Storage > Create Blob Store
 * 3. Environment variable BLOB_READ_WRITE_TOKEN will be auto-added
 */

// Uncomment and use this when deploying to Vercel:
/*
import { put, del } from '@vercel/blob'

export type FileCategory = 'blog' | 'team' | 'achievements' | 'logo' | 'general' | 'media'

export interface UploadResult {
  success: boolean
  url?: string
  filename?: string
  error?: string
}

export async function uploadToVercelBlob(
  file: File,
  category: FileCategory
): Promise<UploadResult> {
  try {
    const filename = `${category}/${Date.now()}-${file.name}`

    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    return {
      success: true,
      url: blob.url,
      filename: blob.pathname,
    }
  } catch (error) {
    console.error('Vercel Blob upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

export async function deleteFromVercelBlob(url: string): Promise<boolean> {
  try {
    await del(url)
    return true
  } catch (error) {
    console.error('Vercel Blob delete error:', error)
    return false
  }
}
*/

/**
 * Cloudinary Upload Handler (Alternative)
 *
 * SETUP REQUIRED:
 * 1. Install: npm install cloudinary
 * 2. Create Cloudinary account
 * 3. Add environment variables:
 *    - CLOUDINARY_CLOUD_NAME
 *    - CLOUDINARY_API_KEY
 *    - CLOUDINARY_API_SECRET
 */

/*
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(
  file: File,
  category: FileCategory
): Promise<UploadResult> {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `snapgo/${category}`,
      resource_type: 'auto',
    })

    return {
      success: true,
      url: result.secure_url,
      filename: result.public_id,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}
*/

// Placeholder exports for TypeScript
export type FileCategory = 'blog' | 'team' | 'achievements' | 'logo' | 'general' | 'media'

export interface UploadResult {
  success: boolean
  url?: string
  filename?: string
  error?: string
}

// This is a placeholder - replace with actual implementation
export async function uploadToCloud(
  file: File,
  category: FileCategory
): Promise<UploadResult> {
  console.warn('Cloud upload not configured. See lib/upload-vercel.ts for setup instructions.')
  return {
    success: false,
    error: 'Cloud upload not configured',
  }
}
