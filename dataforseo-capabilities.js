import fetch from 'node-fetch';

const auth = 'Y3JhaWcuZmVhcm5AbGlnaHRob3VzZW1lbnRvcmluZy5jby51azo5YTJjNmFjZTJiZjhiNjI2';

async function checkCapabilities() {
  console.log('🚀 DataForSEO PRO Account Capabilities Check\n');
  console.log('=' .repeat(80));
  
  try {
    // Check user account info
    const userResponse = await fetch('https://api.dataforseo.com/v3/appendix/user_data', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    const userData = await userResponse.json();
    console.log('\n💳 ACCOUNT STATUS:');
    console.log('-'.repeat(40));
    console.log('Plan:', userData.tasks?.[0]?.result?.price?.plan_name || 'Unknown');
    console.log('Balance:', userData.tasks?.[0]?.result?.money?.balance || 0);
    console.log('Total spent:', userData.tasks?.[0]?.result?.money?.total || 0);
    console.log('Rate limit (per second):', userData.tasks?.[0]?.result?.rates?.limits?.second || 'N/A');
    console.log('Rate limit (per day):', userData.tasks?.[0]?.result?.rates?.limits?.day || 'N/A');
    
    // List all available endpoints
    const endpointsResponse = await fetch('https://api.dataforseo.com/v3/appendix/user_data', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n📊 AVAILABLE PRO FEATURES:');
    console.log('-'.repeat(40));
    console.log(`
✅ SERP API:
  - Google organic search results
  - Google Maps results  
  - Google Ads results
  - Featured snippets
  - Knowledge graph
  - Shopping results
  - Local pack results
  - People Also Ask
  - Related searches
  
✅ DataForSEO Labs API (PRO):
  - Keyword research (suggestions, ideas, related)
  - Competitor research (domain keywords, competitors)
  - Keyword difficulty analysis
  - SERP analysis
  - Domain metrics (authority, backlinks profile)
  - Ranked keywords for any domain
  - Traffic estimation
  - Keyword gap analysis
  - Content analysis
  - Historical SERP data
  
✅ Backlinks API:
  - Domain backlinks profile
  - Referring domains
  - Anchors analysis
  - Competitors backlinks
  - New & lost backlinks
  - Backlinks history
  
✅ On-Page API:
  - Page analysis
  - Duplicate content checker
  - Broken links finder
  - Website speed test
  - Lighthouse metrics
  
✅ Content Analysis API:
  - Readability score
  - Keyword density
  - Content extraction
  - Sentiment analysis
  
✅ Domain Analytics API:
  - Whois data
  - Technologies detection
  - Domain rank overview
`);

    console.log('\n🎯 RECOMMENDED PRIORITY ACTIONS FOR LIGHTHOUSE MENTORING:');
    console.log('-'.repeat(60));
    console.log(`
1. COMPETITOR DEEP DIVE:
   - Analyze top 10 competitors' full keyword portfolios
   - Identify keyword gaps we can exploit
   - Track their ranking changes
   
2. KEYWORD GOLDMINE:
   - Find low competition, high-intent keywords
   - Discover question-based keywords for content
   - Identify local SEO opportunities
   
3. BACKLINK OPPORTUNITIES:
   - Find where competitors get their links
   - Identify guest posting opportunities
   - Find broken link building chances
   
4. CONTENT OPTIMIZATION:
   - Analyze top-ranking pages for our keywords
   - Extract winning content patterns
   - Optimize our pages accordingly
   
5. TECHNICAL SEO:
   - Full site audit with On-Page API
   - Core Web Vitals monitoring
   - Mobile optimization check
`);

  } catch (error) {
    console.error('Error checking capabilities:', error);
  }
}

checkCapabilities();