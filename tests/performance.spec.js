// @ts-check
import { test, expect } from '@playwright/test';

const PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/services/', name: 'Services' },
  { path: '/wellbeing-audit/', name: 'Wellbeing Audit' },
  { path: '/iso-45003/', name: 'ISO 45003' },
  { path: '/contact/', name: 'Contact' }
];

test.describe('⚡ Performance Tests', () => {
  test('Pages load within acceptable time', async ({ page }) => {
    for (const pageInfo of PAGES) {
      const startTime = Date.now();
      await page.goto(pageInfo.path, { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;
      
      console.log(`${pageInfo.name} load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(3000); // 3 second max
    }
  });
  
  test('Images are optimized', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    for (const img of images.slice(0, 5)) { // Test first 5 images
      const src = await img.getAttribute('src');
      
      // Check for optimized format (allow PNG for logos, badges, and credential images)
      if (src && !src.includes('badge') && !src.includes('favicon') && !src.includes('logo') 
          && !src.includes('iod') && !src.includes('rsph') && !src.includes('finalist')) {
        expect(src).toMatch(/\.(webp|jpg|jpeg)$/i);
      }
      
      const naturalWidth = await img.evaluate((el) => el.naturalWidth);
      const displayWidth = await img.evaluate((el) => el.clientWidth);
      
      // Check images aren't extremely oversized (allow for responsive images)
      if (naturalWidth > 0 && displayWidth > 0) {
        expect(naturalWidth).toBeLessThanOrEqual(displayWidth * 30);
      }
      
      // Check lazy loading for below-fold images
      const loading = await img.getAttribute('loading');
      const isAboveFold = await img.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight;
      });
      
      if (!isAboveFold && !src?.includes('hero') && !src?.includes('badge') && !src?.includes('logo')) {
        expect(loading).toBe('lazy');
      }
    }
  });
  
  test('CSS and JS bundle sizes are reasonable', async ({ page }) => {
    const resourceSizes = [];
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('.css') || url.includes('.js')) {
        resourceSizes.push({
          url: url,
          size: response.headers()['content-length']
        });
      }
    });
    
    await page.goto('/');
    
    // Check that no single resource is too large
    for (const resource of resourceSizes) {
      if (resource.size) {
        const sizeInKB = parseInt(resource.size) / 1024;
        expect(sizeInKB).toBeLessThan(500); // 500KB max per resource
      }
    }
  });
  
  test('Pages use appropriate caching headers', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    
    // Check for cache control headers
    if (headers) {
      const cacheControl = headers['cache-control'];
      if (cacheControl) {
        expect(cacheControl).toContain('max-age');
      }
    }
  });
  
  test('No console errors on page load', async ({ page }) => {
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    for (const pageInfo of PAGES.slice(0, 3)) { // Test first 3 pages
      await page.goto(pageInfo.path);
      expect(errors.length).toBe(0);
    }
  });
  
  test('First Contentful Paint is fast', async ({ page }) => {
    await page.goto('/');
    
    const metrics = await page.evaluate(() => {
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      return fcp ? fcp.startTime : null;
    });
    
    if (metrics) {
      expect(metrics).toBeLessThan(1500); // 1.5 seconds
    }
  });
});