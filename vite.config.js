import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' 

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, 'src/config'),   // Alias para src/config
      '@services': path.resolve(__dirname, 'src/services'), // Alias para src/services
      '@pages': path.resolve(__dirname, 'src/pages'),     // Alias para src/pages
      '@components': path.resolve(__dirname, 'src/components'), // Alias para src/components
    }
  }
})
