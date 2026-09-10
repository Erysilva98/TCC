# Funcionalidades detalhadas

Este documento descreve o comportamento efetivamente configurado no projeto. A fonte de permissões de produto é [src/data/profiles.ts](../src/data/profiles.ts). O menu inferior é montado a partir da lista `menu` do perfil em `BottomNav.tsx`.

> Os itens fora do menu não são promovidos pela interface daquele perfil. As rotas ainda são rotas SPA protegidas apenas pela conclusão do onboarding; não há, no estado atual, um guard por funcionalidade para impedir acesso por URL direta.

## Funcionalidades comuns a todos os perfis

### Onboarding e sessão local

- Landing com entrada no fluxo de diagnóstico.
- Questionário que calcula uma pontuação e define o perfil inicial.
- Redirecionamento ao Dashboard quando o onboarding já está concluído.
- Persistência integral no IndexedDB do navegador; não há login nem servidor.
- Reinicialização na tela Perfil: remove todos os dados locais do app.

### Dashboard

- **Saldo Total:** soma saldos de contas, investimentos e resultado das transações. Ao tocar no card, abre o detalhamento de contas e ativos sobre a tela.
- **Entradas e Saídas:** mostra o mês atual, receitas e despesas; tocar em uma entrada abre Gastos com filtro de receitas e tocar em uma saída aplica filtro de despesas.
- **Saúde Financeira:** calcula score a partir das transações e orçamentos. O card abre sugestões em sobreposição.
- **Gastos por Categoria:** gráfico donut, legenda, percentual e valor em reais. O destaque de uma fatia usa efeito visual circular e tooltip, sem retângulo de foco.
- **Metas e comparação mensal:** são exibidos quando o card está habilitado e quando o perfil libera a capacidade correspondente.
- **Personalização:** cards podem ser reordenados ou ocultados pelo mecanismo de configuração existente; Contas e Sugestões não fazem parte da lista de cards configuráveis porque foram incorporados aos fluxos principais.

### Registro financeiro

- FAB abre `QuickAddModal`.
- Fluxo: tipo (Receita/Despesa) → categoria → valor → descrição opcional → confirmação.
- Transações são listadas e filtradas em **Gastos**.
- Criar uma transação concede **5 XP** e atualiza saldo, entradas, saídas, categorias, saúde e desafios que dependem de movimentação.
- Categorias suportadas: alimentação, transporte, moradia, lazer, saúde, educação, salário e outros.

### Metas, contas, patrimônio e investimentos

- **Metas:** título, valor-alvo, valor atual, categoria opcional, prazo e data de criação. Criar meta concede **30 XP**.
- **Contas:** nome, tipo (conta corrente, poupança, cartão ou dinheiro), saldo e cor; saldo pode ser atualizado ou a conta removida.
- **Transferências:** atualizam saldo da conta de origem e destino e ficam registradas no estado local.
- **Patrimônio:** ativos dos tipos imóvel, investimento, veículo ou outro.
- **Investimentos:** cria ativo de tipo investimento e o inclui no patrimônio e saldo consolidado.

### Perfil, XP e desafios

- Cabeçalho mostra a classificação do perfil e o nível interno. O ícone `?` abre regras de ganho de XP e de progressão.
- A página Perfil apresenta XP acumulado, desafios concluídos, metas e transações.
- Cada perfil possui níveis 1–100; cada nível exige 100 XP. Ao concluir o nível 100, há promoção de perfil.
- O Perfil contém desafios mensais, criação de orçamento e regras de XP.
- Desafios usam validações reais de transações, metas, contas, ativos, investimentos, orçamentos e aulas concluídas.

### Aprender

- Exibe 30 aulas da trilha associada ao perfil atual, divididas em três módulos.
- Cada card apresenta título, módulo, nível, duração e XP.
- O modal mostra conteúdo e uma missão prática; o botão de concluir permanece bloqueado até a validação da ação real no app.
- A conclusão concede o XP definido pela aula.

## Matriz por perfil

| Perfil | Classificação e identidade | Menu inferior | Objetivo |
| --- | --- | --- | --- |
| Explorador Financeiro | 1 · verde · bússola | Início, Gastos, Aprender, Perfil | criar consciência financeira |
| Equilibrado Financeiro | 2 · ciano · balança | Início, Gastos, Contas, Metas, Aprender, Perfil | organizar e equilibrar as finanças |
| Construtor Financeiro | 3 · violeta · tendência de alta | Início, Gastos, Contas, Metas, Aprender, Perfil | construir patrimônio e planejar o futuro |
| Estrategista Financeiro | 4 · laranja · cérebro | Início, Gastos, Análises, Investimentos, Contas, Metas, Perfil | analisar e otimizar decisões |
| Mestre Financeiro | 5 · dourado · troféu | Início, Gastos, Análises, Investimentos, Contas, Metas, Perfil | manter excelência e multiplicar resultados |

## Perfil 1 — Explorador Financeiro

### Recursos liberados

- Dashboard com saldo, entradas/saídas, saúde financeira, categorias e sugestões.
- Registro e consulta de gastos e receitas.
- Trilha Aprender com 30 aulas de consciência financeira.
- Desafios de registro, hábitos e consciência.
- Saúde financeira e sugestões ativas.

