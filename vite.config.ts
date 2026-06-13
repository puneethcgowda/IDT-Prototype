import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' 

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'sb-2b2muaq6xuky.vercel.run'
    ]
  }
})
