import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const auth = process.env.DATAFORSEO_AUTH || 'Y3JhaWcuZmVhcm5AbGlnaHRob3VzZW1lbnRvcmluZy5jby51azo5YTJjNmFjZTJiZjhiNjI2';

async function testConnection() {
  console.log('Testing DataForSEO connection...\n');
  console.log('Auth token:', auth.substring(0, 20) + '...');
  
  // Test 1: Check account status
  console.log('\n1. Testing Account Status:');
  try {
    const response = await fetch('https://api.dataforseo.com/v3/appendix/user_data', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.tasks && data.tasks[0]) {
      console.log('\n✅ Account info:');
      console.log('- Balance:', data.tasks[0].result?.money?.balance);
      console.log('- Plan:', data.tasks[0].result?.price?.plan_name);
    }
  } catch (error) {
    console.error('❌ Account check failed:', error);
  }
  
  // Test 2: Simple keyword data
  console.log('\n2. Testing Keyword Data API:');
  try {
    const response = await fetch('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        keywords: ['ISO 45003'],
        location_code: 2826,
        language_code: "en"
      }])
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Keyword data failed:', error);
  }
  
  // Test 3: SERP API
  console.log('\n3. Testing SERP API:');
  try {
    const response = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/regular', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        keyword: 'ISO 45003',
        location_code: 2826,
        language_code: "en",
        device: "desktop",
        depth: 10
      }])
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    
    if (data.tasks && data.tasks[0] && data.tasks[0].result) {
      console.log('✅ SERP data received');
      console.log('- Items found:', data.tasks[0].result[0]?.items?.length || 0);
      console.log('- First result:', data.tasks[0].result[0]?.items?.[0]?.title || 'N/A');
    } else {
      console.log('Full response:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ SERP API failed:', error);
  }
  
  // Test 4: DataForSEO Labs
  console.log('\n4. Testing DataForSEO Labs API:');
  try {
    const response = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        target: 'mind.org.uk',
        location_code: 2826,
        language_code: "en",
        limit: 10
      }])
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    
    if (data.tasks && data.tasks[0] && data.tasks[0].result) {
      console.log('✅ Labs data received');
      console.log('- Keywords found:', data.tasks[0].result[0]?.total_count || 0);
      console.log('- First keyword:', data.tasks[0].result[0]?.items?.[0]?.keyword || 'N/A');
    } else {
      console.log('Full response:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Labs API failed:', error);
  }
}

testConnection();