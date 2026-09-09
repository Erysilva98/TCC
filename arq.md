Analisei a estrutura atual enviada. Hoje o projeto já possui a base dos motores, porém está muito simplificado:

* `lessons.ts` possui apenas **8 aulas fixas**, sem progressão por nível e sem trilha completa por perfil. 
* `challenges.ts` possui poucos desafios fixos (3 por perfil aproximadamente), sem rotação mensal real, sem regra de 6 meses e sem níveis de dificuldade. 
* `progress.ts` já possui validação de tarefas usando funcionalidades reais do app, o que é uma boa base para evoluir o sistema. 
* `Learn.tsx` já suporta desafios associados às aulas e bloqueio do botão concluir quando a tarefa não foi realizada. Essa lógica deve ser preservada. 
* `profiles.ts` já possui os perfis e recursos liberados, incluindo Estrategista e Mestre. 

O prompt abaixo deve ser usado no Lovable para **evoluir a arquitetura existente**, não reconstruir.

---

# PROMPT — IMPLEMENTAÇÃO DO LEARNING ENGINE + CHALLENGE ENGINE FINEDU WALLET

````md
# EVOLUÇÃO DO SISTEMA DE APRENDIZADO E DESAFIOS
# FINEDU WALLET

Analise a implementação atual do projeto.

Os arquivos existentes:

- lessons.ts
- Learn.tsx
- challenges.ts
- progress.ts
- profiles.ts

já possuem uma estrutura inicial de aprendizado, desafios e validação.

NÃO recriar do zero.

Faça uma evolução arquitetural mantendo:

- React atual;
- Zustand atual;
- armazenamento local;
- componentes existentes;
- design system atual;
- regras de perfil existentes.

O objetivo é transformar o FinEdu Wallet em um sistema de progressão financeira baseado em:

Aprender

+

Praticar dentro do aplicativo

+

Receber XP

+

Subir nível

+

Desbloquear maturidade financeira

---

# OBJETIVO DO SISTEMA

O usuário não deve apenas consumir aulas.

Cada aprendizado precisa gerar uma mudança de comportamento dentro do aplicativo.

Fluxo:

Usuário aprende

↓

Recebe uma missão prática

↓

Executa uma ação financeira real

↓

Sistema valida

↓

Libera XP

↓

Evolui nível


---

# ARQUITETURA DOS MOTORES


Criar dois motores:


# 1. Learning Engine

Responsável pela trilha permanente.


Estrutura:

Perfil

↓

Nível

↓

Módulo

↓

Aula

↓

Desafio prático

↓

Validação

↓

XP


---

# 2. Challenge Engine

Responsável pelos desafios mensais.


Características:

- geração automática;
- desafios aleatórios;
- baseado no perfil;
- baseado no nível;
- baseado nas funcionalidades disponíveis;
- sem repetição.


---

# SISTEMA DE PROGRESSÃO


Manter regra:

Cada perfil possui:

Nível 1 até Nível 100


Cada nível:

100 XP


Exemplo:


Nível 1

0/100 XP


Ao atingir:

100 XP


Executar:

- subir nível;
- resetar XP;
- liberar novos conteúdos.


---

# PERFIS


Manter os 5 perfis:


1. Explorador Financeiro

2. Equilibrado Financeiro

3. Construtor Financeiro

4. Estrategista Financeiro

5. Mestre Financeiro


Cada perfil possui:

- objetivos;
- funcionalidades;
- trilha;
- desafios;
- recomendações.


---

# ESTRUTURA DE AULA


Alterar modelo Lesson.


Adicionar:


