# Dados, PWA e publicação

## Modelo persistido

`AppState` em `src/types/index.ts` guarda:

- onboarding e perfil inicial/atual;
- transações, metas, contas, ativos e transferências;
- orçamentos;
- progresso de aulas;
- desafios mensais e `challengeHistory`;
- XP, ordem e visibilidade dos cards.

Os dados permanecem somente no navegador. A opção Recomeçar apaga toda a chave de estado no IndexedDB.

## PWA

A configuração está em `vite.config.ts`:

- `VitePWA` gera `dist/manifest.json`;
- display standalone, idioma `pt-BR`, ícone `icon-wallet.png` e shortcut de painel;
- Service Worker Workbox pré-armazena HTML, JS, CSS, SVG, PNG, ICO e fontes;
- `navigateFallback: 'index.html'` permite abrir telas SPA offline após o cache inicial.

## GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` executa `npm ci`, `npm run build`, verifica os arquivos PWA e publica `dist` como artefato. O GitHub Pages deve estar configurado para usar **GitHub Actions**.

`dist` fica ignorada pelo Git porque é produzida durante o workflow. O PWABuilder deve receber a URL pública publicada, não a URL do repositório.

## Comandos operacionais

```bash
npm run dev        # desenvolvimento
npm run typecheck  # tipos
npm run lint       # lint
npm run build      # produção e PWA
npm run preview    # prévia do build
```
