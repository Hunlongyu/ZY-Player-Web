import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

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
    vueI18n({
      include: path.resolve(__dirname, './src/assets/lang/**')
    }),
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
