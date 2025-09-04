import fetch from 'node-fetch';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

const auth = process.env.DATAFORSEO_AUTH || 'Y3JhaWcuZmVhcm5AbGlnaHRob3VzZW1lbnRvcmluZy5jby51azo5YTJjNmFjZTJiZjhiNjI2';

console.log('🚀 LIGHTHOUSE MENTORING SEO DOMINATION ANALYSIS');
console.log('='.repeat(80));
console.log('Using DataForSEO PRO Account\n');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 1. SERP ANALYSIS FOR KEY TERMS
async function analyzeSERP() {
  console.log('\n📊 ANALYZING SERP FOR KEY TERMS');
  console.log('-'.repeat(60));
  
  const keywords = [
    'ISO 45003 consultant UK',
    'workplace wellbeing audit',
    'psychosocial risk assessment UK',
    'mental health workplace assessment',
    'employee wellbeing consultant'
  ];
  
  const results = {};
  
  for (const keyword of keywords) {
    console.log(`\n🔍 Analyzing: "${keyword}"`);
    
    try {
      const response = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/regular', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          keyword: keyword,
          location_code: 2826, // UK
          language_code: "en",
          device: "desktop",
          depth: 20
        }])
      });
      
      const data = await response.json();
      
      if (data.tasks?.[0]?.result?.[0]) {
        const serp = data.tasks[0].result[0];
        results[keyword] = {
          totalResults: serp.se_results_count,
          topCompetitors: serp.items?.slice(0, 10).map(item => ({
            position: item.rank_group,
            domain: item.domain,
            title: item.title,
            url: item.url,
            description: item.description
          })) || [],
          featuredSnippet: serp.featured_snippet || null,
          peopleAlsoAsk: serp.people_also_ask || [],
          relatedSearches: serp.related_searches || []
        };
        
        console.log(`  ✓ Found ${serp.items?.length || 0} results`);
        console.log(`  ✓ Top competitor: ${serp.items?.[0]?.domain || 'N/A'}`);
        
        if (serp.featured_snippet) {
          console.log(`  ⭐ Featured snippet opportunity!`);
        }
        if (serp.people_also_ask?.length > 0) {
          console.log(`  ❓ ${serp.people_also_ask.length} People Also Ask questions`);
        }
      }
      
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
    }
    
    await delay(1500);
  }
  
  return results;
}

// 2. KEYWORD RESEARCH WITH GOOGLE ADS API
async function keywordResearch() {
  console.log('\n💎 KEYWORD OPPORTUNITY DISCOVERY');
  console.log('-'.repeat(60));
  
  const seedKeywords = [
    'ISO 45003',
    'workplace wellbeing',
    'psychosocial risk',
    'employee mental health',
    'workplace stress assessment'
  ];
  
  const opportunities = [];
  
  for (const seed of seedKeywords) {
    console.log(`\n🌱 Seed keyword: "${seed}"`);
    
    try {
      // Get search volume and related keywords
      const response = await fetch('https://api.dataforseo.com/v3/keywords_data/google_ads/keywords_for_keywords/live', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          keywords: [seed],
          location_code: 2826,
          language_code: "en",
          sort_by: "search_volume"
        }])
      });
      
      const data = await response.json();
      
      if (data.tasks?.[0]?.result) {
        const keywords = data.tasks[0].result;
        
        keywords.forEach(kw => {
          if (kw.search_volume > 50 && kw.competition_index < 50) {
            opportunities.push({
              keyword: kw.keyword,
              volume: kw.search_volume,
              competition: kw.competition,
              competitionIndex: kw.competition_index,
              cpc: kw.cpc,
              monthlySearches: kw.monthly_searches
            });
          }
        });
        
        console.log(`  ✓ Found ${keywords.length} related keywords`);
        console.log(`  ✓ Low competition opportunities: ${opportunities.filter(o => o.keyword.includes(seed)).length}`);
      }
      
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
    }
    
    await delay(1500);
  }
  
  // Sort by opportunity score (volume / competition)
  opportunities.sort((a, b) => {
    const scoreA = a.volume / (a.competitionIndex || 100);
    const scoreB = b.volume / (b.competitionIndex || 100);
    return scoreB - scoreA;
  });
  
  return opportunities.slice(0, 30);
}

