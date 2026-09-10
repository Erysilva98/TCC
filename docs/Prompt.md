# FINEDU WALLET
# Evolução da Experiência Financeira Adaptativa

Atue como:

- Product Owner especialista em produtos financeiros digitais;
- UX Designer especialista em aplicativos mobile-first;
- Engenheiro de Software React/PWA;
- Especialista em educação financeira comportamental.

Analise o projeto atual do FinEdu Wallet antes de implementar qualquer alteração.

IMPORTANTE:

Não reconstruir o aplicativo.

Não remover funcionalidades existentes.

Não criar backend.

Não criar IA generativa.

Não criar integrações externas.

Implementar evolução incremental mantendo:

- React + TypeScript;
- Zustand;
- IndexedDB;
- PWA;
- arquitetura atual;
- design system existente.

---

# CONTEXTO DO PRODUTO

O FinEdu Wallet deve deixar de ser apenas:

"um aplicativo para registrar gastos"

e evoluir para:

"uma plataforma que ensina, acompanha hábitos e orienta decisões financeiras."

O aplicativo deve ajudar principalmente usuários iniciantes, pois pesquisas mostram que aplicativos financeiros atuais são eficientes no rastreamento, mas apresentam limitações em:

- onboarding personalizado;
- orientação contextual;
- formação de hábito;
- continuidade de uso.

O produto deve resolver essas lacunas.

---

# PRINCÍPIO CENTRAL

Separar:

## XP

Representa:

Engajamento no aplicativo.

Exemplo:

- registrar gastos;
- completar desafios;
- concluir atividades.


## Maturidade Financeira

Representa:

Evolução real do comportamento financeiro.


Criar um novo conceito:

Financial Maturity Score


---

# NOVO MOTOR DE MATURIDADE FINANCEIRA

Criar uma estrutura:

FinancialMaturityScore


Avaliar:

## Organização

Pergunta:

"O usuário acompanha seu dinheiro?"


Métricas:

- quantidade de registros;
- frequência de uso;
- categorias utilizadas.


---

## Planejamento

Avaliar:

- possui orçamento;
- possui metas;
- acompanha evolução.


---

## Controle Financeiro

Avaliar:

- equilíbrio receitas/despesas;
- redução de gastos;
- cumprimento de limites.


---

## Educação Financeira

Avaliar:

- aulas concluídas;
- desafios realizados;
- evolução da trilha.


---

## Consistência

Avaliar:

- frequência mensal;
- retorno ao aplicativo.


---

Resultado:

Exibir:

Saúde Financeira

+

Maturidade Financeira


Exemplo:

Nível:
Equilibrado Financeiro


Maturidade:

Organização: 80%

Planejamento: 45%

Controle: 70%

Educação: 60%

---

# PERFIS ADAPTATIVOS

A classificação inicial continua existindo.

Porém criar diferença entre:

Perfil inicial

e

Perfil comportamental.


---

# PERFIL 1 — EXPLORADOR FINANCEIRO

## Persona

Usuário:

- 16 a 25 anos;
- primeiro contato com organização financeira;
- pouca consciência dos gastos;
- dificuldade em criar hábito.


## Principal dor

"Eu não sei para onde meu dinheiro vai."


## Objetivo do produto

Criar consciência.


---

## Funcionalidades disponíveis

Manter:

✓ Saldo

✓ Receitas

✓ Despesas

✓ Categorias

✓ Sugestões

✓ Aprender

✓ Desafios


---

## Dashboard Explorador

Priorizar:

1. Saldo atual

2. Gastos recentes

3. Categorias

4. Próxima ação


Não mostrar:

- investimentos;
- análises;
- relatórios complexos.


---

## Recomendações


Criar regras:

Exemplo:

Usuário não registrou gastos:

"Comece registrando seus primeiros gastos para entender seus hábitos."


Usuário registrou 10 gastos:

"Agora descubra qual categoria representa maior parte das suas despesas."


---

## Trilha Aprender


Módulos:

1.
Conhecendo meu dinheiro


2.
Criando hábitos


3.
Consumindo melhor


4.
Primeiro planejamento


---

## Desafios


Exemplos:

Registrar 7 gastos reais.

XP:

+20


Analisar categoria mais utilizada.

XP:

+30


Criar primeira meta.

XP:

+50


---

# PERFIL 2 — EQUILIBRADO FINANCEIRO


## Persona

Usuário:

- já registra gastos;
- busca organização;
- quer controlar melhor o mês.


## Dor

"Eu sei meus gastos, mas não consigo planejar."


---

## Liberar:

Tudo Explorador +

✓ Orçamento

✓ Contas

✓ Metas

✓ Comparação mensal


---

## Dashboard


Adicionar:

