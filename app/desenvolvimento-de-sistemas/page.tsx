import type { Metadata } from 'next'
import Link from 'next/link'
import { FinalCTA } from '@/components/FinalCTA'
import { buildWhatsAppUrl, SITE } from '@/lib/constants'

const PAGE_URL = `${SITE.url}/desenvolvimento-de-sistemas`

export const metadata: Metadata = {
  title: 'Desenvolvimento de Sistemas Sob Medida · Web e Mobile no Brasil',
  description:
    'Desenvolvimento de sistemas web e mobile sob medida para empresas em todo o Brasil. ERPs, plataformas multi-tenant, integração SEFAZ, automação de processos. CEO no projeto, sem terceirização.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Desenvolvimento de Sistemas Sob Medida · Icardcase',
    description:
      'Sistemas web e mobile sob medida para empresas no Brasil — ERPs, multi-tenant, integração SEFAZ. CEO no projeto, sem call center.',
    url: PAGE_URL,
    type: 'website',
  },
}

const faq = [
  {
    q: 'O que é um sistema sob medida?',
    a: 'É um software construído especificamente para o seu processo, suas regras de negócio e seu fluxo de trabalho. Diferente de um SaaS de prateleira (que obriga você a se adaptar a ele), o sistema sob medida se adapta à empresa. Faz sentido quando o processo é diferenciado, quando o sistema legado já não acompanha o crescimento, ou quando integração com SEFAZ, ERPs e ferramentas internas precisa ser profunda.',
  },
  {
    q: 'Quanto tempo leva pra construir um sistema sob medida?',
    a: 'Depende do escopo. Um MVP funcional fica em 60-90 dias. Um sistema operacional completo (multi-módulo, integração fiscal, multi-tenant) leva 4-9 meses. Trabalhamos com entregas incrementais (release a cada 2-4 semanas), então você usa o sistema antes dele estar 100% pronto.',
  },
  {
    q: 'Vocês atendem empresas fora do Rio de Janeiro?',
    a: 'Sim. Atendemos empresas em todo o Brasil de forma remota. A operação de TI moderna não precisa de presença física — code review, deploys, monitoramento, suporte e treinamento acontecem 100% online. Já entregamos projetos para clientes no RJ, SP, PA, MG e RS.',
  },
  {
    q: 'Quais tecnologias vocês usam?',
    a: 'Stack moderno e maduro: Next.js + React + TypeScript no frontend, FastAPI / Laravel no backend, Supabase / PostgreSQL como banco, Docker + Traefik em produção. Para mobile, React Native ou Expo. A escolha exata depende do projeto — não somos religiosos com framework.',
  },
  {
    q: 'O que diferencia vocês de uma agência de software?',
    a: 'Três coisas. Primeiro: quem fecha contigo executa. Não tem trainee aprendendo no seu projeto, não tem freelancer terceirizado. Segundo: 14 anos de mercado e 15 anos prévios em infraestrutura crítica (Vale, Camargo Corrêa, EFVM) — sabemos o que é prazo apertado e sistema de missão crítica. Terceiro: ticket alto, poucos clientes por ano — cada projeto tem atenção real, não está numa fila de 50 contas paralelas.',
  },
  {
    q: 'Vocês desenvolvem aplicativo mobile também?',
    a: 'Sim. Stack React Native / Expo, publicação em App Store e Google Play, integração com sistemas backend que você já tem. Veja /desenvolvimento-mobile para detalhes.',
  },
]

