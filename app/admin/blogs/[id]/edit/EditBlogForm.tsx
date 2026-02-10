'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { slugify, sanitizeSlug, MAX_SLUG_LENGTH } from '@/lib/utils'
import Image from 'next/image'
import {
  ArrowLeft,
  Save,
  Eye,
  Loader2,
  FileText,
  LayoutGrid,
} from 'lucide-react'
import Link from 'next/link'
import { FileUpload } from '@/components/ui/FileUpload'
import { useToast } from '@/components/ui/use-toast'
import { BlockEditor } from '@/components/admin/blog/BlockEditor'
import { ContentRenderer } from '@/components/blog/ContentRenderer'
import { DEFAULT_CATEGORIES, type ContentBlock, type ContentVersion } from '@/lib/types/blog'

const blogSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').max(MAX_SLUG_LENGTH, `Slug must be under ${MAX_SLUG_LENGTH} characters`),
  content: z.string().optional(),
  metaDesc: z.string().max(160, 'Meta description must be under 160 characters').optional(),
  excerpt: z.string().max(300, 'Excerpt must be under 300 characters').optional(),
  keywords: z.string().optional(),
  imageUrl: z.string().optional().or(z.literal('')),
  published: z.boolean(),
  category: z.string().optional(),
})

type BlogFormData = z.infer<typeof blogSchema>

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  contentBlocks?: ContentBlock[]
  contentVersion?: ContentVersion
  metaDesc: string | null
  excerpt: string | null
  keywords: string | null
  imageUrl: string | null
  published: boolean
  category?: string
}

// Helper to convert blocks to markdown for word count
function blocksToText(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'paragraph':
        case 'heading':
        case 'quote':
          return block.content
        case 'list':
          return block.items.join(' ')
        default:
          return ''
      }
    })
    .join(' ')
}

export default function EditBlogForm() {
  const router = useRouter()
  const params = useParams()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editorMode, setEditorMode] = useState<'markdown' | 'blocks'>('markdown')
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
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
      category: '',
    },
  })

  const content = watch('content')
  const imageUrl = watch('imageUrl')

  // Fetch blog data
  useEffect(() => {
    const loadBlog = async () => {
      try {
        let data: Blog | null = null
        const res = await fetch(`/api/blogs/${params.id}`)
        if (!res.ok) throw new Error('Blog not found')
        data = await res.json()

        if (!data) throw new Error('Blog not found')

        setBlog(data)

        // Set editor mode based on content version
        if (data.contentVersion === 2 && data.contentBlocks) {
          setEditorMode('blocks')
          setContentBlocks(data.contentBlocks)
        } else {
          setEditorMode('markdown')
        }

        reset({
          title: data.title || '',
          slug: data.slug || '',
          content: data.content || '',
          metaDesc: data.metaDesc || '',
          excerpt: data.excerpt || '',
          keywords: data.keywords || '',
          imageUrl: data.imageUrl || '',
          published: data.published || false,
          category: data.category || '',
        })
      } catch (error) {
        console.error('Error fetching blog:', error)
        toast({
          title: 'Error',
          description: 'Failed to load blog post.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadBlog()
    }
  }, [params.id, reset, toast])

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setValue('title', newTitle)
    setValue('slug', slugify(newTitle))
  }

  const onSubmit = async (data: BlogFormData) => {
    // Validate content based on editor mode
    if (editorMode === 'markdown' && (!data.content || data.content.length < 100)) {
      toast({
        title: 'Error',
        description: 'Content must be at least 100 characters',
        variant: 'destructive',
      })
      return
    }

    if (editorMode === 'blocks' && contentBlocks.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one content block',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const textContent = editorMode === 'blocks' ? blocksToText(contentBlocks) : (data.content || '')
      const wordCount = textContent.trim().split(/\s+/).length
      const readingTime = Math.max(1, Math.ceil(wordCount / 200))

      const res = await fetch(`/api/blogs/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          slug: sanitizeSlug(data.slug),
          content: editorMode === 'blocks' ? '' : (data.content || ''),
          contentBlocks: editorMode === 'blocks' ? contentBlocks : undefined,
          contentVersion: editorMode === 'blocks' ? 2 : 1,
          category: data.category || '',
          status: data.published ? 'published' : 'draft',
          wordCount,
          readingTime,
        }),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to update blog')
      }

      toast({
        title: 'Blog updated',
        description: 'Your blog post has been saved successfully.',
      })
      router.push('/admin/blogs')
    } catch (error) {
      console.error('Error updating blog:', error)
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to update blog. Please try again.'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Blog not found</h2>
        <Link href="/admin/blogs" className="text-primary hover:underline">
          Back to blogs
        </Link>
      </div>
    )
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
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <span className="text-muted-foreground">
            Update the blog article
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

            {/* Title and Slug */}
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
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Content</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={editorMode === 'markdown' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEditorMode('markdown')}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Markdown
                    </Button>
                    <Button
                      type="button"
                      variant={editorMode === 'blocks' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEditorMode('blocks')}
                    >
                      <LayoutGrid className="w-4 h-4 mr-1" />
                      Blocks
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editorMode === 'markdown' ? (
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
                ) : (
                  <Tabs defaultValue="edit">
                    <TabsList>
                      <TabsTrigger value="edit">Edit</TabsTrigger>
                      <TabsTrigger value="preview">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit">
                      <BlockEditor
                        blocks={contentBlocks}
                        onChange={setContentBlocks}
                      />
                    </TabsContent>
                    <TabsContent value="preview">
                      <div className="min-h-[400px] p-4 border rounded-lg bg-background">
                        {contentBlocks.length > 0 ? (
                          <ContentRenderer
                            content=""
                            contentBlocks={contentBlocks}
                            contentVersion={2}
                          />
                        ) : (
                          <p className="text-muted-foreground">No content blocks yet...</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
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
                  <Label htmlFor="published">Published</Label>
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
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={watch('category') || ''}
                  onValueChange={(value) => setValue('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
