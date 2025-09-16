import { test, expect } from '@playwright/test';

/**
 * Performance Benchmarking Tests for Vendor Operations
 * Monitors and validates performance metrics for vendor functionality
 */

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  totalBlockingTime: number;
  cumulativeLayoutShift: number;
}

async function getPerformanceMetrics(page: any): Promise<PerformanceMetrics> {
  return await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');

    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

    return {
      loadTime: navigation.loadEventEnd - navigation.navigationStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
      firstContentfulPaint: fcp,
      largestContentfulPaint: 0, // Will be measured separately
      totalBlockingTime: 0, // Will be measured separately
      cumulativeLayoutShift: 0, // Will be measured separately
    };
  });
}

test.describe('Vendor Dashboard Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('clerk-user', JSON.stringify({
        id: 'vendor-123',
        publicMetadata: { role: 'vendor' }
      }));
    });
  });

  test('dashboard loads within performance budget', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/vendor/dashboard');
    await page.waitForSelector('[data-testid="vendor-dashboard"]', { timeout: 10000 });

    const loadTime = Date.now() - startTime;
    const metrics = await getPerformanceMetrics(page);

    // Performance assertions
    expect(loadTime).toBeLessThan(3000); // Page should load within 3 seconds
    expect(metrics.domContentLoaded).toBeLessThan(2000); // DOM ready within 2 seconds
    expect(metrics.firstContentfulPaint).toBeLessThan(1500); // FCP within 1.5 seconds

    console.log('Dashboard Performance Metrics:', {
      loadTime,
      ...metrics
    });
  });

  test('dashboard with large dataset performance', async ({ page }) => {
    // Mock large dataset
    await page.route('**/api/vendor/dashboard**', async route => {
      const largeDataset = {
        analytics: {
          revenue: { total: 15000, thisMonth: 2500, lastMonth: 2200 },
          orders: { total: 150, pending: 12, completed: 138 },
          products: { total: 500, active: 450, draft: 30, sold: 20 },
          customers: { total: 85, returning: 45, new: 40, satisfactionRate: 92 }
        },
        recentOrders: Array.from({ length: 100 }, (_, i) => ({
          id: `order-${i}`,
          customerName: `Customer ${i}`,
          total: Math.random() * 500,
          status: ['pending', 'completed', 'shipped'][Math.floor(Math.random() * 3)],
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        })),
        topProducts: Array.from({ length: 50 }, (_, i) => ({
          id: `product-${i}`,
          name: `Top Product ${i}`,
          sales: Math.floor(Math.random() * 100),
          revenue: Math.random() * 1000
        }))
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: largeDataset })
      });
    });

    const startTime = Date.now();
    await page.goto('/vendor/dashboard');
    await page.waitForSelector('[data-testid="vendor-dashboard"]', { timeout: 15000 });

    const loadTime = Date.now() - startTime;

    // Performance should remain acceptable even with large datasets
    expect(loadTime).toBeLessThan(5000); // Allow more time for large dataset

    console.log('Large Dataset Performance:', { loadTime });
  });

  test('dashboard memory usage', async ({ page, context }) => {
    await page.goto('/vendor/dashboard');
    await page.waitForSelector('[data-testid="vendor-dashboard"]', { timeout: 10000 });

    // Get memory usage
    const memoryUsage = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : null;
    });

    if (memoryUsage) {
      // Memory usage should be reasonable (less than 50MB)
      expect(memoryUsage.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024);
      console.log('Memory Usage:', memoryUsage);
    }
  });
});

