import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for Vendor UI Components
 * Ensures UI consistency across browsers and viewport sizes
 */

test.describe('Vendor Dashboard Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication for vendor user
    await page.addInitScript(() => {
      window.localStorage.setItem('clerk-user', JSON.stringify({
        id: 'vendor-123',
        publicMetadata: { role: 'vendor' }
      }));
    });
  });

  test('vendor dashboard layout', async ({ page }) => {
    await page.goto('/vendor/dashboard');

    // Wait for content to load
    await page.waitForSelector('[data-testid="vendor-dashboard"]', { timeout: 10000 });

    // Hide dynamic content (dates, real-time data)
    await page.addStyleTag({
      content: `
        .date-display, .time-display, .real-time-data { visibility: hidden !important; }
        .chart-animation { animation: none !important; }
      `
    });

    // Take full page screenshot
    await expect(page).toHaveScreenshot('vendor-dashboard-desktop.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('vendor products page layout', async ({ page }) => {
    await page.goto('/vendor/products');

    // Wait for products to load
    await page.waitForSelector('[data-testid="products-table"]', { timeout: 10000 });

    // Hide dynamic elements
    await page.addStyleTag({
      content: `
        .view-count, .last-updated { visibility: hidden !important; }
        .loading-spinner { display: none !important; }
      `
    });

    await expect(page).toHaveScreenshot('vendor-products-desktop.png', {
      fullPage: true
    });
  });

  test('vendor product creation form', async ({ page }) => {
    await page.goto('/vendor/products/new');

    // Wait for form to render
    await page.waitForSelector('form[data-testid="product-form"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('vendor-product-new-desktop.png', {
      fullPage: true
    });
  });

  test('vendor analytics page', async ({ page }) => {
    await page.goto('/vendor/analytics');

    // Wait for charts to load
    await page.waitForSelector('[data-testid="analytics-charts"]', { timeout: 10000 });

    // Disable chart animations
    await page.addStyleTag({
      content: `
        .chart-container * { animation: none !important; transition: none !important; }
        .chart-loading { display: none !important; }
      `
    });

    await expect(page).toHaveScreenshot('vendor-analytics-desktop.png', {
      fullPage: true
    });
  });
});

test.describe('Vendor Mobile UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('clerk-user', JSON.stringify({
        id: 'vendor-123',
        publicMetadata: { role: 'vendor' }
      }));
    });
  });

  test('mobile vendor dashboard', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone 12 size
    await page.goto('/vendor/dashboard');

    await page.waitForSelector('[data-testid="vendor-dashboard"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('vendor-dashboard-mobile.png', {
      fullPage: true
    });
  });

  test('mobile product management', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/vendor/products');

    await page.waitForSelector('[data-testid="products-table"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('vendor-products-mobile.png', {
      fullPage: true
    });
  });
});

test.describe('Vendor Component States', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('clerk-user', JSON.stringify({
        id: 'vendor-123',
        publicMetadata: { role: 'vendor' }
      }));
    });
  });

  test('empty product state', async ({ page }) => {
    // Mock empty products response
    await page.route('**/api/vendor/products*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [] })
      });
    });

    await page.goto('/vendor/products');
    await page.waitForSelector('[data-testid="empty-state"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('vendor-products-empty.png');
  });

  test('loading state', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/vendor/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [] })
      });
    });

    await page.goto('/vendor/dashboard');

    // Capture loading state
    await expect(page.locator('[data-testid="loading-skeleton"]')).toBeVisible();
    await expect(page).toHaveScreenshot('vendor-dashboard-loading.png');
  });

  test('error state', async ({ page }) => {
    // Mock API error
    await page.route('**/api/vendor/**', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'Server error' })
      });
    });

    await page.goto('/vendor/products');
    await page.waitForSelector('[data-testid="error-state"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('vendor-products-error.png');
  });
});

test.describe('Vendor Form Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('clerk-user', JSON.stringify({
        id: 'vendor-123',
        publicMetadata: { role: 'vendor' }
      }));
    });
  });

  test('product form validation states', async ({ page }) => {
    await page.goto('/vendor/products/new');
    await page.waitForSelector('form[data-testid="product-form"]', { timeout: 10000 });

    // Trigger validation by submitting empty form
    await page.click('button[type="submit"]');
    await page.waitForSelector('.error-message', { timeout: 5000 });

    await expect(page).toHaveScreenshot('vendor-product-form-validation.png');
  });

  test('product form filled state', async ({ page }) => {
    await page.goto('/vendor/products/new');
    await page.waitForSelector('form[data-testid="product-form"]', { timeout: 10000 });

    // Fill form with sample data
    await page.fill('input[name="name"]', 'Sample Product');
    await page.fill('textarea[name="description"]', 'This is a sample product description');
    await page.fill('input[name="price"]', '29.99');
    await page.selectOption('select[name="category"]', 'trading-cards');
    await page.selectOption('select[name="condition"]', 'near-mint');

    await expect(page).toHaveScreenshot('vendor-product-form-filled.png');
  });
});

test.describe('Vendor Dark Mode Support', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('clerk-user', JSON.stringify({
        id: 'vendor-123',
        publicMetadata: { role: 'vendor' }
      }));
      // Enable dark mode
      document.documentElement.classList.add('dark');
    });
  });

  test('dark mode dashboard', async ({ page }) => {
    await page.goto('/vendor/dashboard');
    await page.waitForSelector('[data-testid="vendor-dashboard"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('vendor-dashboard-dark.png', {
      fullPage: true
    });
  });

  test('dark mode products page', async ({ page }) => {
    await page.goto('/vendor/products');
    await page.waitForSelector('[data-testid="products-table"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('vendor-products-dark.png', {
      fullPage: true
    });
  });
});