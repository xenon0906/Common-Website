'use client'

import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { categoryAPI } from '@/lib/admin-client'
import { Plus, Loader2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  color?: string
  description?: string
}

interface CategoryManagerProps {
  value?: string
  onChange: (categoryId: string) => void
  className?: string
}

const DEFAULT_COLORS = [
  { value: 'bg-blue-500', label: 'Blue' },
  { value: 'bg-green-500', label: 'Green' },
  { value: 'bg-purple-500', label: 'Purple' },
  { value: 'bg-red-500', label: 'Red' },
  { value: 'bg-yellow-500', label: 'Yellow' },
  { value: 'bg-emerald-500', label: 'Emerald' },
  { value: 'bg-pink-500', label: 'Pink' },
  { value: 'bg-indigo-500', label: 'Indigo' },
  { value: 'bg-orange-500', label: 'Orange' },
  { value: 'bg-teal-500', label: 'Teal' },
]

export function CategoryManager({ value, onChange, className }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  // Form state
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: 'bg-primary',
    description: '',
  })

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await categoryAPI.list()
      if (error) {
        console.error('Error fetching categories:', error)
        setCategories([])
      } else {
        setCategories(data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: 'Error',
        description: 'Category name is required',
        variant: 'destructive',
      })
      return
    }

    setIsCreating(true)
    try {
      const { data, error } = await categoryAPI.create({
        name: newCategory.name.trim(),
        color: newCategory.color,
        description: newCategory.description.trim() || undefined,
      })

      if (error) {
        toast({
          title: 'Error',
          description: error,
          variant: 'destructive',
        })
      } else if (data) {
        toast({
          title: 'Success',
          description: `Category "${data.name}" created successfully`,
        })
        setCategories([...categories, data])
        onChange(data.id)
        setIsDialogOpen(false)
        setNewCategory({ name: '', color: 'bg-primary', description: '' })
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast({
        title: 'Error',
        description: 'Failed to create category',
        variant: 'destructive',
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <div className={className}>
        <Select
          value={value || ''}
          onValueChange={(val) => {
            if (val === '__create__') {
              setIsDialogOpen(true)
            } else {
              onChange(val)
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoading ? 'Loading categories...' : 'Select category'} />
          </SelectTrigger>
          <SelectContent>
            {categories.length === 0 && !isLoading && (
              <div className="px-2 py-6 text-center text-sm text-gray-500">
                No categories yet. Create one below.
              </div>
            )}
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cat.color || 'bg-primary'}`} />
                  {cat.name}
                </div>
              </SelectItem>
            ))}
            <div className="border-t my-1" />
            <SelectItem value="__create__" className="font-medium text-primary">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create new category
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category for your blog posts. Categories help organize your content.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category-name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="e.g., Tips & Guides"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-color">Color</Label>
              <Select
                value={newCategory.color}
                onValueChange={(color) => setNewCategory({ ...newCategory, color })}
              >
                <SelectTrigger id="category-color">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${color.value}`} />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-description">Description (optional)</Label>
              <Textarea
                id="category-description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Brief description of this category..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isCreating || !newCategory.name.trim()}>
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Category
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
