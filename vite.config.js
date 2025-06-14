import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 出力先を 'docs' に変更
    outDir: 'docs', 
  },
  base: "/portfolio/", 
})
