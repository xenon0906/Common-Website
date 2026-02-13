import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { getFirebaseStorage } from './firebase'

/**
 * Upload a file to Firebase Storage
 * @param file - The file to upload
 * @param category - The category/folder for the file (e.g., 'blog', 'team', 'general')
 * @returns Object containing the download URL and filename
 */
export async function uploadToFirebaseStorage(
  file: File,
  category: string = 'general'
): Promise<{ url: string; filename: string }> {
  const storage = getFirebaseStorage()

  // Generate unique filename
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const nameParts = sanitized.split('.')
  const extension = nameParts.pop()
  const basename = nameParts.join('.')
  const filename = `${basename}-${timestamp}-${random}.${extension}`

  // Upload path: {category}/{filename}
  const storagePath = `${category}/${filename}`
  const storageRef = ref(storage, storagePath)

  // Upload file with metadata
  const metadata = {
    contentType: file.type,
    customMetadata: {
      uploadedAt: new Date().toISOString(),
      category,
      originalName: file.name,
    },
  }

  await uploadBytes(storageRef, file, metadata)

  // Get public download URL
  const url = await getDownloadURL(storageRef)

  return { url, filename }
}

/**
 * Delete a file from Firebase Storage
 * @param url - The download URL or storage path of the file to delete
 */
export async function deleteFromFirebaseStorage(url: string): Promise<void> {
  const storage = getFirebaseStorage()

  // If it's a full Firebase Storage URL, extract the path
  // Format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encoded-path}?alt=media&token={token}
  let storagePath = url

  if (url.includes('firebasestorage.googleapis.com')) {
    try {
      const urlObj = new URL(url)
      const pathMatch = urlObj.pathname.match(/\/o\/(.+)/)
      if (pathMatch && pathMatch[1]) {
        storagePath = decodeURIComponent(pathMatch[1])
      }
    } catch (error) {
      console.error('Failed to parse Firebase Storage URL:', error)
      throw new Error('Invalid Firebase Storage URL')
    }
  }

  const storageRef = ref(storage, storagePath)
  await deleteObject(storageRef)
}

/**
 * Upload a file from a Buffer (for server-side uploads)
 * @param buffer - The file buffer
 * @param filename - The desired filename
 * @param contentType - The MIME type of the file
 * @param category - The category/folder for the file
 * @returns Object containing the download URL and filename
 */
export async function uploadBufferToFirebaseStorage(
  buffer: Buffer,
  filename: string,
  contentType: string,
  category: string = 'general'
): Promise<{ url: string; filename: string }> {
  const storage = getFirebaseStorage()

  // Generate unique filename
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  const nameParts = sanitized.split('.')
  const extension = nameParts.pop()
  const basename = nameParts.join('.')
  const uniqueFilename = `${basename}-${timestamp}-${random}.${extension}`

  // Upload path: {category}/{filename}
  const storagePath = `${category}/${uniqueFilename}`
  const storageRef = ref(storage, storagePath)

  // Upload buffer with metadata
  const metadata = {
    contentType,
    customMetadata: {
      uploadedAt: new Date().toISOString(),
      category,
      originalName: filename,
    },
  }

  await uploadBytes(storageRef, buffer, metadata)

  // Get public download URL
  const url = await getDownloadURL(storageRef)

  return { url, filename: uniqueFilename }
}
