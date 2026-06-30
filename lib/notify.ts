/**
 * Notificação de lead via SMTP (cPanel/Hostinger).
 *
 * Envia um e-mail bonito (HTML + texto plain) com os dados do lead
 * pro endereço configurado em LEAD_NOTIFICATION_EMAIL. O remetente é
 * uma caixa do próprio domínio (ex: lead@icardcase.com.br), o que dá
 * 2 vantagens: identidade visual da marca + Reply-To configurado pro
 * e-mail do lead (resposta direta no Gmail volta pro cliente).
 *
 * Falha silenciosa: se SMTP estiver mal configurado ou cair, o lead
 * JÁ FOI gravado no Supabase — a notificação é só "nice to have".
 */
import nodemailer from 'nodemailer'

export interface LeadNotification {
  nome: string
  empresa: string
  segmento: string
  whatsapp: string
  email: string
  mensagem: string
  origem?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  leadId?: string
}

// Lazy: só cria o transporter quando a função é chamada (evita criar
// em build/cold-start sem env vars).
let cachedTransporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter | null {
  if (cachedTransporter) return cachedTransporter

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT) || 465
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    console.warn('[Lead] SMTP não configurado (SMTP_HOST/USER/PASS ausentes)')
    return null
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    // 465 = SMTPS direto; 587 = STARTTLS upgrade. cPanel geralmente expõe ambas.
    secure: port === 465,
    auth: { user, pass },
    // Timeouts curtos pra não travar a serverless function do Vercel:
    // o lead já foi gravado, perder a notificação é melhor que segurar a UI.
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  })

  return cachedTransporter
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function buildHtml(lead: LeadNotification): string {
  const waE164 = lead.whatsapp.replace(/\D/g, '')
  const waUrl = `https://wa.me/${waE164}`
  const utmLine = [lead.utm_source, lead.utm_medium, lead.utm_campaign]
    .filter(Boolean)
    .join(' / ') || '—'

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Novo lead Icardcase</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:24px 0">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
        <tr>
          <td style="background:#081F4D;padding:24px 28px;color:#ffffff">
            <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.7">Icardcase · Novo lead</div>
            <div style="margin-top:8px;font-size:22px;font-weight:600;letter-spacing:-0.02em">${escapeHtml(lead.nome)} — ${escapeHtml(lead.empresa)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.6">
              <tr>
                <td style="padding:8px 0;color:#64748b;width:140px">Segmento</td>
                <td style="padding:8px 0;color:#0f172a;font-weight:500">${escapeHtml(lead.segmento)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b">E-mail</td>
                <td style="padding:8px 0"><a href="mailto:${escapeHtml(lead.email)}" style="color:#2563EB;text-decoration:none">${escapeHtml(lead.email)}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b">WhatsApp</td>
                <td style="padding:8px 0"><a href="${waUrl}" style="color:#2563EB;text-decoration:none">${escapeHtml(lead.whatsapp)}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b">Origem</td>
                <td style="padding:8px 0;color:#0f172a">${escapeHtml(lead.origem || 'site (formulário)')}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#64748b">UTM</td>
                <td style="padding:8px 0;color:#0f172a;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px">${escapeHtml(utmLine)}</td>
              </tr>
              ${lead.leadId ? `<tr>
                <td style="padding:8px 0;color:#64748b">ID Supabase</td>
                <td style="padding:8px 0;color:#0f172a;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px">${escapeHtml(lead.leadId)}</td>
              </tr>` : ''}
            </table>

            <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e2e8f0">
              <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">Mensagem</div>
              <div style="font-size:14px;line-height:1.6;color:#0f172a;white-space:pre-wrap">${escapeHtml(lead.mensagem)}</div>
            </div>

            <div style="margin-top:28px;display:block">
              <a href="${waUrl}" style="display:inline-block;background:#2563EB;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:500;font-size:14px">
                💬 Abrir WhatsApp do cliente
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 28px;background:#f8fafc;color:#94a3b8;font-size:12px;border-top:1px solid #e2e8f0">
            Responda este e-mail para falar direto com <strong style="color:#475569">${escapeHtml(lead.email)}</strong> — o Reply-To já está configurado.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildText(lead: LeadNotification): string {
  return `🔔 NOVO LEAD ICARDCASE

Nome:     ${lead.nome}
Empresa:  ${lead.empresa}
Segmento: ${lead.segmento}
E-mail:   ${lead.email}
WhatsApp: ${lead.whatsapp}
Origem:   ${lead.origem || 'site (formulário)'}
UTM:      ${[lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(' / ') || '—'}
${lead.leadId ? `ID:       ${lead.leadId}\n` : ''}
MENSAGEM:
${lead.mensagem}

—
Responda este e-mail pra falar direto com o cliente (Reply-To configurado).
WhatsApp: https://wa.me/${lead.whatsapp.replace(/\D/g, '')}
`
}

export async function notifyLeadViaEmail(lead: LeadNotification): Promise<void> {
  const transporter = getTransporter()
  if (!transporter) return

  const to = process.env.LEAD_NOTIFICATION_EMAIL
  const from = process.env.LEAD_NOTIFICATION_FROM || process.env.SMTP_USER

  if (!to || !from) {
    console.warn('[Lead] LEAD_NOTIFICATION_EMAIL ou LEAD_NOTIFICATION_FROM ausente')
    return
  }

  try {
    await transporter.sendMail({
      from: `"Icardcase — Lead Form" <${from}>`,
      to,
      replyTo: lead.email, // responder no Gmail volta direto pro cliente
      subject: `[Lead] ${lead.nome} — ${lead.empresa} (${lead.segmento})`,
      text: buildText(lead),
      html: buildHtml(lead),
    })
  } catch (err) {
    // Falha silenciosa: o lead JÁ está no Supabase, não bloqueia UX.
    console.error('[Lead] Falha SMTP:', err)
  }
}
