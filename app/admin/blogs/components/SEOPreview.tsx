'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Globe, Twitter, Facebook } from 'lucide-react'

interface SEOPreviewProps {
  title: string
  description: string
  slug: string
  imageUrl?: string
}

export function SEOPreview({ title, description, slug, imageUrl }: SEOPreviewProps) {
  const url = `https://snapgo.in/blog/${slug}`
  const truncatedTitle = title.length > 60 ? title.slice(0, 57) + '...' : title
  const truncatedDesc = description.length > 160 ? description.slice(0, 157) + '...' : description

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Eye className="w-4 h-4" />
          Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Google Preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Google Search</span>
          </div>
          <div className="p-4 bg-white rounded-lg border">
            <p className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
              {truncatedTitle || 'Page Title'}
            </p>
            <p className="text-green-700 text-sm truncate">{url}</p>
            <p className="text-gray-600 text-sm line-clamp-2 mt-1">
              {truncatedDesc || 'Meta description will appear here...'}
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            <Badge variant={title.length <= 60 ? 'default' : 'destructive'}>
              Title: {title.length}/60
            </Badge>
            <Badge variant={description.length <= 160 ? 'default' : 'destructive'}>
              Desc: {description.length}/160
            </Badge>
          </div>
        </div>

        {/* Twitter Preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Twitter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Twitter Card</span>
          </div>
          <div className="rounded-xl border overflow-hidden bg-white">
            {imageUrl ? (
              <div className="aspect-[2/1] bg-muted">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[2/1] bg-muted flex items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
            <div className="p-3">
              <p className="font-medium truncate">{truncatedTitle || 'Title'}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {truncatedDesc || 'Description'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">snapgo.in</p>
            </div>
          </div>
        </div>

        {/* Facebook Preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Facebook className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Facebook</span>
          </div>
          <div className="rounded-lg border overflow-hidden bg-gray-100">
            {imageUrl ? (
              <div className="aspect-[1.91/1] bg-muted">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[1.91/1] bg-muted flex items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
            <div className="p-3 bg-gray-50">
              <p className="text-xs text-gray-500 uppercase">snapgo.in</p>
              <p className="font-semibold truncate">{truncatedTitle || 'Title'}</p>
              <p className="text-sm text-gray-600 line-clamp-1">
                {truncatedDesc || 'Description'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
