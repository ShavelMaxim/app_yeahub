import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/shared/config/tests/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/shared/ui/**/*.{ts,tsx}', 'src/features/**/*.{ts,tsx}'],
    },
  },
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
});
