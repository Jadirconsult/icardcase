import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FinalCTA } from '@/components/FinalCTA'
import { MarkdownContent } from '@/components/MarkdownContent'
import { RelatedLinks } from '@/components/RelatedLinks'
import { POSTS, formatDatePtBR, getPost, postLastModified, postReadingTime } from '@/lib/insights'
import { countWords } from '@/lib/markdown'
import {
  DEFAULT_OG_IMAGE,
  absoluteUrl,
  breadcrumbSchema,
  buildMetadata,
  organizationRef,
} from '@/lib/seo'

// Conteúdo dos posts mora em lib/insights.ts (fonte única com listagem e sitemap).

// Next 15+/16: params virou Promise — sempre await antes de usar
interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: 'Não encontrado' }
  return buildMetadata({
    title: post.metaTitle,
    description: post.description,
    path: `/insights/${slug}`,
    type: 'article',
    publishedTime: post.date,
    modifiedTime: postLastModified(post),
  })
}

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }))
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const path = `/insights/${slug}`
  const url = absoluteUrl(path)
  const modified = postLastModified(post)
  const readingTime = postReadingTime(post)

  // Schema.org Article — rich snippet no Google (autor, data, headline, imagem)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: [absoluteUrl(DEFAULT_OG_IMAGE.url)],
    datePublished: post.date,
    dateModified: modified,
    wordCount: countWords(post.content),
    author: {
      '@type': 'Person',
      name: 'Jadir Luiz de Oliveira Junior',
      jobTitle: 'CEO & Founder',
      worksFor: organizationRef,
    },
    // Referência ao nó da organização declarado no layout
    publisher: organizationRef,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: post.category,
    inLanguage: 'pt-BR',
  }

  // Schema.org BreadcrumbList — hierarquia navegável pro Google
  const breadcrumb = breadcrumbSchema([
    { name: 'Insights', path: '/insights' },
    { name: post.title, path },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <article className="section-y">
        <div className="container-content max-w-prose-wide">
          <Link
            href="/insights"
            className="inline-flex items-center gap-1 text-sm font-mono uppercase tracking-[0.12em] text-accent-text hover:text-ink link-underline"
          >
            ← Todos os insights
          </Link>
          <p className="mt-8 section-kicker">{post.category} · {readingTime} min de leitura</p>
          <h1 className="mt-2 text-display-lg text-ink">{post.title}</h1>
          <p className="mt-5 text-sm text-ink-subtle">
            Publicado em <time dateTime={post.date}>{formatDatePtBR(post.date)}</time>
            {modified !== post.date && (
              <>
                {' · '}Atualizado em <time dateTime={modified}>{formatDatePtBR(modified)}</time>
              </>
            )}
          </p>

          {/* Markdown vira elementos React escapados — sem HTML cru */}
          <MarkdownContent source={post.content} className="prose-icardcase mt-12" />

          <div className="mt-14 pt-8 border-t border-hairline text-sm text-ink-subtle">
            Por <strong className="text-ink font-semibold">Jadir Luiz de Oliveira Junior</strong> · CEO Icardcase
          </div>

          <RelatedLinks links={post.related} />
        </div>
      </article>
      <FinalCTA />
    </>
  )
}
