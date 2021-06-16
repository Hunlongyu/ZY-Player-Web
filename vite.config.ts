import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import styleImport from 'vite-plugin-style-import'

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
    styleImport({
      libs: [{
        libraryName: 'element-plus',
        esModule: true,
        ensureStyleFile: true,
        resolveStyle: (name) => {
          name = name.slice(3)
          return `element-plus/packages/theme-chalk/src/${name}.scss`;
        },
        resolveComponent: (name) => {
          return `element-plus/lib/${name}`;
        },
      }]
    }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ZY Player Web',
        short_name: 'ZY Player',
        icons: [
          {
            src: '/img/64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: '/img/128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: '/img/256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: '/img/512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ]
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ]
})
