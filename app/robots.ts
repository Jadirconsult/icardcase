import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /_next/ fica liberado: o Google precisa do CSS/JS para renderizar a
        // página. Bloquear fazia o crawler ver o site sem estilo nem conteúdo client.
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  }
}
