import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3004',
        changeOrigin: true,

        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Proxying request:', req.method, req.url, 'to', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Received response from proxy for:', req.method, req.url, 'Status:', proxyRes.statusCode);
          });
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err);
            // Fallback for local development - handle API requests directly
            console.log('API proxy error, using fallback');
          });
        }
      }
    }
  }
});
