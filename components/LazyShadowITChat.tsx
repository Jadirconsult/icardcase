'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

/* Placeholder com a mesma altura do chat montado — sem layout shift. */
function ChatSkeleton() {
  return <div className="surface-card h-[34rem]" aria-hidden="true" />
}

const ShadowITChat = dynamic(
  () => import('@/components/ShadowITChat').then((m) => m.ShadowITChat),
  { ssr: false, loading: ChatSkeleton },
)

/**
 * ShadowITChat carregado sob demanda, para páginas onde ele fica abaixo da
 * dobra (home, via DiagnosticoSection).
 *
 * O chat já não entrava no HTML do servidor (useSearchParams + Suspense faz
 * bailout para client na rota estática), então `ssr: false` não custa SEO.
 * O ganho: o JS do chat sai do chunk inicial e só baixa quando a seção chega
 * a ~600px da viewport.
 *
 * Onde o chat está acima da dobra (/shadow-it), importe o ShadowITChat direto.
 */
export function LazyShadowITChat() {
  const ref = useRef<HTMLDivElement>(null)
  const [perto, setPerto] = useState(false)

  useEffect(() => {
    const node = ref.current
    // IntersectionObserver existe em todo browser do browserslist (Safari 16+).
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPerto(true)
          observer.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref}>
      {perto ? (
        <Suspense fallback={<ChatSkeleton />}>
          <ShadowITChat />
        </Suspense>
      ) : (
        <ChatSkeleton />
      )}
    </div>
  )
}
