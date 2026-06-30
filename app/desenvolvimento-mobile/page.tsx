import type { Metadata } from 'next'
import Link from 'next/link'
import { FinalCTA } from '@/components/FinalCTA'
import { buildWhatsAppUrl, SITE } from '@/lib/constants'

const PAGE_URL = `${SITE.url}/desenvolvimento-mobile`

export const metadata: Metadata = {
  title: 'Desenvolvimento de Aplicativo Mobile Sob Medida · iOS e Android',
  description:
    'Desenvolvimento de aplicativos mobile sob medida para empresas em todo o Brasil. React Native, Expo, integração com sistemas corporativos, publicação na App Store e Google Play.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Desenvolvimento de Aplicativo Mobile Sob Medida · Icardcase',
    description: 'Aplicativos iOS e Android sob medida — React Native, Expo, integração com seu sistema.',
    url: PAGE_URL,
    type: 'website',
  },
}

const faq = [
  {
    q: 'Por que React Native ao invés de nativo (Swift/Kotlin)?',
    a: 'Pela economia. React Native (com Expo) entrega um único código rodando em iOS e Android com performance próxima do nativo, em metade do tempo e custo. Para 90% dos apps empresariais (dashboards, formulários, integração com backend), é a escolha certa. Reservamos nativo puro para casos específicos: AR, processamento de vídeo em tempo real, integração com hardware proprietário.',
  },
  {
    q: 'Vocês publicam o app na App Store e Google Play?',
    a: 'Sim. Cuidamos do processo completo: ícone, screenshots, descrição, formulários de privacidade, certificados de assinatura, revisão da Apple e Google. Você precisa apenas das contas de developer (R$ 99/ano Apple, US$ 25 Google — taxas próprias da plataforma) em nome da sua empresa.',
  },
  {
    q: 'O app precisa de internet pra funcionar?',
    a: 'Depende do projeto. Construímos com cache local (SQLite ou WatermelonDB) para funcionar offline e sincronizar quando voltar a conexão — útil para vendedores em campo, equipes em obra, motoristas. Para apps que dependem de informação fresca (saldo, NF-e em tempo real), exigimos conexão.',
  },
  {
    q: 'O app vai funcionar em celular antigo?',
    a: 'Mantemos compatibilidade com iOS 16+ e Android 9+ (chega em 95% dos aparelhos ativos no Brasil em 2026). Versões mais antigas podem rodar com limitações. Sempre validamos no escopo inicial qual é o parque de aparelhos do seu público.',
  },
  {
    q: 'Quanto custa manter um app mobile depois de pronto?',
    a: 'Três custos. (1) Contas de developer: R$ 600/ano Apple + R$ 130 Google (única). (2) Servidor/banco: variável conforme tráfego, geralmente R$ 200-2.000/mês. (3) Manutenção evolutiva: depende do contrato — sugerimos pacote mensal cobrindo atualizações do iOS/Android (a Apple e Google quebram coisas a cada ~12 meses) + ajustes evolutivos.',
  },
  {
    q: 'O app vai funcionar em tablet também?',
    a: 'Sim, se projetado pra isso. React Native + nossa abordagem de layout responsivo entrega o mesmo app em celular e tablet. Para apps onde o tablet é o uso principal (ponto de atendimento, prontuário médico, balcão), otimizamos especificamente para tela maior.',
  },
]

