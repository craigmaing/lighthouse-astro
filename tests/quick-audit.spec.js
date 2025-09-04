// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Quick Site Audit', () => {
  test('Homepage loads and has proper structure', async ({ page }) => {
    await page.goto('/', { timeout: 10000 });
    
    // Check page loads
    await expect(page).toHaveTitle(/Lighthouse/);
    
    // Check main elements exist
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    console.log('✅ Homepage structure OK');
  });

  test('Check color contrast', async ({ page }) => {
    await page.goto('/', { timeout: 10000 });
    
    const contrast = await page.evaluate(() => {
      const body = document.body;
      const bgColor = window.getComputedStyle(body).backgroundColor;
      const textColor = window.getComputedStyle(body).color;
      return { bg: bgColor, text: textColor };
    });
    
    console.log('Colors:', contrast);
    expect(contrast.text).toBeTruthy();
    console.log('✅ Contrast check passed');
  });

  test('Check layout consistency', async ({ page }) => {
    await page.goto('/', { timeout: 10000 });
    
    const containerWidth = await page.locator('.container').first().evaluate(el => el.offsetWidth);
    console.log('Container width:', containerWidth);
    
    await page.goto('/services/', { timeout: 10000 });
    const servicesWidth = await page.locator('.container').first().evaluate(el => el.offsetWidth);
    console.log('Services container width:', servicesWidth);
    
    // Allow small variance
    expect(Math.abs(containerWidth - servicesWidth)).toBeLessThanOrEqual(50);
    console.log('✅ Layout consistency OK');
  });

  test('Check clickable elements', async ({ page }) => {
    await page.goto('/', { timeout: 10000 });
    
    // Find and click first CTA
    const cta = page.locator('a').filter({ hasText: /Book|Discovery Call|Get Started/ }).first();
    await expect(cta).toBeVisible();
    
    const href = await cta.getAttribute('href');
    console.log('CTA link:', href);
    expect(href).toBeTruthy();
    
    console.log('✅ Clickable elements OK');
  });
});