import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      // Exclude API integration tests that need separate configuration
      'src/__tests__/api/products/route.test.ts',
      'src/__tests__/api/vendors/*.test.ts',
      'src/__tests__/api-integration/*.test.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '.next/',
        '*.config.js',
        '*.config.ts',
        '**/*.d.ts',
        '**/types.ts',
        'src/app/layout.tsx',
        'src/app/**/layout.tsx',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        // Higher thresholds for vendor functionality
        'src/app/vendor/**': {
          branches: 90,
          functions: 95,
          lines: 90,
          statements: 90
        },
        'src/app/api/vendors/**': {
          branches: 85,
          functions: 90,
          lines: 85,
          statements: 85
        }
      },
      reportOnFailure: true,
      reportsDirectory: './coverage',
      watermarks: {
        statements: [80, 95],
        functions: [80, 95],
        branches: [80, 95],
        lines: [80, 95]
      }
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});