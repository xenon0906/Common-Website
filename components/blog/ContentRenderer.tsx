'use client'

import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { motion } from 'framer-motion'
import type {
  ContentBlock,
  ParagraphBlock,
  HeadingBlock,
  ImageBlock,
  QuoteBlock,
  ListBlock,
} from '@/lib/types/blog'

interface ContentRendererProps {
  content: string // Legacy markdown
  contentBlocks?: ContentBlock[]
  contentVersion?: 1 | 2
  className?: string
}

// Render inline markdown (bold, italic, links)
function InlineMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <>{children}</>,
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-primary hover:underline font-medium"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children }) => (
          <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm text-primary">
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

function ParagraphBlockRenderer({ block }: { block: ParagraphBlock }) {
  return (
    <p className="mb-6 text-lg leading-[1.8] text-gray-700 dark:text-gray-300">
      <InlineMarkdown content={block.content} />
    </p>
  )
}

function HeadingBlockRenderer({ block }: { block: HeadingBlock }) {
  const className = {
    1: 'text-4xl font-bold mt-12 mb-6 text-gray-900 dark:text-white leading-tight tracking-tight',
    2: 'text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-white leading-snug tracking-tight',
    3: 'text-2xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white leading-snug',
  }[block.level]

  if (block.level === 1) {
    return <h1 className={className}>{block.content}</h1>
  } else if (block.level === 2) {
    return <h2 className={className}>{block.content}</h2>
  } else {
    return <h3 className={className}>{block.content}</h3>
  }
}

function ImageBlockRenderer({ block }: { block: ImageBlock }) {
  // Handle both 'url' and 'imageUrl' fields for backward compatibility
  const imageUrl = block.url || (block as any).imageUrl || ''

  // Skip rendering if no valid image URL
  if (!imageUrl) {
    console.warn('ImageBlock missing url/imageUrl:', block)
    return null
  }

  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-8"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
        <Image
          src={imageUrl}
          alt={block.alt || ''}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      {block.caption && (
        <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3 italic">
          {block.caption}
        </figcaption>
      )}
    </motion.figure>
  )
}

function QuoteBlockRenderer({ block }: { block: QuoteBlock }) {
  return (
    <blockquote className="border-l-4 border-primary pl-6 py-3 my-8 bg-gray-50 dark:bg-gray-900 rounded-r">
      <p className="italic text-gray-800 dark:text-gray-200 text-xl leading-relaxed">
        <InlineMarkdown content={block.content} />
      </p>
      {block.attribution && (
        <footer className="mt-3 text-base text-gray-600 dark:text-gray-400 not-italic">
          — {block.attribution}
        </footer>
      )}
    </blockquote>
  )
}

function ListBlockRenderer({ block }: { block: ListBlock }) {
  const ListTag = block.ordered ? 'ol' : 'ul'
  const listClass = block.ordered
    ? 'list-decimal pl-8 mb-6 space-y-3'
    : 'list-disc pl-8 mb-6 space-y-3'

  return (
    <ListTag className={listClass}>
      {block.items.map((item, index) => (
        <li key={index} className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          <InlineMarkdown content={item} />
        </li>
      ))}
    </ListTag>
  )
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <ParagraphBlockRenderer block={block} />
    case 'heading':
      return <HeadingBlockRenderer block={block} />
    case 'image':
      return <ImageBlockRenderer block={block} />
    case 'quote':
      return <QuoteBlockRenderer block={block} />
    case 'list':
      return <ListBlockRenderer block={block} />
    default:
      return null
  }
}

// Full markdown renderer (legacy content)
function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold mt-8 mb-4 text-primary">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-gray-600 dark:text-gray-300">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-4 py-2 my-6 bg-primary/5 rounded-r-lg italic text-gray-700 dark:text-gray-300">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-primary hover:underline font-medium"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>
        ),
        code: ({ children }) => (
          <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm text-primary">
            {children}
          </code>
        ),
        img: ({ src, alt }) => {
          const imgSrc = typeof src === 'string' ? src : ''
          return (
            <figure className="my-8">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src={imgSrc}
                  alt={alt || ''}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              {alt && (
                <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {alt}
                </figcaption>
              )}
            </figure>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export function ContentRenderer({
  content,
  contentBlocks,
  contentVersion = 1,
  className = '',
}: ContentRendererProps) {
  // Use blocks if version is 2 and blocks exist
  if (contentVersion === 2 && contentBlocks && contentBlocks.length > 0) {
    // Sort blocks by order
    const sortedBlocks = [...contentBlocks].sort((a, b) => a.order - b.order)

    return (
      <article className={`prose prose-lg max-w-none dark:prose-invert ${className}`}>
        {sortedBlocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </article>
    )
  }

  // Fallback to markdown rendering
  return (
    <article className={`prose prose-lg max-w-none dark:prose-invert ${className}`}>
      <MarkdownRenderer content={content} />
    </article>
  )
}

export default ContentRenderer
