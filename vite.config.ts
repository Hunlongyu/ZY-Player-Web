import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    open: true
  },
  build: {
    outDir: 'docs'
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ZY Player Web',
        short_name: 'ZY Player'
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ]
})
