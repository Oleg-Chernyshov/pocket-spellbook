import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      boot: path.resolve(__dirname, 'src/boot'),
    },
  },
});