test.describe('Product Management Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('clerk-user', JSON.stringify({
        id: 'vendor-123',
        publicMetadata: { role: 'vendor' }
      }));
    });
  });

  test('products page loads efficiently', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/vendor/products');
    await page.waitForSelector('[data-testid="products-table"]', { timeout: 10000 });

    const loadTime = Date.now() - startTime;
    const metrics = await getPerformanceMetrics(page);

    expect(loadTime).toBeLessThan(3000);
    expect(metrics.domContentLoaded).toBeLessThan(2000);

    console.log('Products Page Performance:', { loadTime, ...metrics });
  });

  test('product creation form performance', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/vendor/products/new');
    await page.waitForSelector('form[data-testid="product-form"]', { timeout: 10000 });

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(2500);
    console.log('Product Form Load Time:', loadTime);
  });

  test('form submission performance', async ({ page }) => {
    await page.goto('/vendor/products/new');
    await page.waitForSelector('form[data-testid="product-form"]', { timeout: 10000 });

    // Fill form
    await page.fill('input[name="name"]', 'Performance Test Product');
    await page.fill('textarea[name="description"]', 'Test description');
    await page.fill('input[name="price"]', '29.99');

    const startTime = Date.now();
    await page.click('button[type="submit"]');

    // Wait for submission response
    await page.waitForSelector('.toast-success, .toast-error', { timeout: 10000 });

    const submissionTime = Date.now() - startTime;

    // Form submission should be fast
    expect(submissionTime).toBeLessThan(2000);
    console.log('Form Submission Time:', submissionTime);
  });
});

test.describe('Search and Filter Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('clerk-user', JSON.stringify({
        id: 'vendor-123',
        publicMetadata: { role: 'vendor' }
      }));
    });

    // Mock large product dataset
    await page.route('**/api/vendor/products**', async route => {
      const products = Array.from({ length: 1000 }, (_, i) => ({
        id: `product-${i}`,
        name: `Product ${i}`,
        description: `Description for product ${i}`,
        price: Math.random() * 500,
        category: ['trading-cards', 'comics', 'toys'][Math.floor(Math.random() * 3)],
        status: ['active', 'draft', 'sold'][Math.floor(Math.random() * 3)],
        views: Math.floor(Math.random() * 1000),
        wishlisted: Math.floor(Math.random() * 50)
      }));

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: products })
      });
    });
  });

  test('search performance with large dataset', async ({ page }) => {
    await page.goto('/vendor/products');
    await page.waitForSelector('[data-testid="products-table"]', { timeout: 10000 });

    const searchInput = page.getByPlaceholder('Search products...');

    const startTime = Date.now();
    await searchInput.fill('Product 50');

    // Wait for search results
    await page.waitForTimeout(500); // Allow for debouncing

    const searchTime = Date.now() - startTime;

    // Search should be responsive
    expect(searchTime).toBeLessThan(1000);
    console.log('Search Performance:', searchTime);
  });

  test('filter performance', async ({ page }) => {
    await page.goto('/vendor/products');
    await page.waitForSelector('[data-testid="products-table"]', { timeout: 10000 });

    const startTime = Date.now();

    // Apply filters
    await page.click('[data-testid="status-filter-active"]');
    await page.waitForTimeout(300);

    const filterTime = Date.now() - startTime;

    expect(filterTime).toBeLessThan(500);
    console.log('Filter Performance:', filterTime);
  });
});

test.describe('API Performance Tests', () => {
  test('vendor stats API performance', async ({ request }) => {
    const startTime = Date.now();

    const response = await request.get('/api/vendor/stats', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });

    const responseTime = Date.now() - startTime;

    expect(response.ok()).toBeTruthy();
    expect(responseTime).toBeLessThan(1000); // API should respond within 1 second

    console.log('API Response Time:', responseTime);
  });

  test('concurrent API requests performance', async ({ request }) => {
    const startTime = Date.now();

    // Make multiple concurrent requests
    const requests = [
      request.get('/api/vendor/dashboard'),
      request.get('/api/vendor/products'),
      request.get('/api/vendor/orders'),
      request.get('/api/vendor/analytics'),
      request.get('/api/vendor/stats')
    ];

    const responses = await Promise.all(requests);
    const totalTime = Date.now() - startTime;

    // All requests should complete
    responses.forEach(response => {
      expect(response.ok()).toBeTruthy();
    });

    // Concurrent requests should be handled efficiently
    expect(totalTime).toBeLessThan(3000);

    console.log('Concurrent API Performance:', {
      totalTime,
      requestCount: requests.length,
      averageTime: totalTime / requests.length
    });
  });
});