Planejamento mensal.


Mostrar:

Receita

Limite

Gasto atual


---

## Recomendações


Exemplo:


"Seu orçamento de alimentação atingiu 85%."

"Você possui contas próximas do vencimento."


---

## Trilha


Módulos:

1.
Organização financeira


2.
Orçamento


3.
Reserva financeira


4.
Planejamento mensal


---

## Desafios


Criar orçamento de 3 categorias.

XP:

+50


Cadastrar contas recorrentes.

XP:

+40


Comparar dois meses.

XP:

+60


---

# PERFIL 3 — CONSTRUTOR FINANCEIRO


## Persona

Usuário:

- possui organização;
- deseja alcançar objetivos.


## Dor:

"Como transformar dinheiro em conquistas?"


---

## Liberar:

Tudo Equilibrado +

✓ Planejamento

✓ Metas avançadas

✓ Patrimônio

✓ Investimentos básicos


---

## Dashboard


Priorizar:

Metas

Progresso

Planejamento


---

## Recomendações


Exemplo:


"Você está economizando abaixo do necessário para atingir sua meta."


---

## Trilha


Módulos:

1.

Metas inteligentes


2.

Construção financeira


3.

Patrimônio


4.

Primeiros investimentos


---

## Desafios


Criar meta com prazo.

XP:

+70


Cadastrar investimento.

XP:

+80


Acompanhar evolução por 30 dias.

XP:

+100


---

# PERFIL 4 — ESTRATEGISTA FINANCEIRO


## Persona

Usuário:

- possui controle;
- busca otimização.


## Dor:

"Como melhorar minhas decisões?"


---

## Liberar:

Tudo Construtor +

✓ Análises

✓ Relatórios históricos

✓ Otimização


---

## Dashboard


Priorizar:

Insights financeiros.


Exemplo:


"Seu gasto com lazer aumentou 18%."


---

## Recomendações


Mais analíticas:


"Reduzir 10% da categoria alimentação aumentaria sua capacidade de investimento."


---

## Trilha


Módulos:


1.

Análise financeira


2.

Indicadores


3.

Estratégia


4.

Otimização


---

## Desafios


Analisar relatório mensal.

XP:

+80


Identificar categoria para redução.

XP:

+100


Criar estratégia financeira.

XP:

+150


---

# PERFIL 5 — MESTRE FINANCEIRO


## Persona

Usuário:

- alta maturidade;
- visão estratégica.


## Objetivo

Manter excelência.


---

## Liberar:

Tudo Estrategista +

✓ Auditoria financeira


---

## Dashboard


Priorizar:

Indicadores avançados.


---

## Trilha:


1.

Auditoria financeira


2.

Independência financeira


3.

Estratégia de longo prazo


---

## Desafios


Realizar auditoria mensal.

XP:

+150


Criar planejamento anual.

XP:

+200


---

# MOTOR DE RECOMENDAÇÕES

Substituir mensagens genéricas por recomendações contextuais.


Entrada:

Perfil

+

Nível

+

Maturidade

+

Transações

+

Metas

+

Orçamento


Saída:

Próxima melhor ação.


Exemplo:


Explorador:

"Registre seus gastos por 7 dias."


Equilibrado:

"Seu orçamento está próximo do limite."


Construtor:

"Sua meta precisa de ajuste."


Estrategista:

"Seu padrão de gastos reduziu sua capacidade de investimento."


---

# RELATÓRIO MENSAL FINANCEIRO


Criar resumo automático:


## Meu mês financeiro


Pontos positivos:

✓


Pontos de atenção:

⚠


Próximo objetivo:

🎯


---

# DESAFIOS MENSAIS


Manter:

4 desafios por mês.


Regras:


- compatível com perfil;
- compatível com nível;
- baseado nas funcionalidades liberadas;
- não repetir antes de 6 meses.


Nenhum desafio pode ser concluído manualmente.


Sempre validar através de ações reais.


---

# UX

Aplicar princípios identificados em pesquisas:

Reduzir carga cognitiva.

Mostrar apenas o necessário para cada usuário.

Transformar registros em aprendizado.

Criar feedback após ações.


Evitar:

- dashboards complexos para iniciantes;
- excesso de gráficos;
- funcionalidades bloqueadas sem explicação.


---

# CRITÉRIOS DE ACEITE


✓ Perfis possuem experiências diferentes.

✓ Dashboard muda conforme comportamento.

✓ Recomendações são contextuais.

✓ XP representa engajamento.

✓ Maturidade representa evolução real.

✓ Aprendizado gera prática.

✓ Desafios incentivam uso do aplicativo.

✓ Não quebrar funcionalidades existentes.

✓ Funcionar offline.

✓ Manter arquitetura atual.