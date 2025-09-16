import { test, expect } from '@playwright/test';

/**
 * Performance Benchmarking Tests for Public Pages
 * Monitors customer-facing page performance and Core Web Vitals
 */

interface WebVitals {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

async function measureWebVitals(page: any): Promise<Partial<WebVitals>> {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const vitals: Partial<WebVitals> = {};

      // First Contentful Paint
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcpEntry) {
        vitals.fcp = fcpEntry.startTime;
      }

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        vitals.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      }

      // For LCP, we need to use PerformanceObserver
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            vitals.lcp = entries[entries.length - 1].startTime;
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // CLS measurement
        new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          vitals.cls = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });

        // Resolve after a short delay to collect metrics
        setTimeout(() => resolve(vitals), 2000);
      } catch (error) {
        resolve(vitals);
      }
    });
  });
}

test.describe('Homepage Performance', () => {
  test('homepage Core Web Vitals', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });

    const loadTime = Date.now() - startTime;
    const vitals = await measureWebVitals(page);

    // Core Web Vitals thresholds (Google's recommendations)
    if (vitals.fcp) expect(vitals.fcp).toBeLessThan(1800); // FCP < 1.8s
    if (vitals.lcp) expect(vitals.lcp).toBeLessThan(2500); // LCP < 2.5s
    if (vitals.cls) expect(vitals.cls).toBeLessThan(0.1); // CLS < 0.1
    if (vitals.ttfb) expect(vitals.ttfb).toBeLessThan(600); // TTFB < 600ms

    expect(loadTime).toBeLessThan(3000); // Total load time

    console.log('Homepage Performance:', {
      loadTime,
      ...vitals
    });
  });

  test('homepage with slow network', async ({ page, context }) => {
    // Simulate slow 3G network
    await context.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Add delay
      await route.continue();
    });

    const startTime = Date.now();
    await page.goto('/');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 15000 });

    const loadTime = Date.now() - startTime;

    // Should still be usable on slow connections
    expect(loadTime).toBeLessThan(8000);

    console.log('Homepage Slow Network Performance:', { loadTime });
  });

  test('homepage image optimization', async ({ page }) => {
    const imageRequests: any[] = [];

    page.on('response', response => {
      if (response.url().match(/\.(jpg|jpeg|png|webp|avif)$/i)) {
        imageRequests.push({
          url: response.url(),
          size: response.headers()['content-length'],
          format: response.url().split('.').pop()
        });
      }
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });

    const totalImageSize = imageRequests.reduce((total, img) =>
      total + (parseInt(img.size) || 0), 0
    );

    console.log('Image Optimization:', {
      imageCount: imageRequests.length,
      totalSize: `${(totalImageSize / 1024).toFixed(2)}KB`,
      formats: [...new Set(imageRequests.map(img => img.format))]
    });

    // Images should be optimized
    expect(totalImageSize).toBeLessThan(1024 * 1024); // Less than 1MB total
  });
});

test.describe('Product Catalog Performance', () => {
  test('product grid rendering performance', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-grid"]', { timeout: 10000 });

    const loadTime = Date.now() - startTime;
    const vitals = await measureWebVitals(page);

    expect(loadTime).toBeLessThan(3000);
    if (vitals.lcp) expect(vitals.lcp).toBeLessThan(2500);

    console.log('Product Grid Performance:', { loadTime, ...vitals });
  });

  test('infinite scroll performance', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-grid"]', { timeout: 10000 });

    const initialProductCount = await page.locator('[data-testid="product-card"]').count();

    const startTime = Date.now();

    // Scroll to trigger infinite loading
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Wait for new products to load
    await page.waitForFunction(
      (initial) => document.querySelectorAll('[data-testid="product-card"]').length > initial,
      initialProductCount,
      { timeout: 5000 }
    );

    const loadTime = Date.now() - startTime;
    const newProductCount = await page.locator('[data-testid="product-card"]').count();

    expect(loadTime).toBeLessThan(2000); // New content loads quickly
    expect(newProductCount).toBeGreaterThan(initialProductCount);

    console.log('Infinite Scroll Performance:', {
      loadTime,
      initialCount: initialProductCount,
      newCount: newProductCount
    });
  });

  test('search functionality performance', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="search-input"]', { timeout: 10000 });

    const searchInput = page.getByTestId('search-input');

    const startTime = Date.now();
    await searchInput.fill('pokemon card');

    // Wait for search results
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 5000 });

    const searchTime = Date.now() - startTime;

    expect(searchTime).toBeLessThan(1500); // Search should be fast

    console.log('Search Performance:', { searchTime });
  });
});

test.describe('Product Detail Performance', () => {
  test('product page load performance', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/product/1');
    await page.waitForSelector('[data-testid="product-details"]', { timeout: 10000 });

    const loadTime = Date.now() - startTime;
    const vitals = await measureWebVitals(page);

    expect(loadTime).toBeLessThan(2500);
    if (vitals.lcp) expect(vitals.lcp).toBeLessThan(2000);

    console.log('Product Detail Performance:', { loadTime, ...vitals });
  });

  test('image gallery performance', async ({ page }) => {
    await page.goto('/product/1');
    await page.waitForSelector('[data-testid="image-gallery"]', { timeout: 10000 });

    const startTime = Date.now();

    // Click through multiple images
    for (let i = 0; i < 5; i++) {
      await page.click(`[data-testid="thumbnail-${i}"]`);
      await page.waitForTimeout(100);
    }

    const interactionTime = Date.now() - startTime;

    expect(interactionTime).toBeLessThan(1000); // Image switching should be instant

    console.log('Image Gallery Performance:', { interactionTime });
  });

  test('related products performance', async ({ page }) => {
    await page.goto('/product/1');
    await page.waitForSelector('[data-testid="product-details"]', { timeout: 10000 });

    const startTime = Date.now();

    // Scroll to related products
    await page.evaluate(() => {
      document.querySelector('[data-testid="related-products"]')?.scrollIntoView();
    });

    await page.waitForSelector('[data-testid="related-products"]', { timeout: 5000 });

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(1500);

    console.log('Related Products Performance:', { loadTime });
  });
});

