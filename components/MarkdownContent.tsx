import Link from 'next/link'
import type { ReactNode } from 'react'
import { isInternalHref, parseMarkdown, type Inline } from '@/lib/markdown'

interface MarkdownContentProps {
  /** Texto em markdown (subconjunto suportado em lib/markdown.ts). */
  source: string
  className?: string
}

function renderInline(nodes: Inline[]): ReactNode[] {
  return nodes.map((node, i) => {
    if (node.type === 'text') return node.text
    if (node.type === 'strong') return <strong key={i}>{renderInline(node.children)}</strong>
    if (isInternalHref(node.href)) {
      return (
        <Link key={i} href={node.href}>
          {renderInline(node.children)}
        </Link>
      )
    }
    return (
      <a key={i} href={node.href} target="_blank" rel="noopener noreferrer">
        {renderInline(node.children)}
      </a>
    )
  })
}

/**
 * Renderiza markdown como elementos React (escapados) — sem
 * dangerouslySetInnerHTML. O estilo vem do container (ex.: `.prose-icardcase`).
 */
export function MarkdownContent({ source, className }: MarkdownContentProps) {
  const blocks = parseMarkdown(source)

  return (
    <div className={className}>
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          const Heading = block.level === 2 ? 'h2' : 'h3'
          return <Heading key={i}>{renderInline(block.children)}</Heading>
        }
        if (block.type === 'list') {
          const items = block.items.map((item, j) => <li key={j}>{renderInline(item)}</li>)
          return block.ordered ? (
            <ol key={i} start={block.start === 1 ? undefined : block.start}>
              {items}
            </ol>
          ) : (
            <ul key={i}>{items}</ul>
          )
        }
        return <p key={i}>{renderInline(block.children)}</p>
      })}
    </div>
  )
}
