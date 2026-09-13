import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants'
import { CASES, CASES_LAST_REVIEWED } from '@/lib/cases'
import { POSTS, postLastModified } from '@/lib/insights'

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>

interface RouteEntry {
  url: string
  priority: number
  changeFrequency: ChangeFrequency
  /** AAAA-MM-DD da última revisão real da página. */
  lastModified: string
}

// Maior data ISO (AAAA-MM-DD compara certo como string)
function latest(...dates: string[]): string {
  return dates.reduce((a, b) => (b > a ? b : a))
}

const newestPost = latest(...Object.values(POSTS).map(postLastModified))

// lastModified = data do último commit que tocou o page.tsx da rota
// (git log -1 --format=%cs -- app/<rota>/page.tsx). Antes era new Date() em
// todas as URLs: o Google aprende a ignorar lastmod que muda a cada build.
// Ao revisar o conteúdo de uma página, atualize a data dela aqui.
const routes: RouteEntry[] = [
  { url: '', priority: 1.0, changeFrequency: 'weekly', lastModified: '2026-09-04' },
  { url: '/sobre', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-07-01' },
  { url: '/cases', priority: 0.9, changeFrequency: 'weekly', lastModified: latest('2026-07-01', CASES_LAST_REVIEWED) },
  { url: '/insights', priority: 0.9, changeFrequency: 'weekly', lastModified: latest('2026-07-01', newestPost) },
  { url: '/contato', priority: 0.7, changeFrequency: 'monthly', lastModified: '2026-06-30' },
  // Páginas de serviço — SEO orgânico nacional
  { url: '/desenvolvimento-de-sistemas', priority: 0.9, changeFrequency: 'monthly', lastModified: '2026-06-30' },
  { url: '/desenvolvimento-mobile', priority: 0.9, changeFrequency: 'monthly', lastModified: '2026-06-30' },
  { url: '/infraestrutura-de-ti', priority: 0.9, changeFrequency: 'monthly', lastModified: '2026-06-30' },
  { url: '/seguranca-lgpd', priority: 0.9, changeFrequency: 'monthly', lastModified: '2026-06-30' },
  { url: '/consultoria-ti', priority: 0.9, changeFrequency: 'monthly', lastModified: '2026-06-30' },
  // Landing de oferta — campanha de captação (contabilidades)
  { url: '/raio-x-de-ti', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-07-03' },
  // Landing de topo de funil — busca orgânica por "Shadow IT", com o
  // diagnóstico por conversa no lugar do formulário.
  { url: '/shadow-it', priority: 0.9, changeFrequency: 'monthly', lastModified: '2026-09-04' },
  // Auditoria 09/2026: as três entradas legais aqui apontavam para 404.
  // A rota real é /politica-privacidade (sem o "de"); /termos-de-uso e /lgpd
  // nunca existiram em app/. Declarar 404 no sitemap gasta orçamento de
  // rastreio e deixava a política real fora do índice.
  { url: '/politica-privacidade', priority: 0.3, changeFrequency: 'yearly', lastModified: '2026-09-03' },
  { url: '/abordagem', priority: 0.6, changeFrequency: 'monthly', lastModified: '2026-09-03' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const main = routes.map((r) => ({
    url: `${SITE.url}${r.url}`,
    lastModified: r.lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  // Slugs e datas vêm das mesmas fontes que as páginas — post novo entra sozinho
  const posts = Object.entries(POSTS).map(([slug, post]) => ({
    url: `${SITE.url}/insights/${slug}`,
    lastModified: postLastModified(post),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const caseUrls = Object.keys(CASES).map((slug) => ({
    url: `${SITE.url}/cases/${slug}`,
    lastModified: CASES_LAST_REVIEWED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...main, ...posts, ...caseUrls]
}
