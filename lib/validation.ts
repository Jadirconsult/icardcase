/**
 * Validação de inputs — Icardcase
 * Zod (estrutura) + DOMPurify (HTML) + regex (sanitização)
 */
import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

export const leadSchema = z.object({
  nome: z.string().trim().min(2, 'Nome muito curto').max(100)
    .regex(/^[\p{L}\s'-]+$/u, 'Nome contém caracteres inválidos'),
  email: z.string().trim().toLowerCase().email('E-mail inválido').max(200),
  whatsapp: z.string().trim()
    .regex(/^\+?[\d\s()-]{10,20}$/, 'WhatsApp inválido')
    .transform((val) => val.replace(/\D/g, '')),
  empresa: z.string().trim().min(2, 'Empresa muito curta').max(200),
  segmento: z.enum(['contabilidade', 'financeira', 'industria', 'outro']),
  mensagem: z.string().trim().min(20, 'Conte mais (mín. 20 caracteres)').max(2000),
  consentimentoLgpd: z.literal(true, {
    errorMap: () => ({ message: 'Aceite a política de privacidade' }),
  }),
  website: z.string().max(0, 'Spam detectado').optional().or(z.literal('')),
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  origem: z.string().max(100).optional(),
})

export type LeadInput = z.infer<typeof leadSchema>

export function sanitizeText(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
}

export const whatsappClickSchema = z.object({
  origem: z.string().max(100),
  utm_source: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
})
