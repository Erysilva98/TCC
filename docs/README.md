# Documentação — FinEdu Wallet

Este diretório descreve o produto e a implementação que existe neste repositório. O documento de engenharia inicial foi revisado para distinguir o que está entregue no MVP do que permanece como evolução futura.

| Documento | Conteúdo |
| --- | --- |
| [01-produto-e-escopo.md](01-produto-e-escopo.md) | visão, público, escopo entregue e limites |
| [02-arquitetura.md](02-arquitetura.md) | tecnologias, pastas, rotas e fluxo de estado |
| [03-funcionalidades.md](03-funcionalidades.md) | comportamento das telas e regras de negócio |
| [04-aprendizado-e-desafios.md](04-aprendizado-e-desafios.md) | learning engine, desafios mensais e XP |
| [05-dados-e-pwa.md](05-dados-e-pwa.md) | modelo de dados, IndexedDB, PWA e publicação |
| [06-roadmap-e-lacunas.md](06-roadmap-e-lacunas.md) | comparação com o escopo inicial e próximos passos |

## Como validar

```bash
npm install
npm run typecheck
npm run build
```

O build gera `dist/`, incluindo `manifest.json` e `sw.js`. A pasta é artefato de build e não deve ser versionada.
