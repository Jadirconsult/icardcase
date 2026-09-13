/**
 * Markdown mínimo para os artigos de /insights — sem dependência nova.
 *
 * Converte o texto numa árvore simples (blocos + inlines) que o componente
 * `MarkdownContent` renderiza como React. Nada vira HTML cru: todo texto sai
 * como filho de elemento React (escapado), então conteúdo não injeta markup.
 *
 * Suporta só o que os posts usam: `##`/`###`, parágrafos, `**negrito**`,
 * listas `- ` e `1. ` e links `[texto](url)`.
 */

export type Inline =
  | { type: 'text'; text: string }
  | { type: 'strong'; children: Inline[] }
  | { type: 'link'; href: string; children: Inline[] }

export type Block =
  | { type: 'heading'; level: 2 | 3; children: Inline[] }
  | { type: 'paragraph'; children: Inline[] }
  | { type: 'list'; ordered: boolean; start: number; items: Inline[][] }

const HEADING = /^(#{2,3})\s+(.+)$/
const UNORDERED_ITEM = /^[-*]\s+(.+)$/
const ORDERED_ITEM = /^(\d+)\.\s+(.+)$/

/** Só esquemas seguros; qualquer outro (javascript:, data:) vira texto puro. */
export function isSafeHref(href: string): boolean {
  return /^(\/(?!\/)|#|https?:\/\/|mailto:)/i.test(href)
}

export function isInternalHref(href: string): boolean {
  return /^(\/(?!\/)|#)/.test(href)
}

export function parseInline(source: string): Inline[] {
  const nodes: Inline[] = []
  let buffer = ''
  let i = 0

  const flush = () => {
    if (buffer) nodes.push({ type: 'text', text: buffer })
    buffer = ''
  }

  while (i < source.length) {
    // **negrito** — só fecha se houver par; senão os asteriscos ficam como texto
    if (source.startsWith('**', i)) {
      const end = source.indexOf('**', i + 2)
      if (end > i + 2) {
        flush()
        nodes.push({ type: 'strong', children: parseInline(source.slice(i + 2, end)) })
        i = end + 2
        continue
      }
    }

    // [texto](url)
    if (source[i] === '[') {
      const match = /^\[([^\]]+)\]\(([^)\s]+)\)/.exec(source.slice(i))
      if (match) {
        flush()
        const [whole, label, href] = match
        const children = parseInline(label)
        if (isSafeHref(href)) {
          nodes.push({ type: 'link', href, children })
        } else {
          nodes.push(...children)
        }
        i += whole.length
        continue
      }
    }

    buffer += source[i]
    i += 1
  }

  flush()
  return nodes
}

export function parseMarkdown(source: string): Block[] {
  const blocks: Block[] = []
  let paragraph: string[] = []
  let list: { ordered: boolean; start: number; items: string[] } | null = null

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'paragraph', children: parseInline(paragraph.join(' ')) })
    }
    paragraph = []
  }

  const flushList = () => {
    if (list) {
      blocks.push({
        type: 'list',
        ordered: list.ordered,
        start: list.start,
        items: list.items.map(parseInline),
      })
    }
    list = null
  }

  for (const rawLine of source.replace(/\r\n?/g, '\n').split('\n')) {
    const line = rawLine.trim()

    if (!line) {
      flushParagraph()
      flushList()
      continue
    }

    const heading = HEADING.exec(line)
    if (heading) {
      flushParagraph()
      flushList()
      blocks.push({
        type: 'heading',
        level: heading[1].length === 2 ? 2 : 3,
        children: parseInline(heading[2]),
      })
      continue
    }

    const ordered = ORDERED_ITEM.exec(line)
    const unordered = ordered ? null : UNORDERED_ITEM.exec(line)
    if (ordered || unordered) {
      flushParagraph()
      const isOrdered = Boolean(ordered)
      const text = ordered ? ordered[2] : (unordered as RegExpExecArray)[1]
      // Troca de tipo de lista no meio do bloco fecha a anterior
      if (list && list.ordered !== isOrdered) flushList()
      if (!list) {
        list = { ordered: isOrdered, start: ordered ? Number(ordered[1]) : 1, items: [] }
      }
      list.items.push(text)
      continue
    }

    // Linha comum logo após uma lista começa parágrafo novo
    flushList()
    paragraph.push(line)
  }

  flushParagraph()
  flushList()
  return blocks
}

/** Contagem de palavras do texto visível (sem a marcação). */
export function countWords(source: string): number {
  const plain = source
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*]/g, ' ')
    .replace(/^\s*(\d+\.|-)\s+/gm, ' ')
  return plain.split(/\s+/).filter(Boolean).length
}

const WORDS_PER_MINUTE = 200

/** Minutos de leitura (~200 palavras/min), arredondado para cima. */
export function readingTimeMinutes(source: string): number {
  return Math.max(1, Math.ceil(countWords(source) / WORDS_PER_MINUTE))
}
