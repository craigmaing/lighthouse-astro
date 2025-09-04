# QA Todo List - Lighthouse Mentoring Website
Generated: September 4, 2025

## 🚨 Critical Issues (Priority 1)

### SEO Failures
- [ ] **Fix Homepage title length** - Currently 74 chars, must be < 70 chars
  - Current: "Workplace Wellbeing Audit & ISO 45003 Consultant UK | Lighthouse Mentoring"
  - Suggested: "ISO 45003 Wellbeing Audit Consultant UK | Lighthouse Mentoring"

- [ ] **Fix multiple H1 tags on Services page** - Found 5 H1 tags, should only have 1
  - Review src/pages/services.astro
  - Ensure only one H1 per page

- [ ] **Fix meta descriptions that are too long** (>160 chars)
  - Stress Risk Assessment page: 168 chars
  - Psychosocial Hazards page: Check length
  - ISO 45003 page: Check length

- [ ] **Fix structured data type mismatch**
  - Expected: "Organization" 
  - Found: "ProfessionalService"
  - Update Layout.astro structured data

### Responsive Design Failures
- [ ] **Fix horizontal scroll on tablet (768px)**
  - Body width (980px) exceeds viewport (768px)
  - Check container widths and overflow issues

- [ ] **Fix horizontal scroll on mobile (375px)**
  - Body width exceeds viewport
  - Review mobile-specific styles

- [ ] **Fix navigation dropdown on desktop**
  - Dropdown menu not functioning properly
  - Check Navigation.astro component

## ⚠️ Important Issues (Priority 2)

### Accessibility Issues
- [ ] **Fix heading hierarchy issues**
  - Multiple H1 tags detected on homepage
  - Ensure proper H1 > H2 > H3 hierarchy
  - No skipping heading levels

### Performance Issues
- [ ] **Optimize images that are not properly compressed**
  - Some images still not fully optimized
  - Check WebP implementation
  - Verify lazy loading is working

### Content Issues
- [ ] **Fix content spacing issues**
  - Inconsistent padding/margins detected
  - Review typography spacing

- [ ] **Verify About page credentials display**
  - Credentials section may not be showing properly
  - Check badges and certifications visibility

## ✅ Tests Currently Passing

### Accessibility (90% pass rate)
- ✅ Forms have proper labels
- ✅ Color contrast meets WCAG standards  
- ✅ Interactive elements have sufficient size
- ✅ Focus indicators work properly
- ✅ Skip links functional

### Performance
- ✅ Pages load within 3 seconds
- ✅ CSS/JS bundle sizes acceptable
- ✅ Proper caching headers
- ✅ No console errors
- ✅ Fast First Contentful Paint

### Responsive Design
- ✅ Desktop rendering (1920x1080)
- ✅ Mobile navigation menu
- ✅ Images are responsive
- ✅ Container widths consistent

### SEO
- ✅ Language attributes present
- ✅ Some pages have proper metadata
- ✅ Structured data present (but wrong type)

## 📋 Test Summary
- **Total Test Categories**: 5 (Accessibility, SEO, Responsive, Performance, Comprehensive)
- **Critical Failures**: ~15-20 tests
- **Pass Rate**: Approximately 70-75%
- **Most Problematic Area**: SEO metadata and responsive design

## 🔧 Recommended Fix Order
1. SEO title/description lengths (quick fixes)
2. Multiple H1 tags issue
3. Responsive viewport issues
4. Structured data type
5. Navigation dropdown
6. Heading hierarchy
7. Image optimization
8. Content spacing

## 🎯 Testing Commands
```bash
# Run all tests
npm run test

# Run specific test suites
npx playwright test tests/seo.spec.js --project=chromium
npx playwright test tests/responsive.spec.js --project=chromium
npx playwright test tests/accessibility.spec.js --project=chromium
npx playwright test tests/performance.spec.js --project=chromium

# Run with UI mode for debugging
npx playwright test --ui

# Generate HTML report
npx playwright show-report
```

## 📊 Success Metrics
After fixes, we should achieve:
- [ ] 100% SEO tests passing
- [ ] 100% Accessibility tests passing
- [ ] 100% Responsive tests passing
- [ ] All Lighthouse scores > 90
- [ ] No horizontal scroll on any viewport
- [ ] Proper heading hierarchy on all pages