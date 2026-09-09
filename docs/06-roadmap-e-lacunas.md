# Escopo inicial, estado atual e roadmap

## Atualizações do escopo inicial

O documento inicial previa LocalStorage e uma arquitetura futura com múltiplos repositories e services. A implementação atual usa **IndexedDB** por `idb`, um store Zustand único e regras puras em `lib/`. Isso atende ao MVP offline e mantém a persistência centralizada, mas não implementa ainda os repositories por entidade nem backend.

O modelo de perfis também evoluiu de três perfis iniciais para cinco classificações: Explorador, Equilibrado, Construtor, Estrategista e Mestre.

## Entregue

- PWA, manifest e Service Worker.
- Persistência local isolada.
- Onboarding e perfis.
- Financeiro, dashboard e gráficos.
- Aprendizado prático, XP, níveis e desafios mensais.
- Navegação adaptada por perfil.

## Próximas evoluções recomendadas

1. Criar testes unitários para cálculos, progressão e seleção sem repetição.
2. Separar `useStore` por domínio e introduzir repositórios tipados.
3. Substituir o motor de sugestões local por RecommendationService com regras rastreáveis.
4. Implementar autenticação, sincronização e resolução de conflitos.
5. Adicionar configurações, cartões de crédito, empréstimos e simulador 50-30-20.
6. Registrar eventos de promoção e exibir modal de level-up.
7. Revisar acessibilidade, estados de carregamento e testes em dispositivos offline.

## Critério de atualização desta documentação

Ao alterar uma regra de perfil, XP, desafio, armazenamento, rota ou configuração PWA, atualize o documento correspondente no mesmo pull request.
