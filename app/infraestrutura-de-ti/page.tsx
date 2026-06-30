import type { Metadata } from 'next'
import Link from 'next/link'
import { FinalCTA } from '@/components/FinalCTA'
import { buildWhatsAppUrl, SITE } from '@/lib/constants'

const PAGE_URL = `${SITE.url}/infraestrutura-de-ti`

export const metadata: Metadata = {
  title: 'Infraestrutura de TI Empresarial · Servidores, Redes e Cloud',
  description:
    'Gestão de infraestrutura de TI para empresas em todo o Brasil. Servidores Windows e Linux, redes corporativas, virtualização, cloud híbrida, backup automatizado, monitoramento proativo.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Infraestrutura de TI Empresarial · Icardcase',
    description: 'Servidores, redes corporativas, cloud híbrida, backup e monitoramento para empresas no Brasil.',
    url: PAGE_URL,
    type: 'website',
  },
}

const faq = [
  {
    q: 'Vocês atendem empresas que já têm equipe de TI interna?',
    a: 'Sim. Funcionamos como camada técnica especializada que complementa a equipe interna. Casos comuns: TI interna cuida do dia a dia, nós cuidamos de projeto de migração, virtualização, política de backup, hardening de segurança, ou auditoria técnica. Sem competir com a equipe que você já tem — agregando expertise pontual.',
  },
  {
    q: 'Cloud, servidor físico ou híbrido?',
    a: 'Depende do uso. Cloud (AWS, Azure, Google Cloud, OCI) faz sentido para escalabilidade variável, recuperação de desastre, equipes distribuídas. Servidor físico vence em uso constante de alto volume (banco de dados de produção que roda 24/7), latência crítica (sistemas industriais), ou compliance específico. Híbrido combina os dois — produção em cloud, backup e ambientes de desenvolvimento on-premise.',
  },
  {
    q: 'O que vocês cobrem em "monitoramento proativo"?',
    a: 'Stack de observabilidade (geralmente Zabbix, Grafana, Uptime Kuma ou similar) monitorando: uso de CPU/RAM/disco em servidores, latência e perda em redes, status de backup, uptime de serviços críticos. Alertas via WhatsApp/e-mail quando algum threshold é cruzado. Relatórios mensais consolidados.',
  },
  {
    q: 'Como vocês cuidam de backup?',
    a: 'Política 3-2-1: 3 cópias dos dados, em 2 mídias diferentes, 1 fora do local. Stack típico: Veeam para servidores Windows/Linux, snapshots automatizados em cloud, replicação geográfica. Retenção configurável (diário, semanal, mensal, anual). E o mais importante: teste de restore mensal — backup que não foi restaurado é só esperança.',
  },
  {
    q: 'Vocês fazem migração de servidor sem parar a operação?',
    a: 'Sim. Migração com janela zero ou janela mínima é nossa especialidade. Estratégia padrão: replicação em paralelo do sistema antigo para o novo, validação contínua, cutover programado em horário de baixa atividade (madrugada ou fim de semana), plano de rollback se algo desviar.',
  },
  {
    q: 'Existe contrato mensal de infraestrutura?',
    a: 'Sim. Modelo comum: projeto inicial (auditoria + implantação) com investimento fechado + contrato de gestão e monitoramento mensal. O mensal cobre monitoramento, ajustes evolutivos, resposta a incidentes dentro de SLA, e revisões trimestrais de estratégia.',
  },
]

