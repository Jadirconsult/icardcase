import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import {
  FileSpreadsheet,
  LockKeyholeOpen,
  Repeat,
  UserX,
  Kanban,
  FormInput,
  ShieldCheck,
  Mail,
  Phone,
  MessageSquare,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { ShadowITChat } from '@/components/ShadowITChat'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { COMPANY, yearsInBusiness } from '@/lib/constants'
import { breadcrumbSchema, buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Shadow IT: elimine ferramentas paralelas',
  description:
    'Shadow IT: planilhas soltas, formulários gratuitos e controles em WhatsApp expõem dados de clientes. Unifique tudo, integrado ao ERP. Diagnóstico grátis.',
  path: '/shadow-it',
})

const breadcrumb = breadcrumbSchema([{ name: 'Shadow IT', path: '/shadow-it' }])

const RISCOS = [
  {
    icon: FileSpreadsheet,
    tone: 'text-danger-text bg-danger/10',
    title: 'Planilhas paralelas',
    body: 'Controles cruciais isolados no Excel ou no Drive pessoal de um colaborador, sem versão oficial, sem histórico e sem backup.',
  },
  {
    icon: LockKeyholeOpen,
    tone: 'text-warning-text bg-warning/10',
    title: 'Dado de cliente exposto',
    body: 'Informação confidencial de terceiro em conta pessoal de e-mail, Trello ou Notion. Na LGPD a responsabilidade pelo tratamento continua sendo sua.',
  },
  {
    icon: Repeat,
    tone: 'text-accent-text bg-accent/10',
    title: 'Retrabalho e divergência',
    body: 'A mesma informação digitada no ERP e na planilha. Quando os dois números discordam, ninguém sabe qual é o verdadeiro.',
  },
  {
    icon: UserX,
    tone: 'text-accent-text bg-accent/10',
    title: 'Conhecimento que vai embora',
    body: 'O colaborador sai e leva junto o processo e o acesso ao arquivo. O que ele controlava vira arqueologia.',
  },
]

const PILARES = [
  {
    icon: Kanban,
    title: 'Fluxos e Kanban próprios',
    body: 'Acompanhamento visual das tarefas dentro do seu ambiente, sem depender de ferramenta de terceiro em conta particular.',
  },
  {
    icon: FormInput,
    title: 'Formulários e agendamento',
    body: 'Coleta padronizada que alimenta o banco central direto — sem exportar planilha, sem digitar de novo.',
  },
  {
    icon: ShieldCheck,
    title: 'Controle de acesso por papel',
    body: 'Quem pode ver, editar e exportar cada informação, definido por função. Com log de alteração para auditoria.',
  },
]

/* Números reais e verificáveis dos cases autorizados — nada de métrica
   ilustrativa. Ver PRODUCT.md § Evidence on Hand. */
const PROVAS = [
  { valor: '94', unidade: 'tabelas', ctx: 'ERP sob medida em produção na indústria química (SYSPERSHY)' },
  { valor: '60', unidade: 'migrações', ctx: 'evolução de schema versionada, sem perder dado' },
  { valor: 'Zero', unidade: 'downtime', ctx: 'migração de Visual FoxPro para Supabase sem parar a receita (Prossiga)' },
  { valor: String(yearsInBusiness()), unidade: 'anos', ctx: `construindo sistemas críticos desde ${COMPANY.founded}` },
]