// 3. COMPETITOR ANALYSIS WITH DATAFORSEO LABS
async function analyzeCompetitors() {
  console.log('\n🎯 COMPETITOR DOMAIN ANALYSIS');
  console.log('-'.repeat(60));
  
  const competitors = [
    'mind.org.uk',
    'hse.gov.uk',
    'acas.org.uk',
    'healthassured.org',
    'robertsoncooper.com'
  ];
  
  const competitorData = {};
  
  for (const domain of competitors) {
    console.log(`\n📌 Analyzing: ${domain}`);
    
    try {
      // Get domain keywords
      const response = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          target: domain,
          location_code: 2826,
          language_code: "en",
          limit: 100,
          order_by: ["keyword_info.search_volume,desc"],
          filters: [
            ["keyword_data.keyword_info.search_volume", ">", 100]
          ]
        }])
      });
      
      const data = await response.json();
      
      if (data.tasks?.[0]?.result?.[0]) {
        const result = data.tasks[0].result[0];
        
        competitorData[domain] = {
          totalKeywords: result.total_count || 0,
          metrics: result.metrics || {},
          topKeywords: result.items?.slice(0, 20).map(item => ({
            keyword: item.keyword_data.keyword,
            position: item.keyword_data.serp_info.rank_group,
            volume: item.keyword_data.keyword_info.search_volume,
            url: item.keyword_data.serp_info.url
          })) || []
        };
        
        console.log(`  ✓ Total keywords: ${result.total_count || 0}`);
        console.log(`  ✓ Organic traffic: ${result.metrics?.organic?.etv || 0}`);
        
        if (result.items?.[0]) {
          console.log(`  ✓ Top keyword: "${result.items[0].keyword_data.keyword}" (pos ${result.items[0].keyword_data.serp_info.rank_group})`);
        }
      }
      
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
    }
    
    await delay(2000);
  }
  
  return competitorData;
}

// 4. CONTENT GAP ANALYSIS
async function findContentGaps(competitorData) {
  console.log('\n📝 CONTENT GAP ANALYSIS');
  console.log('-'.repeat(60));
  
  const allKeywords = new Map();
  
  // Aggregate all competitor keywords
  Object.entries(competitorData).forEach(([domain, data]) => {
    if (data.topKeywords) {
      data.topKeywords.forEach(kw => {
        if (!allKeywords.has(kw.keyword)) {
          allKeywords.set(kw.keyword, {
            keyword: kw.keyword,
            volume: kw.volume,
            competitors: [domain],
            bestPosition: kw.position
          });
        } else {
          allKeywords.get(kw.keyword).competitors.push(domain);
          if (kw.position < allKeywords.get(kw.keyword).bestPosition) {
            allKeywords.get(kw.keyword).bestPosition = kw.position;
          }
        }
      });
    }
  });
  
  // Find gaps (keywords multiple competitors rank for)
  const gaps = Array.from(allKeywords.values())
    .filter(kw => kw.competitors.length >= 2)
    .sort((a, b) => b.volume - a.volume);
  
  console.log(`\n✓ Found ${gaps.length} content gap opportunities`);
  console.log('✓ Top content gaps:');
  
  gaps.slice(0, 10).forEach(gap => {
    console.log(`  - "${gap.keyword}" (Vol: ${gap.volume}, ${gap.competitors.length} competitors)`);
  });
  
  return gaps;
}

