'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

const achievementSchema = z.object({
  type: z.enum(['CERT', 'VIDEO', 'POST']),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().optional(),
  mediaUrl: z.string().url().optional().or(z.literal('')),
  embedCode: z.string().optional(),
})

type AchievementFormData = z.infer<typeof achievementSchema>

export default function CreateAchievementPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AchievementFormData>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      type: 'CERT',
      title: '',
      content: '',
      mediaUrl: '',
      embedCode: '',
    },
  })

  const selectedType = watch('type')

  const onSubmit = async (data: AchievementFormData) => {
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push('/admin/achievements')
      } else {
        alert('Failed to create achievement')
      }
    } catch (error) {
      console.error('Error creating achievement:', error)
      alert('Error creating achievement')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/achievements">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add Achievement</h1>
          <p className="text-muted-foreground">Add a new certificate, video, or social post</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="max-w-2xl">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={selectedType}
                onValueChange={(value: 'CERT' | 'VIDEO' | 'POST') => setValue('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CERT">Certificate (DPIIT, Awards)</SelectItem>
                  <SelectItem value="VIDEO">Video (Short clips, demos)</SelectItem>
                  <SelectItem value="POST">Social Post (News, announcements)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., DPIIT Certificate 2024"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Description</Label>
              <Textarea
                id="content"
                {...register('content')}
                placeholder="Describe this achievement..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mediaUrl">Media URL</Label>
              <Input
                id="mediaUrl"
                {...register('mediaUrl')}
                placeholder="https://..."
              />
              <p className="text-sm text-muted-foreground">
                Link to certificate image, video, or social media post
              </p>
            </div>

            {selectedType === 'VIDEO' && (
              <div className="space-y-2">
                <Label htmlFor="embedCode">Embed Code (optional)</Label>
                <Textarea
                  id="embedCode"
                  {...register('embedCode')}
                  placeholder="<iframe src='...'></iframe>"
                  rows={3}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  Paste YouTube or other video embed code
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="gradient"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Achievement
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/achievements">Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
