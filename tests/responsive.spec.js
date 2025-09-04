// @ts-check
import { test, expect } from '@playwright/test';

// Define test pages
const PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/services/', name: 'Services' },
  { path: '/wellbeing-audit/', name: 'Wellbeing Audit' },
  { path: '/contact/', name: 'Contact' }
];

// Viewport sizes for responsive testing
const VIEWPORTS = [
  { name: 'Mobile', width: 375, height: 812 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 }
];

test.describe('📱 Responsive Design Tests', () => {
  for (const viewport of VIEWPORTS) {
    test(`Pages render correctly at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      for (const pageInfo of PAGES) {
        await page.goto(pageInfo.path);
        
        // Check no horizontal scroll
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width);
        
        // Check main content is visible
        await expect(page.locator('main, section').first()).toBeVisible();
        
        // Check text is readable
        const bodyFontSize = await page.evaluate(() => {
          const body = document.querySelector('body');
          return window.getComputedStyle(body).fontSize;
        });
        const fontSize = parseInt(bodyFontSize);
        expect(fontSize).toBeGreaterThanOrEqual(14);
      }
    });
  }
  
  test('Navigation menu works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    // Mobile menu button should be visible
    const mobileMenuBtn = page.locator('#mobile-menu-button');
    await expect(mobileMenuBtn).toBeVisible();
    
    // Click and check menu opens
    await mobileMenuBtn.click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    
    // Check menu items are accessible
    const menuLinks = await page.locator('#mobile-menu a').count();
    expect(menuLinks).toBeGreaterThan(3);
  });
  
  test('Navigation works on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // Desktop nav should be visible
    await expect(page.locator('nav:not([aria-label="Mobile navigation"]) a[href="/services/"]').first()).toBeVisible();
    
    // Mobile menu button should be hidden
    const mobileMenuBtn = page.locator('#mobile-menu-button');
    await expect(mobileMenuBtn).toBeHidden();
  });
  
  test('Images are responsive', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 812 });
    const mobileImages = await page.locator('img').all();
    for (const img of mobileImages.slice(0, 3)) { // Test first 3 images
      const width = await img.evaluate((el) => el.clientWidth);
      expect(width).toBeLessThanOrEqual(375);
    }
    
    // Test desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopImages = await page.locator('img').all();
    for (const img of desktopImages.slice(0, 3)) { // Test first 3 images
      const naturalWidth = await img.evaluate((el) => el.naturalWidth);
      const displayWidth = await img.evaluate((el) => el.clientWidth);
      // Images should not be stretched beyond natural size
      if (naturalWidth > 0) {
        expect(displayWidth).toBeLessThanOrEqual(naturalWidth);
      }
    }
  });
  
  test('Container widths are consistent', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const containerWidths = new Set();
    for (const pageInfo of PAGES) {
      await page.goto(pageInfo.path);
      
      const containers = await page.locator('.container').all();
      for (const container of containers.slice(0, 2)) { // Check first 2 containers
        const width = await container.evaluate((el) => el.offsetWidth);
        if (width > 0) {
          containerWidths.add(width);
        }
      }
    }
    
    // Should have consistent container widths
    expect(containerWidths.size).toBeLessThanOrEqual(2); // Allow for hero and content containers
  });
});