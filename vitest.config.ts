import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/shared/config/tests/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.stories.{ts,tsx}',
        'src/**/*.test.{ts,tsx}',
        'src/**/index.ts',
        'src/**/*.d.ts',
        'src/index.tsx',
      ],
    },
  },
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
});
