'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { DEFAULT_CATEGORIES, BlogCategory } from '@/lib/types/blog'

interface CategorySelectProps {
  value?: string
  onChange: (value: string) => void
  categories?: BlogCategory[]
}

export function CategorySelect({
  value,
  onChange,
  categories = DEFAULT_CATEGORIES,
}: CategorySelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map(category => (
          <SelectItem key={category.id} value={category.id}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${category.color}`} />
              {category.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function CategoryBadge({ categoryId, categories = DEFAULT_CATEGORIES }: { categoryId?: string; categories?: BlogCategory[] }) {
  const category = categories.find(c => c.id === categoryId)
  if (!category) return null

  return (
    <Badge className={`${category.color} text-white`}>
      {category.name}
    </Badge>
  )
}
