'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { GOOGLE_ADS_ID, sendGtagEvent } from '@/lib/analytics'

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
 *   NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL → conversão de lead enviado
 *     (usada por lib/analytics.ts → trackLeadConversion).
 *
 * Carregamento em duas partes:
 *  1. Stub inline (`dataLayer` + `gtag` + config) — custo ~zero, roda cedo.
 *     Todo gtag() a partir daqui entra na fila do dataLayer.
 *  2. gtag.js real em `lazyOnload` — ~100KB de terceiro fora do caminho do
 *     LCP/INP; quando chega, processa a fila. Nenhum evento se perde.
 *
 * Como funciona a conversão: listener global (delegação) captura QUALQUER
 * clique em link wa.me/api.whatsapp.com do site — landing, header, float —
 * e dispara gtag('event','conversion'). Depende só de window.gtag (do stub).
 * Como os links abrem em nova aba, não é preciso segurar a navegação.
 */

const WHATSAPP_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL

export function GoogleTag() {
  useEffect(() => {
    if (!GOOGLE_ADS_ID || !WHATSAPP_LABEL) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element | null
      const link = target?.closest?.(
        'a[href*="wa.me"], a[href*="api.whatsapp.com"]',
      )
      if (!link) return

      sendGtagEvent('conversion', {
        send_to: `${GOOGLE_ADS_ID}/${WHATSAPP_LABEL}`,
        value: 1.0,
        currency: 'BRL',
      })
    }

    // capture=true: pega o clique antes de qualquer stopPropagation de terceiros
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  if (!GOOGLE_ADS_ID) return null

  return (
    <>
      <Script id="google-tag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
      <Script
        id="google-tag-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="lazyOnload"
      />
    </>
  )
}
