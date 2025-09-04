import { chromium } from 'playwright';

async function findHorizontalScrollIssues() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // iPhone X viewport
    deviceScaleFactor: 1,
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🔍 Enhanced horizontal scroll diagnostic...');
    console.log('📱 Viewport set to 375px width (mobile)');
    
    // Navigate to the homepage
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    console.log('✅ Page loaded successfully');
    
    // Wait a bit for any lazy loading and animations
    await page.waitForTimeout(3000);
    
    // First, let's check if there's actually horizontal scroll
    const scrollInfo = await page.evaluate(() => {
      return {
        documentWidth: document.documentElement.scrollWidth,
        documentClientWidth: document.documentElement.clientWidth,
        bodyWidth: document.body.scrollWidth,
        bodyClientWidth: document.body.clientWidth,
        windowInnerWidth: window.innerWidth,
        canScrollHorizontally: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        maxScrollLeft: document.documentElement.scrollWidth - document.documentElement.clientWidth
      };
    });
    
    console.log('\n📐 Scroll Information:');
    console.log(`   Document scroll width: ${scrollInfo.documentWidth}px`);
    console.log(`   Document client width: ${scrollInfo.documentClientWidth}px`);
    console.log(`   Body scroll width: ${scrollInfo.bodyWidth}px`);
    console.log(`   Body client width: ${scrollInfo.bodyClientWidth}px`);
    console.log(`   Window inner width: ${scrollInfo.windowInnerWidth}px`);
    console.log(`   Can scroll horizontally: ${scrollInfo.canScrollHorizontally}`);
    console.log(`   Max scroll left: ${scrollInfo.maxScrollLeft}px`);
    
    if (!scrollInfo.canScrollHorizontally) {
      console.log('\n✅ No horizontal scroll detected at viewport load!');
      console.log('💡 This might be an intermittent issue. Let me trigger a resize...');
      
      // Try triggering resize events that might cause overflow
      await page.setViewportSize({ width: 374, height: 812 });
      await page.waitForTimeout(500);
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(500);
    }
    
    // Now do a comprehensive element check
    const problematicElements = await page.evaluate(() => {
      const results = [];
      const viewportWidth = window.innerWidth || 375;
      
      console.log(`Checking elements against viewport width: ${viewportWidth}px`);
      
      // Get ALL elements
      const allElements = document.querySelectorAll('*');
      
      allElements.forEach((element, index) => {
        try {
          const rect = element.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(element);
          
          // Multiple checks for overflow
          const checks = {
            scrollWidth: element.scrollWidth,
            offsetWidth: element.offsetWidth,
            clientWidth: element.clientWidth,
            boundingWidth: rect.width,
            boundingRight: rect.right,
            boundingLeft: rect.left
          };
          
          // Check various conditions that could cause overflow
          let isProblematic = false;
          let reasons = [];
          
          if (checks.scrollWidth > viewportWidth) {
            isProblematic = true;
            reasons.push(`scrollWidth: ${checks.scrollWidth}px > ${viewportWidth}px`);
          }
          
          if (checks.offsetWidth > viewportWidth) {
            isProblematic = true;
            reasons.push(`offsetWidth: ${checks.offsetWidth}px > ${viewportWidth}px`);
          }
          
          if (checks.boundingWidth > viewportWidth) {
            isProblematic = true;
            reasons.push(`boundingWidth: ${Math.round(checks.boundingWidth)}px > ${viewportWidth}px`);
          }
          
          if (checks.boundingRight > viewportWidth) {
            isProblematic = true;
            reasons.push(`boundingRight: ${Math.round(checks.boundingRight)}px > ${viewportWidth}px`);
          }
          
          if (checks.boundingLeft < 0 && Math.abs(checks.boundingLeft) + checks.boundingWidth > viewportWidth) {
            isProblematic = true;
            reasons.push(`element extends beyond viewport (left: ${Math.round(checks.boundingLeft)}px, width: ${Math.round(checks.boundingWidth)}px)`);
          }
          
          // Also check for specific width values that might cause issues
          if (checks.scrollWidth === 568 || checks.offsetWidth === 568 || Math.round(checks.boundingWidth) === 568) {
            isProblematic = true;
            reasons.push(`🎯 FOUND 568px WIDTH!`);
          }
          
          if (isProblematic) {
            // Create selector
            let selector = '';
            if (element.id) {
              selector = `#${element.id}`;
            } else if (element.className && typeof element.className === 'string' && element.className.trim()) {
              const classes = element.className.trim().split(/\s+/).slice(0, 3);
              selector = `.${classes.join('.')}`;
            } else {
              selector = element.tagName.toLowerCase();
            }
            
            // Get parent info
            const parent = element.parentElement;
            const parentSelector = parent ? (parent.id ? `#${parent.id}` : parent.tagName.toLowerCase()) : 'none';
            
            // Get content preview
            const textContent = element.textContent ? element.textContent.substring(0, 100).trim() : '';
            const innerHTML = element.innerHTML ? element.innerHTML.substring(0, 200) : '';
            
            results.push({
              selector,
              tagName: element.tagName,
              reasons,
              parentSelector,
              ...checks,
              // CSS properties that might be relevant
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
              overflow: computedStyle.overflow,
              overflowX: computedStyle.overflowX,
              transform: computedStyle.transform,
              left: computedStyle.left,
              right: computedStyle.right,
              textContent,
              innerHTML: innerHTML.replace(/\n/g, ' ').replace(/\s+/g, ' ')
            });
          }
        } catch (e) {
          console.warn(`Error checking element ${index}:`, e);
        }
      });
      
      return results;
    });
    
    console.log('\n🚨 ENHANCED DIAGNOSTIC RESULTS 🚨');
    console.log('='.repeat(60));
    
    if (problematicElements.length === 0) {
      console.log('✅ No problematic elements found with current method!');
      
      // Let's try a different approach - scroll and see what happens
      console.log('\n🔄 Trying alternative detection method...');
      
      await page.mouse.move(200, 400);
      
      // Try scrolling horizontally
      try {
        await page.mouse.wheel(100, 0);
        await page.waitForTimeout(100);
        
        const afterScrollInfo = await page.evaluate(() => {
          return {
            scrollLeft: document.documentElement.scrollLeft || document.body.scrollLeft,
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth
          };
        });
        
        console.log(`   After horizontal scroll attempt:`);
        console.log(`   ScrollLeft: ${afterScrollInfo.scrollLeft}px`);
        console.log(`   ScrollWidth: ${afterScrollInfo.scrollWidth}px`);
        console.log(`   ClientWidth: ${afterScrollInfo.clientWidth}px`);
        
        if (afterScrollInfo.scrollLeft > 0) {
          console.log('🎯 HORIZONTAL SCROLL DETECTED AFTER WHEEL EVENT!');
        }
      } catch (e) {
        console.log('   Could not perform horizontal scroll test');
      }
      
    } else {
      console.log(`Found ${problematicElements.length} potentially problematic elements:\n`);
      
      // Sort by most problematic first
      problematicElements.sort((a, b) => {
        const aMax = Math.max(a.scrollWidth, a.offsetWidth, a.boundingWidth);
        const bMax = Math.max(b.scrollWidth, b.offsetWidth, b.boundingWidth);
        return bMax - aMax;
      });
      
      problematicElements.forEach((element, index) => {
        console.log(`\n🔴 Element #${index + 1}:`);
        console.log(`   Selector: ${element.selector}`);
        console.log(`   Tag: ${element.tagName}`);
        console.log(`   Parent: ${element.parentSelector}`);
        console.log(`   Reasons: ${element.reasons.join(', ')}`);
        console.log(`   Dimensions:`);
        console.log(`     - Scroll Width: ${element.scrollWidth}px`);
        console.log(`     - Offset Width: ${element.offsetWidth}px`);
        console.log(`     - Client Width: ${element.clientWidth}px`);
        console.log(`     - Bounding Width: ${Math.round(element.boundingWidth)}px`);
        console.log(`     - Bounding Left: ${Math.round(element.boundingLeft)}px`);
        console.log(`     - Bounding Right: ${Math.round(element.boundingRight)}px`);
        console.log(`   CSS Properties:`);
        console.log(`     - Position: ${element.position}`);
        console.log(`     - Display: ${element.display}`);
        console.log(`     - Width: ${element.width}`);
        console.log(`     - Max Width: ${element.maxWidth}`);
        console.log(`     - Box Sizing: ${element.boxSizing}`);
        console.log(`     - Overflow: ${element.overflow}`);
        console.log(`     - Overflow-X: ${element.overflowX}`);
        console.log(`     - Transform: ${element.transform}`);
        if (element.left !== 'auto') console.log(`     - Left: ${element.left}`);
        if (element.right !== 'auto') console.log(`     - Right: ${element.right}`);
        console.log(`     - Margins: L:${element.marginLeft} R:${element.marginRight}`);
        console.log(`     - Padding: L:${element.paddingLeft} R:${element.paddingRight}`);
        
        if (element.textContent) {
          console.log(`   Text: "${element.textContent.substring(0, 50)}..."`);
        }
        
        console.log('   ---');
      });
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'enhanced-overflow-diagnostic.png', 
      fullPage: true 
    });
    console.log('\n📸 Enhanced screenshot saved as: enhanced-overflow-diagnostic.png');
    
    // Also test specific breakpoints that might trigger the issue
    console.log('\n🔄 Testing different viewport widths to trigger overflow...');
    
    const testWidths = [374, 375, 376, 320, 360, 414];
    
    for (const width of testWidths) {
      await page.setViewportSize({ width, height: 812 });
      await page.waitForTimeout(500);
      
      const testScrollInfo = await page.evaluate(() => {
        return {
          width: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          canScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      });
      
      console.log(`   Width ${width}px: scroll=${testScrollInfo.scrollWidth}px, overflow=${testScrollInfo.overflow}px, canScroll=${testScrollInfo.canScroll}`);
      
      if (testScrollInfo.canScroll) {
        console.log(`🎯 OVERFLOW TRIGGERED AT ${width}px VIEWPORT!`);
        
        // Re-run element analysis at this width
        const overflowElements = await page.evaluate((viewportWidth) => {
          const results = [];
          const allElements = document.querySelectorAll('*');
          
          allElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            if (rect.width > viewportWidth || rect.right > viewportWidth || element.scrollWidth > viewportWidth) {
              let selector = '';
              if (element.id) {
                selector = `#${element.id}`;
              } else if (element.className && typeof element.className === 'string' && element.className.trim()) {
                const classes = element.className.trim().split(/\s+/).slice(0, 2);
                selector = `.${classes.join('.')}`;
              } else {
                selector = element.tagName.toLowerCase();
              }
              
              results.push({
                selector,
                tagName: element.tagName,
                scrollWidth: element.scrollWidth,
                boundingWidth: Math.round(rect.width),
                boundingRight: Math.round(rect.right),
                overflow: Math.max(rect.right - viewportWidth, element.scrollWidth - viewportWidth)
              });
            }
          });
          
          return results.sort((a, b) => b.overflow - a.overflow);
        }, width);
        
        if (overflowElements.length > 0) {
          console.log(`   🔴 Found ${overflowElements.length} overflow elements at ${width}px:`);
          overflowElements.slice(0, 5).forEach((el, i) => {
            console.log(`     ${i+1}. ${el.selector} (${el.tagName}): ${el.scrollWidth}px scroll, ${el.boundingWidth}px bound, +${el.overflow}px overflow`);
          });
        }
        
        break; // Stop at first width that triggers overflow
      }
    }
    
    return problematicElements;
    
  } catch (error) {
    console.error('❌ Error during enhanced diagnostic:', error);
    return [];
  } finally {
    await browser.close();
  }
}

// Run the enhanced diagnostic
findHorizontalScrollIssues()
  .then((results) => {
    console.log(`\n✅ Enhanced diagnostic complete! Found ${results.length} potentially problematic elements.`);
  })
  .catch((error) => {
    console.error('❌ Enhanced diagnostic failed:', error);
  });