import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        home: resolve(projectRoot, 'index.html'),
        sobre: resolve(projectRoot, 'quem-somos.html'),
        servicos: resolve(projectRoot, 'servicos.html'),
        produtos: resolve(projectRoot, 'produtos.html'),
        contactos: resolve(projectRoot, 'contactos.html'),
      },
    },
  },
});
