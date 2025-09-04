# 🎯 COMPLETE QA TODO LIST - Lighthouse Mentoring Website
**Generated**: September 4, 2025  
**Total Tests**: 470 (across Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)  
**Test Suite**: Full Playwright Test Coverage

---

## 🚨 CRITICAL FAILURES - PRIORITY 1 (Fix Immediately)

### 🔍 SEO & Metadata Issues (13+ failures across all browsers)

#### Title Tag Length Issues (>70 characters)
- [ ] **Homepage** - 74 chars → Shorten to <70
  - Current: "Workplace Wellbeing Audit & ISO 45003 Consultant UK | Lighthouse Mentoring"
  - Fix: "ISO 45003 Wellbeing Audit Consultant UK | Lighthouse Mentoring" (63 chars)
  
- [ ] **ISO 45003 Page** - 74 chars → Shorten to <70
  - Current: "ISO 45003 Standard for UK Workplaces | Lighthouse Mentoring Compliance"
  - Fix: "ISO 45003 Workplace Compliance UK | Lighthouse Mentoring" (57 chars)

- [ ] **Psychosocial Hazards Page** - 77 chars → Shorten to <70
  - Current title too long
  - Fix: "Psychosocial Hazards Assessment UK | Lighthouse Mentoring" (58 chars)

- [ ] **Contact Page** - 76 chars → Shorten to <70
  - Current title too long
  - Fix: "Contact Lighthouse Mentoring | Wellbeing Audit Experts UK" (58 chars)

#### Meta Description Length Issues (>160 characters)
- [ ] **Stress Risk Assessment** - 168 chars → Shorten to <160
  - Reduce by 8+ characters

- [ ] **Our Approach Page** - 167 chars → Shorten to <160
  - Reduce by 7+ characters

#### Multiple H1 Tags Issue (Should only have 1 per page)
- [ ] **Services Page** - Has 5 H1 tags → Fix to have only 1
  - File: `src/pages/services.astro`
  - Change other H1s to H2 or H3 as appropriate

- [ ] **Wellbeing Audit Page** - Has 5 H1 tags → Fix to have only 1
  - File: `src/pages/wellbeing-audit.astro`

- [ ] **Insights Page** - Has 5 H1 tags → Fix to have only 1
  - File: `src/pages/insights.astro`

- [ ] **About Page** - Has 5 H1 tags → Fix to have only 1
  - File: `src/pages/about.astro`

- [ ] **Homepage** - Has 5 H1 tags → Fix to have only 1
  - File: `src/pages/index.astro`
  - Keep main H1, change others to H2

### 📱 Responsive Design Failures (Critical for Mobile Users)

#### Horizontal Scroll Issues
- [ ] **Mobile View (375px)** - Body width 568px exceeds viewport
  - Fix: Check all container widths, remove fixed widths
  - Add `overflow-x: hidden` to body
  - Check for elements with absolute positioning

- [ ] **Tablet View (768px)** - Body width 980px exceeds viewport
  - Fix: Review all max-widths on containers
  - Check grid layouts for overflow
  - Ensure all images are responsive

#### Navigation Issues
- [ ] **Navigation Menu Multiple Elements** - Selector finds 4 elements instead of 1
  - Fix: Make navigation selectors more specific
  - File: `src/components/Navigation.astro`
  - Issue: Dropdown and mobile menu creating duplicates

---

## ⚠️ IMPORTANT FAILURES - PRIORITY 2

### ♿ Accessibility Issues

#### Heading Hierarchy
- [ ] **Fix heading hierarchy violations** 
  - Pages must follow H1 → H2 → H3 order
  - No skipping levels
  - Only one H1 per page
  - Files: All page files in `src/pages/`

### ⚡ Performance Issues

#### Page Load Times
- [ ] **Stress Risk Assessment Page** - 3439ms (exceeds 3000ms limit)
  - Optimize images
  - Check for large JavaScript bundles
  - Consider lazy loading content

#### Image Optimization
- [ ] **Images are oversized** - Natural width 1123px but display width only 40px
  - Serve appropriately sized images
  - Use srcset for responsive images
  - Implement proper image optimization pipeline

### 📝 Content & Typography Issues

- [ ] **Content Spacing Issue** - Padding value is 0, should be >=16px
  - Check all section padding
  - Review container spacing
  - Fix: Add proper padding to content sections

### ✨ Special Features

- [ ] **About Page Credentials** - Not displaying properly
  - Fix credential badges visibility
  - Check z-index and positioning

---

## 📊 TEST RESULTS SUMMARY

### By Browser Coverage:
- **Chromium**: ~17 failures
- **Firefox**: Similar failure pattern
- **WebKit**: Similar failure pattern  
- **Mobile Chrome**: Additional mobile-specific issues
- **Mobile Safari**: Additional mobile-specific issues

