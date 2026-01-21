'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Calendar,
  Flame,
} from 'lucide-react'
import { USE_FIREBASE } from '@/lib/config'
import {
  useCollection,
  deleteDocument,
  orderBy,
  FirestoreDoc,
} from '@/lib/hooks/useFirestore'
import { Timestamp } from 'firebase/firestore'

interface Blog extends FirestoreDoc {
  title: string
  slug: string
  excerpt: string | null
  published: boolean
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Firestore real-time subscription (when Firebase is enabled)
  const {
    data: firestoreBlogs,
    loading: firestoreLoading,
    error: firestoreError,
  } = useCollection<Blog>(
    'blogs',
    USE_FIREBASE ? [orderBy('createdAt', 'desc')] : []
  )

  // Fetch blogs from API (fallback when Firebase is disabled)
  useEffect(() => {
    if (USE_FIREBASE) {
      // Use Firestore data
      if (!firestoreLoading) {
        setBlogs(firestoreBlogs)
        setLoading(false)
      }
    } else {
      // Fetch from API
      fetchBlogs()
    }
  }, [firestoreBlogs, firestoreLoading])

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs')
      const data = await res.json()
      setBlogs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  const filteredBlogs = (blogs || []).filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    try {
      if (USE_FIREBASE) {
        // Delete from Firestore
        await deleteDocument('blogs', id)
        // Real-time subscription will automatically update the list
      } else {
        // Delete via API
        await fetch(`/api/blogs/${id}`, { method: 'DELETE' })
        setBlogs(blogs.filter((b) => b.id !== id))
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      alert('Failed to delete blog')
    }
  }

  const formatDate = (date: Date | string | Timestamp | undefined) => {
    if (!date) return 'N/A'
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString()
    }
    if (date instanceof Date) {
      return date.toLocaleDateString()
    }
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blog Manager</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            Create and manage blog posts
            {USE_FIREBASE && (
              <Badge variant="outline" className="text-xs gap-1">
                <Flame className="w-3 h-3 text-orange-500" />
                Firebase
              </Badge>
            )}
          </p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/admin/blogs/create">
            <Plus className="w-5 h-5 mr-2" />
            New Blog Post
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Blog List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredBlogs.length > 0 ? (
        <div className="space-y-4">
          {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <h3 className="font-semibold truncate">{blog.title}</h3>
                        <Badge variant={blog.published ? 'teal' : 'secondary'}>
                          {blog.published ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      {blog.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {blog.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(blog.createdAt)}
                        </span>
                        <span>/blog/{blog.slug}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/blog/${blog.slug}`} target="_blank">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/blogs/${blog.id}/edit`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-20 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No blogs found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'No blogs match your search.' : 'Get started by creating your first blog post.'}
            </p>
            <Button variant="gradient" asChild>
              <Link href="/admin/blogs/create">
                <Plus className="w-5 h-5 mr-2" />
                Create Blog Post
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
