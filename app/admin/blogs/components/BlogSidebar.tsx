'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Save,
  Loader2,
  Clock,
  Calendar as CalendarIcon,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from 'lucide-react'
import { format } from 'date-fns'
import { CategorySelect } from './CategorySelect'
import { TagInput } from './TagInput'
import { FileUpload } from '@/components/ui/FileUpload'
import { BlogPost, calculateReadingTime } from '@/lib/types/blog'
import { cn } from '@/lib/utils'

interface BlogSidebarProps {
  status: BlogPost['status']
  onStatusChange: (status: BlogPost['status']) => void
  category?: string
  onCategoryChange: (category: string) => void
  tags: string[]
  onTagsChange: (tags: string[]) => void
  scheduledAt?: Date
  onScheduledAtChange: (date: Date | undefined) => void
  metaDesc?: string
  onMetaDescChange: (value: string) => void
  excerpt?: string
  onExcerptChange: (value: string) => void
  keywords?: string
  onKeywordsChange: (value: string) => void
  imageUrl?: string
  onImageUrlChange: (url: string) => void
  content: string
  onSave: () => void
  isSaving: boolean
}

export function BlogSidebar({
  status,
  onStatusChange,
  category,
  onCategoryChange,
  tags,
  onTagsChange,
  scheduledAt,
  onScheduledAtChange,
  metaDesc,
  onMetaDescChange,
  excerpt,
  onExcerptChange,
  keywords,
  onKeywordsChange,
  imageUrl,
  onImageUrlChange,
  content,
  onSave,
  isSaving,
}: BlogSidebarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const readingTime = calculateReadingTime(content || '')

  const handlePublishToggle = (published: boolean) => {
    if (published) {
      onStatusChange('published')
      onScheduledAtChange(undefined)
    } else {
      onStatusChange('draft')
    }
  }

  const handleSchedule = (date: Date | undefined) => {
    if (date && date > new Date()) {
      onStatusChange('scheduled')
      onScheduledAtChange(date)
    } else {
      onStatusChange('draft')
      onScheduledAtChange(undefined)
    }
    setIsCalendarOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Publish Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Publish
            <Badge
              variant={
                status === 'published' ? 'default' :
                status === 'scheduled' ? 'secondary' : 'outline'
              }
            >
              {status === 'published' && <Eye className="w-3 h-3 mr-1" />}
              {status === 'draft' && <EyeOff className="w-3 h-3 mr-1" />}
              {status === 'scheduled' && <Clock className="w-3 h-3 mr-1" />}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="published">Publish immediately</Label>
            <Switch
              id="published"
              checked={status === 'published'}
              onCheckedChange={handlePublishToggle}
            />
          </div>

          {status !== 'published' && (
            <div className="space-y-2">
              <Label>Schedule for later</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !scheduledAt && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledAt ? format(scheduledAt, 'PPP p') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduledAt}
                    onSelect={handleSchedule}
                    disabled={(date: Date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {readingTime} min read
          </div>

          <Button
            type="button"
            variant="gradient"
            className="w-full"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save {status === 'published' ? '& Publish' : status === 'scheduled' ? '& Schedule' : 'Draft'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Category & Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Taxonomy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <CategorySelect value={category} onChange={onCategoryChange} />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagInput value={tags} onChange={onTagsChange} />
          </div>
        </CardContent>
      </Card>

      {/* Featured Image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Featured Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          {imageUrl ? (
            <div className="space-y-2">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={imageUrl}
                  alt="Featured"
                  className="object-cover w-full h-full"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onImageUrlChange('')}
                className="w-full"
              >
                Remove Image
              </Button>
            </div>
          ) : (
            <FileUpload
              category="blog"
              label="Upload Image"
              description="Recommended: 1200x630px"
              onUploadComplete={onImageUrlChange}
            />
          )}
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaDesc">Meta Description</Label>
            <Textarea
              id="metaDesc"
              value={metaDesc || ''}
              onChange={(e) => onMetaDescChange(e.target.value)}
              placeholder="Brief description for search engines..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {(metaDesc || '').length}/160 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt || ''}
              onChange={(e) => onExcerptChange(e.target.value)}
              placeholder="Short preview text..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={keywords || ''}
              onChange={(e) => onKeywordsChange(e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
