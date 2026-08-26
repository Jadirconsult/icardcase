# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Público B2B amplo, sem eleger um segmento como primário — todos falados com o mesmo peso. Perfis recorrentes: sócios e decisores de **escritórios contábeis**, **financeiras** e **indústria** (ex.: indústria química). São compradores de tecnologia empresarial que precisam de sistemas em produção, infraestrutura confiável e conformidade — não de "um site bonito". Situação típica: chegam pelo Google (SEO orgânico) ou por anúncio pago, avaliando um parceiro de tecnologia sério; o trabalho deles é decidir contratar quem resolve um problema crítico de TI sem risco de descontinuidade.

## Product Purpose

Site institucional B2B da **Icardcase** (marca de J Oliver Serviços de Informática TI Ltda). O site existe para **capturar leads qualificados** e **ranquear em SEO** — os dois com prioridade igual. Vitrine de uma boutique de tecnologia que vende desenvolvimento de sistemas (web e mobile), infraestrutura de TI, suporte, segurança/LGPD e consultoria, com atendimento remoto em todo o Brasil. Sucesso = leads chegando pelos dois canais de conversão (formulário `/contato` e landing paga `/raio-x-de-ti`) somado à presença orgânica no Google.

## Positioning

**Time próprio, sem terceirização.** Este é o diferencial que o site deve liderar e nunca perder: a Icardcase executa com engenheiros internos, nada de repasse a freelancers ou subcontratados. Reforços de posicionamento (parte do conjunto, subordinados ao diferencial central): engenheiros de **sistemas críticos** em produção — não é agência de logos/sites; e operação **nacional e remota desde 2011**, base no Rio de Janeiro. O que um concorrente vizinho não copia com verdade: sistemas reais em produção construídos pela própria equipe, comprováveis (ERP com 94 tabelas, plataforma fiscal multi-tenant, migração de legado sem parar receita).

## Operating Context

- Dois caminhos de conversão: formulário institucional em `/contato` e landing de campanha paga em `/raio-x-de-ti` (oferta de diagnóstico "raio-x de TI").
- Páginas de serviço dedicadas: desenvolvimento de sistemas, desenvolvimento mobile, infraestrutura de TI, segurança/LGPD, consultoria de TI, além de abordagem, sobre, cases e insights (blog/SEO).
- Contato direto por WhatsApp (clique rastreado via `/api/whatsapp-click`) e e-mail.
- Tráfego chega por SEO orgânico e por anúncios (Google Ads — as únicas env vars presentes localmente são de Google Ads).

## Capabilities and Constraints

- Serviços vendidos: desenvolvimento de sistemas web, desenvolvimento mobile, infraestrutura de TI, suporte, segurança e LGPD, consultoria de TI. Atendimento remoto nacional, base no RJ.
- Lead: toda entrada é validada com Zod no servidor, gravada no Supabase (Postgres + RLS) e notificada por e-mail (Nodemailer/SMTP); a notificação é falha silenciosa deliberada — o lead já foi gravado antes.
- Segurança é decisão de produto, não detalhe: rate-limit e cron **fail-closed** em produção, CORS estrito em `/api/*` (nunca `*`), CSP estrito, honeypot no formulário, IP sempre mascarado em log (LGPD). Essas posturas não podem regredir.
- Deploy exclusivamente em **Vercel** (SSR Next.js) — nunca hospedagem PHP/FTP. Segredos moram só na Vercel.
- Terminologia da marca: "boutique de tecnologia", "parceiro estratégico de tecnologia", "sistemas críticos", "sem terceirizações".

## Brand Commitments

- **Nome/razão social:** Icardcase (marca) · J Oliver Serviços de Informática TI Ltda · CNPJ 13.437.391/0001-58 · Niterói/RJ · desde 2011.
- **Tagline:** "Tecnologia que conecta. Soluções que transformam."
- **Contato oficial:** WhatsApp/telefone +55 (21) 98878-5170 · e-mail contatos@icardcase.com.br · endereço Rua Bahia, 43, Badu, Niterói/RJ, 24330-440.
- **Social:** LinkedIn `/company/icardcase` · Instagram `@icardcase`.
- **Assets de marca:** logo "i + circuito de 3 nós"; mascote "icardinho" (`public/icardinho.png`); fontes Inter + JetBrains Mono; paleta institucional em azul-marinho escuro (navy) com azul de destaque.
- Voz: técnica, direta, confiante, sem jargão vazio de agência. Compromisso de nunca sugerir terceirização como caminho.

## Evidence on Hand

- **Cases reais em produção, com autorização de cliente** (`app/cases`): SYSPERSHY — ERP indústria química (94 tabelas, 49 telas, 60 migrações); Prossiga — migração Visual FoxPro → Supabase sem parar receita (estacionamento); NF SaaS — plataforma fiscal multi-tenant NF-e/NFC-e/NFS-e com integração SEFAZ; UFRJ — infraestrutura de TI para órgão vinculado.
- Blog/insights para conteúdo de SEO (`app/insights`).
- Dados legais e de contato reais (ver Brand Commitments). Não fabricar depoimentos, métricas, clientes, preços ou prêmios além dos listados aqui.

## Product Principles

1. **Prova antes de promessa.** Falar de sistemas reais em produção e cases autorizados, não de adjetivos. A credibilidade vem da evidência concreta.
2. **Executa quem promete.** Reforçar em cada superfície que o trabalho é feito por time próprio, sem terceirização — é o núcleo da confiança B2B.
3. **Converter e ser encontrado, no mesmo peso.** Cada página serve à captura de lead e ao SEO; nenhuma decisão pode sacrificar um pelo outro.
4. **Segurança e conformidade não regridem.** Fail-closed, LGPD, CORS/CSP estritos são parte do produto — não otimizar UX às custas dessas garantias.
5. **Seriedade de engenharia, não estética de agência.** O tom fala com decisores técnicos e sócios; clareza e rigor acima de floreio.

## Accessibility & Inclusion

Acessibilidade é requisito confirmado do projeto: contraste mínimo AA, label associado a todo campo, navegação por teclado, `focus-visible` visível, área de toque de 44px, respeito a `prefers-reduced-motion`.
