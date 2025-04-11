import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
   base: 'test_for_-insiders',
  plugins: [react()],
  build: {
    sourcemap: true,
  }
});