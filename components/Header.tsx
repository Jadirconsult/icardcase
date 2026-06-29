'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Logo } from './Logo'
import { buildWhatsAppUrl } from '@/lib/constants'
import { cn } from '@/lib/utils'

const nav = [
  { label: 'Soluções', href: '/#solucoes' },
  { label: 'Cases', href: '/cases' },
  { label: 'Insights', href: '/insights' },
  { label: 'Sobre', href: '/sobre' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-500',
        scrolled
          ? 'bg-canvas/80 backdrop-blur-xl border-b border-hairline'
          : 'bg-canvas border-b border-transparent',
      )}
    >
      <nav className="container-content flex h-16 items-center justify-between" aria-label="Navegação principal">
        <Link href="/" aria-label="Página inicial" className="flex items-center gap-2.5 group">
          <Logo variant="dark" />
          <span className="hidden sm:inline-flex font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink-tertiary group-hover:text-ink-subtle transition-colors">
            v.2026
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-9">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="link-underline nav-link text-sm"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/contato"
            className="text-sm text-ink-muted hover:text-ink transition-colors"
          >
            Contato
          </Link>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Conversar
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <button
          type="button"
          className="lg:hidden text-ink p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={mobileOpen}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden bg-canvas border-t border-hairline">
          <ul className="container-content py-5 space-y-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-ink-muted hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                Conversar no WhatsApp
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
