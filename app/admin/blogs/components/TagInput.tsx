'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { X, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DEFAULT_TAGS } from '@/lib/types/blog'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
  maxTags?: number
}

export function TagInput({
  value = [],
  onChange,
  suggestions = DEFAULT_TAGS,
  placeholder = 'Add a tag...',
  maxTags = 10,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim()
    if (normalizedTag && !value.includes(normalizedTag) && value.length < maxTags) {
      onChange([...value, normalizedTag])
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  const filteredSuggestions = suggestions.filter(
    s => s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s)
  ).slice(0, 5)

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-background min-h-[42px]">
        {value.map(tag => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        {value.length < maxTags && (
          <div className="relative flex-1 min-w-[120px]">
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={value.length === 0 ? placeholder : ''}
              className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto"
            />

            {/* Suggestions dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg">
                {filteredSuggestions.map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addTag(suggestion)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                  >
                    <Plus className="w-3 h-3 text-muted-foreground" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {value.length}/{maxTags} tags. Press Enter to add.
      </p>
    </div>
  )
}