### Recursos ainda não liberados no menu/configuração

- Contas, metas, orçamento, patrimônio, investimentos, análises e comparação mensal.
- Metas avançadas, planejamento, evolução patrimonial e relatórios avançados.
- Missões de organizar contas, guardar valor, reduzir categoria, patrimônio ou otimização.

### Trilha e desafios

- Módulos: **Conhecendo meu dinheiro**, **Consumo consciente** e **Primeiro planejamento**.
- Missões práticas: registrar movimentação, registrar despesas em categorias e criar primeira meta.
- Categorias mensais: registro, hábitos, consciência, organização e planejamento básico.

## Perfil 2 — Equilibrado Financeiro

### Recursos liberados

- Tudo que o Explorador utiliza em registro, saúde e sugestões.
- Menu de **Contas**, **Metas** e **Aprender**.
- Orçamento por categoria e comparação mensal.
- Organização de contas, criação de orçamento e ação de guardar valor.
- Desafios de orçamento, organização e economia.

### Recursos ainda não liberados no menu/configuração

- Patrimônio, investimentos, análises e relatórios avançados.
- Evolução patrimonial, planejamento avançado, metas avançadas e redução de categoria.
- Ações estratégicas de atualizar patrimônio, estudar investimento, analisar relatórios e otimizar gastos.

### Trilha e desafios

- Módulos: **Orçamento mensal**, **Organização financeira** e **Reserva e acompanhamento**.
- Missões práticas: definir orçamento, cadastrar conta com saldo e registrar movimentação.
- Categorias mensais: orçamento, organização, economia e acompanhamento de despesas/receitas.

## Perfil 3 — Construtor Financeiro

### Recursos liberados

- Todos os recursos do Equilibrado.
- Patrimônio, planejamento, evolução financeira e metas avançadas.
- Criação de metas e acompanhamento de evolução.
- Atualização de patrimônio, redução de categorias e estudo de investimentos na configuração de funcionalidades.
- Comparação mensal, saúde financeira e sugestões.

### Recursos ainda não liberados no menu/configuração

- Análises e investimentos não são exibidos no menu deste perfil.
- Relatórios avançados, análise de relatório e otimização de gastos continuam bloqueados.

### Trilha e desafios

- Módulos: **Metas avançadas**, **Patrimônio** e **Investimentos básicos**.
- Missões práticas: criar meta, cadastrar ativo e cadastrar investimento.
- Categorias mensais: metas, patrimônio, objetivos, planejamento e organização.

## Perfil 4 — Estrategista Financeiro

### Recursos liberados

- Todos os módulos financeiros do app: Gastos, Contas, Metas, Patrimônio, Investimentos e Análises.
- Comparação mensal, planejamento, evolução patrimonial, relatórios avançados e metas avançadas.
- Atualização de patrimônio, redução inteligente por categoria, análise de relatórios, otimização de gastos e estudo de investimentos.
- Saúde financeira e sugestões.

### Menu e particularidade de aprendizado

- O menu contém Análises e Investimentos.
- A funcionalidade de aprendizado continua habilitada na configuração, porém **Aprender não está no menu inferior do Estrategista**. A rota permanece acessível no app quando direcionada por fluxo interno/URL.

### Trilha e desafios

- Módulos: **Análise financeira**, **Otimização** e **Estratégia patrimonial**.
- Missões práticas: registrar movimentações para análise, atualizar ativo e cadastrar investimento.
- Categorias mensais: análise, patrimônio, investimento, otimização e planejamento.

## Perfil 5 — Mestre Financeiro

### Recursos liberados

- Mantém todos os recursos avançados do Estrategista: análises, investimentos, contas, metas, patrimônio, orçamento, planejamento, comparativos e relatórios avançados.
- Mantém sugestões, saúde financeira, metas avançadas, organização de contas, redução por categoria, patrimônio, otimização, orçamento e investimentos.
- É o perfil terminal: não há nova promoção após ele.

### Identidade e menu

- O cabeçalho usa número **5** e troféu dourado no lugar do nível/XP.
- Aprender é removido intencionalmente do menu inferior do Mestre.
- As aulas do Mestre existem como trilha de conteúdo, mas não são promovidas na navegação inferior atual.

### Trilha e desafios

- Módulos: **Auditoria financeira**, **Independência financeira** e **Estratégia de longo prazo**.
- Missões práticas: revisar orçamento, atualizar patrimônio e criar meta de longo prazo.
- Categorias mensais: auditoria, planejamento e patrimônio.

## Desafios mensais: regra operacional

1. A inicialização identifica o perfil e nível atuais.
2. O motor seleciona quatro desafios compatíveis na biblioteca do perfil.
3. Cada desafio contém categoria, nível mínimo, XP e chave de validação.
4. A seleção consulta `challengeHistory` e exclui tarefas usadas nos seis meses anteriores.
5. A conclusão libera XP somente após a validação definida em `progress.ts`.
6. No mês seguinte, um novo conjunto de quatro desafios é gerado.

O desafio de teste para promoção ao Mestre não integra a seleção mensal, para manter o limite de quatro desafios.
