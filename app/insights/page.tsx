import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Insights de tecnologia, fiscal e LGPD',
  description: 'Artigos técnicos sobre reforma tributária 2026, automação fiscal (DCTFWeb), LGPD e modernização de sistemas para empresas de todo o Brasil.',
  alternates: { canonical: '/insights' },
}

const posts = [
  { slug: 'reforma-tributaria-2026', title: 'Reforma tributária 2026: IBS e CBS — o que muda no sistema da sua empresa', readTime: '9 min', category: 'Reforma tributária', excerpt: 'IBS e CBS entram em vigor em 2026 e vão reconstruir cálculo fiscal, emissão de nota e reporting. O que toda empresa que emite nota fiscal precisa preparar — em ordem de prioridade.' },
  { slug: 'migrar-visual-foxpro-web', title: 'Como migrar Visual FoxPro para web sem parar a operação', readTime: '11 min', category: 'Modernização de legado', excerpt: 'Sistema crítico em Visual FoxPro precisa sair. Mas qualquer parada de horas gera prejuízo direto. Como fazer migração em paralelo, validada por checksum, com corte cirúrgico.' },
  { slug: 'whatsapp-business-api-empresarial', title: 'WhatsApp Business API empresarial: arquitetura segura para escalar atendimento', readTime: '8 min', category: 'Automação', excerpt: 'WhatsApp virou canal de venda B2B. Mas integração feita errado vira risco de banimento e vazamento de dados. Como construir arquitetura segura para escalar sem perder controle.' },
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
