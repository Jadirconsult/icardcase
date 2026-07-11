# As regras que a IA deve seguir sempre

> Projeto: **Icardcase Site** · Stack: Next.js 16.2.9 (App Router) · React 19.2.7 · TypeScript 5.6.3 (strict) · Tailwind 3.4.13 · Supabase · Vercel
> Este documento descreve como o código **É** escrito aqui. Onde diz "PROPOSTA", a convenção ainda não existe no projeto e precisa ser aprovada.

## Convenções de código

- **Linguagem:** TypeScript 5.6, `strict: true`, `target: ES2022`, `moduleResolution: bundler` (ver `tsconfig.json`).
- **Tipagem:** `any` é proibido. Props e retornos tipados. Use `z.infer<typeof schema>` para derivar tipos de entrada (ex.: `LeadInput` em [lib/validation.ts](lib/validation.ts)).
- **Formatação/Lint:** ESLint via `eslint-config-next` 16.2.9 (`npm run lint`). Não há Prettier configurado — siga o estilo dos arquivos existentes (aspas simples, sem ponto-e-vírgula no fim de linha, indentação de 2 espaços).
- **Imports:** use o alias `@/*` (mapeia pra raiz) para tudo em `lib/` e `components/` — `import { cn } from '@/lib/utils'`. Relativo só dentro da mesma pasta.
- **Exports:** **named export** para componentes e funções (`export function LeadForm()`). Sem `export default` em componente (a exceção é `page.tsx`/`layout.tsx`, exigidos pelo Next como default).
- **Client vs Server:** Server Component é o padrão. `'use client'` só quando há `useState`/`useEffect`/handler de evento/hook de browser. Route handlers em `app/api/*` declaram `export const runtime = 'nodejs'` e, quando dinâmicos, `export const dynamic = 'force-dynamic'`.
- **Tratamento de erro:** em route handler, retorne `NextResponse.json({ ok: false, error: '<mensagem genérica>' }, { status })` — **nunca vaze detalhe de schema/stack no corpo** (o código do erro Postgres vai só pro `console.error`). Log com prefixo entre colchetes: `[Lead]`, `[KeepAlive]`, `[CRÍTICO]`.

## Nomeação de arquivos

| Tipo | Padrão | Exemplo real |
|---|---|---|
| Componente | `PascalCase.tsx` | `components/LeadForm.tsx` |
| Util / lib | `camelCase.ts` ou `kebab-case.ts` | `lib/validation.ts`, `lib/rate-limit.ts` |
| Página | `page.tsx` na pasta da rota | `app/contato/page.tsx` |
| Rota dinâmica | `[slug]/page.tsx` | `app/cases/[slug]/page.tsx` |
| Route handler | `route.ts` | `app/api/lead/route.ts` |
| SQL | `kebab-case.sql` | `supabase/hardening-rpc.sql` |

## Nomeação de componentes

- O nome descreve **o que É**, não onde aparece: `LeadForm`, `Services`, `CasesSection` — não `HomeForm`.
- Um componente por arquivo; nome do arquivo = nome do componente.
- Sufixo `Section` para blocos de seção da home (`CasesSection`, `InsightsSection`). Sufixo `Button` para ações (`WhatsAppButton`).

## Estrutura de commits

Formato em uso (extraído de `git log`): **Conventional Commits com escopo**, descrição no imperativo, em português.

```
tipo(escopo): descrição no imperativo

feat(nav): Raio-X de TI antes de Sobre + logo da landing linka para a home
fix(seg): hardening pos-cowork (CORS, cron fail-closed, honeypot)
fix(lead): waitUntil no envio SMTP
```

Tipos observados: `feat`, `fix`, `chore`, `perf`, `seo`, `docs`, `refactor`. Escopos observados: `lead`, `seg`, `nav`, `ui/ux`, `visual`, `supabase`, `form`, `contato`, `mascote`, `next.config`. Corpo opcional explicando o **porquê**. Rodapé `Co-Authored-By:` quando gerado por IA. Nunca use `--no-verify`.

## Organização de pastas

```
app/            # rotas do App Router. Onde vai uma página nova.
  api/          # route handlers server-side. Onde vai um endpoint novo.
  <rota>/       # page.tsx + (opcional) metadata por rota
components/     # todo componente React. Onde vai um componente novo.
lib/            # lógica SEM JSX: clientes de serviço, schemas, helpers. Onde vai um helper novo.
supabase/       # DDL/scripts SQL rodados à mão no SQL Editor do Supabase.
public/         # assets estáticos servidos direto (imagens, favicons).
docs/           # documentação operacional/campanha (parte gitignored).
```

**Regra de ouro:** JSX → `components/`; sem JSX → `lib/`; rota → `app/`; SQL → `supabase/`.

## Regras de performance

