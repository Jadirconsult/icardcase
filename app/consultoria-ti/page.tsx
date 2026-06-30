import type { Metadata } from 'next'
import Link from 'next/link'
import { FinalCTA } from '@/components/FinalCTA'
import { buildWhatsAppUrl, SITE } from '@/lib/constants'

const PAGE_URL = `${SITE.url}/consultoria-ti`

export const metadata: Metadata = {
  title: 'Consultoria em TI Empresarial · Avaliação Técnica e Modernização',
  description:
    'Consultoria em TI para empresas em todo o Brasil. Avaliação técnica de sistemas, escolha de stack, modernização de legado, due diligence em M&A, second opinion em projetos.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Consultoria em TI · Icardcase',
    description: 'Avaliação técnica, escolha de stack, modernização e due diligence para empresas no Brasil.',
    url: PAGE_URL,
    type: 'website',
  },
}

const faq = [
  {
    q: 'Vocês fazem consultoria sem precisar implementar depois?',
    a: 'Sim. Consultoria pode ser produto final independente. Casos comuns: você precisa de segunda opinião antes de aprovar projeto interno, está avaliando fornecedor de software, ou quer due diligence técnica antes de comprar empresa. Entregamos diagnóstico e recomendação — você decide o que faz com isso, inclusive contratar outro fornecedor para executar.',
  },
  {
    q: 'O que entra numa avaliação técnica?',
    a: 'Depende do escopo, mas o padrão inclui: arquitetura atual (com diagrama), stack tecnológica e maturidade dela, qualidade do código (revisão amostral), segurança e LGPD (gap analysis), performance (métricas reais), riscos operacionais, e estimativa de custo de manter vs trocar. Entregue como relatório técnico de 15-40 páginas + apresentação executiva de 1 hora.',
  },
  {
    q: 'Como vocês ajudam a escolher stack para projeto novo?',
    a: 'Workshop estruturado com seu time. Levantamos requisitos não-funcionais (escala esperada, latência, integração, time disponível, orçamento, prazo), comparamos 2-3 stacks finalistas por critérios objetivos (não por moda), e recomendamos com justificativa. Você sai com decisão fundamentada — não com checklist de Reddit.',
  },
  {
    q: 'Vocês fazem due diligence técnica em M&A?',
    a: 'Sim. Compra de empresa onde a tecnologia é ativo principal (SaaS, plataforma fiscal, fintech) exige auditoria técnica antes de fechar. Avaliamos: qualidade da base de código, dívida técnica acumulada, dependência de pessoas específicas (bus factor), riscos legais (licenças de software, LGPD), e estimamos investimento necessário pós-aquisição. NDA padrão sempre assinado.',
  },
  {
    q: 'Quanto custa uma consultoria pontual?',
    a: 'Modelo de cobrança varia. Para diagnóstico fechado (relatório + apresentação), trabalhamos com escopo fixo e investimento fechado. Para acompanhamento contínuo (CTO fracionado, mentoria mensal), modelo é hora ou pacote mensal. Conversa inicial de 30-60 min é sem custo para alinhar se faz sentido.',
  },
  {
    q: 'Em que vocês NÃO opinam?',
    a: 'Tópicos onde não somos os melhores: blockchain/crypto, machine learning em produção (recomendamos parceiros especializados), gestão de pessoas em TI (escopo de RH), questões trabalhistas. Não vendemos generalismo — recusamos consultoria onde não somos referência clara.',
  },
]

