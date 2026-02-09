'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ReactMarkdown from 'react-markdown'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { slugify, sanitizeSlug } from '@/lib/utils'
import Image from 'next/image'
import {
  ArrowLeft,
  Save,
  Eye,
  Loader2,
  Flame,
  ImageIcon,
} from 'lucide-react'
import Link from 'next/link'
import { FileUpload } from '@/components/ui/FileUpload'
import { USE_FIREBASE } from '@/lib/config'
import { createDoc } from '@/lib/hooks/useFirestore'
import { useToast } from '@/components/ui/use-toast'

const blogSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  metaDesc: z.string().max(160, 'Meta description must be under 160 characters').optional(),
  excerpt: z.string().max(300, 'Excerpt must be under 300 characters').optional(),
  keywords: z.string().optional(),
  imageUrl: z.string().optional().or(z.literal('')),
  published: z.boolean(),
})

type BlogFormData = z.infer<typeof blogSchema>

export default function CreateBlogPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      metaDesc: '',
      excerpt: '',
      keywords: '',
      imageUrl: '',
      published: false,
    },
  })

  const content = watch('content')
  const title = watch('title')
  const imageUrl = watch('imageUrl')

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setValue('title', newTitle)
    setValue('slug', slugify(newTitle))
  }

  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true)

    try {
      const wordCount = data.content.trim().split(/\s+/).length
      const readingTime = Math.max(1, Math.ceil(wordCount / 200))

      const blogData = {
        title: data.title,
        slug: sanitizeSlug(data.slug),
        content: data.content,
        metaDesc: data.metaDesc || '',
        excerpt: data.excerpt || '',
        keywords: data.keywords || '',
        imageUrl: data.imageUrl || '',
        published: data.published,
        status: data.published ? 'published' : 'draft',
        wordCount,
        readingTime,
      }

      if (USE_FIREBASE) {
        await createDoc('blogs', blogData)
      } else {
        const res = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(blogData),
        })
        if (!res.ok) throw new Error('Failed to create blog')
      }

      toast({
        title: 'Blog created',
        description: 'Your blog post has been created successfully.',
      })
      router.push('/admin/blogs')
    } catch (error) {
      console.error('Error creating blog:', error)
      toast({
        title: 'Error',
        description: 'Failed to create blog. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/blogs">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Blog Post</h1>
          <span className="text-muted-foreground flex items-center gap-2">
            Write a new article for the snapgo blog
            {USE_FIREBASE && (
              <Badge variant="outline" className="text-xs gap-1">
                <Flame className="w-3 h-3 text-orange-500" />
                Saves to Firebase
              </Badge>
            )}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Image Hero */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <Label className="text-base font-semibold">Featured Image</Label>
                {imageUrl ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border">
                    <Image
                      src={imageUrl}
                      alt="Featured image preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setValue('imageUrl', '')}
                      >
                        Remove Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <FileUpload
                    category="blog"
                    label=""
                    description="Upload a featured image (recommended: 1200x630px)"
                    onUploadComplete={(url) => setValue('imageUrl', url)}
                  />
                )}
                {imageUrl && (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate max-w-[80%]">{imageUrl}</p>
                    <FileUpload
                      category="blog"
                      label=""
                      description="Replace"
                      className="w-auto"
                      onUploadComplete={(url) => setValue('imageUrl', url)}
                    />
                  </div>
                )}
                <input type="hidden" {...register('imageUrl')} />
              </CardContent>
            </Card>

            {/* Title, Slug, Content */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    onChange={handleTitleChange}
                    placeholder="Enter blog title"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">/blog/</span>
                    <Input
                      id="slug"
                      {...register('slug')}
                      placeholder="url-slug"
                      className={errors.slug ? 'border-red-500' : ''}
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-sm text-red-500">{errors.slug.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Content</Label>
                  <Tabs defaultValue="write">
                    <TabsList>
                      <TabsTrigger value="write">Write</TabsTrigger>
                      <TabsTrigger value="preview">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="write">
                      <Textarea
                        {...register('content')}
                        placeholder="Write your blog content in Markdown..."
                        rows={20}
                        className={`font-mono ${errors.content ? 'border-red-500' : ''}`}
                      />
                      {errors.content && (
                        <p className="text-sm text-red-500">{errors.content.message}</p>
                      )}
                    </TabsContent>
                    <TabsContent value="preview">
                      <div className="min-h-[400px] p-4 border rounded-lg bg-background prose max-w-none">
                        {content ? (
                          <ReactMarkdown>{content}</ReactMarkdown>
                        ) : (
                          <p className="text-muted-foreground">Nothing to preview yet...</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="published">Publish immediately</Label>
                  <Switch
                    id="published"
                    checked={watch('published')}
                    onCheckedChange={(checked) => setValue('published', checked)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    variant="gradient"
                    className="flex-1"
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
                        Save
                      </>
                    )}
                  </Button>
                </div>
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
                    {...register('metaDesc')}
                    placeholder="Brief description for search engines..."
                    rows={3}
                  />
                  {errors.metaDesc && (
                    <p className="text-sm text-red-500">{errors.metaDesc.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    {...register('excerpt')}
                    placeholder="Short preview text..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    {...register('keywords')}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
