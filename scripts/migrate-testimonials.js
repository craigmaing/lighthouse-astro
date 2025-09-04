// Script to migrate testimonials to content collections
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import existing testimonials
const testimonials = [
  {
    name: "Richard Sharpe",
    role: "C-Suite Operational Board Leader",
    company: "IOD Colleague",
    content: "Craig's expertise in mental health support is unrivalled. His innate ability to disseminate complex and sensitive situations with care and insight, always with a practical results-driven approach, makes him an invaluable asset to any organization he supports.",
    rating: 5,
    featured: true
  },
  {
    name: "Andrew Honey CDir FIoD",
    role: "Non-Executive Director",
    company: "Board Advisor",
    content: "Craig helps Directors improve overall business performance by making people matter. Much more than an Employee Assistance Programme - this is about understanding what wellbeing really means for organizational success.",
    rating: 5,
    featured: true
  },
  {
    name: "Chris Saxby",
    role: "Executive & Non-Executive Leader",
    company: "Engineering Better Futures",
    content: "Craig's professional focus on wellbeing leadership has been evident to all attending - not with a salesman's pitch, but through his natural affinity for the subject within his daily approach to all his activities. Craig is someone who leaders find engaging, knowledgeable, and easy to deal with.",
    rating: 5,
    featured: true
  },
  {
    name: "Dianne Knight CertPFS",
    role: "Area Manager SME Business Banking",
    company: "HSBC UK",
    content: "Craig is the ultimate professional. He taught me so much about how I think and value what I think. The tools he provided are guiding me well and I am excited for my future at work now.",
    rating: 5,
    featured: true
  },
  {
    name: "Terry Mullins",
    role: "Founder",
    company: "The Reluctant Salesman Ltd",
    content: "It would be hard to imagine a better qualified Wellbeing practitioner than Craig Fearn. In an area that is attracting people who have little experience or real qualifications, Craig stands out as a true professional.",
    rating: 5,
    featured: true
  },
  {
    name: "Tim Etherington-Judge",
    role: "Founder",
    company: "Healthy Hospo",
    content: "What sets Craig apart is not his encyclopedic knowledge of his subject matter, it's his empathy and ability to speak from a place of first hand experience. I recommend his services to everyone that is in need of mental health support.",
    rating: 5,
    featured: true
  }
];

// Create testimonials directory if it doesn't exist
const testimonialsDir = path.join(__dirname, '..', 'src', 'content', 'testimonials');
if (!fs.existsSync(testimonialsDir)) {
  fs.mkdirSync(testimonialsDir, { recursive: true });
}

// Write each testimonial as a JSON file
testimonials.forEach((testimonial, index) => {
  const filename = `${index + 1}-${testimonial.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.json`;
  const filepath = path.join(testimonialsDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(testimonial, null, 2));
  console.log(`Created: ${filename}`);
});

console.log(`\nMigrated ${testimonials.length} testimonials to content collections!`);