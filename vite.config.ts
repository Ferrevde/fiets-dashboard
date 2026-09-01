import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // of vue() / preact() afhankelijk van je specifieke plugin

export default defineConfig({
  base: '/fiets-dashboard/', // 👈 VOEG DEZE REGEL TOE
  plugins: [/* je huidige plugins */],
})
