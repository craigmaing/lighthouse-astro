import { chromium } from '@playwright/test';

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
const h2Elements = await page.locator('h2').all();
console.log(`\nFound ${h2Elements.length} H2 elements`);

// Check specifically for elements that look like H1s
const largeHeadings = await page.locator('.font-display.font-bold.text-navy-900').all();
console.log(`Found ${largeHeadings.length} elements with H1-like styling`);

await browser.close();
