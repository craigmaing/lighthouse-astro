import fetch from 'node-fetch';

const auth = 'Y3JhaWcuZmVhcm5AbGlnaHRob3VzZW1lbnRvcmluZy5jby51azo5YTJjNmFjZTJiZjhiNjI2';

// Key competitors to analyze
const competitors = [
  'robertsoncooper.com',
  'validium.com',
  'healthassured.org',
  'mind.org.uk/workplace',
  'thrivewellbeing.org'
];

// Target keywords for wellbeing audits
const targetKeywords = [
  'ISO 45003 consultant UK',
  'workplace wellbeing audit',
  'psychosocial risk assessment',
  'mental health audit workplace',
  'stress risk assessment UK',
  'employee wellbeing assessment',
  'ISO 45003 compliance',
  'workplace mental health consultant',
  'HSE stress management standards',
  'wellbeing audit services'
];

// Get SERP results for keywords
async function getSERPResults(keyword) {
  const payload = [{
    keyword: keyword,
    location_code: 2826, // United Kingdom
    language_code: "en",
    device: "desktop",
    os: "windows",
    depth: 20
  }];

  try {
    const response = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/regular', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data.tasks?.[0]?.result?.[0] || null;
  } catch (error) {
    console.error(`Error fetching SERP for ${keyword}:`, error);
    return null;
  }
}

// Analyze competitor domain
async function analyzeCompetitor(domain) {
  const payload = [{
    target: domain,
    location_code: 2826,
    language_code: "en",
    limit: 100
  }];

  try {
    const response = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data.tasks?.[0]?.result?.[0] || null;
  } catch (error) {
    console.error(`Error analyzing ${domain}:`, error);
    return null;
  }
}

// Get keyword suggestions
async function getKeywordSuggestions(seed) {
  const payload = [{
    keyword: seed,
    location_code: 2826,
    language_code: "en",
    limit: 30
  }];

  try {
    const response = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_suggestions/live', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data.tasks?.[0]?.result?.[0] || null;
  } catch (error) {
    console.error(`Error getting suggestions for ${seed}:`, error);
    return null;
  }
}

// Main analysis function
async function runSEOAnalysis() {
  console.log('🔍 Starting SEO Competitive Analysis\n');
  console.log('=' .repeat(60));

  // Analyze SERP for target keywords
  console.log('\n📊 SERP Analysis for Target Keywords:');
  console.log('-'.repeat(40));
  
  for (const keyword of targetKeywords.slice(0, 3)) { // Limit to avoid rate limits
    console.log(`\nAnalyzing: "${keyword}"`);
    const results = await getSERPResults(keyword);
    
    if (results) {
      console.log(`Total results: ${results.se_results_count}`);
      console.log('Top 5 competitors:');
      
      results.items?.slice(0, 5).forEach((item, i) => {
        console.log(`  ${i + 1}. ${item.domain} - ${item.title}`);
        console.log(`     URL: ${item.url}`);
      });
    }
    
    // Small delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Analyze competitor domains
  console.log('\n\n🎯 Competitor Keyword Analysis:');
  console.log('-'.repeat(40));
  
  for (const competitor of competitors.slice(0, 2)) { // Limit for demo
    console.log(`\nAnalyzing: ${competitor}`);
    const data = await analyzeCompetitor(competitor);
    
    if (data && data.items) {
      console.log(`Total keywords ranking: ${data.total_count}`);
      console.log('Top keywords:');
      
      data.items.slice(0, 5).forEach(item => {
        console.log(`  - "${item.keyword}" (Pos: ${item.serp_item.rank_group}, Vol: ${item.keyword_info.search_volume})`);
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Get keyword suggestions
  console.log('\n\n💡 Keyword Opportunities:');
  console.log('-'.repeat(40));
  
  const suggestions = await getKeywordSuggestions('workplace wellbeing audit');
  if (suggestions && suggestions.items) {
    console.log('High-value keyword opportunities:');
    
    suggestions.items
      .filter(item => item.keyword_info.search_volume > 100)
      .sort((a, b) => b.keyword_info.search_volume - a.keyword_info.search_volume)
      .slice(0, 10)
      .forEach(item => {
        console.log(`  - "${item.keyword}" (Vol: ${item.keyword_info.search_volume}, CPC: $${item.keyword_info.cpc})`);
      });
  }

  console.log('\n\n✅ Analysis Complete!');
  console.log('=' .repeat(60));
}

// Run the analysis
runSEOAnalysis().catch(console.error);