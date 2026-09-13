import Link from 'next/link'
import { Logo } from './Logo'
import { COMPANY, buildWhatsAppUrl } from '@/lib/constants'

const navigation = [
  { href: '/', label: 'Início' },
  { href: '/cases', label: 'Cases' },
  { href: '/insights', label: 'Insights' },
  { href: '/abordagem', label: 'Como trabalhamos' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contato', label: 'Contato' },
]

// Links internos para as páginas de serviço — antes só eram alcançáveis
// pelos cards da home, e o rodapé é o bloco presente em todas as páginas.
const services = [
  { href: '/desenvolvimento-de-sistemas', label: 'Desenvolvimento de sistemas' },
  { href: '/desenvolvimento-mobile', label: 'Aplicativos mobile' },
  { href: '/infraestrutura-de-ti', label: 'Infraestrutura de TI' },
  { href: '/seguranca-lgpd', label: 'Segurança e LGPD' },
  { href: '/consultoria-ti', label: 'Consultoria em TI' },
  { href: '/raio-x-de-ti', label: 'Raio-X de TI para contabilidades' },
]

// Rótulo de coluna: h2 (o rodapé não tem h1/h2 próprio — h3 pulava nível)
const columnTitle = 'font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary mb-5'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-canvas border-t border-hairline">
      <div className="container-content py-16 lg:py-20">
        {/* Top: logo + tagline */}
        <div className="grid gap-14 lg:grid-cols-12 mb-16">
          <div className="lg:col-span-4">
            <Logo variant="dark" />
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted">
              {COMPANY.description}
            </p>
            <div className="mt-8 flex flex-col gap-1 font-mono text-xs text-ink-tertiary">
              <span className="uppercase tracking-[0.12em]">CNPJ {COMPANY.cnpj}</span>
              <span>{COMPANY.legalName}</span>
            </div>
          </div>

          {/* Colunas: 2×2 até xl; em xl, 4 lado a lado com Contato mais larga (e-mail) */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,0.8fr)]">
            <nav aria-labelledby="footer-navegacao">
              <h2 id="footer-navegacao" className={columnTitle}>
                Navegação
              </h2>
              <ul className="space-y-3 text-sm">
                {navigation.map((item) => (
                  <li key={item.href}><Link href={item.href} className="footer-link">{item.label}</Link></li>
                ))}
              </ul>
            </nav>

            <nav aria-labelledby="footer-servicos">
              <h2 id="footer-servicos" className={columnTitle}>
                Serviços
              </h2>
              <ul className="space-y-3 text-sm">
                {services.map((item) => (
                  <li key={item.href}><Link href={item.href} className="footer-link">{item.label}</Link></li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className={columnTitle}>
                Contato
              </h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-ink-muted hover:text-ink transition-colors"
                  >
                    WhatsApp · {COMPANY.contact.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${COMPANY.contact.email}`}
                    className="link-underline text-ink-muted hover:text-ink transition-colors break-all"
                  >
                    {COMPANY.contact.email}
                  </a>
                </li>
                <li className="text-ink-subtle leading-relaxed">
                  {COMPANY.address.street}<br />
                  {COMPANY.address.neighborhood}, {COMPANY.address.city}/{COMPANY.address.state}
                </li>
                <li>
                  <a
                    href={COMPANY.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-ink-muted hover:text-ink transition-colors"
                  >
                    Instagram · @icardcase
                  </a>
                </li>
                {/* Auditoria 07/2026: link do LinkedIn removido temporariamente.
                    A página da empresa tem 1 seguidor e zero publicações —
                    mandar decisor B2B pra lá destrói credibilidade. Reativar
                    quando houver 3-4 posts publicados (cases do site dão o
                    conteúdo). O href continua em COMPANY.social.linkedin. */}
              </ul>
            </div>

            <div>
              <h2 className={columnTitle}>
                Status
              </h2>
              <div
                className="flex items-center gap-2 text-sm text-ink-muted"
                role="status"
                aria-label="Sistemas operacionais. Tudo funcionando normalmente."
              >
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-text opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success-text" />
                </span>
                {/* Ícone redundante pra não depender só de cor (a11y / daltonismo) */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-success-text"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Operacional
              </div>
              <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary">
                Niterói · RJ · Brasil
              </p>
            </div>
          </div>
        </div>

        {/* Tagline gigante editorial — Linear-style.
            Marcada como decorativa: o efeito 'fantasma' (opacity 40%) tem contraste
            visualmente baixo de propósito. A tagline real já é indexada pelo
            Schema.org no <head> + aparece no copyright abaixo. */}
        <div className="pt-10 border-t border-hairline" aria-hidden="true">
          <p className="text-display-md text-ink-subtle/40 select-none">
            Tecnologia que conecta. Soluções que transformam.
          </p>
        </div>

        {/* Bottom rule */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary">
            © {year} {COMPANY.name} · Todos os direitos reservados
          </p>
          <ul className="flex gap-6 text-xs">
            <li><Link href="/politica-privacidade" className="text-ink-tertiary hover:text-ink-muted transition-colors">Política de Privacidade</Link></li>
            <li><Link href="/politica-privacidade" className="text-ink-tertiary hover:text-ink-muted transition-colors">LGPD</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
