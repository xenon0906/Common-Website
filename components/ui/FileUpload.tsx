'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  ImageIcon,
} from 'lucide-react'
import { Button } from './button'

// Client-safe utilities (no fs imports)
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export type FileCategory = 'blog' | 'team' | 'achievements' | 'logo' | 'general' | 'media'

interface FileUploadProps {
  category: FileCategory
  onUploadComplete?: (url: string, filename: string) => void
  onUploadError?: (error: string) => void
  accept?: string
  maxSize?: number // in bytes
  className?: string
  currentImage?: string
  label?: string
  description?: string
}

interface UploadState {
  status: 'idle' | 'dragging' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
  previewUrl?: string
  uploadedUrl?: string
}

export function FileUpload({
  category,
  onUploadComplete,
  onUploadError,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  className,
  currentImage,
  label = 'Upload Image',
  description = 'Drag and drop or click to upload',
}: FileUploadProps) {
  const [state, setState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
    previewUrl: currentImage,
    uploadedUrl: currentImage,
  })

  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setState((prev) => ({ ...prev, status: 'dragging' }))
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setState((prev) => ({ ...prev, status: 'idle' }))
  }, [])

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    const acceptedTypes = accept.split(',').map(t => t.trim())
    const isAccepted = acceptedTypes.some(type => {
      if (type === 'image/*') return file.type.startsWith('image/')
      if (type === 'application/pdf') return file.type === 'application/pdf'
      return file.type === type
    })

    if (!isAccepted) {
      return `Invalid file type. Accepted: ${accept}`
    }

    // Check file size
    if (file.size > maxSize) {
      return `File too large. Maximum size: ${formatFileSize(maxSize)}`
    }

    return null
  }, [accept, maxSize])

  const uploadFile = useCallback(async (file: File) => {
    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: validationError,
      }))
      onUploadError?.(validationError)
      return
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file)
      setState((prev) => ({ ...prev, previewUrl }))
    }

    // Start upload
    setState((prev) => ({ ...prev, status: 'uploading', progress: 0 }))

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', category)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setState((prev) => ({
        ...prev,
        status: 'success',
        progress: 100,
        uploadedUrl: data.url,
      }))

      onUploadComplete?.(data.url, data.filename)

      // Reset to idle after showing success
      setTimeout(() => {
        setState((prev) => ({ ...prev, status: 'idle' }))
      }, 2000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: errorMessage,
      }))
      onUploadError?.(errorMessage)
    }
  }, [category, validateFile, onUploadComplete, onUploadError])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setState((prev) => ({ ...prev, status: 'idle' }))

    const file = e.dataTransfer.files[0]
    if (file) {
      uploadFile(file)
    }
  }, [uploadFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }, [uploadFile])

  const handleRemove = useCallback(() => {
    setState({
      status: 'idle',
      progress: 0,
      previewUrl: undefined,
      uploadedUrl: undefined,
    })
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [])

  const statusIcons = {
    idle: <Upload className="w-8 h-8 text-muted-foreground" />,
    dragging: <Upload className="w-8 h-8 text-primary animate-bounce" />,
    uploading: <Loader2 className="w-8 h-8 text-primary animate-spin" />,
    success: <CheckCircle className="w-8 h-8 text-green-500" />,
    error: <AlertCircle className="w-8 h-8 text-destructive" />,
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer',
          'hover:border-primary/50 hover:bg-primary/5',
          state.status === 'dragging' && 'border-primary bg-primary/10 scale-[1.02]',
          state.status === 'error' && 'border-destructive bg-destructive/5',
          state.status === 'success' && 'border-green-500 bg-green-50',
          !state.previewUrl && 'p-8'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileSelect}
        />

        <AnimatePresence mode="wait">
          {state.previewUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
            >
              <Image
                src={state.previewUrl}
                alt="Preview"
                fill
                className="object-cover"
              />

              {/* Overlay with status */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      inputRef.current?.click()
                    }}
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Change
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove()
                    }}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>

              {/* Upload progress */}
              {state.status === 'uploading' && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <Loader2 className="w-10 h-10 text-white animate-spin mb-2" />
                  <span className="text-white text-sm">Uploading...</span>
                </div>
              )}

              {/* Success indicator */}
              {state.status === 'success' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4">
                {statusIcons[state.status]}
              </div>

              <p className="text-sm font-medium text-foreground mb-1">
                {state.status === 'error' ? 'Upload failed' : description}
              </p>

              {state.status === 'error' && state.error ? (
                <p className="text-xs text-destructive">{state.error}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WebP up to {formatFileSize(maxSize)}
                </p>
              )}

              {state.status === 'uploading' && (
                <div className="w-full max-w-xs mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden value for forms */}
      {state.uploadedUrl && (
        <input type="hidden" name={`${category}Image`} value={state.uploadedUrl} />
      )}
    </div>
  )
}

// Compact version for inline use
export function FileUploadCompact({
  category,
  onUploadComplete,
  currentImage,
  className,
}: {
  category: FileCategory
  onUploadComplete?: (url: string) => void
  currentImage?: string
  className?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(currentImage)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', category)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        setImageUrl(data.url)
        onUploadComplete?.(data.url)
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {imageUrl ? (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
          <Image src={imageUrl} alt="Preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => setImageUrl(undefined)}
            className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          className="w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      />

      {imageUrl && (
        <input type="hidden" name={`${category}ImageUrl`} value={imageUrl} />
      )}
    </div>
  )
}
