'use client'

import { useState, useCallback } from 'react'
import { motion, Reorder } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FileUpload } from '@/components/ui/FileUpload'
import {
  Plus,
  GripVertical,
  Trash2,
  Type,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Quote,
  List,
  ListOrdered,
} from 'lucide-react'
import type {
  ContentBlock,
  ContentBlockType,
  ParagraphBlock,
  HeadingBlock,
  ImageBlock,
  QuoteBlock,
  ListBlock,
} from '@/lib/types/blog'

interface BlockEditorProps {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
  className?: string
}

// Generate unique ID
function generateId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Block type menu items
const blockTypes = [
  { type: 'paragraph' as const, label: 'Paragraph', icon: Type },
  { type: 'heading' as const, label: 'Heading 2', icon: Heading2, level: 2 },
  { type: 'heading' as const, label: 'Heading 3', icon: Heading3, level: 3 },
  { type: 'image' as const, label: 'Image', icon: ImageIcon },
  { type: 'quote' as const, label: 'Quote', icon: Quote },
  { type: 'list' as const, label: 'Bullet List', icon: List, ordered: false },
  { type: 'list' as const, label: 'Numbered List', icon: ListOrdered, ordered: true },
]

// Individual block editors
function ParagraphBlockEditor({
  block,
  onUpdate,
  onDelete,
}: {
  block: ParagraphBlock
  onUpdate: (block: ParagraphBlock) => void
  onDelete: () => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Paragraph</Label>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDelete}>
          <Trash2 className="w-3 h-3 text-destructive" />
        </Button>
      </div>
      <Textarea
        value={block.content}
        onChange={(e) => onUpdate({ ...block, content: e.target.value })}
        placeholder="Write your paragraph... (supports **bold**, *italic*, [links](url))"
        rows={4}
        className="font-mono text-sm"
      />
    </div>
  )
}

function HeadingBlockEditor({
  block,
  onUpdate,
  onDelete,
}: {
  block: HeadingBlock
  onUpdate: (block: HeadingBlock) => void
  onDelete: () => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Heading {block.level}</Label>
          <div className="flex gap-1">
            {[2, 3].map((level) => (
              <Button
                key={level}
                variant={block.level === level ? 'default' : 'outline'}
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => onUpdate({ ...block, level: level as 2 | 3 })}
              >
                H{level}
              </Button>
            ))}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDelete}>
          <Trash2 className="w-3 h-3 text-destructive" />
        </Button>
      </div>
      <Input
        value={block.content}
        onChange={(e) => onUpdate({ ...block, content: e.target.value })}
        placeholder="Heading text..."
        className={block.level === 2 ? 'text-xl font-bold' : 'text-lg font-semibold'}
      />
    </div>
  )
}

function ImageBlockEditor({
  block,
  onUpdate,
  onDelete,
}: {
  block: ImageBlock
  onUpdate: (block: ImageBlock) => void
  onDelete: () => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Image</Label>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDelete}>
          <Trash2 className="w-3 h-3 text-destructive" />
        </Button>
      </div>

      {block.url ? (
        <div className="space-y-2">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img
              src={block.url}
              alt={block.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onUpdate({ ...block, url: '' })}
              >
                Replace
              </Button>
            </div>
          </div>
          <Input
            value={block.alt}
            onChange={(e) => onUpdate({ ...block, alt: e.target.value })}
            placeholder="Alt text (for accessibility)"
          />
          <Input
            value={block.caption || ''}
            onChange={(e) => onUpdate({ ...block, caption: e.target.value })}
            placeholder="Caption (optional)"
          />
        </div>
      ) : (
        <FileUpload
          category="blog"
          label=""
          description="Upload an image"
          onUploadComplete={(url) => onUpdate({ ...block, url })}
        />
      )}
    </div>
  )
}

function QuoteBlockEditor({
  block,
  onUpdate,
  onDelete,
}: {
  block: QuoteBlock
  onUpdate: (block: QuoteBlock) => void
  onDelete: () => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Quote</Label>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDelete}>
          <Trash2 className="w-3 h-3 text-destructive" />
        </Button>
      </div>
      <div className="border-l-4 border-primary pl-3 space-y-2">
        <Textarea
          value={block.content}
          onChange={(e) => onUpdate({ ...block, content: e.target.value })}
          placeholder="Quote text..."
          rows={3}
          className="italic"
        />
        <Input
          value={block.attribution || ''}
          onChange={(e) => onUpdate({ ...block, attribution: e.target.value })}
          placeholder="Attribution (optional)"
        />
      </div>
    </div>
  )
}

