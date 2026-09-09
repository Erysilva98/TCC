# Arquitetura

## Stack

- React 18 e TypeScript 5
- Vite 5 e Tailwind CSS 3
- React Router com `HashRouter`
- Zustand para estado global
- IndexedDB através de `idb`
- Framer Motion para transições e modais
- Recharts para gráficos
- `vite-plugin-pwa` para manifesto e Service Worker
- Lucide React para ícones

## Organização real das pastas

```text
src/
├── components/ui/   Layout, navegação, cards, FAB, modal de transação e estados vazios
├── data/            perfis, perguntas, categorias, aulas e desafios
├── lib/             cálculos, formatação, persistência IndexedDB e validações
├── pages/           telas roteadas
├── store/           useStore.ts, store Zustand único do MVP
├── types/           contratos globais
└── App.tsx          inicialização, rotas e proteção de acesso
```

## Estado e persistência

`useStore` centraliza os dados e as ações. Toda mutação chama `_persist`, que agenda uma gravação em IndexedDB por `src/lib/db.ts`. A base contém uma store `appstate` e uma chave `main`.

O carregamento ocorre em `init()` antes das rotas serem exibidas. A rotina migra campos ausentes de versões anteriores, normaliza a ordem de cards, recalcula o perfil a partir do XP e garante os desafios do mês.

## Rotas implementadas

| Rota | Tela |
| --- | --- |
| `/` | Landing ou redirecionamento ao Dashboard |
| `/onboarding` | diagnóstico de perfil |
| `/dashboard` | painel principal |
| `/gastos` | transações |
| `/metas` | metas |
| `/contas` | contas |
| `/patrimonio` | patrimônio |
| `/investimentos` | investimentos |
| `/aprender` | trilha de aprendizado |
| `/analises` | análises |
| `/perfil` | perfil, desafios e orçamento |

Todas as rotas, exceto Landing e Onboarding, passam por `ProtectedRoute`.

## Decisões importantes

- URLs com hash evitam erro 404 de recarregamento no GitHub Pages.
- O manifesto é gerado exclusivamente por `vite.config.ts`; não existe manifesto-fonte em `dist`.
- A camada de persistência está isolada em `lib/db.ts`, permitindo substituição futura por uma API sem alterar as páginas.
