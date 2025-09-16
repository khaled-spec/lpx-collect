import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for Public Pages
 * Tests customer-facing pages for UI consistency
 */

test.describe('Homepage Visual Tests', () => {
  test('homepage desktop layout', async ({ page }) => {
    await page.goto('/');

    // Wait for hero section to load
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });

    // Hide dynamic content
    await page.addStyleTag({
      content: `
        .real-time-counter, .dynamic-price { visibility: hidden !important; }
        .carousel-animation { animation: none !important; }
      `
    });

    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('homepage mobile layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true
    });
  });
});

test.describe('Product Catalog Visual Tests', () => {
  test('product grid layout', async ({ page }) => {
    await page.goto('/products');

    // Wait for products to load
    await page.waitForSelector('[data-testid="product-grid"]', { timeout: 10000 });

    // Hide dynamic pricing and view counts
    await page.addStyleTag({
      content: `
        .view-count, .time-ago { visibility: hidden !important; }
      `
    });

    await expect(page).toHaveScreenshot('products-grid-desktop.png', {
      fullPage: true
    });
  });

  test('product filters sidebar', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="filters-sidebar"]', { timeout: 10000 });

    // Open all filter sections
    await page.click('[data-testid="category-filter-toggle"]');
    await page.click('[data-testid="price-filter-toggle"]');
    await page.click('[data-testid="condition-filter-toggle"]');

    await expect(page.locator('[data-testid="filters-sidebar"]')).toHaveScreenshot('product-filters.png');
  });

  test('product detail page', async ({ page }) => {
    await page.goto('/product/1');

    // Wait for product details to load
    await page.waitForSelector('[data-testid="product-details"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('product-detail-desktop.png', {
      fullPage: true
    });
  });
});

test.describe('Vendor Profile Visual Tests', () => {
  test('vendor profile page', async ({ page }) => {
    await page.goto('/vendor/vendor-123');

    await page.waitForSelector('[data-testid="vendor-profile"]', { timeout: 10000 });

    // Hide dynamic stats
    await page.addStyleTag({
      content: `
        .last-active, .member-since { visibility: hidden !important; }
      `
    });

    await expect(page).toHaveScreenshot('vendor-profile-desktop.png', {
      fullPage: true
    });
  });

  test('vendor products showcase', async ({ page }) => {
    await page.goto('/vendor/vendor-123/products');

    await page.waitForSelector('[data-testid="vendor-products-showcase"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('vendor-products-showcase.png', {
      fullPage: true
    });
  });
});

test.describe('Authentication Pages Visual Tests', () => {
  test('sign in page', async ({ page }) => {
    await page.goto('/sign-in');

    await page.waitForSelector('[data-testid="sign-in-form"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('sign-in-desktop.png');
  });

  test('sign up page', async ({ page }) => {
    await page.goto('/sign-up');

    await page.waitForSelector('[data-testid="sign-up-form"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('sign-up-desktop.png');
  });

  test('vendor registration form', async ({ page }) => {
    await page.goto('/vendor/register');

    await page.waitForSelector('[data-testid="vendor-registration-form"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('vendor-registration.png', {
      fullPage: true
    });
  });
});

test.describe('Cart and Checkout Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock cart with sample items
    await page.addInitScript(() => {
      window.localStorage.setItem('cart', JSON.stringify([
        {
          id: '1',
          name: 'Sample Product',
          price: 29.99,
          quantity: 1,
          image: '/sample-image.jpg'
        }
      ]));
    });
  });

  test('cart sidebar', async ({ page }) => {
    await page.goto('/');

    // Open cart sidebar
    await page.click('[data-testid="cart-trigger"]');
    await page.waitForSelector('[data-testid="cart-sidebar"]', { timeout: 5000 });

    await expect(page.locator('[data-testid="cart-sidebar"]')).toHaveScreenshot('cart-sidebar.png');
  });

  test('checkout page', async ({ page }) => {
    await page.goto('/checkout');

    await page.waitForSelector('[data-testid="checkout-form"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('checkout-desktop.png', {
      fullPage: true
    });
  });

  test('order confirmation', async ({ page }) => {
    await page.goto('/order/123/confirmation');

    await page.waitForSelector('[data-testid="order-confirmation"]', { timeout: 10000 });

    // Hide dynamic order details
    await page.addStyleTag({
      content: `
        .order-date, .order-id { visibility: hidden !important; }
      `
    });

    await expect(page).toHaveScreenshot('order-confirmation.png', {
      fullPage: true
    });
  });
});

test.describe('Error Pages Visual Tests', () => {
  test('404 page', async ({ page }) => {
    await page.goto('/non-existent-page');

    await page.waitForSelector('[data-testid="404-page"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('404-page.png');
  });

  test('500 error page', async ({ page }) => {
    // Mock server error
    await page.route('**/api/**', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    await page.goto('/products');
    await page.waitForSelector('[data-testid="error-boundary"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('500-error.png');
  });
});

test.describe('Accessibility Visual Tests', () => {
  test('high contrast mode', async ({ page }) => {
    await page.addInitScript(() => {
      document.documentElement.style.setProperty('--color-contrast', 'high');
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });

    await expect(page).toHaveScreenshot('homepage-high-contrast.png', {
      fullPage: true
    });
  });

  test('focus indicators', async ({ page }) => {
    await page.goto('/products');

    // Tab through focusable elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await expect(page).toHaveScreenshot('focus-indicators.png');
  });
});

test.describe('Responsive Design Tests', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1200, height: 800 },
    { name: 'wide', width: 1920, height: 1080 }
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`navigation ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');

      await page.waitForSelector('[data-testid="navigation"]', { timeout: 10000 });

      await expect(page.locator('[data-testid="navigation"]')).toHaveScreenshot(`navigation-${name}.png`);
    });

    test(`footer ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');

      await page.waitForSelector('[data-testid="footer"]', { timeout: 10000 });

      await expect(page.locator('[data-testid="footer"]')).toHaveScreenshot(`footer-${name}.png`);
    });
  });
});