- Imagens via `next/image` (`import Image from 'next/image'`) com `width`/`height` explícitos. Nunca `<img>` cru para conteúdo. Ex.: [app/not-found.tsx](app/not-found.tsx), [components/LeadForm.tsx](components/LeadForm.tsx).
- Mantenha o máximo em **Server Component**. Não transforme uma página inteira em client component por causa de um único trecho interativo — isole o interativo num componente `'use client'` pequeno.
- `useSearchParams` exige `<Suspense>` no boundary (Next 16). Ver [app/contato/page.tsx](app/contato/page.tsx).
- Notificação de e-mail roda dentro de `waitUntil()` (`@vercel/functions`) — nunca `await` que atrase a resposta, nem fire-and-forget solto (a serverless congela e mata o envio).
- Fontes self-hosted via `next/font` — não adicione `<link>`/preconnect pro Google Fonts.

## Regras de acessibilidade

- Contraste mínimo WCAG **AA (4.5:1)**. Os tokens `ink-subtle`/`ink-tertiary` já foram calibrados pra passar AA no fundo `canvas`.
- Todo input tem `<label htmlFor>` associado (ver `LeadForm`). Placeholder não substitui label.
- Foco visível: o `globals.css` define `*:focus-visible` com outline accent — **nunca** remova sem substituir.
- `alt` descritivo em imagem com conteúdo; `alt=""` + `aria-hidden` em decorativa (ex.: Icardinho no card de sucesso é decorativo).
- Área de toque mínima **44×44px** — as classes `.btn-*` e `.nav-link` já garantem `min-h-[44px]`.
- Erros de formulário com `role="alert"`/`aria-live`; estado de sucesso com `role="status"` e foco movido pro card.
- `prefers-reduced-motion` respeitado globalmente no `globals.css`.
- Skip link "Pular para o conteúdo" no `layout.tsx`.

## Regras de SEO

- Um `<h1>` por página; hierarquia de headings sem pular nível.
- `title` e `description` por rota via `export const metadata`. `title` usa o template `%s · Icardcase` (definido no `layout.tsx`).
- **Canonical por rota** (relativo) via `alternates: { canonical: '/rota' }`. Não há canonical global — de propósito, pra não marcar páginas internas como duplicata da home.
- Open Graph e Twitter card no `layout.tsx` (defaults) + override por rota quando fizer sentido.
- **Schema.org JSON-LD**: `ProfessionalService` global no `layout.tsx`; `Service`/`FAQPage` em `/raio-x-de-ti`; `Article`/`BreadcrumbList` em cases/insights.
- `app/sitemap.ts` e `app/robots.ts` são gerados por código — ao criar rota indexável, adicione o slug no `sitemap.ts`.

## Boas práticas específicas deste projeto

- **Fail-closed é lei.** Rate-limit e cron negam quando a config falta (em produção). Ver `checkRateLimit` e `app/api/cron/keep-alive/route.ts`.
- **Landing paga é isolada.** Rotas em `CHROMELESS_PREFIXES` (`components/ConditionalChrome.tsx`) renderizam sem Header/Footer/WhatsApp float — sem rota de fuga no funil pago. Hoje: `/raio-x-de-ti`.
- **Preço/vagas como constante única.** Em `/raio-x-de-ti`, `PRECO_RAIOX` e `VAGAS_MES` são constantes no topo do arquivo — ajuste num lugar só.
- IP sempre mascarado em log (`maskIp`). Notificação de e-mail não loga o destinatário (dado pessoal).

## O que NUNCA deve ser feito

- Nunca commitar segredo — env var, sempre. `.env*` e `*.env` estão no `.gitignore`.
- Nunca aceitar credencial (FTP, senha, service key, token) colada no chat — orientar gerenciador externo.
- Nunca confiar em validação só do cliente — Zod no servidor sempre.
- Nunca usar `any` pra calar o TypeScript.
- Nunca criar componente sem checar o COMPONENTS.md.
- Nunca fazer fail-open em checagem de permissão/rate-limit/cron em produção.
- Nunca devolver `Access-Control-Allow-Origin` com lista separada por vírgula nem `*` em `/api/*` (inválido/inseguro — a API é same-origin).
- Nunca vazar `error.code`/detalhe de schema no corpo da resposta HTTP.
- Nunca sugerir hospedagem PHP/FTP — o site é SSR na Vercel.

## Checklist antes de finalizar qualquer tarefa

- [ ] `npm run type-check` passa
- [ ] `npm run lint` passa
- [ ] `npm run build` passa (prova de integridade)
- [ ] Sem `console.log` de depuração esquecido
- [ ] Sem segredo hardcoded
- [ ] Componente novo? Checou COMPONENTS.md e documentou lá no mesmo commit?
- [ ] Acessibilidade: teclado, contraste AA, label, `focus-visible`
- [ ] Rota indexável nova? Adicionou no `sitemap.ts` + canonical na metadata?
- [ ] Commit segue Conventional Commits com escopo
