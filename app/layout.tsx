import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { ConditionalChrome } from '@/components/ConditionalChrome'
import { GoogleTag } from '@/components/GoogleTag'
import { SITE } from '@/lib/constants'
import { DEFAULT_OG_IMAGE, HOME_DESCRIPTION, HOME_TITLE, organizationSchema } from '@/lib/seo'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
// Mono só aparece em rótulos pequenos: sem preload, não disputa banda com o
// Inter e o LCP no carregamento inicial.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
})

const siteUrl = SITE.url

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: HOME_TITLE,
    template: '%s · Icardcase',
  },
  description: HOME_DESCRIPTION,
  keywords: [
    'desenvolvimento de sistemas sob medida',
    'desenvolvimento de aplicativos mobile',
    'software sob medida Brasil',
    'automação de processos',
    'integração de sistemas',
    'consultoria em tecnologia',
    'modernização de sistema legado',
    'segurança e LGPD',
    'desenvolvimento web Rio de Janeiro',
  ],
  applicationName: 'Icardcase',
  authors: [{ name: 'Jadir Luiz de Oliveira Junior', url: siteUrl }],
  creator: 'Icardcase',
  publisher: 'Icardcase',
  referrer: 'strict-origin-when-cross-origin',
  formatDetection: { email: false, address: false, telephone: false },
  // Sem canonical global: cada rota define o seu (relativo) — evita que páginas
  // internas herdem o canonical da home e sejam tratadas como duplicata.
  // openGraph/twitter abaixo são só fallback: rota com buildMetadata (lib/seo)
  // substitui o objeto inteiro.
  appleWebApp: {
    capable: true,
    title: 'Icardcase',
    statusBarStyle: 'black-translucent',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    title: 'Icardcase — Soluções web e mobile sob medida',
    description: 'Tecnologia sob medida para qualquer desafio do seu negócio. Atendimento nacional, base no Rio de Janeiro, desde 2011.',
    siteName: 'Icardcase',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Icardcase — Tecnologia sob medida para o seu negócio',
    description: 'Soluções web e mobile sob medida, segurança e consultoria. Atendimento nacional.',
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#081F4D',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* next/font faz self-host das fontes — não há preconnect a fazer pro Google.
            Removido o preconnect que o Lighthouse flagrou como "não utilizado". */}
        {/* Organização com @id `${SITE.url}/#organization` — as páginas
            referenciam esse nó (provider/publisher/creator) em vez de repetir. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* Skip link — WCAG 2.4.1: usuário keyboard pula direto pro conteúdo */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white"
        >
          Pular para o conteúdo principal
        </a>
        {/* ConditionalChrome: landings de tráfego pago (ex.: /raio-x-de-ti)
            renderizam sem Header/Footer/float — página isolada, sem rota de fuga. */}
        <ConditionalChrome>
          <Header />
        </ConditionalChrome>
        <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
        <ConditionalChrome>
          <Footer />
          <WhatsAppButton origem="float_button" variant="float">
            <span className="sr-only">WhatsApp</span>
          </WhatsAppButton>
        </ConditionalChrome>
        {/* Google tag (Ads) + conversão de clique WhatsApp — só renderiza
            com NEXT_PUBLIC_GOOGLE_ADS_ID / _WHATSAPP_LABEL configuradas */}
        <GoogleTag />
        {/* Vercel Analytics — page views + eventos */}
        <Analytics />
        {/* Vercel Speed Insights — Core Web Vitals reais (RUM) */}
        <SpeedInsights />
      </body>
    </html>
  )
}
