'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trackLeadConversion, trackLeadError } from '@/lib/analytics'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface FormData {
  nome: string
  email: string
  whatsapp: string
  empresa: string
  segmento: 'contabilidade' | 'financeira' | 'industria' | 'outro' | ''
  mensagem: string
  consentimentoLgpd: boolean
  website: string // honeypot
}

type FieldKey = Exclude<keyof FormData, 'website'>

interface LeadResponse {
  ok?: boolean
  id?: string
  error?: string
  issues?: Record<string, string[] | undefined>
}

const INITIAL: FormData = {
  nome: '', email: '', whatsapp: '', empresa: '',
  segmento: '', mensagem: '', consentimentoLgpd: false, website: '',
}

/* Ordem visual dos campos — o foco vai para o primeiro inválido. */
const FIELD_ORDER: FieldKey[] = ['nome', 'empresa', 'email', 'whatsapp', 'segmento', 'mensagem', 'consentimentoLgpd']

/* id do elemento no DOM (o checkbox manteve o id histórico). */
const DOM_ID: Record<FieldKey, string> = {
  nome: 'nome',
  empresa: 'empresa',
  email: 'email',
  whatsapp: 'whatsapp',
  segmento: 'segmento',
  mensagem: 'mensagem',
  consentimentoLgpd: 'consentimento',
}

const errorId = (key: FieldKey) => `${DOM_ID[key]}-error`

function isFieldKey(key: string): key is FieldKey {
  return (FIELD_ORDER as string[]).includes(key)
}

