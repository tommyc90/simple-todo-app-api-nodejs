import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reportsDirectory: './tests/.coverage',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/Server.ts',
        'src/types/**',
        '**/*.test.ts',
        'tests/**',
      ],
    },
  },
});