export default function InfraestruturaPage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Gestão de Infraestrutura de TI',
    provider: { '@type': 'Organization', name: 'Icardcase', url: SITE.url, telephone: '+55-21-98878-5170' },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    description: 'Gestão de infraestrutura de TI — servidores Windows e Linux, redes corporativas, virtualização, cloud híbrida, backup e monitoramento.',
    url: PAGE_URL,
  }
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })) }
  const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Início', item: SITE.url }, { '@type': 'ListItem', position: 2, name: 'Infraestrutura de TI', item: PAGE_URL }] }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="relative isolate overflow-hidden bg-canvas pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-32">
        <div className="bg-mesh absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="container-content relative">
          <p className="section-kicker">Serviço · Infraestrutura</p>
          <h1 className="mt-5 max-w-[20ch] text-display-xl text-ink">
            Infraestrutura confiável.
            <span className="block text-ink-muted">Sem desculpa quando para.</span>
          </h1>
          <p className="mt-8 max-w-[60ch] text-lg leading-[1.55] text-ink-subtle sm:text-xl">
            Servidores, redes, virtualização, cloud híbrida, backup e monitoramento para empresas em
            todo o Brasil. 15 anos prévios em infraestrutura crítica (ferrovia, mineração, construção)
            aplicados à TI corporativa.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a href={buildWhatsAppUrl('Olá! Quero conversar sobre infraestrutura de TI para minha empresa.')} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Conversar sobre minha infraestrutura
            </a>
            <Link href="/cases/ufrj" className="btn-secondary">Ver case UFRJ</Link>
          </div>
        </div>
      </section>

      <section className="relative bg-canvas section-y border-t border-hairline">
        <div className="container-content">
          <p className="section-kicker">Quando faz sentido</p>
          <h2 className="mt-5 text-display-lg text-ink">
            Infraestrutura é como freio.
            <span className="block text-ink-muted">Você só percebe quando falta.</span>
          </h2>
          <p className="mt-8 max-w-[58ch] text-lg leading-[1.55] text-ink-subtle">
            Empresas nos procuram quando algum desses cenários aparece:
          </p>
          <ul className="mt-12 grid gap-px bg-hairline border border-hairline rounded-xl overflow-hidden sm:grid-cols-2">
            {[
              { title: 'Servidor caiu e ninguém sabe restaurar', body: 'Incidente recente expôs que o backup nunca foi testado, ou que o conhecimento estava na cabeça de uma pessoa só. Falta resiliência operacional.' },
              { title: 'Rede improvisada com cabo embolado', body: 'Cresceu sem projeto. Switches em cascata, Wi-Fi de roteador doméstico, IP estático em planilha. Lenta, instável, impossível de auditar.' },
              { title: 'Compliance exigindo backup auditável', body: 'Cliente B2B, auditoria ISO, banco financiador, ou LGPD pedindo evidência de proteção de dados. Não basta ter backup — precisa provar.' },
              { title: 'Hora de sair do fornecedor de TI atual', body: 'MSP terceirizado caro e ineficiente, contratos de SLA que ninguém respeita, técnicos diferentes cada vez. Quer trazer pra dentro com parceiro técnico que entende.' },
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
                Auditoria primeiro.
                <span className="block text-ink-muted">Compra de equipamento depois.</span>
              </h2>
              <p className="mt-8 text-lg leading-[1.55] text-ink-subtle max-w-[42ch]">
                Tipicamente 30-60 dias da auditoria à infraestrutura nova entregue.
              </p>
            </div>
            <ul className="lg:col-span-7 space-y-px border-t border-hairline">
              {[
                { num: '01', title: 'Auditoria técnica', body: 'Inventário de equipamentos, topologia da rede, política de backup atual, vulnerabilidades de segurança, gargalos de performance. Relatório técnico em até 10 dias.' },
                { num: '02', title: 'Projeto e dimensionamento', body: 'Documento de arquitetura cobrindo equipamentos a adquirir, topologia da rede nova, plano de migração, política de backup, política de acesso, custo estimado.' },
                { num: '03', title: 'Implementação com janela mínima', body: 'Execução em fases, em horário de baixa atividade. Equipe presencial quando necessário (RJ direto, outras cidades sob negociação) ou remota com técnico parceiro no local.' },
                { num: '04', title: 'Monitoramento e operação', body: 'Dashboard de monitoramento entregue, política de incident response documentada, contrato mensal de gestão (opcional). Reuniões trimestrais de revisão.' },
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
            Equipamento e ferramenta.
            <span className="block text-ink-muted">Marcas comprovadas.</span>
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { area: 'Servidores', techs: 'Windows Server · Linux (Ubuntu, Debian, RHEL)' },
              { area: 'Virtualização', techs: 'Proxmox · VMware · Hyper-V' },
              { area: 'Redes', techs: 'Cisco · Mikrotik · pfSense · Ubiquiti' },
              { area: 'Backup', techs: 'Veeam · Bacula · rsync · Snapshots cloud' },
              { area: 'Cloud', techs: 'AWS · Azure · OCI · DigitalOcean · Hetzner' },
              { area: 'Monitoramento', techs: 'Zabbix · Grafana · Uptime Kuma · Sentry' },
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
