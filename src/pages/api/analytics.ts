import type { APIRoute } from 'astro';
import { db, Analytics, PageViews } from 'astro:db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Content-Type must be application/json' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const data = await request.json();
    
    // Handle Web Vitals metrics
    if (data.metric) {
      try {
        // Validate metric data
        if (!data.value || !data.page) {
          throw new Error('Missing required fields: value and page');
        }
        
        // Save Web Vitals to Analytics table
        await db.insert(Analytics).values({
          metric: data.metric,
          value: data.value,
          rating: data.rating || 'unknown',
          page: data.page,
          sessionId: data.sessionId || crypto.randomUUID()
        });
        
        console.log('Web Vitals saved:', {
          metric: data.metric,
          value: data.value,
          rating: data.rating,
          page: data.page
        });
        
      } catch (dbError) {
        console.error('Database error saving metrics:', dbError);
        // Continue with fallback logging
        console.log('Fallback - Analytics:', {
          metric: data.metric,
          value: data.value,
          rating: data.rating,
          page: data.page,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Handle page view tracking
    if (data.type === 'pageview') {
      try {
        await db.insert(PageViews).values({
          path: data.path || request.headers.get('referer') || '/',
          referrer: data.referrer || request.headers.get('referer'),
          userAgent: request.headers.get('user-agent'),
          sessionId: data.sessionId || crypto.randomUUID()
        });
        
        console.log('Page view tracked:', data.path);
        
      } catch (dbError) {
        console.error('Database error saving page view:', dbError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Analytics data received'
      }), 
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
    
  } catch (error) {
    console.error('Analytics API error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// GET endpoint for analytics summary
export const GET: APIRoute = async ({ url }) => {
  try {
    const metric = url.searchParams.get('metric');
    const page = url.searchParams.get('page');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    
    let query = db.select().from(Analytics);
    
    // Apply filters if provided
    if (metric) {
      query = query.where('metric', '=', metric);
    }
    if (page) {
      query = query.where('page', '=', page);
    }
    
    const results = await query.limit(limit).all();
    
    // Calculate summary statistics
    const summary = {
      totalRecords: results.length,
      metrics: {} as Record<string, any>
    };
    
    // Group by metric type
    results.forEach(record => {
      if (!summary.metrics[record.metric]) {
        summary.metrics[record.metric] = {
          count: 0,
          values: [],
          averageValue: 0,
          ratings: { good: 0, 'needs-improvement': 0, poor: 0 }
        };
      }
      
      const metricData = summary.metrics[record.metric];
      metricData.count++;
      metricData.values.push(record.value);
      if (record.rating && record.rating in metricData.ratings) {
        metricData.ratings[record.rating as keyof typeof metricData.ratings]++;
      }
    });
    
    // Calculate averages
    Object.keys(summary.metrics).forEach(metric => {
      const metricData = summary.metrics[metric];
      metricData.averageValue = 
        metricData.values.reduce((a: number, b: number) => a + b, 0) / metricData.values.length;
      delete metricData.values; // Remove raw values from response
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        summary,
        filters: { metric, page, limit }
      }),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'max-age=60' // Cache for 1 minute
        }
      }
    );
    
  } catch (error) {
    console.error('Analytics GET error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to retrieve analytics data'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};