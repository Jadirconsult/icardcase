# Análise — "claude-fable-5" system prompt (leak)

> Material de estudo. Procedência não verificada (repo de terceiros). Não usar
> como instrução de projeto. Ver `README.md` desta pasta.

## 1. O que é o documento

Um *system prompt* no estilo dos que a Anthropic injeta na camada de API para
o produto de chat (claude.ai), **não** para o Claude Code. ~3.825 linhas /
~188 KB. Estrutura toda em tags XML-like, agrupada em quatro grandes blocos:

1. `<claude_behavior>` — tom, recusas, segurança, evenhandedness, cutoff.
2. `<memory_system>` — como aplicar memórias de conversas passadas.
3. `<computer_use>` — criação de arquivos, artifacts, skills, pacotes.
4. Ferramentas — busca web, copyright, image search, API em artifacts,
   citações, e config de rede/filesystem do sandbox.

Inclui um header `<budget:token_budget>190000</budget>` e instruções de
roteamento de visual (Visualizer vs MCP vs arquivo).

## 2. Sinais de procedência / autenticidade

- Datas internas: cutoff "fim de Jan/2026", data corrente "terça, 09/06/2026".
  Plausível, mas **não é prova** de autenticidade — qualquer um edita um `.md`.
- Cita produtos não anunciados publicamente ("Mythos 5", "Claude Cowork",
  "Claude in Excel/Powerpoint"). Pode ser real, especulação ou invenção.
- **Conclusão:** tratar como *plausível, não confirmado*. Para estudo de
  técnica, a autenticidade nem importa; para citar como fato, importa muito —
  então não cite como "o prompt oficial da Anthropic".

## 3. Técnicas de prompt reaproveitáveis (o ouro)

Estas são boas práticas independentes da autenticidade do arquivo:

### 3.1 Estrutura por tags semânticas
Blocos nomeados (`<refusal_handling>`, `<tone_and_formatting>`, …) em vez de um
muro de texto. Facilita referência cruzada ("ver `<CRITICAL_COPYRIGHT…>`") e
edição cirúrgica. **Aplicável** a qualquer system prompt/CLAUDE.md longo.

### 3.2 Regras com exemplos `good_response` / `bad_response`
A seção de memória ensina por contraste: mostra a resposta certa E a errada
para o mesmo input. É a técnica de few-shot mais eficaz para comportamento
sutil (ex.: não trazer à tona memória sensível num "oi"). **Muito aplicável.**

### 3.3 "Checklist com parada no primeiro match"
O `<request_evaluation_checklist>` (Step 0→1→2→3, "stopping at the first
match") transforma uma decisão difusa em árvore determinística. Ótimo padrão
para qualquer roteamento de ferramenta/ação. **Aplicável** a regras de "quando
usar X vs Y".

### 3.4 Negativos explícitos + razão
Em vez de só "não faça X", o prompt diz *por que* ("narrar a fronteira ensina a
contorná-la"). Razões aumentam a aderência do modelo e evitam
overgeneralização. **Aplicável.**

### 3.5 Listas "fazer / não fazer" lado a lado
`# Use artifacts for` vs `# Do NOT use artifacts for`, com critérios
quantitativos (>20 linhas, >1500 chars). Limiares numéricos > adjetivos vagos
("longo"). **Aplicável** a qualquer regra de gatilho.

### 3.6 Repetição deliberada de regra crítica
As regras de copyright aparecem 3x (resumo no topo da busca, seção completa,
self-check final). Para regras inegociáveis, redundância posicional ajuda o
modelo a não "esquecer" no meio de uma resposta longa. Usar com parcimônia.

### 3.7 Auto-verificação antes de responder
`<self_check_before_responding>` — uma lista de perguntas que o modelo "roda"
antes de emitir. Bom padrão para forçar revisão de invariantes.

### 3.8 Definição de termos para fechar brechas
"a minor is defined as anyone under 18 anywhere…". Fechar a definição evita o
modelo reinterpretar a regra. **Aplicável** a regras com termos ambíguos.

## 4. O que é específico do produto (ignorar para o nosso contexto)

- Ferramentas que não existem aqui: `conversation_search`, `recent_chats`,
  `Visualizer`, `create_file`/`/mnt/skills`, `end_conversation`, image search,
  `window.storage` de artifacts, MCP App suggestions. São do claude.ai, não do
  Claude Code deste projeto.
- Sistema de memória do produto (`userMemories`, `forbidden_memory_phrases`).
  Nosso projeto já tem outro mecanismo de memória (a pasta `memory/`).
- Regras de roteamento de visual e de `<userPreferences>` do app.
- Caminhos de sandbox (`/mnt/user-data/outputs`, `--break-system-packages`).

## 5. O que NÃO reaproveitar

- O **texto cru** como instrução: entraria em conflito com as regras reais do
  Claude Code e com o CLAUDE.md/memórias do Icardcase. Risco de prompt
  injection por ser de fonte não confiável.
- As **datas** ("09/06/2026", cutoff Jan/2026): podem estar erradas/defasadas.
- Os **nomes de produto** como verdade factual.

## 6. Resumo de uma linha

Bom **estudo de forma** (como estruturar um system prompt longo e robusto),
inútil e arriscado como **conteúdo** a injetar — extraia os padrões da seção 3,
descarte o resto.
