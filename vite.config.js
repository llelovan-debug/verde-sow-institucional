import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        sobre: resolve(__dirname, 'quem-somos.html'),
        servicos: resolve(__dirname, 'servicos.html'),
        produtos: resolve(__dirname, 'produtos.html'),
        contactos: resolve(__dirname, 'contactos.html'),
      },
    },
  },
});