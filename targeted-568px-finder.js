import { chromium } from 'playwright';

async function find568pxElement() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // Exact mobile viewport from failing test
    deviceScaleFactor: 1,
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🎯 TARGETED 568px ELEMENT FINDER');
    console.log('📱 Using exact test conditions: 375x812 viewport');
    
    // Navigate to ALL pages that might have the issue
    const pagesToTest = [
      { url: 'http://localhost:3000/', name: 'Homepage' },
      { url: 'http://localhost:3000/services/', name: 'Services' },
      { url: 'http://localhost:3000/wellbeing-audit/', name: 'Wellbeing Audit' },
      { url: 'http://localhost:3000/stress-risk-assessment/', name: 'Stress Risk Assessment' },
      { url: 'http://localhost:3000/psychosocial-hazards/', name: 'Psychosocial Hazards' },
      { url: 'http://localhost:3000/iso-45003/', name: 'ISO 45003' },
      { url: 'http://localhost:3000/our-approach/', name: 'Our Approach' },
      { url: 'http://localhost:3000/about/', name: 'About' },
      { url: 'http://localhost:3000/insights/', name: 'Insights' },
      { url: 'http://localhost:3000/contact/', name: 'Contact' }
    ];
    
    for (const pageInfo of pagesToTest) {
      console.log(`\n🔍 Testing ${pageInfo.name}...`);
      
      await page.goto(pageInfo.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000); // Wait for any lazy loading
      
      // Check the EXACT same measurement as the failing test
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      
      console.log(`   document.body.scrollWidth: ${bodyScrollWidth}px`);
      
      if (bodyScrollWidth >= 568) {
        console.log(`🚨 FOUND IT! ${pageInfo.name} has body scrollWidth of ${bodyScrollWidth}px`);
        
        // Now find the specific elements causing this width
        const culpritElements = await page.evaluate(() => {
          const results = [];
          const allElements = document.querySelectorAll('*');
          
          // Look for elements that are exactly 568px or wider
          allElements.forEach((element, index) => {
            try {
              const rect = element.getBoundingClientRect();
              const scrollWidth = element.scrollWidth;
              const offsetWidth = element.offsetWidth;
              const clientWidth = element.clientWidth;
              const computedStyle = window.getComputedStyle(element);
              
              // Check if this element is 568px or causes the 568px width
              const is568px = scrollWidth === 568 || offsetWidth === 568 || Math.round(rect.width) === 568;
              const isWide = scrollWidth >= 568 || offsetWidth >= 568 || rect.width >= 568 || rect.right > 375;
              
              if (is568px || isWide) {
                // Create a good selector
                let selector = '';
                if (element.id) {
                  selector = `#${element.id}`;
                } else if (element.className && typeof element.className === 'string' && element.className.trim()) {
                  const classes = element.className.trim().split(/\\s+/).filter(c => c.length > 0).slice(0, 3);
                  if (classes.length > 0) {
                    selector = `.${classes.join('.')}`;
                  } else {
                    selector = element.tagName.toLowerCase();
                  }
                } else {
                  selector = element.tagName.toLowerCase();
                }
                
                // Add nth-child if selector might not be unique
                const parent = element.parentElement;
                if (parent && !element.id) {
                  const siblings = Array.from(parent.children).filter(child => 
                    child.tagName === element.tagName && 
                    child.className === element.className
                  );
                  if (siblings.length > 1) {
                    const index = siblings.indexOf(element) + 1;
                    selector += `:nth-child(${index})`;
                  }
                }
                
                const parentSelector = parent ? (parent.id ? `#${parent.id}` : parent.tagName.toLowerCase()) : 'none';
                
                results.push({
                  selector,
                  tagName: element.tagName,
                  parentSelector,
                  scrollWidth,
                  offsetWidth,
                  clientWidth,
                  boundingWidth: Math.round(rect.width),
                  boundingLeft: Math.round(rect.left),
                  boundingRight: Math.round(rect.right),
                  // CSS that might be relevant
                  position: computedStyle.position,
                  display: computedStyle.display,
                  width: computedStyle.width,
                  minWidth: computedStyle.minWidth,
                  maxWidth: computedStyle.maxWidth,
                  marginLeft: computedStyle.marginLeft,
                  marginRight: computedStyle.marginRight,
                  paddingLeft: computedStyle.paddingLeft,
                  paddingRight: computedStyle.paddingRight,
                  borderLeft: computedStyle.borderLeftWidth,
                  borderRight: computedStyle.borderRightWidth,
                  boxSizing: computedStyle.boxSizing,
                  overflow: computedStyle.overflow,
                  overflowX: computedStyle.overflowX,
                  transform: computedStyle.transform,
                  left: computedStyle.left,
                  right: computedStyle.right,
                  // Content preview
                  textContent: element.textContent ? element.textContent.substring(0, 100).trim() : '',
                  outerHTML: element.outerHTML ? element.outerHTML.substring(0, 200).replace(/\\n/g, ' ').replace(/\\s+/g, ' ') : '',
                  // Flags
                  is568px,
                  isWide
                });
              }
            } catch (e) {
              // Skip elements that cause errors
            }
          });
          
          // Sort by most likely culprits first
          return results.sort((a, b) => {
            if (a.is568px && !b.is568px) return -1;
            if (!a.is568px && b.is568px) return 1;
            const aMax = Math.max(a.scrollWidth, a.offsetWidth, a.boundingWidth);
            const bMax = Math.max(b.scrollWidth, b.offsetWidth, b.boundingWidth);
            return bMax - aMax;
          });
        });
        
        console.log(`\\n🔴 Found ${culpritElements.length} elements that could be causing the 568px width:\\n`);
        
        culpritElements.forEach((element, index) => {
          console.log(`Element #${index + 1}:`);
          console.log(`   🎯 Selector: ${element.selector}`);
          console.log(`   📦 Tag: ${element.tagName}`);
          console.log(`   👨‍👩‍👧‍👦 Parent: ${element.parentSelector}`);
          console.log(`   📏 Dimensions:`);
          console.log(`     - Scroll Width: ${element.scrollWidth}px`);
          console.log(`     - Offset Width: ${element.offsetWidth}px`);
          console.log(`     - Client Width: ${element.clientWidth}px`);
          console.log(`     - Bounding Width: ${element.boundingWidth}px`);
          console.log(`     - Position: ${element.boundingLeft}px to ${element.boundingRight}px`);
          console.log(`   🎨 CSS Properties:`);
          console.log(`     - Position: ${element.position}`);
          console.log(`     - Display: ${element.display}`);
          console.log(`     - Width: ${element.width}`);
          console.log(`     - Min Width: ${element.minWidth}`);
          console.log(`     - Max Width: ${element.maxWidth}`);
          console.log(`     - Box Sizing: ${element.boxSizing}`);
          console.log(`     - Margin: ${element.marginLeft} / ${element.marginRight}`);
          console.log(`     - Padding: ${element.paddingLeft} / ${element.paddingRight}`);
          console.log(`     - Border: ${element.borderLeft} / ${element.borderRight}`);
          console.log(`     - Overflow: ${element.overflow} / ${element.overflowX}`);
          if (element.transform !== 'none') console.log(`     - Transform: ${element.transform}`);
          if (element.left !== 'auto') console.log(`     - Left: ${element.left}`);
          if (element.right !== 'auto') console.log(`     - Right: ${element.right}`);
          
          if (element.textContent) {
            console.log(`   📝 Content: "${element.textContent}"`);
          }
          
          if (element.is568px) {
            console.log(`   🎯 THIS ELEMENT IS EXACTLY 568px!`);
          }
          
          console.log(`   💻 HTML: ${element.outerHTML}`);
          console.log('   ' + '─'.repeat(80));
        });
        
        // Take screenshot
        await page.screenshot({ 
          path: `568px-culprit-${pageInfo.name.replace(/\\s+/g, '-').toLowerCase()}.png`, 
          fullPage: true 
        });
        console.log(`\\n📸 Screenshot saved as: 568px-culprit-${pageInfo.name.replace(/\\s+/g, '-').toLowerCase()}.png`);
        
        break; // Stop at first page with the issue
      } else {
        console.log(`   ✅ No 568px width found on ${pageInfo.name}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error during targeted search:', error);
  } finally {
    await browser.close();
  }
}

// Run the targeted diagnostic
find568pxElement()
  .then(() => {
    console.log('\\n✅ Targeted 568px search complete!');
  })
  .catch((error) => {
    console.error('❌ Targeted search failed:', error);
  });