function ListBlockEditor({
  block,
  onUpdate,
  onDelete,
}: {
  block: ListBlock
  onUpdate: (block: ListBlock) => void
  onDelete: () => void
}) {
  const addItem = () => {
    onUpdate({ ...block, items: [...block.items, ''] })
  }

  const updateItem = (index: number, value: string) => {
    const newItems = [...block.items]
    newItems[index] = value
    onUpdate({ ...block, items: newItems })
  }

  const removeItem = (index: number) => {
    const newItems = block.items.filter((_, i) => i !== index)
    onUpdate({ ...block, items: newItems.length > 0 ? newItems : [''] })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">
            {block.ordered ? 'Numbered List' : 'Bullet List'}
          </Label>
          <Switch
            checked={block.ordered}
            onCheckedChange={(checked) => onUpdate({ ...block, ordered: checked })}
          />
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDelete}>
          <Trash2 className="w-3 h-3 text-destructive" />
        </Button>
      </div>

      <div className="space-y-2 pl-4">
        {block.items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm w-6">
              {block.ordered ? `${index + 1}.` : '•'}
            </span>
            <Input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder="List item..."
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => removeItem(index)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addItem} className="ml-6">
          <Plus className="w-3 h-3 mr-1" />
          Add Item
        </Button>
      </div>
    </div>
  )
}

function BlockEditorItem({
  block,
  onUpdate,
  onDelete,
}: {
  block: ContentBlock
  onUpdate: (block: ContentBlock) => void
  onDelete: () => void
}) {
  const renderEditor = () => {
    switch (block.type) {
      case 'paragraph':
        return (
          <ParagraphBlockEditor
            block={block}
            onUpdate={onUpdate as (block: ParagraphBlock) => void}
            onDelete={onDelete}
          />
        )
      case 'heading':
        return (
          <HeadingBlockEditor
            block={block}
            onUpdate={onUpdate as (block: HeadingBlock) => void}
            onDelete={onDelete}
          />
        )
      case 'image':
        return (
          <ImageBlockEditor
            block={block}
            onUpdate={onUpdate as (block: ImageBlock) => void}
            onDelete={onDelete}
          />
        )
      case 'quote':
        return (
          <QuoteBlockEditor
            block={block}
            onUpdate={onUpdate as (block: QuoteBlock) => void}
            onDelete={onDelete}
          />
        )
      case 'list':
        return (
          <ListBlockEditor
            block={block}
            onUpdate={onUpdate as (block: ListBlock) => void}
            onDelete={onDelete}
          />
        )
      default:
        return null
    }
  }

  return (
    <Reorder.Item
      value={block}
      id={block.id}
      className="relative"
    >
      <Card className="p-4 bg-white dark:bg-gray-900">
        <div className="flex gap-3">
          <div className="cursor-grab active:cursor-grabbing pt-1">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">{renderEditor()}</div>
        </div>
      </Card>
    </Reorder.Item>
  )
}

export function BlockEditor({ blocks, onChange, className = '' }: BlockEditorProps) {
  const addBlock = useCallback(
    (type: ContentBlockType, options?: { level?: 1 | 2 | 3; ordered?: boolean }) => {
      const baseBlock = {
        id: generateId(),
        order: blocks.length,
      }

      let newBlock: ContentBlock

      switch (type) {
        case 'paragraph':
          newBlock = { ...baseBlock, type: 'paragraph', content: '' }
          break
        case 'heading':
          newBlock = { ...baseBlock, type: 'heading', content: '', level: options?.level || 2 }
          break
        case 'image':
          newBlock = { ...baseBlock, type: 'image', url: '', alt: '' }
          break
        case 'quote':
          newBlock = { ...baseBlock, type: 'quote', content: '' }
          break
        case 'list':
          newBlock = { ...baseBlock, type: 'list', items: [''], ordered: options?.ordered || false }
          break
        default:
          return
      }

      onChange([...blocks, newBlock])
    },
    [blocks, onChange]
  )

  const updateBlock = useCallback(
    (updatedBlock: ContentBlock) => {
      onChange(blocks.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)))
    },
    [blocks, onChange]
  )

  const deleteBlock = useCallback(
    (blockId: string) => {
      onChange(blocks.filter((b) => b.id !== blockId))
    },
    [blocks, onChange]
  )

  const handleReorder = useCallback(
    (reorderedBlocks: ContentBlock[]) => {
      // Update order property based on new positions
      const withUpdatedOrder = reorderedBlocks.map((block, index) => ({
        ...block,
        order: index,
      }))
      onChange(withUpdatedOrder)
    },
    [onChange]
  )

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Blocks List */}
      <Reorder.Group
        axis="y"
        values={blocks}
        onReorder={handleReorder}
        className="space-y-3"
      >
        {blocks.map((block) => (
          <BlockEditorItem
            key={block.id}
            block={block}
            onUpdate={updateBlock}
            onDelete={() => deleteBlock(block.id)}
          />
        ))}
      </Reorder.Group>

      {/* Empty state */}
      {blocks.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No content blocks yet</p>
          <p className="text-sm text-muted-foreground">Click "Add Block" to start building your content</p>
        </div>
      )}

      {/* Add Block Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Block
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-48">
          {blockTypes.map((item, index) => (
            <DropdownMenuItem
              key={`${item.type}-${index}`}
              onClick={() =>
                addBlock(item.type, {
                  level: item.level as 1 | 2 | 3 | undefined,
                  ordered: item.ordered,
                })
              }
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default BlockEditor
