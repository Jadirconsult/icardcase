import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FinalCTA } from '@/components/FinalCTA'
import { RelatedLinks } from '@/components/RelatedLinks'
import { CASES, getCase } from '@/lib/cases'
import { absoluteUrl, breadcrumbSchema, buildMetadata, organizationRef } from '@/lib/seo'

// Dados dos cases moram em lib/cases.ts (fonte única com o sitemap).

export function generateStaticParams() {
  return Object.keys(CASES).map((slug) => ({ slug }))
}

// Next 15+/16: params virou Promise — sempre await antes de usar
type CasePageParams = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: CasePageParams }): Promise<Metadata> {
  const { slug } = await params
  const c = getCase(slug)
  if (!c) return { title: 'Não encontrado' }
  return buildMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    path: `/cases/${slug}`,
  })
}

export default async function CasePage({ params }: { params: CasePageParams }) {
  const { slug } = await params
  const c = getCase(slug)
  if (!c) notFound()

  const path = `/cases/${slug}`
  const url = absoluteUrl(path)

  // Schema.org CreativeWork — descreve o case como obra de engenharia
  const caseSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: c.title,
    headline: `${c.title} — ${c.subtitle}`,
    description: c.subtitle,
    abstract: c.problem,
    keywords: c.tech.join(', '),
    inLanguage: 'pt-BR',
    // Referência ao nó da organização declarado no layout
    creator: organizationRef,
    about: c.segment,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }

  const breadcrumb = breadcrumbSchema([
    { name: 'Cases', path: '/cases' },
    { name: c.title, path },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <article className="section-y">
        <div className="container-content max-w-prose-wide">
          <Link
            href="/cases"
            className="inline-flex items-center gap-1 text-sm font-mono uppercase tracking-[0.12em] text-accent-hover hover:text-accent-text link-underline"
          >
            ← Todos os cases
          </Link>
          <p className="mt-8 section-kicker">{c.segment}</p>
          <h1 className="mt-2 text-display-lg text-ink">{c.title}</h1>
          <p className="mt-4 text-body-lg text-ink-muted">{c.subtitle}</p>

          <div className="mt-12 space-y-10">
            <section>
              <h2 className="text-headline text-ink">Desafio</h2>
              <p className="mt-4 text-base leading-[1.65] text-ink-muted">{c.problem}</p>
            </section>
            <section>
              <h2 className="text-headline text-ink">Solução</h2>
              <p className="mt-4 text-base leading-[1.65] text-ink-muted">{c.solution}</p>
            </section>
            <section>
              <h2 className="text-headline text-ink">Resultados</h2>
              <ul className="mt-4 space-y-3">
                {c.results.map((r) => (
                  <li key={r} className="flex gap-3 items-start text-base text-ink-muted leading-[1.6]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0 mt-1 text-accent-text" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-headline text-ink">Stack</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.tech.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-md border border-hairline bg-surface-1 px-3 py-1.5 font-mono text-xs text-ink-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <RelatedLinks links={c.related} />
        </div>
      </article>
      <FinalCTA />
    </>
  )
}
