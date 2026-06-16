/**
 * Notificador via Evolution API
 * Falha silenciosa — não bloqueia registro do lead
 */
interface LeadNotification {
  nome: string; empresa: string; segmento: string;
  whatsapp: string; email: string; mensagem: string; origem?: string;
}

export async function notifyLeadViaWhatsApp(lead: LeadNotification): Promise<void> {
  const evolutionUrl = process.env.EVOLUTION_API_URL
  const apiKey = process.env.EVOLUTION_API_KEY
  const instance = process.env.EVOLUTION_INSTANCE
  const recipientNumber = process.env.WHATSAPP_NOTIFICATION_NUMBER

  if (!evolutionUrl || !apiKey || !instance || !recipientNumber) {
    console.warn('[Lead] Evolution API não configurada')
    return
  }

  const message = `🔔 *Novo lead Icardcase*

👤 *${lead.nome}*
🏢 ${lead.empresa}
📋 Segmento: ${lead.segmento}

📞 WhatsApp: ${lead.whatsapp}
📧 ${lead.email}

💬 _${lead.mensagem.substring(0, 300)}${lead.mensagem.length > 300 ? '...' : ''}_

📍 Origem: ${lead.origem || 'não identificada'}`

  try {
    const response = await fetch(`${evolutionUrl}/message/sendText/${instance}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: apiKey },
      body: JSON.stringify({ number: recipientNumber, text: message }),
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) console.error('[Lead] Evolution erro:', response.status)
  } catch (err) {
    console.error('[Lead] Falha notificação WhatsApp:', err)
  }
}

export async function notifyLeadViaN8N(lead: LeadNotification): Promise<void> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  const secret = process.env.N8N_WEBHOOK_SECRET
  if (!webhookUrl || !secret) return
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': secret },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(5000),
    })
  } catch (err) {
    console.error('[Lead] Falha N8N:', err)
  }
}
