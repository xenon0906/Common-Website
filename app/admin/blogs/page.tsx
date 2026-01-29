'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Calendar,
  Flame,
  Clock,
  Filter,
  MoreHorizontal,
  CheckCircle,
  Tag,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { USE_FIREBASE } from '@/lib/config'
import {
  useCollection,
  deleteDocument,
  orderBy,
  FirestoreDoc,
} from '@/lib/hooks/useFirestore'
import { Timestamp } from 'firebase/firestore'
import { DEFAULT_CATEGORIES, BlogCategory, BlogPost } from '@/lib/types/blog'
import { CategoryBadge } from './components'
import { useConfirmDialog } from '@/components/ui/confirm-dialog'
import { useToast } from '@/components/ui/use-toast'
import { StatCardSkeleton, CardSkeleton } from '@/components/ui/skeleton'

interface Blog extends FirestoreDoc {
  title: string
  slug: string
  excerpt: string | null
  published: boolean
  status?: BlogPost['status']
  category?: string
  tags?: string[]
  readingTime?: number
  scheduledAt?: Timestamp | Date | string
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([])
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { toast } = useToast()

  const {
    data: firestoreBlogs,
    loading: firestoreLoading,
  } = useCollection<Blog>(
    'blogs',
    USE_FIREBASE ? [orderBy('createdAt', 'desc')] : []
  )

  useEffect(() => {
    if (USE_FIREBASE) {
      if (!firestoreLoading) {
        setBlogs(firestoreBlogs)
        setLoading(false)
      }
    } else {
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

  const filteredBlogs = (blogs || []).filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    const blogStatus = blog.status || (blog.published ? 'published' : 'draft')
    const matchesStatus = statusFilter === 'all' || blogStatus === statusFilter
    const matchesCategory = categoryFilter === 'all' || blog.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleDelete = async (id: string) => {
    const blogToDelete = blogs.find(b => b.id === id)
    const confirmed = await confirm({
      title: 'Delete Blog Post',
      description: `Are you sure you want to delete "${blogToDelete?.title || 'this blog'}"? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'destructive',
    })

    if (!confirmed) return

    try {
      if (USE_FIREBASE) {
        await deleteDocument('blogs', id)
      } else {
        await fetch(`/api/blogs/${id}`, { method: 'DELETE' })
        setBlogs(blogs.filter((b) => b.id !== id))
      }
      toast({
        title: 'Blog deleted',
        description: 'The blog post has been permanently deleted.',
      })
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete blog. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleBulkDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Multiple Blog Posts',
      description: `Are you sure you want to delete ${selectedBlogs.length} blog posts? This action cannot be undone.`,
      confirmText: `Delete ${selectedBlogs.length} Posts`,
      variant: 'destructive',
    })

    if (!confirmed) return

    let deletedCount = 0
    for (const id of selectedBlogs) {
      try {
        if (USE_FIREBASE) {
          await deleteDocument('blogs', id)
        } else {
          await fetch(`/api/blogs/${id}`, { method: 'DELETE' })
          setBlogs(prev => prev.filter((b) => b.id !== id))
        }
        deletedCount++
      } catch (error) {
        console.error('Error deleting blog:', error)
      }
    }
    setSelectedBlogs([])
    toast({
      title: 'Blogs deleted',
      description: `Successfully deleted ${deletedCount} blog posts.`,
    })
  }

  const toggleSelectBlog = (id: string) => {
    setSelectedBlogs(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedBlogs.length === filteredBlogs.length) {
      setSelectedBlogs([])
    } else {
      setSelectedBlogs(filteredBlogs.map(b => b.id))
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

  const getStatusBadge = (blog: Blog) => {
    const status = blog.status || (blog.published ? 'published' : 'draft')
    switch (status) {
      case 'published':
        return <Badge variant="default" className="bg-green-500"><Eye className="w-3 h-3 mr-1" />Published</Badge>
      case 'scheduled':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Scheduled</Badge>
      default:
        return <Badge variant="outline">Draft</Badge>
    }
  }

  // Stats
  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.status === 'published' || b.published).length,
    drafts: blogs.filter(b => b.status === 'draft' || (!b.status && !b.published)).length,
    scheduled: blogs.filter(b => b.status === 'scheduled').length,
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: stats.total, icon: FileText },
          { label: 'Published', value: stats.published, icon: CheckCircle, color: 'text-green-500' },
          { label: 'Drafts', value: stats.drafts, icon: Edit, color: 'text-yellow-500' },
          { label: 'Scheduled', value: stats.scheduled, icon: Clock, color: 'text-blue-500' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className={`w-8 h-8 ${stat.color || 'text-muted-foreground'}`} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <Tag className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {DEFAULT_CATEGORIES.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedBlogs.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <span className="text-sm">{selectedBlogs.length} selected</span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedBlogs([])}>
            Clear Selection
          </Button>
        </div>
      )}

      {/* Confirm Dialog */}
      {ConfirmDialog}

      {/* Blog List */}
      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
          <div className="space-y-4 mt-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : filteredBlogs.length > 0 ? (
        <div className="space-y-4">
          {/* Select All */}
          <div className="flex items-center gap-2 px-4">
            <Checkbox
              checked={selectedBlogs.length === filteredBlogs.length && filteredBlogs.length > 0}
              onCheckedChange={toggleSelectAll}
            />
            <span className="text-sm text-muted-foreground">Select All</span>
          </div>

          {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedBlogs.includes(blog.id)}
                      onCheckedChange={() => toggleSelectBlog(blog.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold truncate">{blog.title}</h3>
                        {getStatusBadge(blog)}
                        {blog.category && <CategoryBadge categoryId={blog.category} />}
                      </div>
                      {blog.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {blog.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(blog.createdAt)}
                        </span>
                        {blog.readingTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {blog.readingTime} min read
                          </span>
                        )}
                        <span>/blog/{blog.slug}</span>
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span>{blog.tags.length} tags</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/blog/${blog.slug}`} target="_blank">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/blogs/${blog.id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(blog.id)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'No blogs match your filters.'
                : 'Get started by creating your first blog post.'}
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
