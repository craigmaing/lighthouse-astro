import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const auth = process.env.DATAFORSEO_AUTH || 'Y3JhaWcuZmVhcm5AbGlnaHRob3VzZW1lbnRvcmluZy5jby51azo5YTJjNmFjZTJiZjhiNjI2';

class SEODominationSuite {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      competitors: {},
      keywords: {},
      backlinks: {},
      contentGaps: [],
      opportunities: [],
      actionPlan: []
    };
  }

  // 1. DEEP COMPETITOR ANALYSIS
  async analyzeCompetitors() {
    console.log('\n🎯 PHASE 1: DEEP COMPETITOR ANALYSIS');
    console.log('='.repeat(60));
    
    const competitors = [
      'robertsoncooper.com',
      'validium.com',
      'healthassured.org',
      'mind.org.uk',
      'thrivewellbeing.org',
      'worklifepsych.com',
      'hse.gov.uk',
      'acas.org.uk'
    ];

    for (const domain of competitors) {
      console.log(`\n📊 Analyzing ${domain}...`);
      
      // Get domain metrics
      const metrics = await this.getDomainMetrics(domain);
      
      // Get their top keywords
      const keywords = await this.getCompetitorKeywords(domain);
      
      // Get their backlink profile
      const backlinks = await this.getBacklinkProfile(domain);
      
      this.results.competitors[domain] = {
        metrics,
        topKeywords: keywords?.items?.slice(0, 20) || [],
        backlinks: backlinks || {},
        totalKeywords: keywords?.total_count || 0,
        estimatedTraffic: keywords?.items?.reduce((sum, k) => sum + (k.keyword_info?.search_volume || 0), 0) || 0
      };
      
      console.log(`  ✓ Found ${keywords?.total_count || 0} keywords`);
      console.log(`  ✓ Estimated traffic: ${this.results.competitors[domain].estimatedTraffic}`);
      
      await this.delay(1000);
    }
  }

  // 2. KEYWORD GOLDMINE DISCOVERY
  async discoverKeywordOpportunities() {
    console.log('\n💎 PHASE 2: KEYWORD GOLDMINE DISCOVERY');
    console.log('='.repeat(60));
    
    const seedKeywords = [
      'ISO 45003',
      'workplace wellbeing audit',
      'psychosocial risk assessment',
      'workplace mental health',
      'employee wellbeing assessment',
      'stress risk assessment',
      'wellbeing consultant',
      'mental health audit',
      'workplace stress management',
      'organisational psychology consultant'
    ];

    for (const seed of seedKeywords) {
      console.log(`\n🔍 Exploring: "${seed}"`);
      
      // Get keyword suggestions
      const suggestions = await this.getKeywordIdeas(seed);
      
      // Get related keywords
      const related = await this.getRelatedKeywords(seed);
      
      // Get questions
      const questions = await this.getQuestionKeywords(seed);
      
      // Analyze keyword difficulty
      const opportunities = [];
      
      if (suggestions?.items) {
        for (const item of suggestions.items.slice(0, 10)) {
          const difficulty = await this.getKeywordDifficulty(item.keyword);
          
          if (difficulty && difficulty < 40 && item.keyword_info?.search_volume > 50) {
            opportunities.push({
              keyword: item.keyword,
              volume: item.keyword_info?.search_volume || 0,
              cpc: item.keyword_info?.cpc || 0,
              difficulty: difficulty,
              intent: item.keyword_info?.intent || 'unknown',
              score: (item.keyword_info?.search_volume || 0) / (difficulty || 100)
            });
          }
          
          await this.delay(500);
        }
      }
      
      this.results.keywords[seed] = {
        suggestions: suggestions?.items?.slice(0, 20) || [],
        related: related?.items?.slice(0, 20) || [],
        questions: questions || [],
        opportunities: opportunities.sort((a, b) => b.score - a.score)
      };
      
      console.log(`  ✓ Found ${opportunities.length} low-competition opportunities`);
    }
  }

  // 3. BACKLINK OPPORTUNITIES
  async findBacklinkOpportunities() {
    console.log('\n🔗 PHASE 3: BACKLINK OPPORTUNITY SCANNING');
    console.log('='.repeat(60));
    
    const competitorBacklinks = {};
    const linkOpportunities = [];
    
    // Analyze competitor backlinks
    for (const domain of Object.keys(this.results.competitors).slice(0, 3)) {
      console.log(`\n📌 Analyzing backlinks for ${domain}...`);
      
      const backlinks = await this.getCompetitorBacklinks(domain);
      
      if (backlinks?.items) {
        competitorBacklinks[domain] = backlinks.items.slice(0, 50);
        
        // Find high-quality link sources
        for (const link of backlinks.items) {
          if (link.rank >= 50 && !link.domain.includes('lighthouse')) {
            linkOpportunities.push({
              source: link.domain,
              targetCompetitor: domain,
              rank: link.rank,
              type: link.type,
              dofollow: link.dofollow
            });
          }
        }
      }
      
      await this.delay(1000);
    }
    
    // Find common link sources (multiple competitors have links from them)
    const sourceDomains = {};
    linkOpportunities.forEach(opp => {
      if (!sourceDomains[opp.source]) {
        sourceDomains[opp.source] = [];
      }
      sourceDomains[opp.source].push(opp.targetCompetitor);
    });
    
    const commonSources = Object.entries(sourceDomains)
      .filter(([source, competitors]) => competitors.length >= 2)
      .map(([source, competitors]) => ({
        source,
        competitors,
        priority: 'HIGH'
      }));
    
    this.results.backlinks = {
      opportunities: linkOpportunities.slice(0, 50),
      commonSources,
      totalOpportunities: linkOpportunities.length
    };
    
    console.log(`  ✓ Found ${linkOpportunities.length} backlink opportunities`);
    console.log(`  ✓ Found ${commonSources.length} high-priority sources`);
  }

  // 4. CONTENT GAP ANALYSIS
  async analyzeContentGaps() {
    console.log('\n📝 PHASE 4: CONTENT GAP ANALYSIS');
    console.log('='.repeat(60));
    
    const ourKeywords = new Set();
    const competitorKeywords = new Map();
    
    // Aggregate all competitor keywords
    for (const [domain, data] of Object.entries(this.results.competitors)) {
      if (data.topKeywords) {
        data.topKeywords.forEach(k => {
          if (!competitorKeywords.has(k.keyword)) {
            competitorKeywords.set(k.keyword, {
              keyword: k.keyword,
              volume: k.keyword_info?.search_volume || 0,
              competitors: [domain],
              avgPosition: k.serp_item?.rank_group || 0
            });
          } else {
            competitorKeywords.get(k.keyword).competitors.push(domain);
          }
        });
      }
    }
    
    // Find gaps (keywords multiple competitors rank for that we don't)
    const gaps = Array.from(competitorKeywords.values())
      .filter(k => k.competitors.length >= 2 && k.volume > 100)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 50);
    
    this.results.contentGaps = gaps;
    
    console.log(`  ✓ Identified ${gaps.length} content gaps`);
    console.log(`  ✓ Total search volume opportunity: ${gaps.reduce((sum, g) => sum + g.volume, 0)}`);
  }

  // 5. SERP FEATURE OPPORTUNITIES
  async analyzeSERPFeatures() {
    console.log('\n🏆 PHASE 5: SERP FEATURE OPPORTUNITIES');
    console.log('='.repeat(60));
    
    const featureOpportunities = [];
    const targetKeywords = [
      'ISO 45003 implementation',
      'workplace wellbeing audit checklist',
      'psychosocial hazards examples',
      'mental health risk assessment template',
      'wellbeing ROI calculator'
    ];
    
    for (const keyword of targetKeywords) {
      console.log(`\n🔎 Analyzing SERP for: "${keyword}"`);
      
      const serp = await this.getSERPAnalysis(keyword);
      
      if (serp) {
        const features = {
          keyword,
          hasFeatureSnippet: serp.featured_snippet ? true : false,
          hasPeopleAlsoAsk: serp.people_also_ask ? true : false,
          hasKnowledgeGraph: serp.knowledge_graph ? true : false,
          hasLocalPack: serp.local_pack ? true : false,
          topCompetitors: serp.items?.slice(0, 3).map(i => i.domain) || []
        };
        
        featureOpportunities.push(features);
        
        if (features.hasFeatureSnippet) {
          console.log(`  ⭐ Featured snippet opportunity!`);
        }
        if (features.hasPeopleAlsoAsk) {
          console.log(`  ❓ People Also Ask opportunity!`);
        }
      }
      
      await this.delay(1000);
    }
    
    this.results.serpFeatures = featureOpportunities;
  }

  // 6. GENERATE ACTION PLAN
  async generateActionPlan() {
    console.log('\n🚀 PHASE 6: GENERATING DOMINATION STRATEGY');
    console.log('='.repeat(60));
    
    const plan = [];
    
    // Quick wins (low difficulty, high volume keywords)
    const quickWins = [];
    for (const [seed, data] of Object.entries(this.results.keywords)) {
      if (data.opportunities) {
        quickWins.push(...data.opportunities.slice(0, 3));
      }
    }
    
    quickWins.sort((a, b) => b.score - a.score).slice(0, 10).forEach(kw => {
      plan.push({
        priority: 'HIGH',
        timeframe: '1-2 weeks',
        action: `Create optimized page for "${kw.keyword}"`,
        impact: `${kw.volume} monthly searches, difficulty ${kw.difficulty}/100`,
        type: 'content'
      });
    });
    
    // Content gaps
    this.results.contentGaps.slice(0, 10).forEach(gap => {
      plan.push({
        priority: 'HIGH',
        timeframe: '2-4 weeks',
        action: `Create content for "${gap.keyword}"`,
        impact: `${gap.volume} monthly searches, ${gap.competitors.length} competitors ranking`,
        type: 'content'
      });
    });
    
    // Backlink opportunities
    this.results.backlinks.commonSources?.slice(0, 5).forEach(source => {
      plan.push({
        priority: 'MEDIUM',
        timeframe: '1-3 months',
        action: `Outreach to ${source.source} for backlink`,
        impact: `Used by ${source.competitors.length} competitors`,
        type: 'backlink'
      });
    });
    
    // Technical optimizations
    plan.push({
      priority: 'HIGH',
      timeframe: 'Immediate',
      action: 'Implement schema markup for Organization, Person, Service',
      impact: 'Improved SERP visibility and CTR',
      type: 'technical'
    });
    
    plan.push({
      priority: 'MEDIUM',
      timeframe: '1 week',
      action: 'Create FAQ schema for common wellbeing audit questions',
      impact: 'Target People Also Ask featured snippets',
      type: 'technical'
    });
    
    this.results.actionPlan = plan;
    
    console.log(`\n✅ Generated ${plan.length} action items`);
  }

  // Helper methods
  async getDomainMetrics(domain) {
    try {
      const response = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/google/domain_metrics_by_categories/live', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          target: domain,
          location_code: 2826,
          language_code: "en"
        }])
      });
      
      const data = await response.json();
      return data.tasks?.[0]?.result?.[0] || null;
    } catch (error) {
      console.error(`Error getting domain metrics for ${domain}:`, error.message);
      return null;
    }
  }

  async getCompetitorKeywords(domain) {
    try {
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
          limit: 1000,
          order_by: ["keyword_info.search_volume,desc"]
        }])
      });
      
      const data = await response.json();
      return data.tasks?.[0]?.result?.[0] || null;
    } catch (error) {
      console.error(`Error getting keywords for ${domain}:`, error.message);
      return null;
    }
  }

  async getBacklinkProfile(domain) {
    try {
      const response = await fetch('https://api.dataforseo.com/v3/backlinks/summary/live', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          target: domain,
          internal_list_limit: 10,
          backlinks_status_type: "live"
        }])
      });
      
      const data = await response.json();
      return data.tasks?.[0]?.result?.[0] || null;
    } catch (error) {
      console.error(`Error getting backlink profile for ${domain}:`, error.message);
      return null;
    }
  }

  async getKeywordIdeas(seed) {
    try {
      const response = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_ideas/live', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          keywords: [seed],
          location_code: 2826,
          language_code: "en",
          limit: 100,
          include_seed_keyword: true,
          order_by: ["keyword_info.search_volume,desc"]
        }])
      });
      
      const data = await response.json();
      return data.tasks?.[0]?.result?.[0] || null;
    } catch (error) {
      console.error(`Error getting keyword ideas for ${seed}:`, error.message);
      return null;
    }
  }

  async getRelatedKeywords(seed) {
    try {
      const response = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/google/related_keywords/live', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          keyword: seed,
          location_code: 2826,
          language_code: "en",
          depth: 2,
          limit: 50
        }])
      });
      
      const data = await response.json();
      return data.tasks?.[0]?.result?.[0] || null;
    } catch (error) {
      console.error(`Error getting related keywords for ${seed}:`, error.message);
      return null;
    }
  }

  async getQuestionKeywords(seed) {
    try {
      const response = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/regular', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          keyword: seed,
          location_code: 2826,
          language_code: "en",
          device: "desktop",
          depth: 100
        }])
      });
      
      const data = await response.json();
      const serp = data.tasks?.[0]?.result?.[0];
      
      if (serp?.people_also_ask) {
        return serp.people_also_ask.map(q => q.title);
      }
      
      return [];
    } catch (error) {
      console.error(`Error getting question keywords for ${seed}:`, error.message);
      return [];
    }
  }

  async getKeywordDifficulty(keyword) {
    try {
      const response = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_difficulty/live', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          keywords: [keyword],
          location_code: 2826,
          language_code: "en"
        }])
      });
      
      const data = await response.json();
      return data.tasks?.[0]?.result?.[0]?.items?.[0]?.keyword_difficulty || null;
    } catch (error) {
      console.error(`Error getting keyword difficulty for ${keyword}:`, error.message);
      return null;
    }
  }

  async getCompetitorBacklinks(domain) {
    try {
      const response = await fetch('https://api.dataforseo.com/v3/backlinks/backlinks/live', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          target: domain,
          mode: "as_is",
          filters: ["dofollow", "=", true],
          order_by: ["rank,desc"],
          limit: 100
        }])
      });
      
      const data = await response.json();
      return data.tasks?.[0]?.result?.[0] || null;
    } catch (error) {
      console.error(`Error getting backlinks for ${domain}:`, error.message);
      return null;
    }
  }

  async getSERPAnalysis(keyword) {
    try {
      const response = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/regular', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          keyword: keyword,
          location_code: 2826,
          language_code: "en",
          device: "desktop",
          depth: 10
        }])
      });
      
      const data = await response.json();
      return data.tasks?.[0]?.result?.[0] || null;
    } catch (error) {
      console.error(`Error analyzing SERP for ${keyword}:`, error.message);
      return null;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Save results to file
  async saveResults() {
    const filename = `seo-analysis-${new Date().toISOString().split('T')[0]}.json`;
    await fs.writeFile(
      path.join(__dirname, filename),
      JSON.stringify(this.results, null, 2)
    );
    console.log(`\n💾 Results saved to ${filename}`);
    
    // Also create a markdown report
    await this.generateMarkdownReport();
  }

  async generateMarkdownReport() {
    let report = `# SEO Domination Strategy Report
Generated: ${new Date().toLocaleString()}

## 🎯 Executive Summary

### Key Opportunities Identified:
- **Quick Win Keywords**: ${Object.values(this.results.keywords).reduce((sum, k) => sum + (k.opportunities?.length || 0), 0)} low-competition keywords
- **Content Gaps**: ${this.results.contentGaps.length} high-value topics competitors rank for
- **Backlink Opportunities**: ${this.results.backlinks.totalOpportunities} potential link sources
- **Total Traffic Opportunity**: ${this.results.contentGaps.reduce((sum, g) => sum + g.volume, 0).toLocaleString()} monthly searches

## 📊 Competitor Analysis

| Competitor | Keywords Ranking | Est. Traffic | Top Position |
|------------|-----------------|--------------|--------------|
`;

    for (const [domain, data] of Object.entries(this.results.competitors)) {
      report += `| ${domain} | ${data.totalKeywords.toLocaleString()} | ${data.estimatedTraffic.toLocaleString()} | ${data.topKeywords[0]?.keyword || 'N/A'} |\n`;
    }

    report += `\n## 💎 Top Keyword Opportunities\n\n`;
    report += `### Quick Wins (Low Difficulty, High Volume)\n\n`;

    const allOpportunities = [];
    for (const data of Object.values(this.results.keywords)) {
      if (data.opportunities) {
        allOpportunities.push(...data.opportunities);
      }
    }
    
    allOpportunities.sort((a, b) => b.score - a.score).slice(0, 15).forEach(kw => {
      report += `- **${kw.keyword}** - Volume: ${kw.volume}, Difficulty: ${kw.difficulty}/100, Score: ${kw.score.toFixed(2)}\n`;
    });

    report += `\n## 📝 Content Gap Analysis\n\n`;
    report += `### High-Priority Topics to Create:\n\n`;

    this.results.contentGaps.slice(0, 15).forEach(gap => {
      report += `- **${gap.keyword}** - Volume: ${gap.volume}, Competitors: ${gap.competitors.join(', ')}\n`;
    });

    report += `\n## 🔗 Backlink Opportunities\n\n`;
    report += `### High-Priority Sources (Multiple Competitors Use):\n\n`;

    this.results.backlinks.commonSources?.slice(0, 10).forEach(source => {
      report += `- **${source.source}** - Used by: ${source.competitors.join(', ')}\n`;
    });

    report += `\n## 🚀 30-Day Action Plan\n\n`;

    const byPriority = {
      HIGH: [],
      MEDIUM: [],
      LOW: []
    };

    this.results.actionPlan.forEach(item => {
      byPriority[item.priority]?.push(item);
    });

    for (const [priority, items] of Object.entries(byPriority)) {
      if (items.length > 0) {
        report += `### ${priority} Priority:\n\n`;
        items.forEach(item => {
          report += `- **${item.action}**\n`;
          report += `  - Timeframe: ${item.timeframe}\n`;
          report += `  - Impact: ${item.impact}\n\n`;
        });
      }
    }

    const reportFilename = `seo-domination-report-${new Date().toISOString().split('T')[0]}.md`;
    await fs.writeFile(
      path.join(__dirname, reportFilename),
      report
    );
    
    console.log(`📄 Report saved to ${reportFilename}`);
  }

  async run() {
    console.log('🚀 LIGHTHOUSE MENTORING SEO DOMINATION SUITE');
    console.log('=' .repeat(60));
    console.log('Starting comprehensive SEO analysis...\n');
    
    try {
      await this.analyzeCompetitors();
      await this.discoverKeywordOpportunities();
      await this.findBacklinkOpportunities();
      await this.analyzeContentGaps();
      await this.analyzeSERPFeatures();
      await this.generateActionPlan();
      await this.saveResults();
      
      console.log('\n' + '='.repeat(60));
      console.log('✅ SEO DOMINATION ANALYSIS COMPLETE!');
      console.log('=' .repeat(60));
      
      // Print summary
      console.log('\n📈 QUICK SUMMARY:');
      console.log(`- Analyzed ${Object.keys(this.results.competitors).length} competitors`);
      console.log(`- Discovered ${Object.values(this.results.keywords).reduce((sum, k) => sum + (k.opportunities?.length || 0), 0)} keyword opportunities`);
      console.log(`- Found ${this.results.contentGaps.length} content gaps`);
      console.log(`- Identified ${this.results.backlinks.totalOpportunities} backlink opportunities`);
      console.log(`- Generated ${this.results.actionPlan.length} action items`);
      
    } catch (error) {
      console.error('Error during analysis:', error);
    }
  }
}

// Run the analysis
const suite = new SEODominationSuite();
suite.run();