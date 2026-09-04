'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Send, ShieldAlert, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Diagnóstico de Shadow IT por conversa — substitui o formulário de 6 campos.
 *
 * Roteirizado, não IA: sem chave de API, sem custo por conversa, e sem risco
 * de o site inventar preço, SLA ou cliente. O que ele entrega é real —
 * o nível de exposição sai das respostas, não de um número decorativo.
 *
 * Alimenta o MESMO pipeline do LeadForm (POST /api/lead → Zod → Supabase →
 * SMTP). A `mensagem` é montada a partir do transcript, então o lead chega
 * qualificado em vez de "preciso de suporte".
 */

type Segmento = 'contabilidade' | 'financeira' | 'industria' | 'outro'

interface Sintoma {
  id: string
  label: string
  peso: number
}

/* Pesos derivados do que cada prática expõe de fato, não de escala arbitrária:
   dado pessoal de terceiro em conta particular é o pior caso na LGPD. */
const SINTOMAS: Sintoma[] = [
  { id: 'planilha-pessoal', label: 'Planilha crítica no drive pessoal de alguém', peso: 3 },
  { id: 'whatsapp', label: 'Processo controlado por WhatsApp', peso: 3 },
  { id: 'form-externo', label: 'Formulário de cliente em ferramenta gratuita', peso: 3 },
  { id: 'trello-notion', label: 'Trello/Notion em conta particular', peso: 2 },
  { id: 'legado', label: 'Sistema legado que ninguém mexe', peso: 2 },
  { id: 'digitacao-dupla', label: 'A mesma informação digitada em dois lugares', peso: 1 },
]

const SEGMENTOS: { id: Segmento; label: string }[] = [
  { id: 'contabilidade', label: 'Contabilidade' },
  { id: 'financeira', label: 'Financeira' },
  { id: 'industria', label: 'Indústria' },
  { id: 'outro', label: 'Outro' },
]

/* O risco setorial é específico porque genérico não convence sócio. */
const RISCO_SETOR: Record<Segmento, string> = {
  contabilidade:
    'Escritório contábil é o pior caso: você guarda dado fiscal de dezenas de empresas. Um vazamento não expõe só a sua operação — expõe a dos seus clientes, e a responsabilidade pelo tratamento é sua.',
  financeira:
    'Em financeira o problema é rastreabilidade: sem log de quem viu e alterou o quê, você não consegue provar conformidade numa auditoria — mesmo tendo agido certo.',
  industria:
    'Na indústria o custo aparece na parada: quando o controle vive na planilha de uma pessoa e ela falta, a decisão espera. E decisão que espera em produção vira prejuízo medido em hora.',
  outro:
    'Independente do setor, o padrão se repete: a ferramenta paralela nasce para resolver, e vira o lugar onde o dado mais importante mora sem backup, sem log e sem dono.',
}

const SAIDA_OPCOES = [
  { id: 'perde', label: 'Sinceramente? A gente perde o histórico', peso: 3 },
  { id: 'corre', label: 'Dá uma correria para recuperar', peso: 2 },
  { id: 'tranquilo', label: 'Está tudo em sistema, sai numa boa', peso: 0 },
]

type Author = 'bot' | 'user'
interface Message {
  id: number
  author: Author
  text: string
}

type Step =
  | 'segmento'
  | 'sintomas'
  | 'saida'
  | 'diagnostico'
  | 'identificacao'
  | 'contato'
  | 'consentimento'
  | 'enviando'
  | 'sucesso'
  | 'erro'

interface Respostas {
  segmento: Segmento | null
  sintomas: string[]
  saida: string | null
}

const ABERTURA =
  'Shadow IT é quando a sua equipe resolve na planilha o que o sistema não resolve. Não é indisciplina — é sintoma. Em menos de um minuto eu estimo o tamanho da sua exposição, sem você digitar formulário nenhum.'

