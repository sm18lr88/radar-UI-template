import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.RADAR_DESKTOP_BUILD === '1' ? './' : '/',
  plugins: [react(), tailwindcss()],
})
