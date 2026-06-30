'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const posts = [
  {
    title: 'Reforma tributária 2026: IBS e CBS — o que muda no sistema da sua empresa',
    readTime: '9 min',
    category: 'Reforma Tributária',
    slug: 'reforma-tributaria-2026',
    num: '01',
  },
  {
    title: 'Como migrar Visual FoxPro para web sem parar a operação',
    readTime: '11 min',
    category: 'Modernização',
    slug: 'migrar-visual-foxpro-web',
    num: '02',
  },
  {
    title: 'WhatsApp Business API empresarial: arquitetura segura para escalar',
    readTime: '8 min',
    category: 'Automação',
    slug: 'whatsapp-business-api-empresarial',
    num: '03',
  },
]

export function InsightsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-canvas section-y border-t border-hairline">
      <div className="container-content">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="section-kicker">Insights</p>
            <h2 aria-label="Conhecimento aplicado. Antes de publicado." className="mt-5 text-display-lg text-ink">
              Conhecimento aplicado.
              <span className="block text-ink-muted">Antes de publicado.</span>
            </h2>
          </div>
          <Link
            href="/insights"
            className="link-underline group inline-flex items-center gap-2 text-sm font-mono uppercase tracking-[0.12em] text-accent-hover self-start lg:self-end"
          >
            Todos os insights
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Lista — Linear changelog-style: hairline divider, denso */}
        <ul className="border-t border-hairline">
          {posts.map((post, i) => (
            <li
              key={post.slug}
              className={`transition-all duration-500 ease-out ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <Link
                href={`/insights/${post.slug}`}
                className="group flex items-baseline gap-6 py-7 border-b border-hairline transition-all duration-300 hover:border-hairline-strong"
              >
                <span className="flex-shrink-0 font-mono text-xs tracking-[0.1em] text-ink-tertiary transition-colors duration-300 group-hover:text-accent">
                  {post.num}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-3 mb-2">
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary">
                      {post.category}
                    </span>
                    <span className="text-ink-tertiary">·</span>
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-tertiary">
                      {post.readTime} de leitura
                    </span>
                  </div>
                  <h3 className="text-headline text-ink leading-snug transition-colors duration-300 group-hover:text-accent max-w-[60ch]">
                    {post.title}
                  </h3>
                </div>

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="flex-shrink-0 self-center text-ink-tertiary transition-all duration-500 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
