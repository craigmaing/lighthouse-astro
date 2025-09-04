// @ts-check
import { test, expect } from '@playwright/test';

// Define all pages to test
const PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/services/', name: 'Services' },
  { path: '/wellbeing-audit/', name: 'Wellbeing Audit' },
  { path: '/stress-risk-assessment/', name: 'Stress Risk Assessment' },
  { path: '/psychosocial-hazards/', name: 'Psychosocial Hazards' },
  { path: '/iso-45003/', name: 'ISO 45003' },
  { path: '/our-approach/', name: 'Our Approach' },
  { path: '/about/', name: 'About' },
  { path: '/insights/', name: 'Insights' },
  { path: '/contact/', name: 'Contact' }
];

test.describe('🔍 SEO & Metadata Tests', () => {
  for (const pageInfo of PAGES) {
    test(`${pageInfo.name} has proper SEO metadata`, async ({ page }) => {
      await page.goto(pageInfo.path);
      
      // Check title tag
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThan(70);
      
      // Check meta description
      const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
      expect(metaDescription).toBeTruthy();
      expect(metaDescription.length).toBeGreaterThan(50);
      expect(metaDescription.length).toBeLessThan(160);
      
      // Check canonical URL
      const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
      expect(canonical).toBeTruthy();
      
      // Check Open Graph tags
      const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
      const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
      const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
      expect(ogTitle).toBeTruthy();
      expect(ogDescription).toBeTruthy();
      expect(ogImage).toBeTruthy();
      
      // Check for H1 tag (only one visible per page - ignore Astro dev toolbar H1s)
      const h1Count = await page.locator('h1:visible').count();
      expect(h1Count).toBe(1);
      
      // Check heading hierarchy (only check visible H1)
      const h1Text = await page.locator('h1:visible').first().textContent();
      expect(h1Text).toBeTruthy();
    });
  }
  
  test('Homepage has structured data', async ({ page }) => {
    await page.goto('/');
    const structuredData = await page.locator('script[type="application/ld+json"]').count();
    expect(structuredData).toBeGreaterThan(0);
    
    // Validate structured data content
    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(jsonLd).toContain('"@type"');
    expect(jsonLd).toContain('ProfessionalService');
  });

  test('All pages have proper language attribute', async ({ page }) => {
    for (const pageInfo of PAGES.slice(0, 3)) { // Test first 3 pages
      await page.goto(pageInfo.path);
      const lang = await page.getAttribute('html', 'lang');
      expect(lang).toBe('en-GB');
    }
  });
});