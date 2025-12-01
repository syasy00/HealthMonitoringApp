import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

<<<<<<< HEAD
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    server: {
      host: true
=======
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This allows your code (process.env.API_KEY) to work even in the browser
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
>>>>>>> b107bb86270a912acadea07e414f3bf4ea912b04
    }
  };
});