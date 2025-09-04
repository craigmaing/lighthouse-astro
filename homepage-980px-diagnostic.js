import { chromium } from 'playwright';
import fs from 'fs';

async function findHomepage980pxCulprit() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Set tablet viewport (768px)
    await page.setViewportSize({ width: 768, height: 1024 });

    console.log('🔍 Investigating 980px width on homepage at tablet viewport...\n');

    try {
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        // Get body width
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        console.log(`📏 Body scroll width: ${bodyWidth}px\n`);

        // Find the root cause of 980px width
        const analysis = await page.evaluate(() => {
            const viewport = 768;
            const results = {
                bodyWidth: document.body.scrollWidth,
                htmlWidth: document.documentElement.scrollWidth,
                suspiciousElements: [],
                containerAnalysis: [],
                imageAnalysis: []
            };

            // Check all elements for width issues
            const allElements = document.querySelectorAll('*');
            
            allElements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                const styles = window.getComputedStyle(element);
                
                // Focus on elements that are exactly or close to 980px, or extend beyond viewport
                if (Math.abs(rect.width - 980) < 10 || 
                    rect.width > viewport || 
                    rect.left + rect.width > viewport ||
                    styles.width === '980px' ||
                    (rect.width > 400 && rect.left + rect.width > viewport)) {
                    
                    const selector = element.tagName.toLowerCase() + 
                        (element.id ? `#${element.id}` : '') +
                        (element.className ? `.${element.className.toString().split(' ').join('.')}` : '');
                    
                    const parentSelector = element.parentElement ? 
                        element.parentElement.tagName.toLowerCase() + 
                        (element.parentElement.id ? `#${element.parentElement.id}` : '') +
                        (element.parentElement.className ? `.${element.parentElement.className.toString().split(' ').join('.')}` : '') : 'none';
                    
                    results.suspiciousElements.push({
                        selector: selector,
                        tagName: element.tagName,
                        id: element.id || null,
                        className: element.className || null,
                        parentSelector: parentSelector,
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
                            transform: styles.transform,
                            left: styles.left,
                            right: styles.right
                        },
                        overflowsViewport: rect.left + rect.width > viewport,
                        exactlyOrNear980: Math.abs(rect.width - 980) < 10,
                        innerHTML: element.innerHTML ? element.innerHTML.substring(0, 200) + '...' : null
                    });
                }
            });

            // Special analysis for images
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                const rect = img.getBoundingClientRect();
                const styles = window.getComputedStyle(img);
                
                if (rect.width > 300 || rect.left + rect.width > viewport) {
                    results.imageAnalysis.push({
                        src: img.src,
                        alt: img.alt || null,
                        className: img.className || null,
                        rect: {
                            width: rect.width,
                            height: rect.height,
                            left: rect.left,
                            right: rect.left + rect.width
                        },
                        computed: {
                            width: styles.width,
                            maxWidth: styles.maxWidth,
                            objectFit: styles.objectFit,
                            position: styles.position
                        },
                        naturalWidth: img.naturalWidth,
                        naturalHeight: img.naturalHeight
                    });
                }
            });

            // Container analysis
            const containers = document.querySelectorAll('div, section, main, header, footer, article, aside');
            containers.forEach(container => {
                const rect = container.getBoundingClientRect();
                const styles = window.getComputedStyle(container);
                
                if (rect.width > viewport - 50) { // Close to or exceeding viewport
                    const selector = container.tagName.toLowerCase() + 
                        (container.id ? `#${container.id}` : '') +
                        (container.className ? `.${container.className.toString().split(' ').join('.')}` : '');
                    
                    results.containerAnalysis.push({
                        selector: selector,
                        className: container.className || null,
                        rect: {
                            width: rect.width,
                            left: rect.left,
                            right: rect.left + rect.width
                        },
                        computed: {
                            width: styles.width,
                            maxWidth: styles.maxWidth,
                            minWidth: styles.minWidth,
                            margin: styles.margin,
                            padding: styles.padding,
                            boxSizing: styles.boxSizing,
                            display: styles.display,
                            position: styles.position
                        }
                    });
                }
            });

            // Sort by width descending
            results.suspiciousElements.sort((a, b) => b.rect.width - a.rect.width);
            results.containerAnalysis.sort((a, b) => b.rect.width - a.rect.width);
            results.imageAnalysis.sort((a, b) => b.rect.width - a.rect.width);

            return results;
        });

        console.log('🎯 ANALYSIS RESULTS');
        console.log('==================\n');

        if (analysis.suspiciousElements.length > 0) {
            console.log('🚨 SUSPICIOUS ELEMENTS (causing overflow):');
            analysis.suspiciousElements.slice(0, 5).forEach((el, i) => {
                console.log(`\n${i + 1}. ${el.selector}`);
                console.log(`   📐 Size: ${el.rect.width}px × ${el.rect.height}px`);
                console.log(`   📍 Position: left ${el.rect.left}px, right ${el.rect.right}px`);
                console.log(`   💻 Computed width: ${el.computed.width}`);
                console.log(`   📦 Max width: ${el.computed.maxWidth}`);
                console.log(`   🔄 Position: ${el.computed.position}`);
                if (el.exactlyOrNear980) console.log(`   ⚠️  EXACTLY ~980px!`);
                if (el.overflowsViewport) console.log(`   ❌ OVERFLOWS VIEWPORT!`);
                if (el.computed.transform && el.computed.transform !== 'none') {
                    console.log(`   🔄 Transform: ${el.computed.transform}`);
                }
                console.log(`   👨‍💻 Parent: ${el.parentSelector}`);
            });
        }

        if (analysis.imageAnalysis.length > 0) {
            console.log('\n\n🖼️  LARGE IMAGES:');
            analysis.imageAnalysis.slice(0, 3).forEach((img, i) => {
                console.log(`\n${i + 1}. Image: ${img.src.split('/').pop()}`);
                console.log(`   📐 Rendered: ${img.rect.width}px × ${img.rect.height}px`);
                console.log(`   📐 Natural: ${img.naturalWidth}px × ${img.naturalHeight}px`);
                console.log(`   📍 Position: left ${img.rect.left}px, right ${img.rect.right}px`);
                console.log(`   💻 Computed width: ${img.computed.width}`);
                console.log(`   📦 Max width: ${img.computed.maxWidth}`);
                if (img.className) console.log(`   🎨 Classes: ${img.className}`);
            });
        }

        if (analysis.containerAnalysis.length > 0) {
            console.log('\n\n📦 WIDE CONTAINERS:');
            analysis.containerAnalysis.slice(0, 3).forEach((container, i) => {
                console.log(`\n${i + 1}. ${container.selector}`);
                console.log(`   📐 Width: ${container.rect.width}px`);
                console.log(`   📍 Position: left ${container.rect.left}px, right ${container.rect.right}px`);
                console.log(`   💻 Computed width: ${container.computed.width}`);
                console.log(`   📦 Max width: ${container.computed.maxWidth}`);
                console.log(`   📦 Box sizing: ${container.computed.boxSizing}`);
            });
        }

        // Save detailed results
        fs.writeFileSync('homepage-980px-analysis.json', JSON.stringify(analysis, null, 2));
        console.log(`\n📁 Detailed results saved to: homepage-980px-analysis.json`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    await browser.close();
}

findHomepage980pxCulprit().catch(console.error);