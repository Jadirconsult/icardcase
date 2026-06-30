import type { Metadata } from 'next'
import Link from 'next/link'
import { FinalCTA } from '@/components/FinalCTA'
import { buildWhatsAppUrl, SITE } from '@/lib/constants'

const PAGE_URL = `${SITE.url}/seguranca-lgpd`

export const metadata: Metadata = {
  title: 'Segurança da Informação e Adequação LGPD para Empresas',
  description:
    'Consultoria em segurança da informação e adequação LGPD para empresas em todo o Brasil. Gap analysis, plano de adequação, implementação técnica, treinamento de equipe e auditoria.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Segurança da Informação e LGPD · Icardcase',
    description: 'Consultoria LGPD e segurança aplicada — gap analysis, implementação técnica, treinamento.',
    url: PAGE_URL,
    type: 'website',
  },
}

const faq = [
  {
    q: 'Minha empresa precisa se adequar à LGPD mesmo sendo pequena?',
    a: 'Sim. A LGPD não tem isenção por porte. Toda empresa que trata dados pessoais de pessoas no Brasil (clientes, fornecedores, funcionários, candidatos) está sob a lei. A ANPD prioriza fiscalização em quem trata dados sensíveis em volume — escritórios contábeis, clínicas, RHs terceirizados, e-commerces, fintechs — mas autua qualquer tamanho.',
  },
  {
    q: 'Qual o risco real de não estar adequado?',
    a: 'Três camadas. (1) Multa: até 2% do faturamento limitado a R$ 50 milhões por infração. (2) Reputação: cliente B2B premium pede certificação antes de fechar contrato. (3) Operação: vazamento gera obrigação de notificar titulares em 72h e cria custo legal que pode quebrar empresa pequena. A multa é o menor dos três riscos.',
  },
  {
    q: 'O que envolve uma adequação completa?',
    a: '23 itens distribuídos em 4 categorias: Governança (DPO, RIPD, política de privacidade), Tecnologia (criptografia, controle de acesso, audit log, backup), Processos (treinamento, contratos de fornecedor, procedimento de incidente), Compliance (atendimento a direitos do titular, DPIA). Veja o checklist completo no nosso post de LGPD em /insights.',
  },
  {
    q: 'Vocês fazem só a parte técnica ou também a documental?',
    a: 'Ambas. A parte técnica (criptografia, RLS no banco, rate limiting, audit log) é nossa especialidade primária — mas adequação sem documento é incompleta. Trabalhamos com advogado parceiro para política de privacidade, termos de uso, contratos de tratamento de dados (DPA), formulários de consentimento. Você não fica com lacuna.',
  },
  {
    q: 'Quanto tempo leva pra adequar uma empresa?',
    a: 'Depende do estado atual e do volume de dados. Empresa pequena (até 50 funcionários, sem dados sensíveis em volume) leva 6-10 semanas. Empresa média com dados sensíveis (saúde, financeiro) leva 12-20 semanas. Não existe adequação relâmpago de 30 dias — quem promete isso está vendendo certificado, não conformidade real.',
  },
  {
    q: 'Vocês cuidam de auditoria de segurança periódica também?',
    a: 'Sim. Após a adequação inicial, oferecemos contrato anual de manutenção: revisão semestral do RIPD, atualização de políticas conforme mudança regulatória ANPD, simulação de incidente para testar o procedimento, treinamento de reciclagem da equipe. LGPD não é projeto com fim — é operação contínua.',
  },
]

