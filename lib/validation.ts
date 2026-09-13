/**
 * Validação de inputs — Icardcase
 * Zod (estrutura) + regex (sanitização inline)
 *
 * Sem isomorphic-dompurify: a lib puxa jsdom que virou ESM-only e quebrava o
 * build em runtime do Vercel (ERR_REQUIRE_ESM). Como o conteúdo dos campos é
 * gravado como texto puro no Postgres (nunca renderizado como HTML em
 * navegador), basta strip de tags + neutralização de < > residuais.
 */
import { z } from 'zod'

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
  // HONEYPOT — campo invisível pro humano, irresistível pro bot.
  //
  // NÃO validar aqui. Era `.max(0, 'Spam detectado')`, o que rejeitava o bot
  // logo no safeParse: a rota respondia 400 com
  // `issues: { website: ['Spam detectado'] }`, entregando de bandeja qual campo
  // é a armadilha. De quebra, o branch de honeypot do /api/lead (que finge
  // sucesso com um UUID falso) virava código morto — nunca era alcançado.
  //
  // Deixe o valor passar. Quem decide o que fazer com ele é o /api/lead.
  website: z.string().max(200).optional(),
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  origem: z.string().max(100).optional(),
})

export function sanitizeText(input: string): string {
  // Zod já valida estrutura (tamanho, formato). Aqui só neutralizamos HTML.
  return input
    .replace(/<[^>]*>/g, '')   // remove tags completas (<script>, <img ...>, etc.)
    .replace(/[<>]/g, '')      // remove <> residuais (defesa contra tags malformadas)
    .trim()
}

/**
 * Neutraliza um valor que vai virar CABEÇALHO de e-mail (ex.: Subject).
 *
 * `nome` e `empresa` entram no subject em lib/notify.ts. `empresa` não tem
 * regex restritiva, então poderia carregar CR/LF e tentar injetar um cabeçalho
 * novo. O nodemailer provavelmente já codifica isso, mas não dependemos do
 * comportamento da lib: quebra de linha em header nunca é legítima.
 *
 * Troca todo caractere de controle (< 0x20 e 0x7F, o que inclui CR e LF) por
 * espaço, e colapsa o resultado.
 *
 * NÃO usar em `mensagem` — lá a quebra de linha é conteúdo válido.
 */
export function sanitizeHeader(input: string): string {
  let out = ''
  for (const ch of input) {
    const code = ch.codePointAt(0) ?? 0
    out += code < 0x20 || code === 0x7f ? ' ' : ch
  }
  return out.replace(/\s+/g, ' ').trim()
}

export const whatsappClickSchema = z.object({
  origem: z.string().max(100),
  utm_source: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
})
