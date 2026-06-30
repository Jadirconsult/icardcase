import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FinalCTA } from '@/components/FinalCTA'
import { SITE } from '@/lib/constants'

// Posts hardcoded por enquanto - quando voce quiser MDX, a gente migra.
const POSTS: Record<string, { title: string; date: string; readTime: string; category: string; description: string; content: string }> = {
  'reforma-tributaria-2026': {
    title: 'Reforma tributária 2026: IBS e CBS — o que muda no sistema da sua empresa',
    date: '2026-06-30',
    readTime: '9 min de leitura',
    category: 'Reforma tributária',
    description: 'IBS e CBS entram em vigor em 2026 e vão reconstruir cálculo fiscal, emissão de nota e reporting. O que toda empresa que emite nota fiscal precisa preparar — em ordem de prioridade.',
    content: `
## Por que isso afeta a sua empresa (mesmo que você não seja contador)

A reforma tributária aprovada pela EC 132/2023 começa de fato em janeiro de 2026. Não é só uma "atualização de alíquota". É uma reconstrução: novos tributos (IBS e CBS), nova estrutura na nota fiscal, regime dual de cálculo durante a transição. Se a sua empresa emite nota fiscal — qualquer tipo, em qualquer setor —, o sistema que faz isso vai precisar mudar.

Não importa se você é indústria química com ERP customizado, comércio com SaaS de prateleira, ou prestador de serviço com sistema interno. **Quem não preparar o sistema vai parar de emitir nota em janeiro.**

## O cronograma real (não o do marketing)

- **Janeiro 2026** — IBS (0,1%) e CBS (0,9%) entram em fase de teste. Alíquota baixa, mas obrigação de cálculo, registro e reporting já vale.
- **2027** — CBS substitui PIS e COFINS para a maioria das empresas. Simples Nacional tem prazo estendido até final de 2027.
- **2029-2033** — IBS substitui ICMS e ISS de forma gradual, com alíquotas subindo escalonadamente.

A janela de "preparação tranquila" termina em outubro de 2025. Quem ainda não começou em 2026 está em modo emergencial.

## Os 4 campos novos que toda nota fiscal precisa ter

A partir de janeiro de 2026, NF-e, NFC-e, NFS-e e CT-e precisam comportar:

1. **CST/CSOSN dos novos tributos** — novos códigos de situação tributária para IBS e CBS
2. **Base de cálculo IBS** e **alíquota IBS** — alíquota varia por município (são 5.570 municípios brasileiros)
3. **Base de cálculo CBS** e **alíquota CBS** — alíquota federal única
4. **Valor do imposto seletivo** — aplicável a produtos específicos (cigarro, bebida açucarada, alguns combustíveis)

Se o seu sistema atual de emissão não tem espaço para esses campos no XML, o webservice da SEFAZ rejeita. **Resultado: nota não é emitida e venda não fecha.**

## Simples Nacional: prazo estendido, mas atenção à atratividade

Empresas do Simples têm até 2027 para migrar. Mas atenção: o regime do Simples só faz sentido se ele continuar vantajoso. Com IBS e CBS, muitas empresas que hoje estão no Simples vão descobrir que o regime regular passa a ser mais barato (especialmente serviços B2B). **Cada CNPJ precisa ser recalculado individualmente.**

Se você é dono de empresa no Simples, peça ao seu contador uma projeção comparativa antes da virada do ano fiscal.

## Integração SEFAZ — o que vai quebrar tecnicamente

Os webservices das SEFAZ estaduais e a NF-e 4.0 vão receber novos schemas XML. Todo sistema que faz integração direta precisa atualizar:

- Parser XML (estrutura nova)
- Validação de schema (XSDs atualizados)
- Lógica de geração de XML (novos grupos obrigatórios)
- Tratamento de erros (rejeições novas)

Quem usa **middleware** (TecnoSpeed, Sieg, Migrate, Synker etc.) depende do fornecedor atualizar a tempo. Verifique cronograma do seu fornecedor agora — alguns vão atrasar.

Quem usa **integração direta** com a SEFAZ via SOAP ou REST precisa programar a migração própria. Em casos onde o código original está abandonado ou foi feito por fornecedor que sumiu, é refazer.

## Checklist técnico (15 itens)

Use este checklist para diagnosticar onde o seu sistema está hoje:

### Banco e estrutura (5 itens)
1. Schema da tabela de notas tem campos para IBS, CBS e imposto seletivo?
2. Tabela de alíquotas IBS por município está modelada (5.570 entradas)?
3. Tabela de NCM tem classificação seletiva atualizada?
4. Suporte a cálculo paralelo (ICMS+PIS+COFINS antigo vs IBS+CBS novo) durante transição?
5. Versionamento de schema (você consegue rodar relatório no modelo de 2025 e no de 2026)?

### Emissão (4 itens)
6. Geração de XML NF-e 4.0 com novos grupos obrigatórios?
7. Validação dos novos XSDs antes de enviar?
8. Tratamento de rejeição da SEFAZ com novos códigos de erro?
9. Modo dry-run para testar antes de emitir de verdade?

### Reporting (3 itens)
10. Dashboard fiscal mostrando impacto do novo regime (comparativo antigo vs novo)?
11. Relatório de simulação por cliente / fornecedor / produto?
12. Importação massiva de cadastros (quando mudança de regime exigir)?

### Operação (3 itens)
13. Logs auditáveis para fiscalização futura (mínimo 5 anos)?
14. Backup do sistema antigo congelado para consulta de período pré-reforma?
15. Treinamento da equipe que opera o sistema?

## Por onde começar se você ainda não começou

Três ações práticas para esta semana:

1. **Inventário** — liste TODOS os pontos de emissão de nota fiscal na sua empresa. Quem emite, em qual sistema, com qual integração. Surpresa frequente: existem mais pontos do que você imagina.
2. **Levantamento de fornecedores** — para cada sistema da lista, contate o fornecedor e peça o cronograma oficial de adequação à reforma. Pegue por escrito.
3. **Plano de contingência** — para os sistemas onde o fornecedor não dá garantia (ou para os feitos in-house sem manutenção), planeje migração ou substituição.

## Conclusão

A reforma tributária não é evento técnico isolado. É uma reconstrução que mexe em cálculo, emissão, reporting e processo interno. Empresas que esperam para resolver em dezembro de 2025 vão pagar caro — em fornecedor emergencial, em tempo de equipe, em multas por não-emissão.

Se você tem dúvida sobre onde sua empresa está, agende uma conversa de 30 minutos. Diagnóstico técnico honesto, sem venda.
`,
  },
  'migrar-visual-foxpro-web': {
    title: 'Como migrar Visual FoxPro para web sem parar a operação',
    date: '2026-06-30',
    readTime: '11 min de leitura',
    category: 'Modernização de legado',
    description: 'Sistema crítico em Visual FoxPro precisa sair. Mas qualquer parada de horas gera prejuízo direto. Como fazer migração em paralelo, validada por checksum, com corte cirúrgico no fim de semana.',
    content: `
## Por que isso é tão difícil

Visual FoxPro deixou de ser suportado pela Microsoft em 2015. Não há novas versões, não há patches de segurança, não há driver de banco para sistemas operacionais modernos. E, ainda assim, milhares de empresas brasileiras rodam operação crítica em VFP — porque o sistema funciona, porque o conhecimento de quem fez se perdeu, porque trocar parece arriscado demais.

O problema não é técnico. É de **continuidade de operação**. Estacionamento, distribuidora, gráfica, indústria de médio porte. Para essas empresas, qualquer parada de mais de uma hora gera prejuízo direto que pode ser maior que o custo da própria migração.

Este post descreve a estratégia que aplicamos no case **Prossiga** (gestão de estacionamento) e em projetos similares. **Resultado entregue: zero parada de receita durante a migração.**

## A regra de ouro: nunca migre de uma vez

A tentação é grande: agendar fim de semana, virar o sistema, voltar segunda com o novo. **Isso falha em 7 de cada 10 casos.** Os motivos:

- Dados reais sempre têm casos que o teste não cobriu
- Regra de negócio escrita no VFP original tem detalhe esquecido
- Treinamento da equipe não acompanha o ritmo do projeto
- Stress de "tudo ou nada" leva a decisão precipitada em hora errada

A abordagem correta é **migração em paralelo com corte cirúrgico**. Os dois sistemas (antigo VFP e novo web) rodam ao mesmo tempo, com replicação contínua, durante semanas. O corte final acontece num momento controlado, quando todo mundo já está confortável com o novo.

## As 5 fases do projeto (em ordem)

### Fase 1: Engenharia reversa do schema DBF

Visual FoxPro guarda dados em arquivos .DBF. Não há documentação na maioria dos sistemas legados. Primeira ação: extrair o schema completo lendo os arquivos diretamente.

Ferramentas que usamos:
- **dbfread (Python)** — leitura programática dos arquivos DBF
- **pandas** — análise exploratória dos dados
- **DBML** — linguagem para documentar o schema resultante

O entregável dessa fase é um **diagrama ER** moderno (em geral 30-80 tabelas para sistemas reais) e um **DBML completo** com chaves estrangeiras, tipos de dados e cardinalidades. Isso vira a base para o banco novo.

### Fase 2: Modelagem do banco novo

Não copie o schema DBF tal como está. Use a oportunidade para:

- **Normalizar** o que estava desnormalizado por limitação do VFP
- **Tipar corretamente** (DBF tem tipos limitados; PostgreSQL aceita JSONB, arrays, ENUMs)
- **Adicionar constraints** que faltavam (CHECK, FOREIGN KEY, UNIQUE)
- **Pensar em multi-tenant** se for o caso (RLS no PostgreSQL/Supabase)

No case Prossiga, o esquema final teve menos tabelas que o DBF original (consolidamos algumas tabelas redundantes) mas com modelagem muito mais sólida.

### Fase 3: Pipeline de migração de dados com checksum

Aqui está o coração da operação sem parada. O pipeline tem três passos:

1. **Snapshot inicial** — primeira carga completa do DBF para o PostgreSQL novo
2. **Replicação contínua** — script que roda a cada 5 minutos, copiando deltas (registros novos e alterados) do DBF para o novo
3. **Validação por checksum** — para cada tabela, calculamos checksum dos dados em ambos os lados. Se divergir, alerta.

A replicação contínua mantém os dois sistemas sincronizados durante todo o período de transição. A validação por checksum garante que ninguém migra dados corrompidos.

### Fase 4: Operação dual com cutover programado

Durante 2 a 4 semanas, ambos os sistemas estão no ar:
- **VFP** continua sendo o sistema "de verdade" (faz o trabalho)
- **Web novo** está disponível para uso paralelo (consulta, validação, testes)

A equipe usa os dois, compara resultados, aprende o novo. Bugs encontrados são corrigidos com o sistema antigo ainda rodando como rede de segurança.

O **cutover** é um momento agendado — geralmente fim de semana, durante baixa atividade — em que três coisas acontecem em sequência rápida:
1. Pare o VFP (impede novos lançamentos)
2. Rode última replicação delta
3. Valide checksum final em todas as tabelas críticas
4. Aponte o time para o sistema web
5. VFP fica em modo leitura por 90 dias (consulta histórica, sem novos lançamentos)

### Fase 5: Plano de rollback

**Sempre tenha plano de rollback.** Se algo der errado no cutover, você precisa voltar ao VFP em até 30 minutos. O plano é simples:

- VFP fica congelado, mas funcional, durante o cutover
- Se algo crítico falhar no novo nas primeiras 24-48h, redirecione a equipe de volta
- Sistema web fica em "modo congelado" enquanto se investiga
- Sem cobrar orgulho — voltar e seguir é sempre melhor que ir adiante quebrado

Nunca precisamos usar o rollback em projetos que aplicamos essa metodologia. Mas o fato de existir muda a tensão do dia do cutover.

## Stack típica

Para projetos de migração de VFP que rodamos:

- **Python + pandas + dbfread** — extração e ETL
- **PostgreSQL** (direto ou via Supabase) — banco novo
- **DBML** — documentação de schema
- **Next.js + React** — frontend web
- **FastAPI ou Laravel** — backend
- **Docker + Traefik** — infraestrutura
- **Veeam ou rsync** — backup do VFP antes do cutover

## Quanto tempo leva

Para um sistema VFP de porte médio (40-80 tabelas, 5-10 GB de dados, 5-15 anos de histórico):

- Engenharia reversa: 2-4 semanas
- Modelagem nova: 2-3 semanas
- Pipeline de migração: 3-5 semanas
- Operação dual: 2-4 semanas
- Cutover e estabilização: 1-2 semanas

**Total: 3 a 4 meses.** Sistemas maiores ou mais complexos podem chegar a 6 meses. Sistemas que já são reescrita completa (com regras de negócio novas) levam mais.

## O que não fazer

- **Não use ChatGPT para gerar o schema novo a partir do DBF.** O modelo não vê os dados reais e inventa relações.
- **Não confie em "exportar para Excel"** como ponte. Excel perde tipo de dado, encoding, e arquivos grandes corrompem.
- **Não migre só metade do sistema.** Você acaba com duas verdades simultâneas e ninguém sabe qual é a boa.
- **Não terceirize só a TI sem envolver a operação.** Sem o usuário final usando o sistema durante a fase dual, você sai do cutover descobrindo que nada funciona na prática.

## Quando faz sentido

Migrar de Visual FoxPro vale o investimento quando você tem pelo menos um destes três sintomas:

1. **Sistema trava em horários de pico** — sintoma de banco DBF com limite de concorrência
2. **Auditoria ou compliance pediu controle que o VFP não tem** — LGPD, ISO, banco financiador
3. **A equipe que mantinha o sistema saiu ou está saindo** — conhecimento congelado é bomba relógio

Se nenhum desses sintomas existe e o VFP roda em paz, talvez ainda não seja o momento. Mas você está atrasado: o Windows 11 e o Windows Server 2022 vão começar a ter problemas com VFP em breve.

## Conclusão

Migrar Visual FoxPro para web é projeto de engenharia, não de marketing. Tem método, tem risco, tem prazo. Quem promete "migração relâmpago em 30 dias" está vendendo problema futuro.

Se você está nessa situação, agende uma conversa. Mostramos o método em detalhe, sem custo de avaliação.
`,
  },
  'whatsapp-business-api-empresarial': {
    title: 'WhatsApp Business API empresarial: arquitetura segura para escalar atendimento',
    date: '2026-06-30',
    readTime: '8 min de leitura',
    category: 'Automação',
    description: 'WhatsApp virou canal de venda B2B. Mas integração feita errado vira risco de banimento e vazamento de dados. Como construir arquitetura segura para escalar sem perder controle.',
    content: `
## O WhatsApp deixou de ser opcional

Em 2026, 80% das empresas B2B no Brasil usam WhatsApp como canal principal de atendimento, vendas e suporte. Não tem mais "se sua empresa vai estar no WhatsApp" — tem "quão profissional é o seu WhatsApp empresarial".

E isso não significa colocar o número pessoal do dono no rodapé do site. Significa **arquitetura técnica de verdade**: API oficial ou Evolution API self-hosted, autenticação, anti-spam, logs auditáveis, fluxo de mensagens estruturado.

Este post descreve como montar essa arquitetura, evitando os 3 erros que vejo com mais frequência.

## Os 3 erros mais comuns

### Erro 1: Usar WhatsApp Web num servidor

Algumas empresas tentam automatizar deixando uma sessão de WhatsApp Web aberta num servidor com Selenium ou Puppeteer. **Isso é convite para banimento.** O WhatsApp detecta uso automatizado por padrões de tráfego, headers de navegador e comportamento.

Quando bane, banem o número. E o número da sua empresa virou ativo. Perder o número significa perder histórico de conversa, perder contatos salvos, perder credibilidade (cliente desconfia quando você reaparece com número diferente).

### Erro 2: Compartilhar token de API entre sistemas

Token único de API distribuído para CRM, marketing, suporte e financeiro tudo ao mesmo tempo. Se um deles vazar, o atacante tem acesso a todas as conversas. Se um deles for comprometido, você não sabe qual.

A regra é **token por sistema**, com escopo restrito ao que cada um precisa fazer. Marketing dispara campanhas (não lê conversas individuais). Suporte responde a conversas (não envia em massa). Financeiro consulta histórico (não envia nem responde).

### Erro 3: Sem audit log de quem mandou o quê

Funcionária do suporte é demitida. Cliente reclama que recebeu mensagem ofensiva pelo WhatsApp da empresa. Você não consegue provar quem enviou. Vira processo trabalhista e dano reputacional simultâneo.

Audit log imutável (append-only) de toda mensagem enviada — com timestamp, identidade do operador, conteúdo, número destinatário — é não-negociável em empresa que valoriza compliance.

## A arquitetura correta

Para WhatsApp empresarial em produção, a arquitetura tem 5 camadas:

### Camada 1: Conector ao WhatsApp

Duas opções viáveis:

**(A) API oficial Meta Business** — paga (custo por sessão de conversa), mas com SLA da Meta, sem risco de banimento por uso comercial e suporte oficial.

**(B) Evolution API self-hosted** — open source, gratuita, roda em servidor próprio. Funciona conectando ao WhatsApp Web mas com gerenciamento profissional do socket. Risco de banimento existe se uso for muito agressivo, mas em uso comercial normal é estável.

Para empresas até 50 mil mensagens/mês, recomendamos Evolution. Acima disso, vale fazer conta para API oficial.

### Camada 2: Autenticação e tokens

Cada sistema interno (CRM, marketing, suporte) recebe seu próprio token de API com escopo restrito:

- **Marketing token**: envia mensagens de campanha. Não recebe nem lê conversas individuais.
- **Suporte token**: lê e responde conversas. Não envia em massa.
- **Financeiro token**: read-only no histórico, para conciliação. Não envia.
- **Admin token**: gestão de configurações. Não envia ou lê mensagens.

Tokens rotacionados a cada 90 dias (procedimento documentado, não esperar vazar para rotacionar).

### Camada 3: Webhook + fila de processamento

Mensagens recebidas chegam no webhook do conector. Não processe direto — enfileire.

- **Fila inbound** (mensagens recebidas) → consumidor que classifica, roteia, registra no CRM
- **Fila outbound** (mensagens a enviar) → consumidor que envia com rate limit, retry exponencial, fallback

Stack típica: Redis, Bull/BullMQ, Kafka para volume alto. Sem fila, qualquer pico de mensagem ou queda do Evolution derruba sua operação.

### Camada 4: Storage com audit log

Tabela de mensagens **append-only** (insert; nunca update; delete só por procedimento administrativo com log). Campos obrigatórios:

- ID da mensagem
- Timestamp (com timezone)
- Direção (in/out)
- Número de origem e destino
- Conteúdo (texto, mídia, metadata)
- Identidade do operador (para mensagens out)
- Identificador do sistema que enviou (qual token foi usado)
- Status (enviado, entregue, lido, rejeitado)

Retenção mínima: 5 anos para mensagens com cliente. LGPD considera mensagem de WhatsApp como dado pessoal — então criptografia em repouso e controle de acesso por papel (RBAC).

### Camada 5: Monitoramento

Métricas que precisam estar no dashboard:

- Mensagens enviadas / hora (alerta se cair, alerta se subir muito)
- Mensagens recebidas / hora (mesmo)
- Erro rate (rejeições da API)
- Latência (tempo entre receber webhook e ter no banco)
- Status da conexão Evolution (online / offline)
- Uso de cada token (detecta token comprometido se padrão mudar)

Stack típica: Prometheus + Grafana, ou serviço gerenciado (Datadog, New Relic).

## O que a LGPD exige

WhatsApp empresarial em produção precisa atender, no mínimo:

- **Política de privacidade** explicitando que conversas são registradas
- **Base legal** clara para o tratamento (execução de contrato, legítimo interesse, consentimento)
- **Termo de uso/consentimento** quando coletar dados além do número (CPF, endereço etc.)
- **Procedimento de exclusão** a pedido do titular (direito do art. 18 LGPD)
- **Audit log** de quem acessou quais conversas
- **Treinamento** dos operadores sobre o que pode e o que não pode fazer

Empresas que não cumprem isso ficam expostas em qualquer auditoria ANPD ou denúncia de ex-funcionário.

## Quanto custa montar isso

Para empresa de porte médio (até 50 mil mensagens/mês):

- **Evolution API self-hosted**: R$ 100-300/mês de VPS
- **Desenvolvimento da arquitetura**: 4-8 semanas (depende de integração com CRM existente)
- **Operação contínua**: 1-2 horas/semana de manutenção em estado estável

Para empresas maiores, com API oficial Meta e múltiplos números, o custo escala com volume. Mas o ROI fica positivo se você tiver pelo menos 3-5 atendentes humanos sendo otimizados pela infraestrutura.

## Por onde começar

Três ações imediatas:

1. **Audite o uso atual** — quantos números, quem usa, com qual ferramenta, qual o volume mensal
2. **Identifique vulnerabilidades** — algum sistema usando WhatsApp Web automatizado? Token compartilhado? Sem log?
3. **Defina o futuro** — quantos números você quer ter, quais sistemas precisam acesso, qual o volume esperado em 12 meses

Com esse mapeamento, dá pra desenhar a arquitetura certa para a sua escala.

## Conclusão

WhatsApp empresarial não é projeto de marketing. É infraestrutura de comunicação corporativa, com mesma exigência de segurança e auditabilidade de e-mail, telefone ou ERP. Quem trata como brinquedo paga depois.

Se você quer arquitetura sólida para o canal mais ativo da sua empresa, agende uma conversa. Avaliamos o estado atual e desenhamos o plano de migração para o modelo certo.
`,
  },
  'dctfweb-automacao': {
    title: 'DCTFWeb sem erro: automação real para escritórios contábeis',
    date: '2026-05-23',
    readTime: '6 min de leitura',
    category: 'Automação fiscal',
    description: 'Por que a maioria das automações DCTFWeb feitas hoje são frágeis, e como construir algo que não falha em fim de mês.',
    content: `
## A DCTFWeb veio para ficar

Substituindo gradualmente a DCTF antiga, a DCTFWeb consolida débitos previdenciários e de retenções IR. Para escritórios contábeis, isso significa: novos prazos, novo formato e — principalmente — nova superfície de erro.

## Por que a maioria das automações falha

A automação típica que vemos por aí faz três coisas erradas:

1. **Scraping frágil** — depende de XPath específico que quebra a cada atualização
2. **Sem retry** — se a conexão cair no meio, perde o processamento
3. **Sem audit log** — quando dá problema, ninguém sabe o que aconteceu

## A abordagem correta

Automação fiscal de produção precisa de:

- **API oficial ou e-CAC integrado**, não scraping de tela
- **Fila de jobs** com retry exponencial
- **Audit log imutável** por contribuinte
- **Notificação proativa** quando algo trava
- **Modo dry-run** pra testar antes de enviar

## Resultado

Escritórios que rodam nessa arquitetura processam DCTFWeb de centenas de clientes em horas, com zero retrabalho manual.

Se você quer entender como aplicar isso no seu escritório, vamos conversar.
`,
  },
  'lgpd-escritorio-contabil': {
    title: 'LGPD no escritório contábil: checklist de 23 itens auditados',
    date: '2026-05-23',
    readTime: '10 min de leitura',
    category: 'LGPD',
    description: 'Escritórios contábeis tratam dados sensíveis em volume industrial. Aqui está o checklist que aplicamos em auditorias reais.',
    content: `
## Por que escritório contábil é alvo prioritário da ANPD

Escritórios contábeis tratam:

- CPF/CNPJ de milhares de pessoas
- Folha de pagamento (dado sensível por revelar relação trabalhista)
- Movimentação financeira
- Documentos pessoais (RG, CNH, comprovantes)
- Dados de saúde (atestados médicos para folha)

Tudo isso em volume industrial. Por isso, escritórios contábeis estão no radar de qualquer auditoria ANPD.

## O checklist (23 itens)

### Governança (5 itens)
1. DPO nomeado por escrito
2. RIPD documentado por finalidade de tratamento
3. Política de privacidade pública e acessível
4. Termo de consentimento específico para cada finalidade
5. Mapeamento de dados (data mapping)

### Tecnologia (8 itens)
6. Criptografia em trânsito (HTTPS obrigatório)
7. Criptografia em repouso para dados sensíveis
8. Controle de acesso por papel (RBAC)
9. Audit log imutável
10. Backup criptografado com retenção definida
11. Rate limiting em endpoints públicos
12. Segregação de ambientes (dev/staging/prod)
13. Patch management documentado

### Processos (6 itens)
14. Treinamento LGPD anual da equipe
15. Termo de confidencialidade com colaboradores
16. Procedimento de exclusão a pedido (direito do titular)
17. Procedimento de incidente de segurança (72h ANPD)
18. Contrato com fornecedores incluindo cláusulas LGPD
19. Revisão anual da política

### Compliance (4 itens)
20. Registros de atendimento a direitos de titulares
21. Documentação de impacto (DPIA) para operações de risco
22. Avaliação de adequação de transferência internacional
23. Plano de resposta a incidentes testado

## A multa pode ser pesada

Multa por violação LGPD vai até 2% do faturamento, limitado a R$ 50 milhões por infração. Para um escritório médio, pode significar fechar as portas.

Mas o pior não é a multa. É a perda de cliente. Cliente B2B premium não fecha contrato com fornecedor sem certificação de privacidade.

## Como começamos uma auditoria

1. Mapeamento de dados (3 a 5 dias)
2. Gap analysis contra LGPD (1 semana)
3. Plano de adequação priorizado (1 semana)
4. Implementação acompanhada (4 a 8 semanas)
5. Treinamento e governança (contínuo)

Se você quer iniciar essa conversa, vamos marcar.
`,
  },
}

