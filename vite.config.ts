import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { templateCompilerOptions } from '@tresjs/core'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Noctis-Portfolio/', // GitHub Pages repo name
  plugins: [
    vue({
      ...templateCompilerOptions
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('three')) {
              return 'vendor-three'
            }
            if (id.includes('@tresjs')) {
              return 'vendor-tres'
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap'
            }
            if (id.includes('vue') || id.includes('@vue')) {
              return 'vendor-vue'
            }
          }
        }
      }
    },
    // 调高警告阈值，因为我们已经手动拆包了
    chunkSizeWarningLimit: 600
  }
})