export default function DesenvolvimentoDeSistemasPage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Desenvolvimento de Sistemas Sob Medida',
    provider: {
      '@type': 'Organization',
      name: 'Icardcase',
      url: SITE.url,
      telephone: '+55-21-98878-5170',
    },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    description:
      'Desenvolvimento de sistemas web e mobile sob medida — ERPs, plataformas multi-tenant, integração SEFAZ, automação de processos para empresas em todo o Brasil.',
    url: PAGE_URL,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'BRL',
      description: 'Diagnóstico técnico inicial sem custo. Proposta em até 5 dias úteis.',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Desenvolvimento de Sistemas', item: PAGE_URL },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* HERO da página de serviço */}
      <section className="relative isolate overflow-hidden bg-canvas pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-32">
        <div className="bg-mesh absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="container-content relative">
          <p className="section-kicker">Serviço · Desenvolvimento</p>
          <h1 className="mt-5 max-w-[20ch] text-display-xl text-ink">
            Sistemas sob medida.
            <span className="block text-ink-muted">Construídos pra durar.</span>
          </h1>
          <p className="mt-8 max-w-[60ch] text-lg leading-[1.55] text-ink-subtle sm:text-xl">
            Desenvolvimento de sistemas web e mobile para empresas em todo o Brasil. ERPs, plataformas
            multi-tenant, integração SEFAZ, automação de processos. CEO no projeto, sem terceirização,
            sem call center.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a
              href={buildWhatsAppUrl('Olá! Quero conversar sobre desenvolvimento de sistema sob medida.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Conversar sobre meu projeto
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <Link href="/cases" className="btn-secondary">
              Ver cases em produção
            </Link>
          </div>
        </div>
      </section>

      {/* QUANDO FAZ SENTIDO */}
      <section className="relative bg-canvas section-y border-t border-hairline">
        <div className="container-content">
          <p className="section-kicker">Quando faz sentido</p>
          <h2 className="mt-5 text-display-lg text-ink">
            Você não precisa de um sistema.
            <span className="block text-ink-muted">Precisa de um que resolva.</span>
          </h2>
          <p className="mt-8 max-w-[58ch] text-lg leading-[1.55] text-ink-subtle">
            Sistema sob medida não é luxo. É decisão técnica e econômica que faz sentido em cenários
            específicos. Aqui estão os 4 mais comuns que atendemos:
          </p>

          <ul className="mt-12 grid gap-px bg-hairline border border-hairline rounded-xl overflow-hidden sm:grid-cols-2">
            {[
              {
                title: 'Seu SaaS atual obriga você a se adaptar a ele',
                body: 'Você paga mensalidade pesada e ainda assim faz workaround em planilha porque o processo da sua empresa não cabe no produto. Um sistema sob medida inverte isso: o software se molda ao processo.',
              },
              {
                title: 'O sistema legado já não escala',
                body: 'Visual FoxPro, Delphi antigo, Access multiusuário, planilha gigante. Funciona, mas trava, perde dado, dificulta auditoria. Migrar pra moderno sem parar a operação é exatamente o que entregamos no case Prossiga.',
              },
              {
                title: 'Integração com SEFAZ ou ERP é dor crônica',
                body: 'NF-e, NFC-e, NFS-e nacional, SPED, DCTFWeb, integração com TOTVS / Sankhya / Domínio. Construímos a camada de integração que respeita o ritmo da SEFAZ e o seu fluxo interno.',
              },
              {
                title: 'A reforma tributária 2026 está chegando',
                body: 'IBS e CBS entram em janeiro de 2026 com novos campos na nota fiscal, alíquotas por município, regime dual de cálculo. Sistemas legados vão precisar reescrever — ou ser substituídos. Quanto antes começar, melhor.',
              },
            ].map((scenario) => (
              <li key={scenario.title} className="bg-canvas p-7">
                <h3 className="text-card-title text-ink mb-3">{scenario.title}</h3>
                <p className="text-sm leading-[1.6] text-ink-subtle">{scenario.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* COMO ENTREGAMOS */}
      <section className="relative bg-canvas section-y border-t border-hairline">
        <div className="container-content">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-12 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <p className="section-kicker">Como entregamos</p>
              <h2 className="mt-5 text-display-lg text-ink">
                Engenharia primeiro.
                <span className="block text-ink-muted">Marketing depois.</span>
              </h2>
              <p className="mt-8 text-lg leading-[1.55] text-ink-subtle max-w-[42ch]">
                Cada projeto passa pelas mesmas 4 fases — não pulamos nenhuma, mesmo em sprint curto.
              </p>
            </div>

            <ul className="lg:col-span-7 space-y-px border-t border-hairline">
              {[
                {
                  num: '01',
                  title: 'Diagnóstico técnico',
                  body: 'Conversa de 60-90 min mapeando o problema real (não o sintoma). Análise do sistema atual se existir. Documento técnico em 5 dias úteis com escopo, stack, prazo e investimento estimado. Sem custo.',
                },
                {
                  num: '02',
                  title: 'Arquitetura e modelo',
                  body: 'Modelagem de dados (DBML), diagrama de fluxo, decisões de stack documentadas, política de segurança e LGPD desde o dia 1. Você revisa e aprova antes da primeira linha de código.',
                },
                {
                  num: '03',
                  title: 'Desenvolvimento incremental',
                  body: 'Release a cada 2-4 semanas, em ambiente de staging acessível. Você usa o sistema antes dele estar pronto, dá feedback, ajusta rumo. Sem big bang.',
                },
                {
                  num: '04',
                  title: 'Operação assistida',
                  body: 'Após go-live, contrato de evolução e suporte. Você continua sendo dono do código (repositório em sua conta), mas tem o time que construiu disponível pra evoluir e operar.',
                },
              ].map((step) => (
                <li key={step.num} className="py-8 border-b border-hairline">
                  <div className="flex gap-6">
                    <span className="flex-shrink-0 font-mono text-xs tracking-[0.1em] text-accent pt-1">
                      {step.num}
                    </span>
                    <div>
                      <h3 className="text-headline text-ink">{step.title}</h3>
                      <p className="mt-3 text-base leading-relaxed text-ink-subtle max-w-[60ch]">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* STACK */}
      <section className="relative bg-canvas section-y border-t border-hairline">
        <div className="container-content">
          <p className="section-kicker">Stack</p>
          <h2 className="mt-5 text-display-lg text-ink">
            Tecnologia moderna.
            <span className="block text-ink-muted">Sem modismo gratuito.</span>
          </h2>
          <p className="mt-8 max-w-[58ch] text-lg leading-[1.55] text-ink-subtle">
            Stack escolhida pela maturidade, pela comunidade ativa e pela facilidade de você continuar
            mantendo no futuro (mesmo sem a gente). Nada experimental em produção.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { area: 'Frontend Web', techs: 'Next.js · React · TypeScript · Tailwind' },
              { area: 'Frontend Mobile', techs: 'React Native · Expo' },
              { area: 'Backend API', techs: 'FastAPI · Laravel · Node.js' },
              { area: 'Banco de Dados', techs: 'PostgreSQL · Supabase · Redis' },
              { area: 'Infraestrutura', techs: 'Docker · Traefik · Vercel · VPS' },
              { area: 'Integração', techs: 'SEFAZ · N8N · Evolution API · Webhooks' },
            ].map((item) => (
              <div key={item.area} className="surface-card p-6">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary">
                  {item.area}
                </p>
                <p className="mt-3 text-base text-ink-muted">{item.techs}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASES */}
      <section className="relative bg-canvas section-y border-t border-hairline">
        <div className="container-content">
          <p className="section-kicker">Cases em produção</p>
          <h2 className="mt-5 text-display-lg text-ink">
            Não é portfólio.
            <span className="block text-ink-muted">São sistemas em operação real.</span>
          </h2>

          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {[
              { slug: 'syspershy', title: 'SYSPERSHY', segment: 'Indústria Química · ISO 9001', desc: 'ERP completo de 94 tabelas substituindo VBA/Access legado.' },
              { slug: 'prossiga', title: 'Prossiga', segment: 'Estacionamento', desc: 'Migração de Visual FoxPro para Supabase sem parar receita.' },
              { slug: 'nf-saas', title: 'NF SaaS', segment: 'Plataforma Fiscal', desc: 'Multi-tenant Laravel para NF-e e NFC-e, pronto para IBS/CBS.' },
              { slug: 'ufrj', title: 'UFRJ', segment: 'Órgão Público Federal', desc: 'Gestão de TI para empresa sediada em campus UFRJ.' },
            ].map((c) => (
              <li key={c.slug}>
                <Link href={`/cases/${c.slug}`} className="surface-card block p-7 transition-all hover:-translate-y-1">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary">{c.segment}</p>
                  <h3 className="mt-3 text-headline text-ink">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-subtle">{c.desc}</p>
                  <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent">
                    Ver case →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ — ranqueia em "People Also Ask" do Google */}
      <section className="relative bg-canvas section-y border-t border-hairline">
        <div className="container-content">
          <p className="section-kicker">FAQ · Perguntas frequentes</p>
          <h2 className="mt-5 text-display-lg text-ink">
            O que perguntam antes de fechar.
          </h2>

          <ul className="mt-12 border-t border-hairline">
            {faq.map((item, i) => (
              <li key={i} className="border-b border-hairline">
                <details className="group py-6">
                  <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
                    <h3 className="text-headline text-ink group-open:text-accent transition-colors">
                      {item.q}
                    </h3>
                    <span className="flex-shrink-0 mt-1 text-ink-subtle group-open:text-accent group-open:rotate-45 transition-transform">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-ink-subtle">
                    {item.a}
                  </p>
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