```ts
interface Lesson {

id:string;

titulo:string;

descricao:string;

perfil:string[];

nivel:number;

modulo:string;

duracao:string;

conteudo:string;

xp:number;

desafioPratico: {

tipo:string;

descricao:string;

validacao:string;

rota:string;

}

}
````

---

# REGRAS DAS AULAS

Toda aula precisa possuir:

## Conteúdo

Ensina um conceito financeiro.

## Atividade prática

Obrigatoriamente executada dentro do aplicativo.

## Validação

Nunca permitir:

"Cliquei em concluir"

Correto:

Usuário realiza ação

↓

Sistema valida

↓

Botão concluir fica disponível

---

# TRILHAS DE APRENDIZADO

Criar uma trilha completa para cada perfil.

---

# PERFIL 1

# EXPLORADOR FINANCEIRO

Objetivo:

Criar consciência financeira.

Módulos:

## Módulo 1

Conhecendo meu dinheiro

Aulas:

* O que é controle financeiro
* Para onde meu dinheiro vai
* Receita x despesa

Atividades:

Registrar gastos.

Criar primeiras categorias.

Analisar gráfico.

XP:

baixo.

---

## Módulo 2

Consumo consciente

Conteúdos:

* necessidade x desejo;
* compras impulsivas;
* hábitos financeiros.

Atividades:

Classificar gastos.

Criar limite.

XP:

médio.

---

## Módulo 3

Primeiro planejamento

Conteúdos:

* metas;
* organização;
* primeiros objetivos.

Atividades:

Criar primeira meta.

XP:

alto.

---

# PERFIL 2

# EQUILIBRADO FINANCEIRO

Objetivo:

Transformar controle em planejamento.

Conteúdos:

* orçamento;
* contas;
* reserva financeira;
* organização mensal;
* comparação financeira.

Atividades:

* criar orçamento;
* cadastrar contas;
* acompanhar gastos;
* analisar mês.

---

# PERFIL 3

# CONSTRUTOR FINANCEIRO

Objetivo:

Construir patrimônio.

Conteúdos:

* metas avançadas;
* planejamento;
* patrimônio;
* investimentos básicos.

Atividades:

* criar metas;
* atualizar patrimônio;
* registrar investimentos;
* acompanhar evolução.

---

# PERFIL 4

# ESTRATEGISTA FINANCEIRO

Objetivo:

Otimização.

Conteúdos:

* análise financeira;
* indicadores;
* investimentos;
* projeções;
* redução inteligente.

Atividades:

* analisar relatórios;
* comparar períodos;
* atualizar patrimônio;
* criar estratégias.

---

# PERFIL 5

# MESTRE FINANCEIRO

Objetivo:

Excelência financeira.

Conteúdos:

* independência financeira;
* planejamento longo prazo;
* diversificação;
* estratégia patrimonial.

Atividades:

* auditoria financeira;
* análise completa;
* planejamento anual.

---

# QUANTIDADE DE CONTEÚDO

Cada perfil deve possuir conteúdo suficiente para permitir evolução.

Criar:

mínimo:

30 aulas por perfil.

Distribuição:

Nível inicial:

aulas simples

XP menor

Nível intermediário:

aulas com mais ações

XP médio

Nível avançado:

tarefas complexas

XP maior

---

# DESAFIOS MENSAIS

Criar novo sistema.

Regra:

Todo mês:

gerar 4 desafios.

Fluxo:

Novo mês

↓

Selecionar desafios compatíveis

↓

Usuário executa

↓

Recebe XP

---

# REGRAS DOS DESAFIOS

Cada desafio possui:

```ts
interface MonthlyChallenge {

id:string;

titulo:string;

perfil:string;

nivelMinimo:number;

categoria:string;

descricao:string;

xp:number;

validacao:string;

mes:string;

}
```

---

# NÃO REPETIÇÃO

Implementar histórico:

challengeHistory

Regra:

Um desafio não pode aparecer novamente antes de 6 meses.

Cada perfil deve possuir:

mínimo 24 desafios.

Motivo:

4 desafios por mês

x

6 meses

=

24 desafios.

---

# DIFICULDADE DOS DESAFIOS

Conforme nível:

## Nível 1-25

tarefas simples

Exemplo:

Registrar gastos.

XP:

10-30

---

## Nível 26-50

tarefas intermediárias

Exemplo:

Criar orçamento.

XP:

40-70

---

## Nível 51-75

tarefas avançadas

Exemplo:

Analisar comportamento.

XP:

80-120

---

## Nível 76-100

tarefas estratégicas

Exemplo:

Planejamento anual.

XP:

150+

---

# DESAFIOS POR PERFIL

## Explorador

Categorias:

* registro;
* hábitos;
* consciência.

Exemplos:

Registrar 15 gastos

Validar:

15 despesas cadastradas.

XP:

50

---

## Equilibrado

Categorias:

* orçamento;
* organização;
* economia.

Exemplos:

Criar orçamento em 5 categorias.

Validar:

budgets.length >=5

---

## Construtor

Categorias:

* metas;
* patrimônio;
* objetivos.

Exemplos:

Criar meta com prazo.

Validar:

goal criada.

---

## Estrategista

Categorias:

* análise;
* investimento;
* otimização.

Exemplos:

Atualizar patrimônio.

Analisar relatório mensal.

---

# RECOMENDAÇÕES INTELIGENTES

Criar motor simples.

Entrada:

* perfil;
* nível;
* transações;
* metas;
* desafios;

Saída:

Mensagem personalizada.

Exemplos:

Explorador:

"Você já criou o hábito de registrar gastos. Próximo passo: organizar limites."

Equilibrado:

"Seus gastos estão controlados. Crie uma reserva financeira."

Construtor:

"Sua meta está avançando. Avalie seu patrimônio."

Estrategista:

"Analise sua evolução mensal para otimizar decisões."

---

# ALTERAÇÕES NECESSÁRIAS NOS ARQUIVOS

## lessons.ts

Transformar banco de aulas em trilha completa.

---

## challenges.ts

Criar:

* biblioteca de desafios;
* geração mensal;
* níveis;
* histórico.

---

## progress.ts

Expandir validações:

Adicionar:

* validação por nível;
* validação por atividade;
* validação por desafio mensal.

---

## profiles.ts

Adicionar:

* trilha associada;
* conteúdos liberados;
* desafios disponíveis;
* recomendações.

---

## Learn.tsx

Manter:

* cards atuais;
* modal;

Adicionar:

* módulo;
* nível;
* progresso da trilha;
* desafio associado;
* bloqueio de conclusão.

---

# CRITÉRIOS DE ACEITE

Obrigatório:

✅ nenhuma aula concluída sem atividade prática

✅ desafios mensais renovam

✅ desafios não repetem em 6 meses

✅ XP calculado corretamente

✅ nível evolui a cada 100 XP

✅ conteúdo muda conforme perfil

✅ atividades usam funcionalidades reais do app

✅ recomendações personalizadas

✅ persistência local mantida

---

# IMPORTANTE

Não criar apenas textos.

Criar um sistema funcional.

O FinEdu Wallet deve funcionar como:

"Uma jornada financeira personalizada que ensina, acompanha e transforma hábitos."

```

Esse prompt está mais adequado para o Lovable porque ele não pede "criar aulas"; ele define **um motor de produto**, com entidades, regras, validações e integração com as funcionalidades existentes.
```
