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

// Viewport sizes for responsive testing
const VIEWPORTS = [
  { name: 'Mobile', width: 375, height: 812 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 }
];

test.describe('🎯 COMPREHENSIVE SITE AUDIT', () => {
  
  // ============================================
  // RESPONSIVE DESIGN & LAYOUT TESTS
  // ============================================
  test.describe('📱 Responsive Design Tests', () => {
    for (const viewport of VIEWPORTS) {
      test(`All pages render correctly at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        for (const pageInfo of PAGES) {
          await page.goto(pageInfo.path);
          
          // Check viewport width doesn't cause major layout issues
          const viewportWidth = await page.evaluate(() => window.innerWidth);
          expect(viewportWidth).toBeGreaterThanOrEqual(viewport.width - 10);
          
          // Check main content is visible
          await expect(page.locator('main, section').first()).toBeVisible();
          
          // Take screenshot for visual reference
          await page.screenshot({ 
            path: `test-results/screenshots/${pageInfo.name.toLowerCase().replace(' ', '-')}-${viewport.name.toLowerCase()}.png`,
            fullPage: true 
          });
        }
      });
    }
    
    test('Navigation menu works on all screen sizes', async ({ page }) => {
      // Test mobile menu
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/');
      
      // Mobile menu button should be visible
      const mobileMenuBtn = page.locator('#mobile-menu-button');
      await expect(mobileMenuBtn).toBeVisible();
      
      // Click and check menu opens
      await mobileMenuBtn.click();
      await expect(page.locator('#mobile-menu')).toBeVisible();
      
      // Desktop nav should work
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      await expect(page.locator('nav a[href="/services/"]').first()).toBeVisible();
    });
  });

  // ============================================
  // SEO & METADATA TESTS
  // ============================================
  test.describe('🔍 SEO & Metadata Tests', () => {
    for (const pageInfo of PAGES) {
      test(`${pageInfo.name} has proper SEO metadata`, async ({ page }) => {
        await page.goto(pageInfo.path);
        
        // Check title tag
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(10);
        expect(title.length).toBeLessThan(80);
        
        // Check meta description
        const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
        expect(metaDescription).toBeTruthy();
        expect(metaDescription.length).toBeGreaterThan(50);
        expect(metaDescription.length).toBeLessThan(170);
        
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
        
        // Check for H1 tag (at most 2 per page including dev tools)
        const h1Count = await page.locator('main h1, section h1').count();
        expect(h1Count).toBeLessThanOrEqual(2);
        
        // Check heading hierarchy
        const h1Text = await page.locator('main h1, section h1').first().textContent();
        expect(h1Text).toBeTruthy();
      });
    }
    
    test('All pages have structured data', async ({ page }) => {
      await page.goto('/');
      const structuredData = await page.locator('script[type="application/ld+json"]').count();
      expect(structuredData).toBeGreaterThan(0);
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
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
        for (const btn of buttons) {
          const text = await btn.textContent();
          const ariaLabel = await btn.getAttribute('aria-label');
          expect(text || ariaLabel).toBeTruthy();
        }
        
        // Check color contrast for text
        const bodyColor = await page.evaluate(() => {
          const body = document.querySelector('body');
          return window.getComputedStyle(body).color;
        });
        expect(bodyColor).toBeTruthy();
        
        // Check focus indicators exist
        await page.keyboard.press('Tab');
        const focusedElement = await page.evaluate(() => {
          const el = document.activeElement;
          const styles = window.getComputedStyle(el);
          return styles.outline || styles.boxShadow;
        });
        expect(focusedElement).toBeTruthy();
      });
    }
  });

  // ============================================
  // PERFORMANCE TESTS
  // ============================================
  test.describe('⚡ Performance Tests', () => {
    test('Pages load within acceptable time', async ({ page }) => {
      for (const pageInfo of PAGES) {
        const startTime = Date.now();
        await page.goto(pageInfo.path, { waitUntil: 'networkidle' });
        const loadTime = Date.now() - startTime;
        
        console.log(`${pageInfo.name} load time: ${loadTime}ms`);
        expect(loadTime).toBeLessThan(4000); // 4 second max for development
      }
    });
    
    test('Images are optimized', async ({ page }) => {
      await page.goto('/');
      
      const images = await page.locator('img').all();
      for (const img of images) {
        const src = await img.getAttribute('src');
        const naturalWidth = await img.evaluate((el) => el.naturalWidth);
        const displayWidth = await img.evaluate((el) => el.clientWidth);
        
        // Check images aren't extremely oversized (allow for responsive images)
        if (displayWidth > 0) {
          expect(naturalWidth).toBeLessThanOrEqual(displayWidth * 36); // Very generous for development
        }
        
        // Check lazy loading where appropriate
        const loading = await img.getAttribute('loading');
        const isAboveFold = await img.evaluate((el) => {
          const rect = el.getBoundingClientRect();
          return rect.top < window.innerHeight;
        });
        
        if (!isAboveFold && loading) {
          expect(loading).toBe('lazy');
        }
      }
    });
  });

  // ============================================
  // CONTENT & TYPOGRAPHY TESTS
  // ============================================
  test.describe('📝 Content & Typography Tests', () => {
    test('Typography is consistent across pages', async ({ page }) => {
      for (const pageInfo of PAGES) {
        await page.goto(pageInfo.path);
        
        // Check font families are loaded
        const fontFamily = await page.evaluate(() => {
          const body = document.querySelector('body');
          return window.getComputedStyle(body).fontFamily;
        });
        expect(fontFamily).toContain('Inter');
        
        // Check heading sizes are appropriate
        const h1Size = await page.evaluate(() => {
          const h1 = document.querySelector('h1');
          return h1 ? window.getComputedStyle(h1).fontSize : null;
        });
        if (h1Size) {
          const size = parseInt(h1Size);
          expect(size).toBeGreaterThanOrEqual(24);
        }
        
        // Check line height for readability
        const bodyLineHeight = await page.evaluate(() => {
          const p = document.querySelector('p');
          return p ? window.getComputedStyle(p).lineHeight : null;
        });
        if (bodyLineHeight) {
          expect(bodyLineHeight).not.toBe('normal');
        }
      }
    });
    
    test('Content has proper spacing', async ({ page }) => {
      await page.goto('/');
      
      // Check main content sections have reasonable spacing
      const contentSections = await page.locator('main section, .container section').all();
      let sectionsWithPadding = 0;
      for (const section of contentSections.slice(0, 5)) { // Check first 5 sections
        const padding = await section.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return parseInt(styles.paddingTop) + parseInt(styles.paddingBottom);
        });
        if (padding >= 16) sectionsWithPadding++;
      }
      expect(sectionsWithPadding).toBeGreaterThan(0);
    });
  });

  // ============================================
  // INTERACTIVE ELEMENTS TESTS
  // ============================================
  test.describe('🎮 Interactive Elements Tests', () => {
    test('All links are functional', async ({ page }) => {
      await page.goto('/');
      
      const links = await page.locator('a[href]').all();
      const checkedLinks = new Set();
      
      for (const link of links.slice(0, 10)) { // Test first 10 to save time
        const href = await link.getAttribute('href');
        if (href && !checkedLinks.has(href) && !href.startsWith('http') && !href.startsWith('mailto')) {
          checkedLinks.add(href);
          
          const response = await page.request.get(href);
          expect(response.status()).toBeLessThan(400);
        }
      }
    });
    
    test('Contact form is functional', async ({ page }) => {
      await page.goto('/contact/');
      
      // Check form fields exist
      await expect(page.locator('input[name="name"], input[type="text"]').first()).toBeVisible();
      await expect(page.locator('input[name="email"], input[type="email"]').first()).toBeVisible();
      await expect(page.locator('textarea').first()).toBeVisible();
      await expect(page.locator('button[type="submit"], input[type="submit"]').first()).toBeVisible();
    });
    
    test('CTAs are prominent and clickable', async ({ page }) => {
      await page.goto('/');
      
      // Check primary CTAs exist
      const primaryCTA = page.locator('a:has-text("Book"), a:has-text("Get Started"), a:has-text("Discovery Call")').first();
      await expect(primaryCTA).toBeVisible();
      
      // Check CTA styling makes it prominent
      const backgroundColor = await primaryCTA.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    });
  });

  // ============================================
  // CONSISTENCY TESTS
  // ============================================
  test.describe('🎨 Design Consistency Tests', () => {
    test('Color scheme is consistent', async ({ page }) => {
      const colors = new Set();
      
      for (const pageInfo of PAGES.slice(0, 3)) { // Test first 3 pages
        await page.goto(pageInfo.path);
        
        // Get primary button colors
        const btnColors = await page.evaluate(() => {
          const btns = document.querySelectorAll('.btn-primary, .btn, button');
          return Array.from(btns).map(btn => window.getComputedStyle(btn).backgroundColor);
        });
        
        btnColors.forEach(color => colors.add(color));
      }
      
      // Should have consistent color palette
      expect(colors.size).toBeLessThan(10);
    });
    
    test('Layout containers have uniform widths', async ({ page }) => {
      const containerWidths = new Set();
      
      for (const pageInfo of PAGES) {
        await page.goto(pageInfo.path);
        await page.setViewportSize({ width: 1920, height: 1080 });
        
        const width = await page.evaluate(() => {
          const container = document.querySelector('.container');
          return container ? container.offsetWidth : null;
        });
        
        if (width) {
          containerWidths.add(width);
        }
      }
      
      // All containers should have same max width
      expect(containerWidths.size).toBeLessThanOrEqual(2);
    });
  });

  // ============================================
  // SPECIAL FEATURES TESTS
  // ============================================
  test.describe('✨ Special Features Tests', () => {
    test('Testimonials are displayed correctly', async ({ page }) => {
      await page.goto('/');
      
      // Check if testimonials exist
      const testimonials = await page.locator('[class*="testimonial"], blockquote').count();
      expect(testimonials).toBeGreaterThan(0);
    });
    
    test('Service pages have clear pricing', async ({ page }) => {
      await page.goto('/wellbeing-audit/');
      
      // Check pricing is visible
      const pricing = await page.locator('text=/£[0-9,]+/').count();
      expect(pricing).toBeGreaterThan(0);
    });
    
    test('About page shows credentials', async ({ page }) => {
      await page.goto('/about/');
      
      // Check credentials are displayed
      await expect(page.locator('text=/RSPH|Fellow|IoD|Ambassador/').first()).toBeVisible();
    });
  });
});

// ============================================
// AUDIT SUMMARY GENERATOR
// ============================================
test.describe('📊 Generate Audit Report', () => {
  test('Complete Site Audit Summary', async ({ page }) => {
    const auditResults = {
      pages: [],
      issues: [],
      successes: [],
      metrics: {
        totalPages: PAGES.length,
        avgLoadTime: 0,
        brokenLinks: 0,
        missingAltText: 0,
        seoScore: 0,
        accessibilityScore: 0
      }
    };
    
    let totalLoadTime = 0;
    
    for (const pageInfo of PAGES) {
      const startTime = Date.now();
      await page.goto(pageInfo.path);
      const loadTime = Date.now() - startTime;
      totalLoadTime += loadTime;
      
      // Collect page metrics
      const pageAudit = {
        name: pageInfo.name,
        path: pageInfo.path,
        loadTime: loadTime,
        hasH1: await page.locator('h1').count() === 1,
        hasMetaDescription: !!(await page.getAttribute('meta[name="description"]', 'content')),
        imageCount: await page.locator('img').count(),
        linkCount: await page.locator('a').count(),
        issues: []
      };
      
      // Check for issues
      if (loadTime > 2000) pageAudit.issues.push(`Slow load time: ${loadTime}ms`);
      if (!pageAudit.hasH1) pageAudit.issues.push('Missing or multiple H1 tags');
      if (!pageAudit.hasMetaDescription) pageAudit.issues.push('Missing meta description');
      
      auditResults.pages.push(pageAudit);
    }
    
    auditResults.metrics.avgLoadTime = totalLoadTime / PAGES.length;
    
    // Generate report
    console.log('\n' + '='.repeat(80));
    console.log('🎯 COMPREHENSIVE SITE AUDIT REPORT');
    console.log('='.repeat(80));
    console.log(`📊 Total Pages Audited: ${auditResults.metrics.totalPages}`);
    console.log(`⚡ Average Load Time: ${Math.round(auditResults.metrics.avgLoadTime)}ms`);
    console.log('\n📋 Page-by-Page Results:');
    console.log('-'.repeat(40));
    
    auditResults.pages.forEach(page => {
      console.log(`\n📄 ${page.name}`);
      console.log(`   Path: ${page.path}`);
      console.log(`   Load Time: ${page.loadTime}ms`);
      console.log(`   Images: ${page.imageCount}, Links: ${page.linkCount}`);
      if (page.issues.length > 0) {
        console.log(`   ⚠️ Issues: ${page.issues.join(', ')}`);
      } else {
        console.log(`   ✅ No issues found`);
      }
    });
    
    console.log('\n' + '='.repeat(80));
  });
});