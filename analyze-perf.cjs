const fs = require('fs');

const data = JSON.parse(fs.readFileSync('mobile-perf.json', 'utf8'));

console.log('=== Mobile Performance Analysis ===');
console.log(`Overall Score: ${(data.categories.performance.score * 100).toFixed(0)}/100\n`);

console.log('Failed Audits:');
Object.values(data.audits)
  .filter(audit => audit.score !== null && audit.score < 1 && audit.weight > 0)
  .sort((a, b) => a.score - b.score)
  .forEach(audit => {
    console.log(`  ${(audit.score * 100).toFixed(0)}/100 - ${audit.title}`);
    if (audit.displayValue) {
      console.log(`         Value: ${audit.displayValue}`);
    }
    if (audit.details && audit.details.overallSavingsMs) {
      console.log(`         Savings: ${audit.details.overallSavingsMs.toFixed(0)}ms`);
    }
  });

console.log('\nKey Metrics:');
Object.entries(data.audits)
  .filter(([key, audit]) => key.includes('contentful-paint') || key.includes('largest-contentful') || 
          key.includes('speed-index') || key.includes('interactive') || key.includes('blocking-time') || 
          key.includes('cumulative-layout-shift'))
  .forEach(([key, audit]) => {
    if (audit.displayValue) {
      console.log(`  ${audit.title}: ${audit.displayValue}`);
    }
  });