### By Category:
1. **SEO Issues**: 13+ failures (most critical)
2. **Responsive Design**: 3-5 failures (high impact)
3. **Accessibility**: 1-2 failures
4. **Performance**: 2-3 failures
5. **Content/Typography**: 1-2 failures
6. **Special Features**: 1-2 failures

### Overall Statistics:
- **Total Unique Issues**: ~25-30
- **Cross-browser Issues**: ~15-20 (fail on all browsers)
- **Browser-specific Issues**: ~5-10
- **Estimated Pass Rate**: ~85-90% (good but needs improvement)

---

## 🔧 FIXES BY FILE

### `src/pages/index.astro`
- [ ] Fix title length (74 → <70 chars)
- [ ] Fix multiple H1 tags (5 → 1)
- [ ] Fix mobile horizontal scroll

### `src/pages/services.astro`
- [ ] Fix multiple H1 tags (5 → 1)
- [ ] Review responsive layout

### `src/pages/wellbeing-audit.astro`
- [ ] Fix multiple H1 tags (5 → 1)

### `src/pages/about.astro`
- [ ] Fix multiple H1 tags (5 → 1)
- [ ] Fix credentials display issue

### `src/pages/stress-risk-assessment.astro`
- [ ] Fix meta description length (168 → <160)
- [ ] Optimize page load time (3439ms → <3000ms)

### `src/pages/psychosocial-hazards.astro`
- [ ] Fix title length (77 → <70)

### `src/pages/iso-45003.astro`
- [ ] Fix title length (74 → <70)

### `src/pages/our-approach.astro`
- [ ] Fix meta description length (167 → <160)

### `src/pages/contact.astro`
- [ ] Fix title length (76 → <70)

### `src/pages/insights.astro`
- [ ] Fix multiple H1 tags (5 → 1)

### `src/components/Navigation.astro`
- [ ] Fix duplicate navigation elements issue
- [ ] Ensure unique selectors for testing

### `src/layouts/Layout.astro`
- [ ] Review and fix structured data type if needed

---

## ✅ WHAT'S WORKING WELL

### Passing Tests:
- ✅ Forms have proper labels
- ✅ Color contrast meets WCAG standards
- ✅ Interactive elements have sufficient size
- ✅ Focus indicators work properly
- ✅ Skip links functional
- ✅ Desktop rendering (1920x1080)
- ✅ Mobile navigation menu (mostly)
- ✅ Images are responsive (mostly)
- ✅ Container widths consistent
- ✅ CSS/JS bundle sizes acceptable
- ✅ Proper caching headers
- ✅ No console errors
- ✅ Fast First Contentful Paint
- ✅ All pages have structured data
- ✅ Language attributes present

---

## 🎯 SUCCESS METRICS

After fixing all issues, achieve:
- [ ] 100% SEO tests passing (currently ~25%)
- [ ] 100% Responsive tests passing (currently ~60%)
- [ ] 100% Accessibility tests passing (currently ~90%)
- [ ] 100% Performance tests passing (currently ~80%)
- [ ] All 470 tests passing
- [ ] No horizontal scroll on any viewport
- [ ] All pages load in <3 seconds
- [ ] Lighthouse scores >95 for all metrics

---

## 🚀 RECOMMENDED FIX ORDER

### Day 1 - Quick Wins (2-3 hours)
1. Fix all title/meta description lengths (30 mins)
2. Fix multiple H1 tags on all pages (1 hour)
3. Fix content padding issue (30 mins)
4. Fix navigation selector issue (30 mins)

### Day 2 - Responsive Fixes (3-4 hours)
5. Fix horizontal scroll on mobile (1-2 hours)
6. Fix horizontal scroll on tablet (1-2 hours)
7. Test across all viewports

### Day 3 - Performance & Polish (2-3 hours)
8. Optimize images properly (1 hour)
9. Fix page load time issues (1 hour)
10. Fix credentials display (30 mins)
11. Final testing and verification

---

## 🧪 TESTING COMMANDS

```bash
# Run all tests
npm run test

# Run specific browser tests
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run specific test categories
npx playwright test tests/seo.spec.js
npx playwright test tests/responsive.spec.js
npx playwright test tests/accessibility.spec.js
npx playwright test tests/performance.spec.js
npx playwright test tests/comprehensive-audit.spec.js

# Debug specific failures
npx playwright test --debug
npx playwright test --ui

# Generate and view report
npx playwright show-report
```

---

## 📝 NOTES

- Most failures are consistent across all browsers (good - means fixes will work everywhere)
- SEO issues are the most prevalent and easiest to fix
- Responsive issues are critical for mobile users
- Performance is generally good except for one page
- The site has a strong foundation - these are mostly polish issues
- Estimated total fix time: 8-10 hours for all issues

---

**End of Complete QA Todo List**