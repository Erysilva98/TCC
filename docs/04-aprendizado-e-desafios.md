# Aprendizado, desafios e progressão

## Learning Engine

As aulas são definidas em `src/data/lessons.ts`. A trilha exibida contém **30 aulas para cada perfil**, agrupadas em três módulos e distribuídas em níveis. Cada aula contém título, descrição, duração, XP, perfil, módulo, nível, conteúdo e `desafioPratico`.

`desafioPratico` define tipo, texto da missão, validação e rota. `src/lib/progress.ts` valida a missão com dados reais do app: transações, categorias, metas, orçamento, contas, ativos e investimentos. A conclusão não é liberada apenas por clique.

`Learn.tsx` exibe módulo e nível, abre o conteúdo em modal e direciona para a rota necessária quando a atividade ainda não foi concluída.

## XP e promoção

- Cada perfil possui níveis de 1 a 100.
- Cada nível exige 100 XP.
- O indicador mostra o XP do nível atual, por exemplo `35/100 XP`.
- Ao completar 100 XP, o usuário avança um nível e o contador retorna a zero.
- Ao concluir o nível 100, o perfil avança para a classificação seguinte e suas funcionalidades/menu são atualizados.
- O Mestre Financeiro é a classificação final.

O cálculo está em `getLevel` (`src/lib/analytics.ts`) e a mudança de perfil em `getProfileFromExperience` (`src/data/profiles.ts`).

## Challenge Engine

`src/data/challenges.ts` contém uma biblioteca por perfil e dificuldade. A geração mensal seleciona **quatro** desafios compatíveis com perfil e nível: níveis 1–25, 26–50, 51–75 e 76–100 possuem faixas de XP crescentes.

Cada desafio registra categoria, nível mínimo e chave de validação. O histórico `challengeHistory` é persistido no estado e bloqueia a seleção da mesma tarefa por seis meses. Quando não há desafios do perfil para o mês atual, `_ensureMonthlyChallenges` cria o novo conjunto.

Os desafios mensais não incluem o antigo desafio de teste de promoção; o ciclo mensal sempre contém quatro itens.
