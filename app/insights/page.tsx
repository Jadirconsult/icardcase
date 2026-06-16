import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Artigos técnicos sobre reforma tributária, LGPD, automação fiscal e tecnologia para escritórios contábeis.',
}

const posts = [
  { slug: 'reforma-tributaria-2026', title: 'Reforma tributária 2026: o que muda no sistema do seu escritório contábil', readTime: '8 min', category: 'Reforma tributária', excerpt: 'A transição IBS/CBS começa em janeiro de 2026 com alíquota de teste. O que precisa estar pronto no seu sistema — em ordem de prioridade.' },
  { slug: 'dctfweb-automacao', title: 'DCTFWeb sem erro: automação real para escritórios contábeis', readTime: '6 min', category: 'Automação fiscal', excerpt: 'A DCTFWeb veio para ficar e centralizou obrigações que antes estavam fragmentadas. Mas a automação que escritórios contábeis fazem é, na maioria das vezes, frágil.' },
  { slug: 'lgpd-escritorio-contabil', title: 'LGPD no escritório contábil: checklist de 23 itens auditados', readTime: '10 min', category: 'LGPD', excerpt: 'Escritórios contábeis tratam dados sensíveis em volume industrial. Aqui está o checklist que aplicamos em auditorias reais.' },
]

export default function InsightsPage() {
  return (
    <section className="section-y bg-white">
      <div className="container-content">
        <p className="section-kicker">INSIGHTS</p>
        <h1 className="mt-2 text-h1 font-semibold text-brand-navy max-w-2xl">
          Conteúdo técnico que aplicamos antes de publicar.
        </h1>

        <ul className="mt-12 space-y-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/insights/${post.slug}`} className="group block border-b border-brand-navy/10 pb-6 hover:border-brand-blue transition-colors">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">{post.category} · {post.readTime} de leitura</p>
                <h2 className="mt-2 text-xl font-semibold text-brand-navy group-hover:text-brand-blue transition-colors">{post.title}</h2>
                <p className="mt-2 text-sm text-brand-gray max-w-2xl">{post.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
