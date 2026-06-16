import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://icardcase.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Icardcase — Soluções web e mobile sob medida · Atendimento nacional',
    template: '%s · Icardcase',
  },
  description:
    'Desenvolvimento de sistemas web e mobile sob medida, infraestrutura, segurança e consultoria de tecnologia para empresas de todo o Brasil. Base no Rio de Janeiro, desde 2011.',
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
  authors: [{ name: 'Jadir Luiz de Oliveira Junior', url: siteUrl }],
  creator: 'Icardcase',
  publisher: 'Icardcase',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: siteUrl },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    title: 'Icardcase — Soluções web e mobile sob medida',
    description: 'Tecnologia sob medida para qualquer desafio do seu negócio. Atendimento nacional, base no Rio de Janeiro, desde 2011.',
    siteName: 'Icardcase',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Icardcase — Tecnologia que conecta, soluções que transformam' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Icardcase — Tecnologia sob medida para o seu negócio',
    description: 'Soluções web e mobile sob medida, segurança e consultoria. Atendimento nacional.',
    images: ['/og-default.png'],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  verification: { google: 'COLAR-CODIGO-GOOGLE-SEARCH-CONSOLE-AQUI' },
  icons: { icon: '/favicon.ico', shortcut: '/favicon-16x16.png', apple: '/apple-touch-icon.png' },
}

export const viewport: Viewport = {
  themeColor: '#081F4D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              '@id': siteUrl,
              name: 'Icardcase',
              legalName: 'J Oliver Serviços de Informática TI Ltda',
              alternateName: 'Icardcase Tecnologia',
              description: 'Desenvolvimento de sistemas web e mobile sob medida, infraestrutura, segurança e consultoria de tecnologia para empresas de todo o Brasil. Base no Rio de Janeiro, desde 2011.',
              url: siteUrl,
              telephone: '+55-21-98878-5170',
              email: 'contatos@icardcase.com.br',
              foundingDate: '2011',
              taxID: '13.437.391/0001-58',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Rua Bahia, 43',
                addressLocality: 'Niterói',
                addressRegion: 'RJ',
                postalCode: '24330-440',
                addressCountry: 'BR',
              },
              areaServed: { '@type': 'Country', name: 'Brasil' },
              priceRange: '$$$',
              sameAs: ['https://linkedin.com/company/icardcase', 'https://www.instagram.com/icardcase/'],
              founder: {
                '@type': 'Person',
                name: 'Jadir Luiz de Oliveira Junior',
                jobTitle: 'CEO & Founder',
              },
              makesOffer: [
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Desenvolvimento de sistemas sob medida' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gestão de infraestrutura de TI' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Suporte técnico e gestão de TI' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Consultoria em LGPD e segurança' } },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton origem="float_button" variant="float">
          <span className="sr-only">WhatsApp</span>
        </WhatsAppButton>
      </body>
    </html>
  )
}
