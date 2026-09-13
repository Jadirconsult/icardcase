import type { Metadata } from 'next'
import Link from 'next/link'
import { POSTS, postReadingTime } from '@/lib/insights'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Insights de tecnologia, fiscal e LGPD',
  description: 'Artigos técnicos sobre reforma tributária 2026, automação fiscal (DCTFWeb), LGPD e modernização de sistemas para empresas de todo o Brasil.',
  path: '/insights',
})

// Ordem da listagem + resumo próprio. Título, categoria e tempo de leitura
// vêm de lib/insights.ts — o tempo é calculado do texto, não digitado.
const listing = [
  { slug: 'reforma-tributaria-2026', excerpt: 'IBS e CBS entram em vigor em 2026 e vão reconstruir cálculo fiscal, emissão de nota e reporting. O que toda empresa que emite nota fiscal precisa preparar — em ordem de prioridade.' },
  { slug: 'migrar-visual-foxpro-web', excerpt: 'Sistema crítico em Visual FoxPro precisa sair. Mas qualquer parada de horas gera prejuízo direto. Como fazer migração em paralelo, validada por checksum, com corte cirúrgico.' },
  { slug: 'whatsapp-business-api-empresarial', excerpt: 'WhatsApp virou canal de venda B2B. Mas integração feita errado vira risco de banimento e vazamento de dados. Como construir arquitetura segura para escalar sem perder controle.' },
  { slug: 'dctfweb-automacao', excerpt: 'A DCTFWeb veio para ficar e centralizou obrigações que antes estavam fragmentadas. Mas a automação que escritórios contábeis fazem é, na maioria das vezes, frágil.' },
  { slug: 'lgpd-escritorio-contabil', excerpt: 'Escritórios contábeis tratam dados sensíveis em volume industrial. Aqui está o checklist que aplicamos em auditorias reais.' },
]

const posts = listing.flatMap(({ slug, excerpt }) => {
  const post = POSTS[slug]
  return post
    ? [{ slug, excerpt, title: post.title, category: post.category, readTime: `${postReadingTime(post)} min` }]
    : []
})

export default function InsightsPage() {
  return (
    <section className="section-y">
      <div className="container-content">
        <p className="section-kicker">INSIGHTS</p>
        <h1 className="mt-2 text-display-lg text-ink max-w-2xl">
          Conhecimento aplicado.
          <span className="block text-ink-muted">Antes de publicado.</span>
        </h1>

        <ul className="mt-14 border-t border-hairline">
          {posts.map((post, i) => (
            <li key={post.slug}>
              <Link
                href={`/insights/${post.slug}`}
                className="group flex items-baseline gap-6 py-7 border-b border-hairline transition-all duration-300 hover:border-hairline-strong"
              >
                <span className="flex-shrink-0 font-mono text-xs tracking-[0.1em] text-ink-tertiary transition-colors duration-300 group-hover:text-accent-text">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-3 mb-2">
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary">
                      {post.category}
                    </span>
                    <span className="text-ink-tertiary">·</span>
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary">
                      {post.readTime} de leitura
                    </span>
                  </div>
                  <h2 className="text-headline text-ink leading-snug transition-colors duration-300 group-hover:text-accent-text max-w-[60ch]">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-subtle max-w-[60ch]">
                    {post.excerpt}
                  </p>
                </div>

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="flex-shrink-0 self-center text-ink-tertiary transition-all duration-500 group-hover:text-accent-text group-hover:translate-x-1 group-hover:-translate-y-1"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
