import Link from 'next/link'
import type { RelatedLink } from '@/lib/insights'

interface RelatedLinksProps {
  links: RelatedLink[]
  title?: string
}

/**
 * Bloco "Veja também" no fim de artigos e cases — links internos definidos
 * por dados (campo `related` em lib/insights.ts e lib/cases.ts).
 */
export function RelatedLinks({ links, title = 'Veja também' }: RelatedLinksProps) {
  if (links.length === 0) return null

  return (
    <nav aria-labelledby="veja-tambem" className="mt-14 border-t border-hairline pt-8">
      <h2
        id="veja-tambem"
        className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary"
      >
        {title}
      </h2>
      <ul className="mt-4 space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="link-underline min-h-[44px] text-base text-ink-muted hover:text-ink transition-colors"
            >
              {link.label} →
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
