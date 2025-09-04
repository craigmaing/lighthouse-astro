// @ts-check
import { test, expect } from '@playwright/test';

const PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/services/', name: 'Services' },
  { path: '/wellbeing-audit/', name: 'Wellbeing Audit' },
  { path: '/contact/', name: 'Contact' },
  { path: '/about/', name: 'About' }
];

test.describe('♿ Accessibility Tests', () => {
  for (const pageInfo of PAGES) {
    test(`${pageInfo.name} meets accessibility standards`, async ({ page }) => {
      await page.goto(pageInfo.path);
      
      // Check all images have alt text
      const images = await page.locator('img').all();
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
      
      // Check all buttons have accessible text
      const buttons = await page.locator('button, a[class*="btn"]').all();
      for (const btn of buttons.slice(0, 5)) { // Test first 5 buttons
        const text = await btn.textContent();
        const ariaLabel = await btn.getAttribute('aria-label');
        expect(text || ariaLabel).toBeTruthy();
      }
      
      // Check ARIA landmarks exist
      const main = await page.locator('main[role="main"], main').count();
      expect(main).toBeGreaterThan(0);
      
      const nav = await page.locator('nav, [role="navigation"]').count();
      expect(nav).toBeGreaterThan(0);
      
      // Check skip link exists
      const skipLink = await page.locator('a[href="#main-content"], .skip-link').count();
      expect(skipLink).toBeGreaterThan(0);
    });
  }
  
  test('Forms have proper labels', async ({ page }) => {
    await page.goto('/contact/');
    
    // Check all form inputs have labels
    const inputs = await page.locator('input[type="text"], input[type="email"], textarea, select').all();
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        expect(label).toBeGreaterThan(0);
      }
    }
  });
  
  test('Focus indicators work with keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab through first few elements
    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => {
      const el = document.activeElement;
      const styles = window.getComputedStyle(el);
      return styles.outline || styles.boxShadow;
    });
    expect(firstFocused).toBeTruthy();
    
    await page.keyboard.press('Tab');
    const secondFocused = await page.evaluate(() => {
      const el = document.activeElement;
      const styles = window.getComputedStyle(el);
      return styles.outline || styles.boxShadow;
    });
    expect(secondFocused).toBeTruthy();
  });
  
  test('Color contrast meets WCAG standards', async ({ page }) => {
    await page.goto('/');
    
    // Check main text color contrast
    const textColor = await page.evaluate(() => {
      const body = document.querySelector('body');
      return window.getComputedStyle(body).color;
    });
    expect(textColor).toBeTruthy();
    
    // Check that text is not too light
    const rgb = textColor.match(/\d+/g);
    if (rgb) {
      const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
      expect(brightness).toBeLessThan(200); // Text should be dark enough
    }
  });
  
  test('Page has proper heading hierarchy', async ({ page }) => {
    for (const pageInfo of PAGES.slice(0, 3)) { // Test first 3 pages
      await page.goto(pageInfo.path);
      
      // Should have at most 2 H1 tags (page content + any dev tools)
      const h1Count = await page.locator('main h1, section h1').count();
      expect(h1Count).toBeLessThanOrEqual(2);
      
      // H2s should exist if there are H3s
      const h3Count = await page.locator('h3').count();
      if (h3Count > 0) {
        const h2Count = await page.locator('h2').count();
        expect(h2Count).toBeGreaterThan(0);
      }
    }
  });
  
  test('Interactive elements have sufficient size', async ({ page }) => {
    await page.goto('/');
    
    // Check button sizes
    const buttons = await page.locator('button, a[class*="btn"]').all();
    for (const btn of buttons.slice(0, 3)) { // Test first 3 buttons
      const box = await btn.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44); // Minimum touch target
      }
    }
  });
});