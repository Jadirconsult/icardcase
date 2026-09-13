'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Logo } from './Logo'
import { buildWhatsAppUrl } from '@/lib/constants'
import { cn } from '@/lib/utils'

const nav = [
  { label: 'Soluções', href: '/#solucoes' },
  { label: 'Cases', href: '/cases' },
  { label: 'Insights', href: '/insights' },
  { label: 'Raio-X de TI', href: '/raio-x-de-ti' },
  { label: 'Sobre', href: '/sobre' },
]

const MENU_ID = 'menu-mobile'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Esc fecha o menu e devolve o foco ao botão que o abriu (WCAG 2.1.2 / 2.4.3).
  useEffect(() => {
    if (!mobileOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMobileOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [mobileOpen])

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
        {/* aria-label começa pelo texto visível ("icardcase") — WCAG 2.5.3 */}
        <Link href="/" aria-label="icardcase — página inicial" className="flex items-center gap-2.5 group">
          <Logo variant="dark" />
          <span className="hidden sm:inline-flex font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink-tertiary group-hover:text-ink-subtle transition-colors" aria-hidden="true">
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
            className="nav-link text-sm"
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

        {/* 44×44 (h-11 w-11): antes era p-2 + ícone 22px = 38px de alvo */}
        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-ink transition-colors hover:bg-surface-1 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={mobileOpen}
          aria-controls={MENU_ID}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {mobileOpen ? (
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Sempre no DOM (com `hidden` quando fechado) para o aria-controls
          apontar para um id que existe. */}
      <div id={MENU_ID} hidden={!mobileOpen} className="lg:hidden bg-canvas border-t border-hairline">
        <ul className="container-content py-5 space-y-1">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center text-ink-muted hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
          {/* /contato so existia no bloco `hidden lg:flex` acima: no celular
              o formulario — caminho de conversao de peso igual ao WhatsApp —
              nao existia na navegacao, e so era alcancavel rolando ate o
              rodape. Aqui ele leva o primario porque o WhatsApp ja aparece
              em outros cinco pontos da home mais o botao flutuante; quem
              prefere resposta imediata continua a um toque de distancia. */}
          <li className="space-y-2 pt-4">
            <Link
              href="/contato"
              onClick={() => setMobileOpen(false)}
              className="btn-primary btn-block"
            >
              Falar com a Icardcase
            </Link>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-block"
            >
              Conversar no WhatsApp
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
