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
import { slugify } from '@/lib/utils'
import {
  ArrowLeft,
  Save,
  Eye,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'

const blogSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  metaDesc: z.string().max(160, 'Meta description must be under 160 characters').optional(),
  excerpt: z.string().max(300, 'Excerpt must be under 300 characters').optional(),
  keywords: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  published: z.boolean(),
})

type BlogFormData = z.infer<typeof blogSchema>

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  metaDesc: string | null
  excerpt: string | null
  keywords: string | null
  imageUrl: string | null
  published: boolean
}

export default function EditBlogForm() {
  const router = useRouter()
  const params = useParams()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    },
  })

  const content = watch('content')

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${params.id}`)
        if (!res.ok) throw new Error('Blog not found')
        const data = await res.json()
        setBlog(data)

        // Reset form with blog data
        reset({
          title: data.title || '',
          slug: data.slug || '',
          content: data.content || '',
          metaDesc: data.metaDesc || '',
          excerpt: data.excerpt || '',
          keywords: data.keywords || '',
          imageUrl: data.imageUrl || '',
          published: data.published || false,
        })
      } catch (error) {
        console.error('Error fetching blog:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchBlog()
    }
  }, [params.id, reset])

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setValue('title', newTitle)
    setValue('slug', slugify(newTitle))
  }

  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/blogs/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push('/admin/blogs')
      } else {
        alert('Failed to update blog')
      }
    } catch (error) {
      console.error('Error updating blog:', error)
      alert('Error updating blog')
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
          <p className="text-muted-foreground">Update the blog article</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
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

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Featured Image URL</Label>
                  <Input
                    id="imageUrl"
                    {...register('imageUrl')}
                    placeholder="https://..."
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
