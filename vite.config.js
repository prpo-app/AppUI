import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
    proxy: {
      "/user": {
        target: "http://134.112.82.122",
        changeOrigin: true
      },
      "/book": {
        target: "http://134.112.82.122",
      },
      "/library": {
        target: "http://134.112.82.122",
      }
    }
  },
  css: {
    preprocessorOptions: {
        scss: {
          silenceDeprecations: [
            'import',
            'color-functions',
            'global-builtin',
            'legacy-js-api',
            'if-function',
          ],
        },
    },
  },

})
