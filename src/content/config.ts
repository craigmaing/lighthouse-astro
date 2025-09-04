import { defineCollection, z } from 'astro:content';

// Testimonials collection for social proof
const testimonials = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    company: z.string(),
    content: z.string(),
    rating: z.number().min(1).max(5),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    date: z.string().optional()
  })
});

// Services collection for wellbeing audit packages
const services = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    price: z.object({
      from: z.number(),
      to: z.number().optional(),
      currency: z.string().default('GBP')
    }),
    features: z.array(z.string()),
    deliverables: z.array(z.string()),
    timeline: z.string(),
    ideal_for: z.string(),
    cta_text: z.string().default('Get Started'),
    order: z.number().default(0),
    popular: z.boolean().default(false)
  })
});

// Blog collection for SEO and thought leadership
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Craig Fearn'),
    category: z.enum(['wellbeing', 'iso-45003', 'case-study', 'research', 'insights']),
    tags: z.array(z.string()),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

// Case studies collection
const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    company: z.string(),
    industry: z.string(),
    size: z.string(),
    challenge: z.string(),
    solution: z.string(),
    results: z.array(z.object({
      metric: z.string(),
      improvement: z.string()
    })),
    testimonial: z.string().optional(),
    image: z.string().optional(),
    date: z.coerce.date()
  })
});

export const collections = {
  testimonials,
  services,
  blog,
  'case-studies': caseStudies
};