export default function DesenvolvimentoMobilePage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Desenvolvimento de Aplicativo Mobile Sob Medida',
    provider: { '@type': 'Organization', name: 'Icardcase', url: SITE.url, telephone: '+55-21-98878-5170' },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    description: 'Desenvolvimento de aplicativos mobile iOS e Android sob medida — React Native, Expo, integração com sistemas backend.',
    url: PAGE_URL,
  }
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })) }
  const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Início', item: SITE.url }, { '@type': 'ListItem', position: 2, name: 'Desenvolvimento Mobile', item: PAGE_URL }] }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="relative isolate overflow-hidden bg-canvas pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-32">
        <div className="bg-mesh absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="container-content relative">
          <p className="section-kicker">Serviço · Mobile</p>
          <h1 className="mt-5 max-w-[20ch] text-display-xl text-ink">
            Apps sob medida.
            <span className="block text-ink-muted">Pra quem precisa.</span>
          </h1>
          <p className="mt-8 max-w-[60ch] text-lg leading-[1.55] text-ink-subtle sm:text-xl">
            Desenvolvimento de aplicativos iOS e Android sob medida para empresas em todo o Brasil.
            React Native, Expo, integração com seu sistema atual, publicação nas lojas. Sem template
            de prateleira, sem terceirização.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a href={buildWhatsAppUrl('Olá! Quero conversar sobre desenvolvimento de aplicativo mobile.')} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Conversar sobre meu app
            </a>
            <Link href="/cases" className="btn-secondary">Ver cases em produção</Link>
          </div>
        </div>
      </section>

      <section className="relative bg-canvas section-y border-t border-hairline">
        <div className="container-content">
          <p className="section-kicker">Quando faz sentido</p>
          <h2 className="mt-5 text-display-lg text-ink">
            App não é sempre a resposta.
            <span className="block text-ink-muted">Mas quando é, é definitiva.</span>
          </h2>
          <p className="mt-8 max-w-[58ch] text-lg leading-[1.55] text-ink-subtle">
            App mobile faz sentido em cenários específicos. Os 4 mais frequentes que atendemos:
          </p>
          <ul className="mt-12 grid gap-px bg-hairline border border-hairline rounded-xl overflow-hidden sm:grid-cols-2">
            {[
              { title: 'Sua equipe trabalha em campo', body: 'Vendedores externos, técnicos em obra, motoristas, entregadores. Acesso ao sistema precisa estar na palma da mão, sem depender de internet o tempo todo. Cache local + sincronização inteligente.' },
              { title: 'Seu cliente final precisa do canal direto', body: 'App próprio com sua marca para reservas, agendamentos, consulta de saldo, comunicação. Tirar você da dependência do WhatsApp ou de marketplaces.' },
              { title: 'O fluxo no celular precisa ser específico', body: 'Site responsivo cobre o básico, mas para fluxos complexos (checkout multi-passos, leitor de QR code, captura de foto com OCR, notificação push), o app entrega experiência superior.' },
              { title: 'Você quer presença na App Store e Google Play', body: 'Aparecer nas lojas oficiais comunica seriedade. Cliente B2B premium pesquisa antes de fechar, e ver "disponível na App Store" valida que a empresa investe em tecnologia.' },
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
                Do brief à loja.
                <span className="block text-ink-muted">Sem etapa pulada.</span>
              </h2>
              <p className="mt-8 text-lg leading-[1.55] text-ink-subtle max-w-[42ch]">
                Cada projeto mobile passa pelas mesmas 4 fases. Da brief até o app publicado, tipicamente 90-150 dias.
              </p>
            </div>
            <ul className="lg:col-span-7 space-y-px border-t border-hairline">
              {[
                { num: '01', title: 'Diagnóstico e brief', body: 'Conversa sobre o objetivo do app, perfil do usuário, integrações necessárias (com seu ERP, banco, gateway de pagamento). Documento técnico em 5 dias úteis.' },
                { num: '02', title: 'Design e protótipo', body: 'Design de interface (Figma) navegável antes de codar. Você testa o protótipo no celular, ajustamos antes de virar código.' },
                { num: '03', title: 'Desenvolvimento e testes em loja interna', body: 'Build a cada 2 semanas via TestFlight (iOS) e Internal Testing (Google Play). Você testa nos seus aparelhos antes de cada release.' },
                { num: '04', title: 'Publicação e operação', body: 'Submissão à App Store e Google Play (revisão da Apple leva 1-3 dias, Google 4-24h). Contrato de evolução cobrindo atualizações iOS/Android e ajustes funcionais.' },
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
          <p className="section-kicker">Stack</p>
          <h2 className="mt-5 text-display-lg text-ink">
            Tecnologia comprovada.
            <span className="block text-ink-muted">iOS e Android.</span>
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { area: 'Framework', techs: 'React Native · Expo' },
              { area: 'Estado/Dados', techs: 'TanStack Query · Zustand · WatermelonDB' },
              { area: 'Backend', techs: 'Supabase · Firebase · API REST/GraphQL' },
              { area: 'Notificações', techs: 'Expo Notifications · OneSignal · FCM' },
              { area: 'Pagamentos', techs: 'Stripe · MercadoPago · Pix' },
              { area: 'Análise', techs: 'PostHog · Sentry · Mixpanel' },
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
          <h2 className="mt-5 text-display-lg text-ink">Antes de fechar.</h2>
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