test.describe('Bundle Size and Network Performance', () => {
  test('JavaScript bundle size analysis', async ({ page }) => {
    const networkRequests: any[] = [];

    page.on('response', response => {
      if (response.url().includes('.js') || response.url().includes('.css')) {
        networkRequests.push({
          url: response.url(),
          size: response.headers()['content-length'],
          type: response.url().includes('.js') ? 'javascript' : 'css'
        });
      }
    });

    await page.goto('/vendor/dashboard');
    await page.waitForSelector('[data-testid="vendor-dashboard"]', { timeout: 10000 });

    const jsSize = networkRequests
      .filter(req => req.type === 'javascript')
      .reduce((total, req) => total + (parseInt(req.size) || 0), 0);

    const cssSize = networkRequests
      .filter(req => req.type === 'css')
      .reduce((total, req) => total + (parseInt(req.size) || 0), 0);

    console.log('Bundle Analysis:', {
      jsSize: `${(jsSize / 1024).toFixed(2)}KB`,
      cssSize: `${(cssSize / 1024).toFixed(2)}KB`,
      totalRequests: networkRequests.length
    });

    // Bundle size should be reasonable
    expect(jsSize).toBeLessThan(2 * 1024 * 1024); // Less than 2MB JS
    expect(cssSize).toBeLessThan(500 * 1024); // Less than 500KB CSS
  });

  test('network waterfall optimization', async ({ page }) => {
    const requests: any[] = [];
    const startTime = Date.now();

    page.on('response', response => {
      requests.push({
        url: response.url(),
        timing: Date.now() - startTime,
        status: response.status()
      });
    });

    await page.goto('/vendor/dashboard');
    await page.waitForSelector('[data-testid="vendor-dashboard"]', { timeout: 10000 });

    // Analyze request timing
    const criticalRequests = requests.filter(req =>
      req.url.includes('dashboard') ||
      req.url.includes('vendor') ||
      req.url.includes('_next')
    );

    console.log('Network Waterfall:', {
      totalRequests: requests.length,
      criticalRequests: criticalRequests.length,
      fastestRequest: Math.min(...requests.map(r => r.timing)),
      slowestRequest: Math.max(...requests.map(r => r.timing))
    });

    // Critical requests should complete quickly
    const avgCriticalTiming = criticalRequests.reduce((sum, req) => sum + req.timing, 0) / criticalRequests.length;
    expect(avgCriticalTiming).toBeLessThan(2000);
  });
});

test.describe('Stress Testing', () => {
  test('rapid navigation stress test', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('clerk-user', JSON.stringify({
        id: 'vendor-123',
        publicMetadata: { role: 'vendor' }
      }));
    });

    const pages = [
      '/vendor/dashboard',
      '/vendor/products',
      '/vendor/products/new',
      '/vendor/analytics',
      '/vendor/orders'
    ];

    const startTime = Date.now();

    // Rapidly navigate between pages
    for (let i = 0; i < 10; i++) {
      const pageUrl = pages[i % pages.length];
      await page.goto(pageUrl);
      await page.waitForLoadState('domcontentloaded');
    }

    const totalTime = Date.now() - startTime;

    // Application should remain responsive during rapid navigation
    expect(totalTime).toBeLessThan(30000); // Should complete within 30 seconds

    console.log('Rapid Navigation Stress Test:', {
      totalNavigations: 10,
      totalTime,
      averageTime: totalTime / 10
    });
  });

  test('memory leak detection', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('clerk-user', JSON.stringify({
        id: 'vendor-123',
        publicMetadata: { role: 'vendor' }
      }));
    });

    let initialMemory: any = null;

    // Navigate multiple times to detect memory leaks
    for (let i = 0; i < 5; i++) {
      await page.goto('/vendor/dashboard');
      await page.waitForSelector('[data-testid="vendor-dashboard"]', { timeout: 10000 });

      const currentMemory = await page.evaluate(() => {
        return (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize
        } : null;
      });

      if (i === 0) {
        initialMemory = currentMemory;
      } else if (currentMemory && initialMemory) {
        const memoryGrowth = currentMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
        console.log(`Memory after ${i + 1} navigations:`, {
          current: `${(currentMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
          growth: `${(memoryGrowth / 1024 / 1024).toFixed(2)}MB`
        });

        // Memory growth should be reasonable
        expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024); // Less than 10MB growth
      }
    }
  });
});