import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// base MUST match the Istio VirtualService pathPrefix in deploy/mvp/values.yaml.
// Istio rewrites /verana/mvp/ -> / before reaching nginx, and Vite emits asset
// URLs under this base so every prefixed request routes back to this service.
export default defineConfig({
  base: '/verana/verana/',
  plugins: [react()],
})
