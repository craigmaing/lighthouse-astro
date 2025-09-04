const fs = require('fs');

const data = JSON.parse(fs.readFileSync('mobile-perf-final.json', 'utf8'));

console.log('=== DETAILED MOBILE PERFORMANCE ANALYSIS ===');
console.log(`Overall Score: ${(data.categories.performance.score * 100).toFixed(0)}/100\n`);

// Check what's preventing 100/100
console.log('OPPORTUNITIES (points lost):');
const opportunities = Object.values(data.audits)
  .filter(audit => audit.scoreDisplayMode === 'opportunity' && audit.details && audit.details.overallSavingsMs > 0)
  .sort((a, b) => (b.details.overallSavingsMs || 0) - (a.details.overallSavingsMs || 0));

opportunities.forEach(audit => {
  console.log(`  • ${audit.title}`);
  console.log(`    Potential Savings: ${audit.details.overallSavingsMs.toFixed(0)}ms`);
  if (audit.details.items && audit.details.items.length > 0) {
    audit.details.items.slice(0, 3).forEach(item => {
      if (item.url) {
        const filename = item.url.split('/').pop();
        console.log(`      - ${filename}: ${item.wastedMs ? item.wastedMs.toFixed(0) + 'ms' : item.wastedBytes ? (item.wastedBytes/1024).toFixed(0) + 'KB' : ''}`);
      }
    });
  }
  console.log();
});

console.log('\nDIAGNOSTICS (issues found):');
const diagnostics = Object.values(data.audits)
  .filter(audit => audit.scoreDisplayMode === 'numeric' && audit.score !== null && audit.score < 0.9)
  .sort((a, b) => a.score - b.score);

diagnostics.forEach(audit => {
  console.log(`  • ${audit.title}: ${audit.displayValue || 'Failed'}`);
  if (audit.details && audit.details.items) {
    audit.details.items.slice(0, 2).forEach(item => {
      if (item.node && item.node.snippet) {
        console.log(`      ${item.node.snippet.substring(0, 60)}...`);
      }
    });
  }
});

console.log('\nKEY METRICS:');
const metrics = {
  'first-contentful-paint': 'FCP',
  'largest-contentful-paint': 'LCP', 
  'speed-index': 'Speed Index',
  'total-blocking-time': 'TBT',
  'cumulative-layout-shift': 'CLS',
  'interactive': 'TTI'
};

Object.entries(metrics).forEach(([key, name]) => {
  if (data.audits[key]) {
    const audit = data.audits[key];
    const status = audit.score >= 0.9 ? '✓' : audit.score >= 0.5 ? '⚠' : '✗';
    console.log(`  ${status} ${name}: ${audit.displayValue} (score: ${(audit.score * 100).toFixed(0)})`);
  }
});

console.log('\nLARGEST CONTENTFUL PAINT BREAKDOWN:');
if (data.audits['largest-contentful-paint-element']) {
  const lcpElement = data.audits['largest-contentful-paint-element'];
  if (lcpElement.details && lcpElement.details.items && lcpElement.details.items[0]) {
    const item = lcpElement.details.items[0];
    console.log(`  Element: ${item.node ? item.node.snippet.substring(0, 80) : 'Unknown'}`);
    if (item.phases) {
      console.log(`  TTFB: ${item.phases.TTFB}ms`);
      console.log(`  Load Delay: ${item.phases.loadDelay}ms`);
      console.log(`  Load Time: ${item.phases.loadTime}ms`);
      console.log(`  Render Delay: ${item.phases.renderDelay}ms`);
    }
  }
}