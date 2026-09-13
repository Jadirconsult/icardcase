import type { Metadata } from 'next'
import { COMPANY, SITE } from '@/lib/constants'

/**
 * Helpers de SEO compartilhados pelas rotas.
 *
 * Por que existe: o Next SUBSTITUI (não mescla) `openGraph` e `twitter` do
 * layout quando a página define os seus. Página que sobrescrevia só title e
 * url perdia imagem, siteName e locale na prévia do WhatsApp/LinkedIn.
 * `buildMetadata` devolve sempre o objeto completo.
 */

export const SITE_NAME = 'Icardcase'

// Título/descrição da home — decisão do dono, não alterar sem aprovação.
export const HOME_TITLE = 'Icardcase — Soluções web e mobile sob medida · Atendimento nacional'
export const HOME_DESCRIPTION =
  'Desenvolvimento de sistemas web e mobile sob medida, infraestrutura, segurança e consultoria de tecnologia para empresas de todo o Brasil. Base no Rio de Janeiro, desde 2011.'

// Nó único da organização no grafo schema.org. As páginas referenciam por
// `@id` em vez de repetir uma Organization solta (e divergente) em cada uma.
export const ORGANIZATION_ID = `${SITE.url}/#organization`
export const organizationRef = { '@id': ORGANIZATION_ID } as const

export interface SeoImage {
  url: string
  width?: number
  height?: number
  alt: string
}

export const DEFAULT_OG_IMAGE: SeoImage = {
  url: '/og-icardcase.png',
  width: 1200,
  height: 630,
  alt: 'Icardcase — Tecnologia que conecta, soluções que transformam',
}

/** URL absoluta a partir de um caminho relativo (`/sobre` → `https://…/sobre`). */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString()
}

interface BuildMetadataInput {
  /** Título da página, sem o sufixo — o template `%s · Icardcase` do layout adiciona. */
  title: string
  description: string
  /** Caminho relativo da rota, ex.: `/sobre`. Vira o canonical. */
  path: string
  type?: 'website' | 'article'
  image?: SeoImage
  publishedTime?: string
  modifiedTime?: string
  /** Usa o título como está, sem o template (só a home). */
  absoluteTitle?: boolean
  robots?: Metadata['robots']
}

export function buildMetadata({
  title,
  description,
  path,
  type = 'website',
  image = DEFAULT_OG_IMAGE,
  publishedTime,
  modifiedTime,
  absoluteTitle = false,
  robots,
}: BuildMetadataInput): Metadata {
  // openGraph/twitter não passam pelo template do layout: o sufixo vai à mão
  const socialTitle = absoluteTitle ? title : `${title} · ${SITE_NAME}`
  const url = absoluteUrl(path)
  const images = [image]

  const base = {
    title: socialTitle,
    description,
    url,
    siteName: SITE_NAME,
    locale: SITE.locale,
    images,
  }

  const openGraph: Metadata['openGraph'] =
    type === 'article'
      ? { ...base, type: 'article', publishedTime, modifiedTime: modifiedTime ?? publishedTime }
      : { ...base, type: 'website' }

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [image.url],
    },
    ...(robots ? { robots } : {}),
  }
}

/** Organização no formato schema.org — injetada uma vez no layout. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': ORGANIZATION_ID,
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    alternateName: 'Icardcase Tecnologia',
    description: HOME_DESCRIPTION,
    url: SITE.url,
    logo: { '@type': 'ImageObject', url: absoluteUrl('/logo-icardcase.png'), width: 512, height: 512 },
    image: absoluteUrl(DEFAULT_OG_IMAGE.url),
    telephone: COMPANY.contact.phoneE164,
    email: COMPANY.contact.email,
    foundingDate: COMPANY.founded,
    taxID: COMPANY.cnpj,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.address.street,
      addressLocality: COMPANY.address.city,
      addressRegion: COMPANY.address.state,
      postalCode: COMPANY.address.zip,
      addressCountry: COMPANY.address.country,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: COMPANY.openingHours.days,
      opens: COMPANY.openingHours.opens,
      closes: COMPANY.openingHours.closes,
    },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    priceRange: '$$$',
    sameAs: [COMPANY.social.linkedin, COMPANY.social.instagram],
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
  }
}

interface BreadcrumbItem {
  name: string
  path: string
}

/** BreadcrumbList a partir da raiz: `Início` entra sozinho na posição 1. */
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Início', path: '/' }, ...items].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.path === '/' ? SITE.url : absoluteUrl(item.path),
    })),
  }
}