export default function SegurancaLgpdPage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Consultoria em Segurança da Informação e LGPD',
    provider: { '@type': 'Organization', name: 'Icardcase', url: SITE.url, telephone: '+55-21-98878-5170' },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    description: 'Consultoria em segurança da informação e adequação LGPD — gap analysis, implementação técnica e documental, treinamento, auditoria.',
    url: PAGE_URL,
  }
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })) }
  const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Início', item: SITE.url }, { '@type': 'ListItem', position: 2, name: 'Segurança e LGPD', item: PAGE_URL }] }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="relative isolate overflow-hidden bg-canvas pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-32">
        <div className="bg-mesh absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="container-content relative">
          <p className="section-kicker">Serviço · Segurança</p>
          <h1 className="mt-5 max-w-[20ch] text-display-xl text-ink">
            Segurança que não é discurso.
            <span className="block text-ink-muted">É como construímos.</span>
          </h1>
          <p className="mt-8 max-w-[60ch] text-lg leading-[1.55] text-ink-subtle sm:text-xl">
            Consultoria em segurança da informação e adequação LGPD para empresas em todo o Brasil.
            Implementação técnica e documental, treinamento de equipe, plano de resposta a incidentes,
            auditoria periódica. Sem vender ilusão de "certificado".
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a href={buildWhatsAppUrl('Olá! Quero conversar sobre adequação LGPD da minha empresa.')} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Conversar sobre adequação
            </a>
            <Link href="/insights/lgpd-escritorio-contabil" className="btn-secondary">Ver checklist LGPD</Link>
          </div>
        </div>
      </section>

      <section className="relative bg-canvas section-y border-t border-hairline">
        <div className="container-content">
          <p className="section-kicker">Quando faz sentido</p>
          <h2 className="mt-5 text-display-lg text-ink">
            Adequação não é projeto opcional.
            <span className="block text-ink-muted">É operação contínua.</span>
          </h2>
          <p className="mt-8 max-w-[58ch] text-lg leading-[1.55] text-ink-subtle">
            Os 4 motivos mais comuns que trazem clientes pra essa conversa:
          </p>
          <ul className="mt-12 grid gap-px bg-hairline border border-hairline rounded-xl overflow-hidden sm:grid-cols-2">
            {[
              { title: 'Cliente B2B pediu certificado de privacidade', body: 'Empresa grande te exige evidência de adequação LGPD antes de fechar contrato. Sem documento e implementação real, você perde a venda — independente do quanto seu produto é bom.' },
              { title: 'Houve incidente recente (vazamento ou suspeita)', body: 'E-mail com lista de clientes vazou, banco de dados ficou exposto em SaaS terceirizado, ex-funcionário levou dados. Você precisa entender o tamanho do problema e notificar (ou não) a ANPD em 72h.' },
              { title: 'Auditoria interna ou externa pediu evidência', body: 'ISO 27001, auditoria de cliente, banco financiador exigindo controles. Lista grande de "evidências" que ninguém preparou e o prazo está apertado.' },
              { title: 'Você quer prevenir antes da multa', body: 'Empresa madura sabe que multa não é o pior — o pior é o cliente saber. Adequação proativa é menos dolorosa e custa metade do reativa.' },
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
                Diagnóstico honesto.
                <span className="block text-ink-muted">Implementação real.</span>
              </h2>
              <p className="mt-8 text-lg leading-[1.55] text-ink-subtle max-w-[42ch]">
                Tipicamente 8-20 semanas, dependendo do tamanho da empresa e do estado inicial.
              </p>
            </div>
            <ul className="lg:col-span-7 space-y-px border-t border-hairline">
              {[
                { num: '01', title: 'Gap analysis', body: 'Entrevista com TI, jurídico, RH, comercial. Mapeamento dos dados pessoais que sua empresa trata (data mapping). Comparação com os 23 itens da LGPD aplicáveis. Relatório técnico em 15 dias.' },
                { num: '02', title: 'Plano de adequação priorizado', body: 'Lista de ações por prioridade (alta = risco imediato, média = compliance, baixa = melhoria de processo). Investimento e prazo estimado por item. Você escolhe atacar tudo, atacar só alto, ou faseado.' },
                { num: '03', title: 'Implementação técnica e documental', body: 'Lado técnico: criptografia, RLS no banco, audit log, rate limit, headers de segurança, política de senha. Lado documental: política de privacidade pública, RIPD, contratos com fornecedores, formulários de consentimento.' },
                { num: '04', title: 'Treinamento e manutenção', body: 'Workshop com equipe (geralmente 2-4 horas) cobrindo o que cada um precisa saber e o que NÃO pode fazer. Procedimento de resposta a incidente documentado e testado. Contrato anual de manutenção (opcional).' },
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
            Controles aplicados.
            <span className="block text-ink-muted">Não é teoria.</span>
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { area: 'Criptografia', techs: 'TLS 1.3 · AES-256 · bcrypt/argon2' },
              { area: 'Controle de acesso', techs: 'RBAC · Row-Level Security · MFA · SSO' },
              { area: 'Audit log', techs: 'Append-only · Triggers Postgres · Retenção 5 anos' },
              { area: 'Backup', techs: 'Criptografado · Off-site · Teste de restore mensal' },
              { area: 'Rate limit / WAF', techs: 'Upstash · Cloudflare · headers de segurança' },
              { area: 'Documentação legal', techs: 'Política de privacidade · RIPD · DPA · Termo de consentimento' },
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
