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
import { slugify } from '@/lib/utils'
import {
  ArrowLeft,
  Save,
  Eye,
  Sparkles,
  Loader2,
  Flame,
} from 'lucide-react'
import Link from 'next/link'
import { FileUpload } from '@/components/ui/FileUpload'
import { USE_FIREBASE } from '@/lib/config'
import { createDoc } from '@/lib/hooks/useFirestore'

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

export default function CreateBlogPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiTopic, setAiTopic] = useState('')

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

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setValue('title', newTitle)
    setValue('slug', slugify(newTitle))
  }

  // AI Blog Generation (mock for now)
  const handleAIGenerate = async () => {
    if (!aiTopic.trim()) return

    setIsGenerating(true)

    // Mock AI generation - in production, this would call the Claude API
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockContent = `# ${aiTopic}

## Introduction

In today's fast-paced urban environment, finding affordable and reliable transportation is more important than ever. At **snapgo**, we're revolutionizing how Indians commute by connecting people traveling the same route.

## Why Ride-Sharing Matters

- **Save up to 75%** on your daily commute costs
- **Reduce carbon footprint** by sharing rides
- **Make meaningful connections** with fellow commuters
- **Verified users** through Aadhaar KYC

## How snapgo Makes It Easy

Our smart matching algorithm finds riders within 750m of your route, ensuring convenient pickups and significant savings.

### Real-Time Matching
Find rides instantly when you need them most.

### Scheduled Rides
Plan ahead for guaranteed matches on your regular routes.

## The snapgo Difference

Unlike other platforms, snapgo is built specifically for Indian commuters:
- **Female-only option** for women's safety
- **SOS feature** for emergencies
- **DPIIT certified** startup you can trust

## Get Started Today

Download snapgo and join thousands of users already saving money on their daily commute.

[Download snapgo](/download) | [Learn More](/about) | [Contact Us](/contact)

---

*snapgo - Share Rides, Save Money, Travel Together*`

    setValue('title', aiTopic)
    setValue('slug', slugify(aiTopic))
    setValue('content', mockContent)
    setValue('metaDesc', `Learn about ${aiTopic.toLowerCase()} and how snapgo helps Indian commuters save money through ride-sharing.`)
    setValue('excerpt', `Discover how ${aiTopic.toLowerCase()} is changing the way Indians commute with snapgo's innovative ride-sharing platform.`)
    setValue('keywords', 'snapgo, ride sharing, carpool india, save money commute')

    setIsGenerating(false)
  }

  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true)

    try {
      if (USE_FIREBASE) {
        // Save to Firestore
        await createDoc('blogs', {
          title: data.title,
          slug: data.slug,
          content: data.content,
          metaDesc: data.metaDesc || '',
          excerpt: data.excerpt || '',
          keywords: data.keywords || '',
          imageUrl: data.imageUrl || '',
          published: data.published,
        })
        router.push('/admin/blogs')
      } else {
        // Save via API
        const res = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (res.ok) {
          router.push('/admin/blogs')
        } else {
          alert('Failed to create blog')
        }
      }
    } catch (error) {
      console.error('Error creating blog:', error)
      alert('Error creating blog')
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
          <p className="text-muted-foreground flex items-center gap-2">
            Write a new article for the snapgo blog
            {USE_FIREBASE && (
              <Badge variant="outline" className="text-xs gap-1">
                <Flame className="w-3 h-3 text-orange-500" />
                Saves to Firebase
              </Badge>
            )}
          </p>
        </div>
      </div>

      {/* AI Generator */}
      <Card className="border-teal/50 bg-teal/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal" />
            AI Blog Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter a topic (e.g., 'How Students Save ₹10,000/Month with snapgo')"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="gradient"
              onClick={handleAIGenerate}
              disabled={isGenerating || !aiTopic.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            AI will generate a full SEO-optimized blog post based on your topic.
          </p>
        </CardContent>
      </Card>

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
                  <Label htmlFor="published">Publish immediately</Label>
                  <Switch
                    id="published"
                    {...register('published')}
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

                <div className="space-y-2">
                  <FileUpload
                    category="blog"
                    label="Featured Image"
                    description="Upload a featured image for your blog post"
                    onUploadComplete={(url) => setValue('imageUrl', url)}
                  />
                  <input type="hidden" {...register('imageUrl')} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
