// /Applications/XAMPP/xamppfiles/htdocs/CoffeApp/frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // accessible depuis 127.0.0.1 et localhost
    port: 5173,
    strictPort: true
    // proxy éventuel si tu veux éviter CORS (pas obligatoire ici)
    // proxy: { '/api': 'http://127.0.0.1' }
  }
})
