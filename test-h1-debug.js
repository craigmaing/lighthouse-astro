const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  
  // Find all H1s
  const h1Elements = await page.locator('h1').all();
  console.log(`Found ${h1Elements.length} H1 elements`);
  
  for (let i = 0; i < h1Elements.length; i++) {
    const text = await h1Elements[i].textContent();
    const isVisible = await h1Elements[i].isVisible();
    const classes = await h1Elements[i].getAttribute('class');
    console.log(`H1 #${i+1}: "${text.substring(0, 50)}" - Visible: ${isVisible} - Classes: ${classes}`);
  }
  
  // Check what other elements might be styled as H1
  const largeHeadings = await page.locator('.text-4xl, .text-5xl, .text-6xl').all();
  console.log(`\nFound ${largeHeadings.length} elements with large text classes`);
  
  await browser.close();
})();
