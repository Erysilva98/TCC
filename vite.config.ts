import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // Relative paths support GitHub Pages project URLs.
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        id: './',
        lang: 'pt-BR',
        dir: 'ltr',
        categories: ['finance', 'productivity', 'education'],
        name: 'FinEdu Wallet',
        short_name: 'FinEdu',
        description: 'Seu personal trainer financeiro. Entenda seu dinheiro, crie melhores hábitos, evolua financeiramente.',
        theme_color: '#16a34a',
        background_color: '#ffffff',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
        orientation: 'any',
        start_url: './',
        scope: './',
        screenshots: [
          {
            src: 'screenshot-dashboard.png',
            sizes: '941x1672',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Painel financeiro do FinEdu Wallet',
          },
        ],
        shortcuts: [
          {
            name: 'Abrir painel',
            short_name: 'Painel',
            description: 'Abrir o painel financeiro do FinEdu Wallet',
            url: './',
            icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: 'index.html',
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
