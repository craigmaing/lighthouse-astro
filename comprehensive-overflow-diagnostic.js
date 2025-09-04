import { chromium } from 'playwright';
import fs from 'fs';

async function runComprehensiveOverflowDiagnostic() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Set tablet viewport (768px)
    await page.setViewportSize({ width: 768, height: 1024 });

    const results = {
        timestamp: new Date().toISOString(),
        viewport: { width: 768, height: 1024 },
        pages: {}
    };

    // List of pages to test
    const pages = [
        '/',
        '/about',
        '/accessibility',
        '/contact',
        '/faq',
        '/insights',
        '/iso-45003',
        '/our-approach',
        '/privacy',
        '/psychosocial-hazards',
        '/services',
        '/stress-risk-assessment',
        '/terms',
        '/thank-you',
        '/wellbeing-audit',
        '/insights/iso-45003-guide',
        '/insights/roi-workplace-wellbeing',
        '/insights/signs-you-need-wellbeing-audit'
    ];

    console.log('🔍 Starting comprehensive overflow diagnostic...\n');

    for (const pagePath of pages) {
        console.log(`\n📄 Analyzing page: ${pagePath}`);
        
        try {
            await page.goto(`http://localhost:3000${pagePath}`, { waitUntil: 'networkidle' });
            await page.waitForTimeout(2000); // Wait for any animations/transitions

            // Get body width
            const bodyWidth = await page.evaluate(() => {
                return document.body.scrollWidth;
            });

            console.log(`  📏 Body scroll width: ${bodyWidth}px`);

            // Find all elements that are causing overflow
            const overflowElements = await page.evaluate(() => {
                const results = [];
                const viewport = 768;
                
                // Check all elements
                const allElements = document.querySelectorAll('*');
                
                allElements.forEach((element, index) => {
                    const rect = element.getBoundingClientRect();
                    const styles = window.getComputedStyle(element);
                    
                    // Calculate actual width including margins and borders
                    const marginLeft = parseFloat(styles.marginLeft) || 0;
                    const marginRight = parseFloat(styles.marginRight) || 0;
                    const borderLeft = parseFloat(styles.borderLeftWidth) || 0;
                    const borderRight = parseFloat(styles.borderRightWidth) || 0;
                    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
                    const paddingRight = parseFloat(styles.paddingRight) || 0;
                    
                    const totalWidth = rect.width + marginLeft + marginRight;
                    const rightEdge = rect.left + rect.width;
                    
                    // Check if element extends beyond viewport or has suspicious width
                    if (rightEdge > viewport || totalWidth > viewport || rect.width >= 980) {
                        const selector = element.tagName.toLowerCase() + 
                            (element.id ? `#${element.id}` : '') +
                            (element.className ? `.${element.className.toString().split(' ').join('.')}` : '');
                        
                        results.push({
                            selector: selector,
                            tagName: element.tagName,
                            id: element.id || null,
                            className: element.className || null,
                            rect: {
                                width: rect.width,
                                height: rect.height,
                                left: rect.left,
                                right: rect.left + rect.width,
                                top: rect.top
                            },
                            computed: {
                                width: styles.width,
                                maxWidth: styles.maxWidth,
                                minWidth: styles.minWidth,
                                marginLeft: styles.marginLeft,
                                marginRight: styles.marginRight,
                                paddingLeft: styles.paddingLeft,
                                paddingRight: styles.paddingRight,
                                position: styles.position,
                                display: styles.display,
                                overflow: styles.overflow,
                                overflowX: styles.overflowX
                            },
                            totalWidth: totalWidth,
                            rightEdge: rightEdge,
                            isFixed: styles.position === 'fixed',
                            isAbsolute: styles.position === 'absolute',
                            textContent: element.textContent ? element.textContent.substring(0, 100) + '...' : null
                        });
                    }
                });

                return results.sort((a, b) => b.totalWidth - a.totalWidth);
            });

            // Look specifically for 980px elements
            const elements980 = await page.evaluate(() => {
                const results = [];
                const allElements = document.querySelectorAll('*');
                
                allElements.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    const styles = window.getComputedStyle(element);
                    
                    // Check for exactly 980px or close to it
                    if (Math.abs(rect.width - 980) < 5 || 
                        styles.width === '980px' || 
                        styles.maxWidth === '980px' ||
                        styles.minWidth === '980px') {
                        
                        const selector = element.tagName.toLowerCase() + 
                            (element.id ? `#${element.id}` : '') +
                            (element.className ? `.${element.className.toString().split(' ').join('.')}` : '');
                        
                        results.push({
                            selector: selector,
                            tagName: element.tagName,
                            id: element.id || null,
                            className: element.className || null,
                            actualWidth: rect.width,
                            computedWidth: styles.width,
                            maxWidth: styles.maxWidth,
                            minWidth: styles.minWidth,
                            position: styles.position,
                            display: styles.display,
                            textContent: element.textContent ? element.textContent.substring(0, 50) + '...' : null
                        });
                    }
                });
                
                return results;
            });

            // Check for container elements that might be forcing width
            const containerElements = await page.evaluate(() => {
                const results = [];
                const containers = document.querySelectorAll('.container, .max-w-full, .w-full, [class*="max-w"], [class*="container"], [style*="width"]');
                
                containers.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    const styles = window.getComputedStyle(element);
                    
                    const selector = element.tagName.toLowerCase() + 
                        (element.id ? `#${element.id}` : '') +
                        (element.className ? `.${element.className.toString().split(' ').join('.')}` : '');
                    
                    results.push({
                        selector: selector,
                        tagName: element.tagName,
                        className: element.className || null,
                        actualWidth: rect.width,
                        computedWidth: styles.width,
                        maxWidth: styles.maxWidth,
                        minWidth: styles.minWidth
                    });
                });
                
                return results;
            });

            results.pages[pagePath] = {
                bodyWidth: bodyWidth,
                hasOverflow: bodyWidth > 768,
                overflowElements: overflowElements.slice(0, 10), // Top 10 widest elements
                elements980: elements980,
                containerElements: containerElements.slice(0, 5) // Top 5 container elements
            };

            // Log immediate results for this page
            if (bodyWidth > 768) {
                console.log(`  ⚠️  OVERFLOW DETECTED! Body width: ${bodyWidth}px`);
                
                if (elements980.length > 0) {
                    console.log(`  🎯 Found ${elements980.length} elements at ~980px:`);
                    elements980.forEach((el, i) => {
                        console.log(`    ${i + 1}. ${el.selector} - ${el.actualWidth}px`);
                    });
                }
                
                if (overflowElements.length > 0) {
                    console.log(`  📊 Top overflow elements:`);
                    overflowElements.slice(0, 3).forEach((el, i) => {
                        console.log(`    ${i + 1}. ${el.selector} - ${el.totalWidth}px (right edge: ${el.rightEdge}px)`);
                    });
                }
            } else {
                console.log(`  ✅ No overflow detected`);
            }

        } catch (error) {
            console.error(`  ❌ Error testing ${pagePath}:`, error.message);
            results.pages[pagePath] = {
                error: error.message
            };
        }
    }

    await browser.close();

    // Save results to file
    fs.writeFileSync('comprehensive-overflow-results.json', JSON.stringify(results, null, 2));
    
    // Generate summary report
    console.log('\n\n📊 SUMMARY REPORT');
    console.log('==================');
    
    const pagesWithOverflow = Object.entries(results.pages).filter(([path, data]) => data.hasOverflow);
    
    if (pagesWithOverflow.length > 0) {
        console.log(`\n🔴 ${pagesWithOverflow.length} pages have overflow issues:`);
        
        pagesWithOverflow.forEach(([path, data]) => {
            console.log(`\n📄 ${path} (Body width: ${data.bodyWidth}px)`);
            
            if (data.elements980 && data.elements980.length > 0) {
                console.log(`  🎯 980px elements found:`);
                data.elements980.forEach(el => {
                    console.log(`    - ${el.selector} (${el.actualWidth}px)`);
                });
            }
            
            if (data.overflowElements && data.overflowElements.length > 0) {
                console.log(`  📏 Widest elements:`);
                data.overflowElements.slice(0, 3).forEach(el => {
                    console.log(`    - ${el.selector}: ${el.totalWidth}px`);
                });
            }
        });
        
        // Find the most common culprits
        const allElements980 = [];
        pagesWithOverflow.forEach(([path, data]) => {
            if (data.elements980) {
                allElements980.push(...data.elements980);
            }
        });
        
        if (allElements980.length > 0) {
            console.log(`\n🎯 MOST LIKELY CULPRITS (980px elements):`);
            const elementCounts = {};
            allElements980.forEach(el => {
                const key = el.selector;
                elementCounts[key] = (elementCounts[key] || 0) + 1;
            });
            
            Object.entries(elementCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .forEach(([selector, count]) => {
                    console.log(`  - ${selector} (appears on ${count} pages)`);
                });
        }
        
    } else {
        console.log('\n✅ No overflow issues detected on any pages!');
    }
    
    console.log(`\n📁 Full results saved to: comprehensive-overflow-results.json`);
}

runComprehensiveOverflowDiagnostic().catch(console.error);