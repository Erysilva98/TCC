# Produto e escopo atual

## Visão

**FinEdu Wallet** é um PWA de educação e organização financeira pessoal. O produto ajuda o usuário a registrar movimentações, acompanhar saldo, metas, patrimônio, orçamento e desenvolver hábitos por meio de aulas, missões práticas, XP e desafios mensais.

Tagline atual: **“Entenda seu dinheiro. Evolua suas escolhas.”**

O público inicial é composto por jovens e adultos em início de organização financeira. O aplicativo funciona localmente e não exige cadastro no MVP.

## Fluxo principal

1. A pessoa inicia o onboarding e responde ao diagnóstico.
2. O diagnóstico define o perfil inicial.
3. O Dashboard apresenta dados financeiros e sugestões adaptadas.
4. Transações, metas, contas, investimentos e patrimônio alimentam os indicadores.
5. Aulas exigem uma ação real no aplicativo antes da conclusão.
6. Ações, aulas e desafios concedem XP; cada 100 XP avança um nível.
7. O nível 100 promove para o próximo perfil.

## Perfis

| Classificação | Perfil | Foco |
| --- | --- | --- |
| 1 | Explorador Financeiro | consciência e registro |
| 2 | Equilibrado Financeiro | orçamento e organização |
| 3 | Construtor Financeiro | metas, patrimônio e investimentos |
| 4 | Estrategista Financeiro | análise e otimização |
| 5 | Mestre Financeiro | excelência e estratégia de longo prazo |

O Mestre Financeiro usa identidade dourada e troféu. É a classificação máxima; por isso o cartão do cabeçalho não exibe progresso de XP. O menu do Mestre não apresenta Aprender.

## Escopo entregue

- PWA instalável e utilizável offline após a primeira carga.
- Onboarding, classificação de perfil e navegação protegida.
- Dashboard responsivo com saldo, entradas, saídas, saúde financeira, categorias e sugestões.
- CRUD local de transações, metas, contas, investimentos, patrimônio, orçamento e transferências.
- Perfil com XP, desafios, orçamento e reinicialização dos dados.
- Trilha prática de aprendizado por perfil.
- Motor de desafios mensais com histórico local.

## Limites do MVP

Não há autenticação real, sincronização em nuvem, integração bancária, cartão de crédito, empréstimos, servidor Node/NestJS ou PostgreSQL. O pacote `@supabase/supabase-js` não é usado pelo fluxo atual. Essas capacidades fazem parte do roadmap, não da implementação presente.