export default function ConsultoriaTiPage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Consultoria em Tecnologia da Informação',
    provider: { '@type': 'Organization', name: 'Icardcase', url: SITE.url, telephone: '+55-21-98878-5170' },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    description: 'Consultoria em TI — avaliação técnica, escolha de stack, modernização de legado, due diligence em M&A.',
    url: PAGE_URL,
  }
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })) }
  const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Início', item: SITE.url }, { '@type': 'ListItem', position: 2, name: 'Consultoria em TI', item: PAGE_URL }] }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="relative isolate overflow-hidden bg-canvas pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-32">
        <div className="bg-mesh absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="container-content relative">
          <p className="section-kicker">Serviço · Consultoria</p>
          <h1 className="mt-5 max-w-[20ch] text-display-xl text-ink">
            Antes de codar.
            <span className="block text-ink-muted">Avaliar o que precisa ser feito.</span>
          </h1>
          <p className="mt-8 max-w-[60ch] text-lg leading-[1.55] text-ink-subtle sm:text-xl">
            Consultoria técnica em TI para empresas em todo o Brasil. Avaliação técnica, escolha de
            stack, modernização de legado, due diligence em M&A, second opinion em projetos. Diagnóstico
            honesto, mesmo que a recomendação seja "não faça isso".
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a href={buildWhatsAppUrl('Olá! Quero conversar sobre consultoria em TI.')} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Conversar sobre consultoria
            </a>
            <Link href="/cases" className="btn-secondary">Ver cases em produção</Link>
          </div>
        </div>
      </section>

      <section className="relative bg-canvas section-y border-t border-hairline">
        <div className="container-content">
          <p className="section-kicker">Quando faz sentido</p>
          <h2 className="mt-5 text-display-lg text-ink">
            Consultoria não é vender hora.
            <span className="block text-ink-muted">É reduzir risco.</span>
          </h2>
          <p className="mt-8 max-w-[58ch] text-lg leading-[1.55] text-ink-subtle">
            Os 4 cenários onde consultoria entrega ROI mais claro:
          </p>
          <ul className="mt-12 grid gap-px bg-hairline border border-hairline rounded-xl overflow-hidden sm:grid-cols-2">
            {[
              { title: 'Avaliar fornecedor antes de fechar', body: 'Software house ou SaaS te propôs um projeto grande. Vale o preço? A stack é adequada? O cronograma é realista? Second opinion técnica antes de assinar evita ficar refém de fornecedor.' },
              { title: 'Modernizar sistema legado sem saber por onde começar', body: 'Sistema antigo trava, equipe interna não consegue mexer, fornecedor original sumiu. Avaliamos o cenário e recomendamos: refatorar, migrar, ou reescrever. Cada caminho tem custo e risco diferente.' },
              { title: 'Due diligence antes de M&A', body: 'Sua empresa está comprando outra cujo ativo principal é tecnologia. Antes de pagar, audite. Quanto vai custar manter? Quem é a pessoa-chave? A base de código é boa ou maquiada? Decisão milionária merece diligência.' },
              { title: 'Decidir stack para projeto novo', body: 'Vai construir produto novo (app, plataforma, integração). Stack errada compromete velocidade e custo por anos. Workshop de 2-3 dias entrega decisão fundamentada.' },
            ].map((s) => (
              <li key={s.title} className="bg-canvas p-7">
                <h3 className="text-card-title text-ink mb-3">{s.title}</h3>
                <p className="text-sm leading-[1.6] text-ink-subtle">{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative bg-canvas section-y border-t border-hairline">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-12 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <p className="section-kicker">Como entregamos</p>
              <h2 className="mt-5 text-display-lg text-ink">
                Escuta primeiro.
                <span className="block text-ink-muted">Opinião depois.</span>
              </h2>
              <p className="mt-8 text-lg leading-[1.55] text-ink-subtle max-w-[42ch]">
                Tipicamente 2-6 semanas para diagnóstico completo, dependendo do escopo.
              </p>
            </div>
            <ul className="lg:col-span-7 space-y-px border-t border-hairline">
              {[
                { num: '01', title: 'Briefing de objetivo', body: 'Conversa estruturada (60-90 min) para entender o problema real (não o sintoma). Quem decide, qual prazo, qual orçamento, quais alternativas já foram cogitadas. Sem custo nessa etapa.' },
                { num: '02', title: 'Análise técnica e documental', body: 'Acesso supervisionado a código, infraestrutura, documentos, conversas com a equipe. Análise comparativa de stacks, fornecedores ou cenários, conforme escopo. Geralmente 1-3 semanas.' },
                { num: '03', title: 'Relatório e recomendação', body: 'Documento técnico (15-40 páginas) cobrindo diagnóstico, alternativas analisadas, recomendação fundamentada, plano de ação e estimativa de custo. Linguagem clara — entrega para executivo e CTO.' },
                { num: '04', title: 'Apresentação executiva', body: 'Reunião de 60-90 min para apresentar a recomendação, responder perguntas, discutir trade-offs. Você sai com clareza para decidir, mesmo que a decisão seja não nos contratar para executar.' },
              ].map((step) => (
                <li key={step.num} className="py-8 border-b border-hairline">
                  <div className="flex gap-6">
                    <span className="flex-shrink-0 font-mono text-xs tracking-[0.1em] text-accent pt-1">{step.num}</span>
                    <div>
                      <h3 className="text-headline text-ink">{step.title}</h3>
                      <p className="mt-3 text-base leading-relaxed text-ink-subtle max-w-[60ch]">{step.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative bg-canvas section-y border-t border-hairline">
        <div className="container-content">
          <p className="section-kicker">Tipos de consultoria</p>
          <h2 className="mt-5 text-display-lg text-ink">
            Pra cada problema.
            <span className="block text-ink-muted">Um escopo certo.</span>
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { area: 'Avaliação técnica', techs: 'Diagnóstico de sistema, código, arquitetura' },
              { area: 'Escolha de stack', techs: 'Workshop comparativo para projeto novo' },
              { area: 'Due diligence', techs: 'Auditoria técnica para M&A' },
              { area: 'Second opinion', techs: 'Revisão de proposta de outro fornecedor' },
              { area: 'CTO fracionado', techs: 'Liderança técnica em meio-período' },
              { area: 'Plano de modernização', techs: 'Roadmap de sair do legado' },
            ].map((item) => (
              <div key={item.area} className="surface-card p-6">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary">{item.area}</p>
                <p className="mt-3 text-base text-ink-muted">{item.techs}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-canvas section-y border-t border-hairline">
        <div className="container-content">
          <p className="section-kicker">FAQ · Perguntas frequentes</p>
          <h2 className="mt-5 text-display-lg text-ink">O que perguntam antes.</h2>
          <ul className="mt-12 border-t border-hairline">
            {faq.map((item, i) => (
              <li key={i} className="border-b border-hairline">
                <details className="group py-6">
                  <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
                    <h3 className="text-headline text-ink group-open:text-accent transition-colors">{item.q}</h3>
                    <span className="flex-shrink-0 mt-1 text-ink-subtle group-open:text-accent group-open:rotate-45 transition-transform">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-ink-subtle">{item.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
