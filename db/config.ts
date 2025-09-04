import { defineDb, defineTable, column, NOW } from 'astro:db';

// Define the Inquiries table for storing contact form submissions
const Inquiries = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    // Contact information
    name: column.text(),
    email: column.text(),
    company: column.text(),
    employees: column.text({ optional: true }),
    
    // Message content
    message: column.text(),
    
    // Metadata
    source: column.text({ optional: true }), // Which page they came from
    status: column.text({ default: 'new' }), // new, contacted, qualified, converted
    
    // Timestamps
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ optional: true }),
    
    // Follow-up tracking
    followedUp: column.boolean({ default: false }),
    followUpDate: column.date({ optional: true }),
    notes: column.text({ optional: true })
  },
  indexes: [
    { on: ["email"], unique: false },
    { on: ["status"], unique: false },
    { on: ["createdAt"], unique: false }
  ]
});

// Analytics table for tracking web vitals
const Analytics = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    metric: column.text(), // LCP, FCP, CLS, etc.
    value: column.number(),
    rating: column.text(), // good, needs-improvement, poor
    page: column.text(),
    sessionId: column.text(),
    timestamp: column.date({ default: NOW })
  },
  indexes: [
    { on: ["metric"], unique: false },
    { on: ["page"], unique: false },
    { on: ["timestamp"], unique: false }
  ]
});

// Page views table for basic analytics
const PageViews = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    path: column.text(),
    referrer: column.text({ optional: true }),
    userAgent: column.text({ optional: true }),
    sessionId: column.text(),
    timestamp: column.date({ default: NOW })
  },
  indexes: [
    { on: ["path"], unique: false },
    { on: ["timestamp"], unique: false }
  ]
});

// Export the database configuration
export default defineDb({
  tables: { 
    Inquiries,
    Analytics,
    PageViews
  }
});