export default function ShadowITPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/80 backdrop-blur-xl">
        <div className="container-content flex h-20 items-center justify-between">
          <Link href="/" aria-label="Página inicial da Icardcase">
            <Logo variant="dark" />
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-ink-muted md:flex" aria-label="Seções desta página">
            <a href="#riscos" className="transition-colors hover:text-accent-text">O problema</a>
            <a href="#plataforma" className="transition-colors hover:text-accent-text">A plataforma</a>
            <a href="#provas" className="transition-colors hover:text-accent-text">Provas</a>
          </nav>
          <a href="#diagnostico" className="btn-primary">
            Diagnóstico grátis
          </a>
        </div>
      </header>

      {/* ─── Hero: o caos à esquerda, o ambiente único à direita ─────────── */}
      <section className="relative isolate overflow-hidden pt-16 pb-24">
        <div className="aurora" aria-hidden="true" />
        <div className="bg-mesh pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-content relative z-10">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              {/* Kicker do DS no lugar da pílula — mesma assinatura das outras landings */}
              <span className="section-kicker text-accent-text">Shadow IT</span>

              <h1 className="mt-7 text-display-lg text-ink">
                Seu ERP não resolve tudo. Sua equipe resolveu <span className="text-accent-text">na planilha.</span>
              </h1>

              <p className="mt-7 max-w-[48ch] text-lg leading-relaxed text-ink-subtle">
                Planilha no drive pessoal, processo controlado por WhatsApp, formulário de cliente em ferramenta gratuita. Cada atalho desses é dado da sua empresa — e do seu cliente — fora do seu controle.
              </p>

              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-hairline pt-8">
                {PROVAS.map((p) => (
                  <div key={p.ctx}>
                    <dt className="sr-only">{p.ctx}</dt>
                    <dd>
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-display-md text-ink">{p.valor}</span>
                        <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent-text">
                          {p.unidade}
                        </span>
                      </span>
                      <span className="mt-2 block text-sm leading-snug text-ink-subtle">{p.ctx}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* O chat no lugar do formulário — é a atração, não um rodapé */}
            <div id="diagnostico" className="scroll-mt-24">
              <Suspense
                fallback={
                  <div className="surface-card h-[32rem]" aria-hidden="true" />
                }
              >
                <ShadowITChat />
              </Suspense>
              <p className="mt-4 text-center text-xs text-ink-tertiary">
                Sem cadastro para começar. Você só deixa contato se quiser o mapeamento completo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── O custo invisível ───────────────────────────────────────────── */}
      <section id="riscos" className="border-y border-hairline bg-surface-1/60 py-24">
        <div className="container-content">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-display-md text-ink">
              O custo invisível da <span className="text-accent-text">Shadow IT</span>
            </h2>
            <p className="mt-4 text-ink-subtle">
              Quando o sistema oficial não atende a uma necessidade pontual, a equipe cria a própria alternativa. Ninguém age de má-fé — e é exatamente por isso que ninguém percebe o tamanho da exposição.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {RISCOS.map(({ icon: Icon, tone, title, body }) => (
              <article key={title} className="surface-card card-glow p-6">
                <span className={`mb-6 flex h-12 w-12 items-center justify-center rounded-lg ${tone}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-subtle">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── A plataforma ────────────────────────────────────────────────── */}
      <section id="plataforma" className="py-24">
        <div className="container-content grid items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent-text">
              A saída
            </span>
            <h2 className="mt-3 text-display-md text-ink">
              Um ambiente só, construído para a sua operação
            </h2>
            <p className="mt-6 leading-relaxed text-ink-subtle">
              A Icardcase constrói uma plataforma web e mobile que absorve as ferramentas informais da equipe e conversa com o ERP que você já tem. Time próprio, sem terceirização — quem levanta o requisito é quem escreve o código.
            </p>

            <div className="mt-10 space-y-6">
              {PILARES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex items-start gap-4">
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-text">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">{title}</h3>
                    <p className="mt-1 text-sm text-ink-subtle">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Os três módulos, nomeados como no diagrama de referência */}
          <div className="surface-card p-8">
            <div className="flex items-center justify-between border-b border-hairline pb-4">
              <span className="font-mono text-xs uppercase tracking-[0.1em] text-ink-subtle">
                Ecossistema unificado
              </span>
              <span className="rounded-md bg-success/10 px-3 py-1 text-xs font-semibold text-success-text">
                Integrado
              </span>
            </div>
            <ul className="mt-6 space-y-3">
              {[
                ['Módulo Financeiro (ERP)', 'Conectado via API'],
                ['Gestão de Atendimento', 'Unificado'],
                ['Conformidade de Dados (LGPD)', 'Com log de auditoria'],
              ].map(([nome, estado]) => (
                <li
                  key={nome}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-hairline bg-surface-1 p-4 text-sm"
                >
                  <span className="text-ink">{nome}</span>
                  <span className="font-mono text-xs text-accent-text">{estado}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-ink-tertiary">
              Arquitetura de referência. O desenho final sai do diagnóstico da sua operação — não vendemos módulo de prateleira.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Provas ──────────────────────────────────────────────────────── */}
      <section id="provas" className="border-t border-hairline bg-surface-1/60 py-24">
        <div className="container-content">
          <h2 className="text-display-md text-ink">Sistemas reais, em produção</h2>
          <p className="mt-4 max-w-[60ch] text-ink-subtle">
            Nada de portfólio de tela bonita. Estes são sistemas que empresas usam para faturar, todos com autorização do cliente para citar.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ['SYSPERSHY', 'ERP sob medida para indústria química: 94 tabelas, 49 telas, 60 migrações versionadas.'],
              ['Prossiga', 'Migração de Visual FoxPro para Supabase sem parar a receita do cliente.'],
              ['NF SaaS', 'Plataforma fiscal multi-tenant NF-e/NFC-e/NFS-e com integração SEFAZ.'],
            ].map(([nome, desc]) => (
              <article key={nome} className="surface-card card-glow p-6">
                <h3 className="font-mono text-sm uppercase tracking-[0.1em] text-accent-text">{nome}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-subtle">{desc}</p>
              </article>
            ))}
          </div>
          <Link
            href="/cases"
            className="mt-8 inline-flex min-h-[44px] items-center text-sm font-semibold text-accent-text hover:underline"
          >
            Ver os cases completos →
          </Link>
        </div>
      </section>

      {/* ─── Contato ─────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container-content">
          <div className="surface-card border-accent/30 p-8 text-center sm:p-12">
            <h2 className="text-display-md text-ink">Prefere falar com uma pessoa?</h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-ink-subtle">
              Quem responde é o Jadir, engenheiro e fundador — não um vendedor, não um bot de fila.
            </p>

            <div className="mx-auto mt-10 grid max-w-xl gap-4 text-left sm:grid-cols-2">
              <a
                href={`mailto:${COMPANY.contact.email}`}
                className="flex min-h-[44px] items-center gap-4 rounded-lg border border-hairline bg-canvas p-4 transition-colors hover:border-accent-text"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-text">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-mono text-[0.65rem] uppercase tracking-[0.1em] text-ink-subtle">E-mail</span>
                  <span className="block break-all text-sm font-semibold text-ink">{COMPANY.contact.email}</span>
                </span>
              </a>

              <WhatsAppButton
                origem="shadowit_contato"
                variant="unstyled"
                className="flex min-h-[44px] items-center gap-4 rounded-lg border border-hairline bg-canvas p-4 transition-colors hover:border-success-text"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success-text">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-mono text-[0.65rem] uppercase tracking-[0.1em] text-ink-subtle">WhatsApp</span>
                  <span className="block text-sm font-semibold text-ink">{COMPANY.contact.phone}</span>
                </span>
              </WhatsAppButton>
            </div>

            <WhatsAppButton origem="shadowit_final" className="btn-lg mt-10">
              <MessageSquare className="h-5 w-5" aria-hidden="true" />
              Falar direto com o engenheiro
            </WhatsAppButton>
          </div>
        </div>
      </section>

      <footer className="border-t border-hairline py-8">
        <div className="container-content flex flex-col items-center justify-between gap-4 text-sm text-ink-subtle sm:flex-row">
          <p>© {new Date().getFullYear()} {COMPANY.name} · {COMPANY.legalName}</p>
          <p className="text-xs">CNPJ {COMPANY.cnpj} · {COMPANY.address.city}/{COMPANY.address.state}</p>
        </div>
      </footer>
    </div>
  )
}