test.describe('Checkout Performance', () => {
  test.beforeEach(async ({ page }) => {
    // Add item to cart
    await page.addInitScript(() => {
      window.localStorage.setItem('cart', JSON.stringify([
        {
          id: '1',
          name: 'Test Product',
          price: 29.99,
          quantity: 1
        }
      ]));
    });
  });

  test('checkout page performance', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/checkout');
    await page.waitForSelector('[data-testid="checkout-form"]', { timeout: 10000 });

    const loadTime = Date.now() - startTime;
    const vitals = await measureWebVitals(page);

    expect(loadTime).toBeLessThan(2000);

    console.log('Checkout Performance:', { loadTime, ...vitals });
  });

  test('payment processing simulation', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForSelector('[data-testid="checkout-form"]', { timeout: 10000 });

    // Fill form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');

    const startTime = Date.now();
    await page.click('button[type="submit"]');

    // Wait for processing
    await page.waitForSelector('[data-testid="processing-indicator"]', { timeout: 5000 });

    const processingTime = Date.now() - startTime;

    expect(processingTime).toBeLessThan(3000);

    console.log('Payment Processing Performance:', { processingTime });
  });
});

test.describe('Mobile Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone 12
  });

  test('mobile homepage performance', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });

    const loadTime = Date.now() - startTime;
    const vitals = await measureWebVitals(page);

    // Mobile should be as fast as desktop
    expect(loadTime).toBeLessThan(3500);
    if (vitals.fcp) expect(vitals.fcp).toBeLessThan(2000);

    console.log('Mobile Homepage Performance:', { loadTime, ...vitals });
  });

  test('mobile navigation performance', async ({ page }) => {
    await page.goto('/');

    const startTime = Date.now();

    // Open mobile menu
    await page.click('[data-testid="mobile-menu-trigger"]');
    await page.waitForSelector('[data-testid="mobile-menu"]', { timeout: 3000 });

    const menuOpenTime = Date.now() - startTime;

    expect(menuOpenTime).toBeLessThan(500); // Menu should open instantly

    console.log('Mobile Navigation Performance:', { menuOpenTime });
  });

  test('mobile scroll performance', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-grid"]', { timeout: 10000 });

    const startTime = Date.now();

    // Simulate fast scrolling
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, 200);
      });
      await page.waitForTimeout(50);
    }

    const scrollTime = Date.now() - startTime;

    // Scrolling should remain smooth
    expect(scrollTime).toBeLessThan(2000);

    console.log('Mobile Scroll Performance:', { scrollTime });
  });
});

test.describe('API Performance Monitoring', () => {
  test('API response times', async ({ page }) => {
    const apiRequests: any[] = [];

    page.on('response', response => {
      if (response.url().includes('/api/')) {
        apiRequests.push({
          url: response.url(),
          status: response.status(),
          responseTime: response.timing()
        });
      }
    });

    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-grid"]', { timeout: 10000 });

    const avgResponseTime = apiRequests.reduce((sum, req) =>
      sum + (req.responseTime || 0), 0
    ) / apiRequests.length;

    expect(avgResponseTime).toBeLessThan(1000); // Average API response < 1s

    console.log('API Performance:', {
      requestCount: apiRequests.length,
      avgResponseTime: `${avgResponseTime.toFixed(2)}ms`,
      slowestAPI: Math.max(...apiRequests.map(r => r.responseTime || 0))
    });
  });

  test('concurrent API load test', async ({ page, context }) => {
    const requests = [];

    // Make multiple pages to simulate concurrent users
    for (let i = 0; i < 5; i++) {
      const newPage = await context.newPage();
      requests.push(
        newPage.goto('/products').then(() =>
          newPage.waitForSelector('[data-testid="product-grid"]', { timeout: 10000 })
        )
      );
    }

    const startTime = Date.now();
    await Promise.all(requests);
    const totalTime = Date.now() - startTime;

    // System should handle concurrent load
    expect(totalTime).toBeLessThan(8000);

    console.log('Concurrent Load Performance:', {
      concurrentUsers: 5,
      totalTime,
      avgTimePerUser: totalTime / 5
    });
  });
});

test.describe('Caching Performance', () => {
  test('static asset caching', async ({ page }) => {
    const cachedRequests: any[] = [];

    page.on('response', response => {
      const cacheControl = response.headers()['cache-control'];
      if (cacheControl) {
        cachedRequests.push({
          url: response.url(),
          cacheControl,
          fromCache: response.fromServiceWorker()
        });
      }
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });

    // Reload to test caching
    await page.reload();
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });

    const cachableAssets = cachedRequests.filter(req =>
      req.cacheControl.includes('max-age') || req.cacheControl.includes('immutable')
    );

    console.log('Caching Performance:', {
      totalRequests: cachedRequests.length,
      cachableAssets: cachableAssets.length,
      cacheHitRatio: `${((cachableAssets.length / cachedRequests.length) * 100).toFixed(1)}%`
    });

    expect(cachableAssets.length).toBeGreaterThan(0);
  });
});