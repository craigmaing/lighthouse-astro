// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('has title', async ({ page }) => {
    await page.goto('/');
    
    // Expect the page to have correct title
    await expect(page).toHaveTitle(/Wellbeing Audit & ISO 45003 Specialist/);
  });

  test('displays hero section', async ({ page }) => {
    await page.goto('/');
    
    // Check hero heading is visible - be specific to avoid other h1 elements
    const heroHeading = page.locator('h1').first();
    await expect(heroHeading).toContainText('Human+AI Wellbeing Audits');
  });

  test('shows pricing packages', async ({ page }) => {
    await page.goto('/');
    
    // Check pricing packages are displayed
    await expect(page.locator('h3:has-text("Foundation")').first()).toBeVisible();
    await expect(page.locator('text=£3,450')).toBeVisible();
    await expect(page.locator('h3:has-text("Standard")')).toBeVisible();
    await expect(page.locator('text=£5,950')).toBeVisible();
    await expect(page.locator('h3:has-text("Advanced")')).toBeVisible();
    await expect(page.locator('text=£8,950')).toBeVisible();
  });

  test('displays testimonials', async ({ page }) => {
    await page.goto('/');
    
    // Check testimonials section exists
    await expect(page.locator('text=What Leaders Say About Working With Craig')).toBeVisible();
    await expect(page.locator('text=Richard Sharpe')).toBeVisible();
  });

  test('shows credentials', async ({ page }) => {
    await page.goto('/');
    
    // Check credentials are displayed - be more specific with selectors
    await expect(page.locator('p:has-text("RSPH Fellow")').first()).toBeVisible();
    await expect(page.locator('p:has-text("IoD Ambassador")').first()).toBeVisible();
  });

  test('contact button works', async ({ page }) => {
    await page.goto('/');
    
    // Click contact button
    await page.locator('text=Book Free Discovery Call').first().click();
    
    // Should navigate to contact page
    await expect(page).toHaveURL('/contact/');
  });
});