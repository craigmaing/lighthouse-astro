import { chromium } from 'playwright';

async function findOverflowElements() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // iPhone X viewport
    deviceScaleFactor: 1,
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🔍 Starting overflow diagnostic...');
    console.log('📱 Viewport set to 375px width (mobile)');
    
    // Navigate to the homepage
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    console.log('✅ Page loaded successfully');
    
    // Wait a bit for any lazy loading
    await page.waitForTimeout(2000);
    
    // Inject diagnostic script into the page
    const overflowElements = await page.evaluate(() => {
      const results = [];
      const viewportWidth = 375;
      
      // Get all elements on the page
      const allElements = document.querySelectorAll('*');
      
      console.log(`Checking ${allElements.length} elements...`);
      
      allElements.forEach((element, index) => {
        try {
          const rect = element.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(element);
          const scrollWidth = element.scrollWidth;
          const offsetWidth = element.offsetWidth;
          const clientWidth = element.clientWidth;
          
          // Check if element causes horizontal overflow
          if (scrollWidth > viewportWidth || offsetWidth > viewportWidth || rect.width > viewportWidth) {
            // Get element selector
            let selector = '';
            if (element.id) {
              selector = `#${element.id}`;
            } else if (element.className && typeof element.className === 'string') {
              const classes = element.className.trim().split(/\s+/).slice(0, 3);
              selector = `.${classes.join('.')}`;
            } else {
              selector = element.tagName.toLowerCase();
            }
            
            // Get parent context for better identification
            const parent = element.parentElement;
            const parentSelector = parent ? (parent.id ? `#${parent.id}` : parent.tagName.toLowerCase()) : 'none';
            
            results.push({
              selector,
              tagName: element.tagName,
              scrollWidth,
              offsetWidth,
              clientWidth,
              boundingWidth: Math.round(rect.width),
              boundingLeft: Math.round(rect.left),
              boundingRight: Math.round(rect.right),
              parentSelector,
              overflow: scrollWidth - viewportWidth,
              position: computedStyle.position,
              display: computedStyle.display,
              width: computedStyle.width,
              maxWidth: computedStyle.maxWidth,
              minWidth: computedStyle.minWidth,
              marginLeft: computedStyle.marginLeft,
              marginRight: computedStyle.marginRight,
              paddingLeft: computedStyle.paddingLeft,
              paddingRight: computedStyle.paddingRight,
              boxSizing: computedStyle.boxSizing,
              innerHTML: element.innerHTML ? element.innerHTML.substring(0, 100) + '...' : '',
              textContent: element.textContent ? element.textContent.substring(0, 50).trim() : ''
            });
          }
        } catch (e) {
          console.warn(`Error checking element ${index}:`, e);
        }
      });
      
      return results;
    });
    
    console.log('\n🚨 OVERFLOW DIAGNOSTIC RESULTS 🚨');
    console.log('=' * 50);
    
    if (overflowElements.length === 0) {
      console.log('✅ No elements found causing horizontal overflow!');
    } else {
      console.log(`Found ${overflowElements.length} elements causing horizontal overflow:\n`);
      
      // Sort by overflow amount (most problematic first)
      overflowElements.sort((a, b) => b.overflow - a.overflow);
      
      overflowElements.forEach((element, index) => {
        console.log(`\n🔴 Element #${index + 1}:`);
        console.log(`   Selector: ${element.selector}`);
        console.log(`   Tag: ${element.tagName}`);
        console.log(`   Parent: ${element.parentSelector}`);
        console.log(`   Scroll Width: ${element.scrollWidth}px (overflow: +${element.overflow}px)`);
        console.log(`   Offset Width: ${element.offsetWidth}px`);
        console.log(`   Client Width: ${element.clientWidth}px`);
        console.log(`   Bounding Width: ${element.boundingWidth}px`);
        console.log(`   Position: Left ${element.boundingLeft}px, Right ${element.boundingRight}px`);
        console.log(`   CSS Position: ${element.position}`);
        console.log(`   CSS Display: ${element.display}`);
        console.log(`   CSS Width: ${element.width}`);
        console.log(`   CSS Max Width: ${element.maxWidth}`);
        console.log(`   CSS Box Sizing: ${element.boxSizing}`);
        console.log(`   CSS Margins: L:${element.marginLeft} R:${element.marginRight}`);
        console.log(`   CSS Padding: L:${element.paddingLeft} R:${element.paddingRight}`);
        if (element.textContent) {
          console.log(`   Text Content: "${element.textContent}"`);
        }
        console.log('   ---');
      });
      
      // Find the specific 568px element
      const element568 = overflowElements.find(el => 
        el.scrollWidth === 568 || el.offsetWidth === 568 || el.boundingWidth === 568
      );
      
      if (element568) {
        console.log('\n🎯 FOUND THE 568px CULPRIT:');
        console.log('=' * 40);
        console.log(`Selector: ${element568.selector}`);
        console.log(`Tag: ${element568.tagName}`);
        console.log(`Dimensions: ${element568.scrollWidth}px scroll, ${element568.offsetWidth}px offset`);
        console.log(`Location: ${element568.boundingLeft}px to ${element568.boundingRight}px`);
        console.log(`Parent: ${element568.parentSelector}`);
      }
    }
    
    // Take a screenshot for visual reference
    await page.screenshot({ 
      path: 'overflow-diagnostic-mobile.png', 
      fullPage: true 
    });
    console.log('\n📸 Screenshot saved as: overflow-diagnostic-mobile.png');
    
    // Also get the document width for comparison
    const documentWidth = await page.evaluate(() => {
      return {
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        windowInnerWidth: window.innerWidth,
        documentClientWidth: document.documentElement.clientWidth
      };
    });
    
    console.log('\n📏 Document Measurements:');
    console.log(`   Document scroll width: ${documentWidth.documentWidth}px`);
    console.log(`   Body scroll width: ${documentWidth.bodyWidth}px`);
    console.log(`   Window inner width: ${documentWidth.windowInnerWidth}px`);
    console.log(`   Document client width: ${documentWidth.documentClientWidth}px`);
    
    return overflowElements;
    
  } catch (error) {
    console.error('❌ Error during diagnostic:', error);
    return [];
  } finally {
    await browser.close();
  }
}

// Run the diagnostic
findOverflowElements()
  .then((results) => {
    console.log(`\n✅ Diagnostic complete! Found ${results.length} overflow elements.`);
  })
  .catch((error) => {
    console.error('❌ Diagnostic failed:', error);
  });