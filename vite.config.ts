import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: { // Cumple requisito [cite: 9]
        name: 'Pokedex Pro PWA',
        short_name: 'Pokedex',
        description: 'Gestor de Pokemons para Evaluación DevOps',
        theme_color: '#DC0A2D', // Rojo Pokemon
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Estrategia StaleWhileRevalidate para imágenes y API [cite: 12]
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://raw.githubusercontent.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'pokemon-images' }
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://pokeapi.co',
            handler: 'NetworkFirst',
            options: { cacheName: 'pokemon-api' }
          }
        ]
      }
    })
  ],
})