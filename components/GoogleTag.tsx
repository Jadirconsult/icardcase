'use client'

import { useEffect } from 'react'
import Script from 'next/script'

/**
 * Google tag (gtag.js) + conversão de clique no WhatsApp.
 *
 * Segurança de deploy: NADA renderiza se as env vars não existirem.
 * Configurar na Vercel (Settings → Environment Variables) e no .env.local:
 *
 *   NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
 *     → em Google Ads: Ferramentas → Planejamento e configuração da tag
 *       do Google (ou na criação da ação de conversão).
 *
 *   NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL=abcDEFghiJKL
 *     → o "rótulo de conversão" gerado ao criar a ação de conversão
 *       "Contato — clique no WhatsApp" (tipo: clique em link do site).
 *
 * Como funciona a conversão: listener global (delegação) captura QUALQUER
 * clique em link wa.me/api.whatsapp.com do site — landing, header, float —
 * e dispara gtag('event','conversion'). Como os links abrem em nova aba,
 * não é preciso segurar a navegação.
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
const WHATSAPP_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL

export function GoogleTag() {
  useEffect(() => {
    if (!ADS_ID || !WHATSAPP_LABEL) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element | null
      const link = target?.closest?.(
        'a[href*="wa.me"], a[href*="api.whatsapp.com"]',
      )
      if (!link || typeof window.gtag !== 'function') return

      window.gtag('event', 'conversion', {
        send_to: `${ADS_ID}/${WHATSAPP_LABEL}`,
        value: 1.0,
        currency: 'BRL',
      })
    }

    // capture=true: pega o clique antes de qualquer stopPropagation de terceiros
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  if (!ADS_ID) return null

  return (
    <>
      <Script
        id="google-tag-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${ADS_ID}');
        `}
      </Script>
    </>
  )
}
