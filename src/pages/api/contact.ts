import type { APIRoute } from 'astro';
import { db, Inquiries } from 'astro:db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validate required fields
    const required = ['name', 'email', 'company', 'message'];
    for (const field of required) {
      if (!data[field]) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Missing required field: ${field}` 
          }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid email format' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Save to Astro DB
    try {
      const inquiry = await db.insert(Inquiries).values({
        name: data.name,
        email: data.email,
        company: data.company,
        employees: data.employees || null,
        message: data.message,
        source: request.headers.get('referer') || 'direct',
        status: 'new',
        followedUp: false
      }).returning();
      
      console.log('New inquiry saved to database:', {
        id: inquiry[0].id,
        name: data.name,
        company: data.company,
        timestamp: new Date().toISOString()
      });
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue even if DB save fails - don't lose the lead
      console.log('Fallback - Contact form submission:', {
        ...data,
        timestamp: new Date().toISOString(),
        source: request.headers.get('referer') || 'unknown'
      });
    }
    
    // TODO: Add email notification
    // TODO: Add CRM integration
    // TODO: Add conversion tracking
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Thank you for your inquiry. We\'ll be in touch within 24 hours.',
        data: {
          name: data.name,
          company: data.company
        }
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
    console.error('Contact form error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'An error occurred processing your request' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// Optional: Add GET endpoint for testing
export const GET: APIRoute = async () => {
  let dbStatus = 'unknown';
  let inquiryCount = 0;
  
  try {
    // Test database connection and get count
    const inquiries = await db.select().from(Inquiries).all();
    inquiryCount = inquiries.length;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
    console.error('Database connection test failed:', error);
  }
  
  return new Response(
    JSON.stringify({ 
      status: 'Contact API is running',
      database: dbStatus,
      totalInquiries: inquiryCount,
      accepts: 'POST requests with name, email, company, message, employees (optional)',
      endpoint: '/api/contact',
      features: [
        'Form validation',
        'Email format validation',
        'Database persistence with Astro DB',
        'Automatic source tracking',
        'Fallback logging if DB fails'
      ]
    }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};