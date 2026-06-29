'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

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

const INITIAL: FormData = {
  nome: '', email: '', whatsapp: '', empresa: '',
  segmento: '', mensagem: '', consentimentoLgpd: false, website: '',
}

export function LeadForm() {
  const [data, setData] = useState<FormData>(INITIAL)
  const [state, setState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const searchParams = useSearchParams()

  // Captura UTMs da URL
  const [utms, setUtms] = useState({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    origem: 'formulario_contato',
  })

  useEffect(() => {
    setUtms({
      utm_source: searchParams.get('utm_source') || '',
      utm_medium: searchParams.get('utm_medium') || '',
      utm_campaign: searchParams.get('utm_campaign') || '',
      origem: searchParams.get('origem') || 'formulario_contato',
    })
  }, [searchParams])

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

    setState('submitting')
    setErrorMessage('')
    setFieldErrors({})

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ...utms }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          setErrorMessage(result.error || 'Muitas tentativas. Tente em alguns minutos.')
        } else if (response.status === 400 && result.issues) {
          setFieldErrors(result.issues)
          setErrorMessage('Verifique os campos destacados.')
        } else {
          setErrorMessage(result.error || 'Erro ao enviar. Tente o WhatsApp direto.')
        }
        setState('error')
        return
      }

      setState('success')
      setData(INITIAL)
    } catch {
      setErrorMessage('Erro de conexão. Tente novamente ou use o WhatsApp.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="bg-surface-alt border border-accent/20 rounded-lg p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-accent mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-xl font-semibold text-ink mb-2">Contato recebido!</h3>
        <p className="text-muted leading-relaxed">
          O próprio Jadir Luiz vai responder via WhatsApp em até <strong className="text-ink">4 horas úteis</strong>.
          Se for urgente, mande mensagem direto no WhatsApp pra agilizar.
        </p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="mt-6 text-sm text-accent hover:underline font-medium"
        >
          Enviar outro contato
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
            disabled={state === 'submitting'}
            aria-invalid={!!fieldErrors.nome}
            aria-describedby={fieldErrors.nome ? 'nome-error' : undefined}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-md border border-ink-100 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors disabled:opacity-60"
          />
          {fieldErrors.nome?.[0] && (
            <p id="nome-error" className="mt-1 text-xs text-red-600">{fieldErrors.nome[0]}</p>
          )}
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
            disabled={state === 'submitting'}
            aria-invalid={!!fieldErrors.empresa}
            aria-describedby={fieldErrors.empresa ? 'empresa-error' : undefined}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-md border border-ink-100 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors disabled:opacity-60"
          />
          {fieldErrors.empresa?.[0] && (
            <p id="empresa-error" className="mt-1 text-xs text-red-600">{fieldErrors.empresa[0]}</p>
          )}
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
            disabled={state === 'submitting'}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-md border border-ink-100 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors disabled:opacity-60"
          />
          {fieldErrors.email?.[0] && (
            <p id="email-error" className="mt-1 text-xs text-red-600">{fieldErrors.email[0]}</p>
          )}
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
            disabled={state === 'submitting'}
            aria-invalid={!!fieldErrors.whatsapp}
            aria-describedby={fieldErrors.whatsapp ? 'whatsapp-error' : undefined}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-md border border-ink-100 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors disabled:opacity-60"
          />
          {fieldErrors.whatsapp?.[0] && (
            <p id="whatsapp-error" className="mt-1 text-xs text-red-600">{fieldErrors.whatsapp[0]}</p>
          )}
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
          disabled={state === 'submitting'}
          className="w-full min-h-[44px] px-4 py-2.5 rounded-md border border-ink-100 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors disabled:opacity-60 bg-white"
        >
          <option value="">Selecione…</option>
          <option value="contabilidade">Escritório contábil</option>
          <option value="financeira">Financeira / Crédito</option>
          <option value="industria">Indústria / Empresa</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      <div>
        <label htmlFor="mensagem" className="block text-sm font-medium text-ink mb-1.5">
          Sobre seu projeto *
          <span className="text-muted font-normal ml-2 text-xs">(quanto mais contexto, melhor)</span>
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
          disabled={state === 'submitting'}
          placeholder="Conta um pouco sobre o que você precisa: sistema novo? migração de legado? suporte recorrente? infraestrutura?"
          aria-invalid={!!fieldErrors.mensagem}
          aria-describedby={fieldErrors.mensagem ? 'mensagem-error mensagem-counter' : 'mensagem-counter'}
          className="w-full px-4 py-2.5 rounded-md border border-ink-100 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors disabled:opacity-60 resize-y"
        />
        <p id="mensagem-counter" className="mt-1 text-xs text-muted">
          {data.mensagem.length}/2000 caracteres
        </p>
        {fieldErrors.mensagem?.[0] && (
          <p id="mensagem-error" className="mt-1 text-xs text-red-600">{fieldErrors.mensagem[0]}</p>
        )}
      </div>

      <div className="flex items-start gap-3 bg-surface-alt rounded-md p-4">
        <input
          type="checkbox"
          id="consentimento"
          required
          checked={data.consentimentoLgpd}
          onChange={(e) => update('consentimentoLgpd', e.target.checked)}
          disabled={state === 'submitting'}
          className="mt-0.5 h-4 w-4 rounded border-ink-100 text-accent focus:ring-2 focus:ring-accent/20"
        />
        <label htmlFor="consentimento" className="text-sm text-ink/80 leading-relaxed">
          Concordo com a{' '}
          <a href="/politica-privacidade" target="_blank" className="text-accent hover:underline font-medium">
            Política de Privacidade
          </a>{' '}
          da Icardcase e autorizo o tratamento dos meus dados para contato comercial,
          conforme a LGPD (Lei 13.709/2018). *
        </label>
      </div>

      {state === 'error' && errorMessage && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-md p-4">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={state === 'submitting' || !data.consentimentoLgpd}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover disabled:bg-ink-100 disabled:text-muted disabled:cursor-not-allowed text-white px-8 py-3 rounded-md font-medium transition-colors"
      >
        {state === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Enviando…
          </>
        ) : (
          'Enviar contato'
        )}
      </button>

      <p className="text-xs text-muted">
        * Campos obrigatórios. Não compartilhamos seus dados.
      </p>
    </form>
  )
}