// Next 15+/16: params virou Promise — sempre await antes de usar
interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = POSTS[slug]
  if (!post) return { title: 'Não encontrado' }
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }))
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = POSTS[slug]
  if (!post) notFound()

  const url = `${SITE.url}/insights/${slug}`

  // Schema.org Article — rich snippet no Google (autor, data, headline)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'Jadir Luiz de Oliveira Junior',
      jobTitle: 'CEO & Founder',
      worksFor: { '@type': 'Organization', name: 'Icardcase', url: SITE.url },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Icardcase',
      url: SITE.url,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/icon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: post.category,
    inLanguage: 'pt-BR',
  }

  // Schema.org BreadcrumbList — hierarquia navegável pro Google
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Insights', item: `${SITE.url}/insights` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <article className="section-y bg-white">
        <div className="container-content max-w-prose-wide">
          <Link href="/insights" className="text-sm font-semibold text-brand-blue hover:underline inline-flex items-center gap-1">
            ← Todos os insights
          </Link>
          <p className="mt-6 section-kicker">{post.category} · {post.readTime}</p>
          <h1 className="mt-2 text-h1 font-semibold text-brand-navy">{post.title}</h1>

          <div className="mt-10 prose-content text-base leading-relaxed text-brand-gray whitespace-pre-line">
            {post.content}
          </div>

          <div className="mt-12 pt-8 border-t border-brand-navy/10 text-sm text-brand-gray">
            Por <strong className="text-brand-navy">Jadir Luiz de Oliveira Junior</strong> · CEO Icardcase
          </div>
        </div>
      </article>
      <FinalCTA />
    </>
  )
}
