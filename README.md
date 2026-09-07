# Projeto Vite

## Requisitos

Antes de começar, instale o [Node.js](https://nodejs.org/) na versão LTS. Em seguida, abra um terminal na pasta deste projeto e confirme a instalação:

```bash
node --version
npm --version
```

Se os comandos não mostrarem versões, feche e abra o terminal após instalar o Node.js.

## Instalação

Na raiz do projeto, instale as dependências:

```bash
npm install
```

## Executar em desenvolvimento

Inicie o servidor local:

```bash
npm run dev
```

O terminal exibirá um endereço semelhante a este:

```text
Local: http://localhost:5173/
```

Abra esse endereço no navegador. Se a porta `5173` já estiver ocupada, o Vite escolherá outra porta e mostrará o endereço correto no terminal.

## Outros comandos

```bash
# Verifica erros de estilo com ESLint
npm run lint

# Verifica tipos TypeScript sem gerar arquivos
npm run typecheck

# Gera a versão de produção na pasta dist
npm run build

# Visualiza localmente a versão gerada pelo build
npm run preview
```

## Túnel HTTPS público para testar a PWA

Um túnel disponibiliza temporariamente o servidor local em uma URL HTTPS pública. Use-o para validar a PWA em outro celular ou para informar uma URL ao [PWABuilder](https://www.pwabuilder.com/).

Mantenha dois terminais abertos na pasta do projeto. No primeiro, inicie a aplicação e mantenha o processo em execução:

```bash
npm run dev
```

O Vite deste projeto usa a porta `5173`. A URL do túnel só funcionará enquanto os dois comandos permanecerem abertos.

### Opção A: Ngrok

Depois de instalar e autenticar o [Ngrok](https://ngrok.com/), abra outro terminal e execute:

```bash
ngrok http 5173
```

Copie a URL HTTPS exibida, por exemplo `https://exemplo.ngrok-free.app`, e abra-a no navegador ou informe-a no PWABuilder.

### Opção B: LocalTunnel

Em outro terminal, execute:

```bash
npm run tunnel
```

O comando usa o LocalTunnel pela primeira vez via `npx` e mostrará uma URL semelhante a:

```text
https://nome-gerado.loca.lt
```

Copie a URL HTTPS. Se o LocalTunnel solicitar uma senha de acesso, use o endereço IP público indicado na própria página do LocalTunnel.

### Gerar APK/AAB no PWABuilder

1. Execute `npm run dev` e, em outro terminal, crie o túnel com Ngrok ou `npm run tunnel`.
2. Abra a URL HTTPS gerada em uma aba anônima e confirme que o aplicativo carrega.
3. Acesse [PWABuilder](https://www.pwabuilder.com/) e cole a mesma URL HTTPS.
4. Após a validação do manifesto e service worker, selecione **Android** para gerar APK ou AAB.

Para publicar na loja, prefira uma hospedagem HTTPS com URL permanente. Túneis são temporários e a URL pode mudar a cada execução.

## Se o projeto não iniciar

1. Confirme que o terminal está na pasta que contém o arquivo `package.json`:

   ```bash
   dir
   ```

   No resultado, deve aparecer `package.json`.

2. Instale as dependências antes de executar o projeto:

   ```bash
   npm install
   npm run dev
   ```

3. Se aparecer `npm` ou `node` não é reconhecido, instale a versão LTS do Node.js e reinicie o terminal.

4. Se aparecer `Cannot find module`, apague somente a pasta `node_modules`, instale novamente e execute:

   ```bash
   npm install
   npm run dev
   ```

5. Se aparecer erro de porta em uso, inicie com outra porta:

   ```bash
   npm run dev -- --port 5174
   ```

6. Se continuar falhando, execute os comandos abaixo e envie a mensagem completa de erro:

   ```bash
   npm run typecheck
   npm run lint
   ```

## Publicar no GitHub Pages e gerar o APK

O comando `npm run build` gera o `manifest.json`, os icones e o service worker. A configuracao usa caminhos relativos para funcionar na URL de projeto do GitHub Pages.

1. Envie este projeto para um repositorio GitHub na branch `main`.
2. No GitHub, abra **Settings > Pages** e selecione **GitHub Actions** em Build and deployment.
   Essa ativacao deve ser feita uma vez pelo dono do repositorio. O `GITHUB_TOKEN` do workflow nao tem permissao para habilitar Pages automaticamente.
3. Faca push na branch `main`. O workflow `.github/workflows/deploy-pages.yml` publicara a pasta `dist`.
   Confirme no arquivo publicado no GitHub que ele usa `actions/configure-pages@v6`. Uma execucao que mostra `@v5` ainda esta usando uma versao antiga do workflow.
4. Ao terminar, a URL sera parecida com `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.
5. Abra essa URL e verifique se o aplicativo carrega.
6. Cole essa URL publica do GitHub Pages no [PWABuilder](https://www.pwabuilder.com/) e escolha Android para gerar APK ou AAB.

O PWABuilder precisa da URL publica do GitHub Pages. A URL do repositorio, como `github.com/usuario/repositorio`, nao pode ser usada para gerar o APK.

`vite.config.ts` e a unica fonte de configuracao do manifesto. Ao executar `npm run build`, ele gera `dist/manifest.json`, que e o unico manifesto publicado e lido pelo PWABuilder.
"# TCC" 
