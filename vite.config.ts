import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src')
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    ]
  },
  server: {
    host: '127.0.0.1',
    port: 5000,
    proxy: {
      '/dev-api': {
        target: 'http://127.0.0.1:3000', //实际请求地址
        changeOrigin: true,
        rewrite: path => path.replace(/^\/dev-api/, '')
      },
      '/api': {
        target: 'http://127.0.0.1:3001', //实际请求地址
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        math: 'always', // 括号内才使用数学计算
        globalVars: {
          // 全局变量
        }
      }
    }
  }
})
