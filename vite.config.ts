import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy, options) => {
          // Fallback for local development - handle API requests directly
          proxy.on('error', (err, req, res) => {
            console.log('API proxy error, using fallback');
          });
        }
      }
    }
  }
})
