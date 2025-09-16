import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration Optimized for CI/CD
 * Faster execution with reduced resource usage
 */
export default defineConfig({
  testDir: './tests',

  // CI-specific test patterns
  testMatch: [
    '**/tests/visual/**/*.spec.ts',
    '**/tests/performance/**/*.spec.ts'
  ],

  // Optimized for CI performance
  fullyParallel: false, // Avoid resource contention in CI
  forbidOnly: !!process.env.CI,

  // Reduced retries for faster feedback
  retries: process.env.CI ? 1 : 0,

  // Conservative worker count for CI stability
  workers: process.env.CI ? 2 : undefined,

  // Optimized reporting for CI
  reporter: process.env.CI
    ? [
        ['github'],
        ['junit', { outputFile: 'test-results/playwright-results.xml' }],
        ['json', { outputFile: 'test-results/playwright-results.json' }],
        ['html', { open: 'never', outputFolder: 'playwright-report' }]
      ]
    : [['html']],

  // Global test settings optimized for CI
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Reduced timeouts for faster CI execution
    actionTimeout: 10000,
    navigationTimeout: 15000,

    // Minimal tracing in CI
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',

    // Screenshots only on failure
    screenshot: 'only-on-failure',

    // No video recording in CI to save resources
    video: process.env.CI ? 'retain-on-failure' : 'retain-on-failure',

    // Locale settings
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },

  // Optimized project configuration for CI
  projects: [
    // Desktop Chrome - primary browser for CI
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Reduce viewport for faster rendering
        viewport: { width: 1280, height: 720 },
      },
    },

    // Mobile Chrome - essential mobile testing
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
      // Only run mobile tests for specific test files
      testMatch: '**/tests/visual/public-pages.spec.ts',
    },

    // Firefox - only for critical visual tests
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
      // Limit Firefox to visual regression tests only
      testMatch: '**/tests/visual/**/*.spec.ts',
      // Skip if not explicitly requested
      testIgnore: process.env.SKIP_FIREFOX ? '**/*' : undefined,
    },

    // Performance tests - Chromium only for consistency
    {
      name: 'performance',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: '**/tests/performance/**/*.spec.ts',
      // Run performance tests only on main branch
      testIgnore: process.env.GITHUB_REF !== 'refs/heads/main' ? '**/*' : undefined,
    },
  ],

  // CI-optimized web server configuration
  webServer: process.env.CI ? {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: false,
    timeout: 60000, // Reduced timeout for CI
    env: {
      NODE_ENV: 'production',
      PORT: '3000',
    },
  } : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120000,
  },

  // Global timeout for CI
  globalTimeout: process.env.CI ? 900000 : undefined, // 15 minutes max

  // Test timeout optimized for CI
  timeout: process.env.CI ? 30000 : 60000,

  // Expect settings optimized for CI
  expect: {
    // More lenient thresholds for CI environments
    threshold: process.env.CI ? 0.3 : 0.2,

    toHaveScreenshot: {
      threshold: process.env.CI ? 0.25 : 0.15,
      mode: 'strict',
      animations: 'disabled',
      caret: 'hide',
    },

    // Reduced timeout for assertions
    timeout: process.env.CI ? 15000 : 30000,
  },

  // Output directory optimization
  outputDir: 'test-results/playwright',

  // Metadata for CI reporting
  metadata: {
    'CI Environment': process.env.CI ? 'true' : 'false',
    'Node Version': process.version,
    'OS': process.platform,
    'Architecture': process.arch,
  },

  // CI-specific configurations
  grep: process.env.TEST_GREP ? new RegExp(process.env.TEST_GREP) : undefined,
  grepInvert: process.env.TEST_GREP_INVERT ? new RegExp(process.env.TEST_GREP_INVERT) : undefined,

  // Shard configuration for parallel CI execution
  shard: process.env.CI && process.env.SHARD ? {
    current: parseInt(process.env.SHARD_INDEX || '1'),
    total: parseInt(process.env.SHARD_TOTAL || '1'),
  } : undefined,
});