export function LeadForm() {
  const [data, setData] = useState<FormData>(INITIAL)
  const [state, setState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  // Objeto novo a cada pedido: o efeito roda mesmo repetindo o mesmo alvo.
  const [focusRequest, setFocusRequest] = useState<{ target: FieldKey | 'summary' } | null>(null)
  const searchParams = useSearchParams()
  const successRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  // A11y: quando entra em success, move foco pra o card — leitor de tela
  // anuncia a confirmação sem depender de o usuário estar navegando.
  useEffect(() => {
    if (state === 'success' && successRef.current) {
      successRef.current.focus()
    }
  }, [state])

  // Depois de um envio recusado, o foco vai para o primeiro campo inválido
  // (o leitor lê o erro via aria-describedby) ou para o resumo do erro.
  useEffect(() => {
    if (!focusRequest) return
    if (focusRequest.target === 'summary') summaryRef.current?.focus()
    else document.getElementById(DOM_ID[focusRequest.target])?.focus()
  }, [focusRequest])

  // UTMs lidas da URL no render: useSearchParams já é reativo, não precisa
  // de estado + efeito espelhando o mesmo valor.
  const utms = {
    utm_source: searchParams.get('utm_source') || '',
    utm_medium: searchParams.get('utm_medium') || '',
    utm_campaign: searchParams.get('utm_campaign') || '',
    origem: searchParams.get('origem') || 'formulario_contato',
  }

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
    if (fieldErrors[key as string]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[key as string]
        return next
      })
    }
  }

  // Validação inline por campo (roda no onBlur — não polui enquanto digita)
  function validateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    const errors: string[] = []
    if (key === 'nome') {
      const v = String(value).trim()
      if (v.length > 0 && v.length < 2) errors.push('Nome muito curto')
    }
    if (key === 'email') {
      const v = String(value).trim()
      if (v.length > 0 && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v)) {
        errors.push('E-mail inválido')
      }
    }
    if (key === 'whatsapp') {
      const digits = String(value).replace(/\D/g, '')
      if (digits.length > 0 && (digits.length < 10 || digits.length > 15)) {
        errors.push('WhatsApp deve ter 10 a 15 dígitos')
      }
    }
    if (key === 'empresa') {
      const v = String(value).trim()
      if (v.length > 0 && v.length < 2) errors.push('Empresa muito curta')
    }
    if (key === 'mensagem') {
      const v = String(value).trim()
      if (v.length > 0 && v.length < 20) {
        errors.push(`Mensagem precisa ter pelo menos 20 caracteres (${v.length}/20)`)
      }
    }
    setFieldErrors((prev) => {
      const next = { ...prev }
      if (errors.length > 0) next[key as string] = errors
      else delete next[key as string]
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'submitting') return

    // Botão fica habilitado de propósito: disabled não recebe foco nem explica
    // nada. Sem o aceite LGPD, o envio para aqui com mensagem e foco no checkbox.
    if (!data.consentimentoLgpd) {
      setFieldErrors((prev) => ({
        ...prev,
        consentimentoLgpd: ['Para enviar, marque que concorda com a Política de Privacidade.'],
      }))
      setErrorMessage('Falta autorizar o uso dos seus dados (LGPD) para podermos responder.')
      setState('error')
      setFocusRequest({ target: 'consentimentoLgpd' })
      return
    }

    setState('submitting')
    setErrorMessage('')
    setFieldErrors({})

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ...utms }),
      })

      const result = (await response.json().catch(() => ({}))) as LeadResponse

      if (!response.ok) {
        trackLeadError(response.status, utms.origem)
        if (response.status === 429) {
          setErrorMessage(result.error || 'Muitas tentativas. Tente em alguns minutos.')
          setFocusRequest({ target: 'summary' })
        } else if (response.status === 400 && result.issues) {
          const issues: Record<string, string[]> = {}
          for (const [key, messages] of Object.entries(result.issues)) {
            if (messages?.length) issues[key] = messages
          }
          setFieldErrors(issues)
          setErrorMessage('Verifique os campos destacados.')
          setFocusRequest({ target: FIELD_ORDER.find((k) => issues[k]) ?? 'summary' })
        } else {
          setErrorMessage(result.error || 'Erro ao enviar. Tente o WhatsApp direto.')
          setFocusRequest({ target: 'summary' })
        }
        setState('error')
        return
      }

      trackLeadConversion({ id: result.id, origem: utms.origem })
      setState('success')
      setData(INITIAL)
    } catch {
      trackLeadError('rede', utms.origem)
      setErrorMessage('Erro de conexão. Tente novamente ou use o WhatsApp.')
      setState('error')
      setFocusRequest({ target: 'summary' })
    }
  }

  // Erros do servidor em chaves sem campo visível (utm_*, origem): vão para o resumo.
  const extraErrors = Object.entries(fieldErrors)
    .filter(([key]) => !isFieldKey(key))
    .flatMap(([, messages]) => messages)

  const invalid = (key: FieldKey) => Boolean(fieldErrors[key]?.length)
  const describedBy = (key: FieldKey, ...extra: string[]) => {
    const ids = [...extra, ...(invalid(key) ? [errorId(key)] : [])]
    return ids.length ? ids.join(' ') : undefined
  }

  // Helper de render (não componente): definido aqui dentro ele remontaria o
  // <p> a cada render e reanunciaria o aria-live.
  const fieldError = (field: FieldKey) => {
    const messages = fieldErrors[field]
    if (!messages?.length) return null
    return (
      <p id={errorId(field)} aria-live="polite" className="field-error">
        {messages.join(' · ')}
      </p>
    )
  }

  if (state === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="surface-card p-8 text-center border-accent/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-text focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        <Image
          src="/icardinho.png"
          alt=""
          width={128}
          height={118}
          aria-hidden="true"
          className="mx-auto mb-4 drop-shadow-[0_8px_24px_rgba(37,99,235,0.3)]"
        />
        <h3 className="text-xl font-semibold text-ink mb-2">
          <CheckCircle2 className="inline h-5 w-5 text-accent-text mr-1.5 -mt-0.5" aria-hidden="true" />
          Contato recebido!
        </h3>
        <p className="text-ink-muted leading-relaxed">
          O próprio Jadir Luiz vai responder via WhatsApp em até <strong className="text-ink">4 horas úteis</strong>.
          Se for urgente, mande mensagem direto no WhatsApp pra agilizar.
        </p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="mt-4 inline-flex min-h-[44px] items-center text-sm font-medium text-accent-text hover:text-ink hover:underline underline-offset-4"
        >
          Enviar outro contato
        </button>
      </div>
    )
  }

  const submitting = state === 'submitting'

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate aria-busy={submitting}>
      {/* Honeypot — invisível pra humano, bot preenche */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Não preencha este campo</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={data.website}
          onChange={(e) => update('website', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-ink mb-1.5">
            Nome completo *
          </label>
          <input
            type="text"
            id="nome"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            value={data.nome}
            onChange={(e) => update('nome', e.target.value)}
            onBlur={(e) => validateField('nome', e.target.value)}
            aria-invalid={invalid('nome')}
            aria-describedby={describedBy('nome')}
            className="field-input"
          />
          {fieldError('nome')}
        </div>

        <div>
          <label htmlFor="empresa" className="block text-sm font-medium text-ink mb-1.5">
            Empresa *
          </label>
          <input
            type="text"
            id="empresa"
            required
            minLength={2}
            maxLength={200}
            autoComplete="organization"
            value={data.empresa}
            onChange={(e) => update('empresa', e.target.value)}
            onBlur={(e) => validateField('empresa', e.target.value)}
            aria-invalid={invalid('empresa')}
            aria-describedby={describedBy('empresa')}
            className="field-input"
          />
          {fieldError('empresa')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
            E-mail corporativo *
          </label>
          <input
            type="email"
            id="email"
            required
            maxLength={200}
            autoComplete="email"
            inputMode="email"
            value={data.email}
            onChange={(e) => update('email', e.target.value)}
            onBlur={(e) => validateField('email', e.target.value)}
            aria-invalid={invalid('email')}
            aria-describedby={describedBy('email')}
            className="field-input"
          />
          {fieldError('email')}
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-ink mb-1.5">
            WhatsApp *
          </label>
          <input
            type="tel"
            id="whatsapp"
            required
            placeholder="(21) 99999-9999"
            autoComplete="tel"
            inputMode="tel"
            value={data.whatsapp}
            onChange={(e) => update('whatsapp', e.target.value)}
            onBlur={(e) => validateField('whatsapp', e.target.value)}
            aria-invalid={invalid('whatsapp')}
            aria-describedby={describedBy('whatsapp')}
            className="field-input"
          />
          {fieldError('whatsapp')}
        </div>
      </div>

      <div>
        <label htmlFor="segmento" className="block text-sm font-medium text-ink mb-1.5">
          Segmento *
        </label>
        <select
          id="segmento"
          required
          value={data.segmento}
          onChange={(e) => update('segmento', e.target.value as FormData['segmento'])}
          aria-invalid={invalid('segmento')}
          aria-describedby={describedBy('segmento')}
          className="field-input"
        >
          <option value="" disabled>Selecione…</option>
          <option value="contabilidade">Escritório contábil</option>
          <option value="financeira">Financeira / Crédito</option>
          <option value="industria">Indústria / Empresa</option>
          <option value="outro">Outro</option>
        </select>
        {fieldError('segmento')}
      </div>

      <div>
        <label htmlFor="mensagem" className="block text-sm font-medium text-ink mb-1.5">
          Sobre seu projeto *
          <span className="text-ink-subtle font-normal ml-2 text-xs">(quanto mais contexto, melhor)</span>
        </label>
        <textarea
          id="mensagem"
          required
          minLength={20}
          maxLength={2000}
          rows={5}
          value={data.mensagem}
          onChange={(e) => update('mensagem', e.target.value)}
          onBlur={(e) => validateField('mensagem', e.target.value)}
          placeholder="Conta um pouco sobre o que você precisa: sistema novo? migração de legado? suporte recorrente? infraestrutura?"
          aria-invalid={invalid('mensagem')}
          aria-describedby={describedBy('mensagem', 'mensagem-counter')}
          className="field-input resize-y"
        />
        <p id="mensagem-counter" className="mt-1 text-xs text-ink-subtle">
          {data.mensagem.length}/2000 caracteres
        </p>
        {fieldError('mensagem')}
      </div>

      <div>
        <div
          className={cn(
            'flex items-start gap-3 rounded-md border bg-surface-1 p-4 transition-colors',
            invalid('consentimentoLgpd') ? 'border-danger-text' : 'border-hairline',
          )}
        >
          <input
            type="checkbox"
            id="consentimento"
            required
            checked={data.consentimentoLgpd}
            onChange={(e) => update('consentimentoLgpd', e.target.checked)}
            aria-invalid={invalid('consentimentoLgpd')}
            aria-describedby={describedBy('consentimentoLgpd')}
            className="mt-1 h-4 w-4 flex-shrink-0 cursor-pointer accent-accent"
          />
          <label htmlFor="consentimento" className="cursor-pointer text-sm text-ink leading-relaxed">
            Concordo com a{' '}
            <a
              href="/politica-privacidade"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent-text underline underline-offset-2 hover:text-ink"
            >
              Política de Privacidade
              <span className="sr-only"> (abre em nova aba)</span>
            </a>{' '}
            da Icardcase e autorizo o tratamento dos meus dados para contato comercial,
            conforme a LGPD (Lei 13.709/2018). *
          </label>
        </div>
        {fieldError('consentimentoLgpd')}
      </div>

      {state === 'error' && errorMessage && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="flex items-start gap-3 rounded-md border border-danger/40 bg-danger/10 p-4 focus:outline-none"
        >
          <AlertCircle className="h-5 w-5 text-danger-text flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm text-ink">
            <p>{errorMessage}</p>
            {extraErrors.length > 0 && (
              <ul className="mt-2 list-disc pl-4 text-ink-muted">
                {extraErrors.map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* aria-disabled (não disabled) durante o envio: o botão segura o foco
          e o handler já bloqueia re-submit. */}
      <button
        type="submit"
        aria-disabled={submitting}
        aria-describedby="lead-form-nota"
        className="btn-primary btn-lg btn-block sm:w-auto"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Enviando…
          </>
        ) : (
          'Enviar contato'
        )}
      </button>

      <p id="lead-form-nota" className="text-xs text-ink-subtle">
        * Campos obrigatórios. O envio exige a autorização LGPD acima. Não compartilhamos seus dados.
      </p>
    </form>
  )
}
