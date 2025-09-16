import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/**
 * Optimized Vitest Configuration for CI/CD
 * Focused on speed and reliability in automated environments
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],

    // CI-specific optimizations
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 4, // Limit for CI stability
        minThreads: 2,
      },
    },

    // Faster test discovery
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
      '**/tests/visual/**',
      '**/tests/performance/**',
      // Exclude flaky tests in CI
      'src/__tests__/api-integration/*.test.ts',
    ],

    // CI-specific timeouts
    testTimeout: 10000, // 10 seconds per test
    hookTimeout: 10000, // 10 seconds for hooks

    // Reduced retries for faster feedback
    retry: 1,

    // Coverage configuration optimized for CI
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov', 'cobertura'],
      reportOnFailure: true,
      reportsDirectory: './coverage',

      // Thresholds for CI failure
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        },
        'src/app/vendor/**': {
          branches: 90,
          functions: 95,
          lines: 90,
          statements: 90
        },
        'src/app/api/vendors/**': {
          branches: 88,
          functions: 92,
          lines: 88,
          statements: 88
        }
      },

      // Optimized exclusions for CI
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
        'middleware.ts',
        'instrumentation.ts',
        // Exclude test utilities
        'src/test-utils/**',
        'tests/**',
      ],

      // Faster coverage collection
      all: false, // Only collect coverage for tested files
      skipFull: false,
    },

    // Reporter configuration for CI
    reporter: process.env.CI
      ? ['junit', 'json', 'github-actions']
      : ['verbose'],

    outputFile: {
      junit: './test-results/junit.xml',
      json: './test-results/results.json',
    },

    // CI-specific watch settings
    watch: false, // Disable watch mode in CI

    // Bail on first failure for faster feedback
    bail: process.env.CI ? 5 : 0, // Stop after 5 failures in CI

    // Environment variables for CI
    env: {
      NODE_ENV: 'test',
      CI: 'true',
      VITEST_SEGFAULT_RETRY: '3',
    },

    // Silent mode for cleaner CI output
    silent: false,
    ui: false,

    // Chunk size optimization for CI
    maxConcurrency: 4,
    minWorkers: 1,
    maxWorkers: 4,
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

  // Optimizations for CI builds
  esbuild: {
    target: 'node14',
  },

  // Reduced memory usage
  define: {
    'process.env.NODE_ENV': '"test"',
  },
});