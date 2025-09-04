export const testimonials = [
  // Corporate Leaders & Directors
  {
    name: "Richard Sharpe",
    role: "C-Suite Operational Board Leader",
    company: "IOD Colleague",
    content: "Craig's expertise in mental health support is unrivalled. His innate ability to disseminate complex and sensitive situations with care and insight, always with a practical results-driven approach, makes him an invaluable asset to any organization he supports.",
    category: "corporate",
    featured: true
  },
  {
    name: "Andrew Honey CDir FIoD",
    role: "Non-Executive Director",
    company: "Board Advisor",
    content: "Craig helps Directors improve overall business performance by making people matter. Much more than an Employee Assistance Programme - this is about understanding what wellbeing really means for organizational success.",
    category: "corporate",
    featured: true
  },
  {
    name: "Chris Saxby",
    role: "Executive & Non-Executive Leader",
    company: "Engineering Better Futures",
    content: "Craig's professional focus on wellbeing leadership has been evident to all attending - not with a salesman's pitch, but through his natural affinity for the subject within his daily approach to all his activities. Craig is someone who leaders find engaging, knowledgeable, and easy to deal with.",
    category: "corporate",
    featured: true
  },
  {
    name: "Des Bell",
    role: "Managing Director",
    company: "Furniss of Cornwall Ltd",
    content: "I would like to recommend Craig's Leadership, Organisational and Interpersonal skills. Craig has grown the membership, galvanised diverse opinions, and provided Leadership on business issues: Highly recommended for these qualities.",
    category: "corporate"
  },
  
  // Banking & Financial Services
  {
    name: "Dianne Knight CertPFS",
    role: "Area Manager SME Business Banking",
    company: "HSBC UK",
    content: "Craig is the ultimate professional. He taught me so much about how I think and value what I think. The tools he provided are guiding me well and I am excited for my future at work now.",
    category: "banking",
    featured: true
  },
  
  // Business Owners & Entrepreneurs
  {
    name: "Phil Tottman",
    role: "Co-Founder",
    company: "Book of Beasties",
    content: "Craig has had such a profound and positive impact on Book of Beasties. He came into the company with a level of understanding, empathy and guidance that has been unmatched, reinvigorating the mission and the team through his support.",
    category: "business"
  },
  {
    name: "Terry Mullins",
    role: "Founder",
    company: "The Reluctant Salesman Ltd",
    content: "It would be hard to imagine a better qualified Wellbeing practitioner than Craig Fearn. In an area that is attracting people who have little experience or real qualifications, Craig stands out as a true professional.",
    category: "business",
    featured: true
  },
  
  // B2B Clients
  {
    name: "David McGuire",
    role: "B2B Copywriting and Creativity Trainer",
    company: "",
    content: "We wanted to give our people flexible, confidential access to expert psychological support as and when they needed it. Craig has enabled us to do exactly that, and the feedback has been excellent.",
    category: "b2b"
  },
  
  // Hospitality Industry
  {
    name: "Michael Redgewell",
    role: "Regional Development Manager",
    company: "Edrington UK",
    content: "Craig has been a fantastic support and helped us drive forward the project making it the best possible setup for the people it's designed to help. It is now an absolute pleasure to read the wonderful feedback he and the project receives.",
    category: "hospitality"
  },
  {
    name: "Nidal Ramini",
    role: "Advocacy Director",
    company: "Brown-Forman",
    content: "Craig delivered an informative, engaging and insightful session on coping with stress and dealing with anxiety. I can't recommend Craig highly enough.",
    category: "hospitality"
  },
  {
    name: "Tim Etherington-Judge",
    role: "Founder",
    company: "Healthy Hospo",
    content: "What sets Craig apart is not his encyclopedic knowledge of his subject matter, it's his empathy and ability to speak from a place of first hand experience. I recommend his services to everyone that is in need of mental health support.",
    category: "hospitality",
    featured: true
  },
  
  // Technology Sector
  {
    name: "Mark Ripley",
    role: "Award-winning CTO",
    company: "We Are Dinosaurs",
    content: "Craig is exceptional when it comes to mental health, mentoring and finding new approaches to solving issues with anxiety, depression and chronic pain.",
    category: "technology"
  },
  {
    name: "Mark Kendall",
    role: "Freelance Web Developer",
    company: "",
    content: "Craig goes past traditional counselling and simply provides what we need by listening and providing simple advice and observations. This for me is the core of getting help and what Craig excels at.",
    category: "technology"
  },
  
  // Education/Students
  {
    name: "Yana James-Mills",
    role: "Dental Hygiene Therapist",
    company: "",
    content: "Craig was a fundamental part of my journey through University. He built my confidence over 3 years of mentoring in all aspects of my life and gave me the tools I needed to overcome life situations. If it wasn't for Craig, I'm not sure I would have gotten through my degree.",
    category: "education"
  },
  {
    name: "George Williams",
    role: "Student",
    company: "Falmouth University",
    content: "I have known Craig for about 2 years and he has helped me through a lot of Issues I have had. He is very professional and will always go above and beyond for his clients.",
    category: "education"
  },
  {
    name: "Cora Polland",
    role: "Green Skills Coordinator",
    company: "",
    content: "Craig's guidance and advice has been invaluable in helping me overcome any obstacles at university. He goes above and beyond for his clients. Craig is incredibly kind, hard-working, empathetic and understanding whilst never being patronising.",
    category: "education"
  },
  {
    name: "Sabina Ôn-Stothard PIEMA",
    role: "Senior BNG Consultant",
    company: "AECOM",
    content: "Craig is one of a kind. He has the professional credentials but also the personal experience needed in his job. He brings such compassion and a sense of humour to his role, which is just what I needed.",
    category: "education"
  },
  {
    name: "Becky Mason",
    role: "Graduate",
    company: "BA Marine & Natural History Photography",
    content: "Craig has got me through a lot of stress. I would highly recommend him and he always makes you feel comfortable whenever you see him.",
    category: "education"
  },
  {
    name: "Luke Dalby",
    role: "Teacher of Geography",
    company: "SFG",
    content: "Craig goes to great lengths to ensure that the personal needs and welfare of his clients are met and taken care of. Craig truly wants the best for his clients and will do anything to ensure that his client's personal wellbeing is looked after.",
    category: "education"
  },
  {
    name: "Madison Watling",
    role: "Learning Disabilities Team Leader",
    company: "",
    content: "Craig helped me through my last 2 years at University during a very tough time. He helped me be the woman I am today - someone who actually realises how strong they are and not to give up even if times are hard.",
    category: "education"
  }
];

// Get featured testimonials for homepage
export const getFeaturedTestimonials = () => {
  return testimonials.filter(t => t.featured);
};

// Get testimonials by category
export const getTestimonialsByCategory = (category) => {
  return testimonials.filter(t => t.category === category);
};

// Get corporate testimonials for services pages
export const getCorporateTestimonials = () => {
  return testimonials.filter(t => ['corporate', 'banking', 'business'].includes(t.category));
};

// Get random testimonials
export const getRandomTestimonials = (count = 3) => {
  const shuffled = [...testimonials].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};