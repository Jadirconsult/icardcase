'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type RevealTag = 'div' | 'li' | 'section' | 'article'
type RevealVariant = 'fade-up' | 'rise'

interface RevealProps {
  children: ReactNode
  /** Elemento renderizado. `li` para item de lista/grade. */
  as?: RevealTag
  /** `fade-up` = sobe 1rem · `rise` = sobe 2.5rem com leve scale (cards). */
  variant?: RevealVariant
  /** Atraso em ms — use para stagger dentro de uma grade. */
  delay?: number
  className?: string
}

/**
 * Animação de entrada ao rolar, SEM esconder conteúdo no HTML do servidor.
 *
 * Antes cada seção da home tinha a própria cópia de um hook com
 * IntersectionObserver e começava com `opacity-0` no SSR: sem JS (ou com JS
 * atrasado, ou para crawler que não rola), a página chegava com dezenas de
 * blocos invisíveis.
 *
 * Aqui o estado inicial é VISÍVEL. Depois de hidratar, só o que ainda está
 * abaixo da dobra é escondido (`data-reveal="pending"`) e volta ao entrar na
 * viewport. O que já está na tela nunca pisca. Quem pede menos movimento,
 * browser sem IntersectionObserver e cliente sem JS veem tudo direto.
 *
 * Os filhos podem ser Server Components — este wrapper é o único trecho client.
 */
export function Reveal({ children, as: Tag = 'div', variant = 'fade-up', delay = 0, className }: RevealProps) {
  // Nó guardado em state (callback ref) em vez de useRef: funciona com
  // qualquer tag do union sem cast e não lê ref durante o render.
  const [node, setNode] = useState<HTMLElement | null>(null)
  const [state, setState] = useState<'idle' | 'pending' | 'shown'>('idle')

  useEffect(() => {
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Já na tela (ou acima dela, ex.: âncora /#secao): fica como está.
    if (node.getBoundingClientRect().top < window.innerHeight) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('shown')
          observer.disconnect()
        } else {
          setState((prev) => (prev === 'idle' ? 'pending' : prev))
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [node])

  const style = delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined

  return (
    <Tag
      ref={setNode}
      className={cn('reveal', variant === 'rise' && 'reveal-rise', className)}
      data-reveal={state === 'idle' ? undefined : state}
      style={style}
    >
      {children}
    </Tag>
  )
}