export function ShadowITChat() {
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, author: 'bot', text: ABERTURA },
    { id: 1, author: 'bot', text: 'Para começar: em que setor você atua?' },
  ])
  const [step, setStep] = useState<Step>('segmento')
  const [respostas, setRespostas] = useState<Respostas>({ segmento: null, sintomas: [], saida: null })
  const [sintomasSel, setSintomasSel] = useState<string[]>([])
  const [nome, setNome] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [erro, setErro] = useState('')
  const [digitando, setDigitando] = useState(false)

  const nextId = useRef(2)
  const logRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useRef(false)

  useEffect(() => {
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  /* Rola só o log, nunca a página: puxar a viewport embaixo do usuário é
     desorientador, ainda mais em celular. */
  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, step, digitando])

  const push = useCallback((author: Author, text: string) => {
    setMessages((prev) => [...prev, { id: nextId.current++, author, text }])
  }, [])

  /* Pausa de digitação: dá ritmo de conversa em vez de despejar tudo de uma
     vez. Zerada para quem pediu menos movimento. */
  const botSays = useCallback(
    (linhas: string[], depois?: () => void) => {
      const delay = reduceMotion.current ? 0 : 550
      let acc = 0
      setDigitando(true)
      linhas.forEach((linha, i) => {
        acc += delay
        setTimeout(() => {
          push('bot', linha)
          if (i === linhas.length - 1) {
            setDigitando(false)
            depois?.()
          }
        }, acc)
      })
      if (delay === 0) setDigitando(false)
    },
    [push],
  )

  function escolherSegmento(seg: Segmento) {
    const label = SEGMENTOS.find((s) => s.id === seg)?.label ?? ''
    push('user', label)
    setRespostas((r) => ({ ...r, segmento: seg }))
    setStep('sintomas')
    botSays([RISCO_SETOR[seg], 'Quais destes existem hoje na sua operação? Marque quantos quiser — ninguém está julgando, isso é rotina em empresa que cresceu rápido.'])
  }

  function confirmarSintomas() {
    const labels = sintomasSel.map((id) => SINTOMAS.find((s) => s.id === id)?.label).filter(Boolean)
    push('user', labels.length ? labels.join(' · ') : 'Nenhum desses')
    setRespostas((r) => ({ ...r, sintomas: sintomasSel }))
    setStep('saida')
    botSays(['Última pergunta antes do diagnóstico: quando alguém da equipe sai da empresa, o que acontece com o que essa pessoa controlava?'])
  }

  function escolherSaida(id: string) {
    const label = SAIDA_OPCOES.find((o) => o.id === id)?.label ?? ''
    push('user', label)
    const proximas = { ...respostas, saida: id }
    setRespostas(proximas)
    setStep('diagnostico')

    const pesoSintomas = sintomasSel.reduce(
      (acc, sid) => acc + (SINTOMAS.find((s) => s.id === sid)?.peso ?? 0),
      0,
    )
    const pesoSaida = SAIDA_OPCOES.find((o) => o.id === id)?.peso ?? 0
    const total = pesoSintomas + pesoSaida

    const nivel = total >= 9 ? 'alto' : total >= 5 ? 'moderado' : total >= 1 ? 'baixo' : 'mínimo'
    const leitura =
      total >= 9
        ? 'Exposição alta. Há dado crítico fora do seu controle em mais de uma frente ao mesmo tempo, e a saída de uma pessoa hoje levaria histórico junto. Não é hipótese — é o que você acabou de descrever.'
        : total >= 5
          ? 'Exposição moderada. O núcleo está em sistema, mas existem bolsões paralelos onde a informação nasce e nunca volta para o sistema oficial. É o estágio em que ainda dá para resolver barato.'
          : total >= 1
            ? 'Exposição baixa. A operação está majoritariamente sob controle; sobrou pouca coisa fora, e vale fechar antes que vire hábito.'
            : 'Exposição mínima pelo que você descreveu. Vale uma conversa mesmo assim para confirmar — o que costuma escapar nesse cenário é o que ninguém lembra de mencionar.'

    botSays([
      `Diagnóstico: exposição ${nivel}.`,
      leitura,
      'Isso aqui é a leitura rápida. O mapeamento de verdade lista ferramenta por ferramenta, aponta onde tem dado pessoal de terceiro e diz o que fechar primeiro — quem faz é o Jadir, engenheiro, não vendedor. Quer receber?',
    ], () => setStep('identificacao'))
  }

  function confirmarIdentificacao(e: React.FormEvent) {
    e.preventDefault()
    if (nome.trim().length < 2 || empresa.trim().length < 2) return
    push('user', `${nome.trim()} — ${empresa.trim()}`)
    setStep('contato')
    botSays([`Prazer, ${nome.trim().split(' ')[0]}. Onde eu te mando o mapeamento?`])
  }

  function confirmarContato(e: React.FormEvent) {
    e.preventDefault()
    const digits = whatsapp.replace(/\D/g, '')
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim())) {
      setErro('E-mail inválido — confere para eu não mandar no vazio?')
      return
    }
    if (digits.length < 10 || digits.length > 15) {
      setErro('O WhatsApp precisa ter DDD. Ex.: (21) 98878-5170')
      return
    }
    setErro('')
    push('user', `${email.trim()} · ${whatsapp.trim()}`)
    setStep('consentimento')
    botSays(['Só falta você autorizar o uso desses dados para eu te responder. Nada de lista de disparo.'])
  }

  async function enviar() {
    setStep('enviando')
    setErro('')

    const labels = respostas.sintomas
      .map((id) => SINTOMAS.find((s) => s.id === id)?.label)
      .filter(Boolean)
    const saidaLabel = SAIDA_OPCOES.find((o) => o.id === respostas.saida)?.label ?? '—'

    /* Transcript vira a mensagem: o lead chega qualificado, e passa folgado
       do mínimo de 20 caracteres do schema. */
    const mensagem = [
      '[Diagnóstico de Shadow IT — via chat]',
      `Setor: ${SEGMENTOS.find((s) => s.id === respostas.segmento)?.label ?? '—'}`,
      `Sintomas relatados: ${labels.length ? labels.join('; ') : 'nenhum dos listados'}`,
      `Saída de colaborador: ${saidaLabel}`,
    ].join('\n')

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          empresa: empresa.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          segmento: respostas.segmento,
          mensagem,
          consentimentoLgpd: true,
          website,
          utm_source: searchParams.get('utm_source') || '',
          utm_medium: searchParams.get('utm_medium') || '',
          utm_campaign: searchParams.get('utm_campaign') || '',
          origem: searchParams.get('origem') || 'chat_shadow_it',
        }),
      })
      const result = await response.json()

      if (!response.ok) {
        setErro(
          response.status === 429
            ? result.error || 'Muitas tentativas. Tente daqui a alguns minutos.'
            : result.error || 'Não consegui enviar. Chama no WhatsApp que resolvemos por lá.',
        )
        setStep('erro')
        return
      }

      setStep('sucesso')
      botSays([
        `Recebido, ${nome.trim().split(' ')[0]}. O Jadir responde em até 4 horas úteis, no e-mail e no WhatsApp que você deixou.`,
        'Se for urgente, chama direto no WhatsApp — é o mesmo número que atende o cliente.',
      ])
    } catch {
      setErro('Erro de conexão. Tente de novo, ou chama no WhatsApp.')
      setStep('erro')
    }
  }

  const inputCls =
    'w-full min-h-[44px] rounded-lg border border-hairline bg-canvas px-4 py-3 text-sm text-ink placeholder:text-ink-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text'
  const chipCls =
    'min-h-[44px] rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-left text-sm text-ink transition-colors hover:border-accent-text hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-text'

  return (
    <div className="surface-card overflow-hidden rounded-2xl">
      <div className="flex items-center gap-3 border-b border-hairline bg-surface-1/60 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent-text">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-white">Diagnóstico de Shadow IT</p>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-subtle">
            Sem formulário · menos de 1 minuto
          </p>
        </div>
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Conversa do diagnóstico"
        className="max-h-[26rem] space-y-4 overflow-y-auto px-5 py-6"
      >
        {messages.map((m) => (
          <div key={m.id} className={cn('flex', m.author === 'user' ? 'justify-end' : 'justify-start')}>
            <p
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                m.author === 'user'
                  ? 'bg-accent/20 text-ink'
                  : 'bg-surface-1/80 text-ink-muted',
              )}
            >
              <span className="sr-only">{m.author === 'user' ? 'Você: ' : 'Icardcase: '}</span>
              {m.text}
            </p>
          </div>
        ))}

        {digitando && (
          <p className="font-mono text-xs text-ink-tertiary" aria-hidden="true">
            digitando…
          </p>
        )}
      </div>

      <div className="border-t border-hairline bg-surface-1/40 px-5 py-5">
        {/* Honeypot — invisível para humano, irresistível para bot. */}
        <label className="sr-only" htmlFor="chat-website" aria-hidden="true">
          Não preencha
        </label>
        <input
          id="chat-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />

        {step === 'segmento' && (
          <div className="grid grid-cols-2 gap-2.5">
            {SEGMENTOS.map((s) => (
              <button key={s.id} type="button" className={chipCls} onClick={() => escolherSegmento(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
        )}

        {step === 'sintomas' && (
          <div className="space-y-2.5">
            <fieldset>
              <legend className="sr-only">Sintomas de Shadow IT na sua operação</legend>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {SINTOMAS.map((s) => {
                  const on = sintomasSel.includes(s.id)
                  return (
                    <label
                      key={s.id}
                      className={cn(
                        chipCls,
                        'flex cursor-pointer items-center gap-3',
                        on && 'border-accent-text bg-accent/10 text-white',
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() =>
                          setSintomasSel((prev) =>
                            prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id],
                          )
                        }
                        className="h-4 w-4 shrink-0 accent-[#2563EB]"
                      />
                      {s.label}
                    </label>
                  )
                })}
              </div>
            </fieldset>
            <button
              type="button"
              onClick={confirmarSintomas}
              className="min-h-[44px] w-full rounded-lg bg-accent px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {sintomasSel.length ? `Continuar com ${sintomasSel.length} marcado(s)` : 'Nenhum desses'}
            </button>
          </div>
        )}

        {step === 'saida' && (
          <div className="grid gap-2.5">
            {SAIDA_OPCOES.map((o) => (
              <button key={o.id} type="button" className={chipCls} onClick={() => escolherSaida(o.id)}>
                {o.label}
              </button>
            ))}
          </div>
        )}

        {step === 'identificacao' && (
          <form onSubmit={confirmarIdentificacao} className="space-y-2.5">
            <label className="sr-only" htmlFor="chat-nome">Seu nome</label>
            <input
              id="chat-nome"
              className={inputCls}
              placeholder="Seu nome"
              autoComplete="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <label className="sr-only" htmlFor="chat-empresa">Empresa</label>
            <input
              id="chat-empresa"
              className={inputCls}
              placeholder="Empresa"
              autoComplete="organization"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              required
            />
            <button
              type="submit"
              className="min-h-[44px] w-full rounded-lg bg-accent px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Quero o mapeamento
            </button>
          </form>
        )}

        {step === 'contato' && (
          <form onSubmit={confirmarContato} className="space-y-2.5">
            <label className="sr-only" htmlFor="chat-email">E-mail</label>
            <input
              id="chat-email"
              type="email"
              inputMode="email"
              className={inputCls}
              placeholder="E-mail"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="sr-only" htmlFor="chat-whatsapp">WhatsApp</label>
            <input
              id="chat-whatsapp"
              type="tel"
              inputMode="tel"
              className={inputCls}
              placeholder="WhatsApp com DDD"
              autoComplete="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
            />
            {erro && (
              <p role="alert" className="text-xs text-red-400">
                {erro}
              </p>
            )}
            <button
              type="submit"
              className="min-h-[44px] w-full rounded-lg bg-accent px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Continuar
            </button>
          </form>
        )}

        {step === 'consentimento' && (
          <div className="space-y-3">
            <p className="text-xs leading-relaxed text-ink-subtle">
              Autorizo a Icardcase a usar meus dados para responder este contato, conforme a{' '}
              <a href="/politica-privacidade" className="text-accent-text underline underline-offset-2">
                Política de Privacidade
              </a>{' '}
              e a LGPD. Não compartilhamos com terceiros.
            </p>
            <button
              type="button"
              onClick={enviar}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Autorizo e quero receber
            </button>
          </div>
        )}

        {step === 'enviando' && (
          <p className="text-center text-sm text-ink-subtle" role="status">
            Enviando…
          </p>
        )}

        {step === 'erro' && (
          <div className="space-y-3">
            <p role="alert" className="text-sm text-red-400">
              {erro}
            </p>
            <button
              type="button"
              onClick={enviar}
              className="min-h-[44px] w-full rounded-lg border border-hairline px-5 py-3 text-sm font-semibold text-ink hover:border-accent-text"
            >
              Tentar de novo
            </button>
          </div>
        )}

        {step === 'sucesso' && (
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400" role="status">
            <Send className="h-4 w-4" aria-hidden="true" />
            Diagnóstico enviado
          </p>
        )}
      </div>
    </div>
  )
}