// 5. GENERATE ACTION PLAN
async function generateActionPlan(serpResults, opportunities, competitorData, contentGaps) {
  console.log('\n🚀 GENERATING SEO DOMINATION PLAN');
  console.log('-'.repeat(60));
  
  const plan = [];
  
  // Quick wins from keyword opportunities
  console.log('\n1️⃣ QUICK WINS (Low Competition, High Volume):');
  opportunities.slice(0, 5).forEach(opp => {
    console.log(`   - Target: "${opp.keyword}" (${opp.volume} searches/month)`);
    plan.push({
      priority: 'HIGH',
      timeframe: '1-2 weeks',
      action: `Create optimized page for "${opp.keyword}"`,
      expectedTraffic: opp.volume,
      competition: opp.competition
    });
  });
  
  // Featured snippet opportunities
  console.log('\n2️⃣ FEATURED SNIPPET OPPORTUNITIES:');
  Object.entries(serpResults).forEach(([keyword, data]) => {
    if (!data.featuredSnippet && data.peopleAlsoAsk?.length > 0) {
      console.log(`   - Optimize for: "${keyword}"`);
      plan.push({
        priority: 'HIGH',
        timeframe: '1 week',
        action: `Create FAQ-style content for "${keyword}" targeting featured snippet`,
        expectedImpact: 'High CTR increase'
      });
    }
  });
  
  // Content gaps
  console.log('\n3️⃣ CONTENT GAP PRIORITIES:');
  contentGaps.slice(0, 5).forEach(gap => {
    console.log(`   - Create: "${gap.keyword}" content`);
    plan.push({
      priority: 'MEDIUM',
      timeframe: '2-4 weeks',
      action: `Develop comprehensive guide on "${gap.keyword}"`,
      expectedTraffic: gap.volume,
      competitors: gap.competitors.join(', ')
    });
  });
  
  return plan;
}

// MAIN EXECUTION
async function runAnalysis() {
  try {
    console.log('Starting comprehensive analysis...\n');
    
    // Run all analyses
    const serpResults = await analyzeSERP();
    const opportunities = await keywordResearch();
    const competitorData = await analyzeCompetitors();
    const contentGaps = await findContentGaps(competitorData);
    const actionPlan = await generateActionPlan(serpResults, opportunities, competitorData, contentGaps);
    
    // Save results
    const results = {
      timestamp: new Date().toISOString(),
      serp: serpResults,
      keywordOpportunities: opportunities,
      competitors: competitorData,
      contentGaps: contentGaps.slice(0, 50),
      actionPlan
    };
    
    // Save JSON
    const filename = `seo-pro-analysis-${new Date().toISOString().split('T')[0]}.json`;
    await fs.writeFile(filename, JSON.stringify(results, null, 2));
    
    // Create markdown report
    let report = `# SEO Domination Report - Lighthouse Mentoring
Generated: ${new Date().toLocaleString()}

## 📊 Executive Summary

### Key Metrics:
- **Keyword Opportunities Found**: ${opportunities.length}
- **Content Gaps Identified**: ${contentGaps.length}
- **Action Items Generated**: ${actionPlan.length}

## 💎 Top Keyword Opportunities

| Keyword | Volume | Competition | Score |
|---------|--------|-------------|-------|
`;

    opportunities.slice(0, 15).forEach(opp => {
      const score = (opp.volume / (opp.competitionIndex || 100)).toFixed(2);
      report += `| ${opp.keyword} | ${opp.volume} | ${opp.competition} | ${score} |\n`;
    });

    report += `\n## 📝 Content Gaps to Fill\n\n`;
    contentGaps.slice(0, 10).forEach(gap => {
      report += `- **${gap.keyword}** - Volume: ${gap.volume}, Competitors: ${gap.competitors.join(', ')}\n`;
    });

    report += `\n## 🚀 30-Day Action Plan\n\n`;
    actionPlan.forEach((item, i) => {
      report += `### ${i + 1}. ${item.action}\n`;
      report += `- Priority: ${item.priority}\n`;
      report += `- Timeframe: ${item.timeframe}\n`;
      if (item.expectedTraffic) report += `- Expected Traffic: ${item.expectedTraffic}\n`;
      report += `\n`;
    });
    
    const reportFilename = `seo-pro-report-${new Date().toISOString().split('T')[0]}.md`;
    await fs.writeFile(reportFilename, report);
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ ANALYSIS COMPLETE!');
    console.log(`📄 Report saved to: ${reportFilename}`);
    console.log(`💾 Data saved to: ${filename}`);
    
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

// Run the analysis
runAnalysis();