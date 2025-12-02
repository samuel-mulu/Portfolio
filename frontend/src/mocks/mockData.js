// Mock data for all API endpoints
// This file contains realistic sample data for development without backend

// Landing Content Data
export const mockLandingContent = {
  id: "5c389ee8-c493-467b-9729-effb78c00a01",
  name: "Samuel Mulu",
  introduction:
    "A passionate full-stack developer crafting beautiful and functional web experiences.",
  typewriter_texts: [
    "Full-Stack Developer",
    "React Specialist",
    "Backend Engineer",
    "Innovative Developer",
    "Problem Solver",
  ], // Store as array
  reference_icons: [
    { icon: "github", href: "https://github.com/samuel-mulu", label: "GitHub" },
    {
      icon: "linkedin",
      href: "https://www.linkedin.com/in/sami-mulu-20a1a1322/",
      label: "LinkedIn",
    },

    {
      icon: "envelope",
      href: "mailto:samuelmulu810@gmail.com",
      label: "Gmail",
    },
    {
      icon: "phone",
      href: "tel:+251962520885",
      label: "Phone",
    },
  ], // Store as array
  image_path: "/images/portfolio-image.jpg",
  cv_path: "/cv/samuel_mulu.pdf",
};

// About Section Data
export const mockAboutData = {
  id: 1,
  name: "Samuel Mulu",
  bio: "I'm a dedicated full-stack developer with a passion for creating innovative web solutions. With expertise in modern JavaScript frameworks and backend technologies, I bring ideas to life through clean, efficient code.",
  about_me: [
    "I'm a dedicated full-stack developer with a passion for creating innovative web solutions.",
    "With expertise in modern JavaScript frameworks and backend technologies, I bring ideas to life through clean, efficient code.",
    "I love solving complex problems and building scalable applications that make a difference.",
  ], // Store as array
  image_path: "/images/about-image.png",
  details: {
    age: 30,
    location: "Ethiopia",
    email: "amdebrhanasmamaw93@gmail.com",
    phone: "+251 9XX XXX XXX",
    availability: "Available for freelance work",
  }, // Store as object, not JSON string
};

// Projects Data
export const mockProjects = [
  {
    id: 1,
    title: "E-Commerce Platform (plink21.com)",
    tools: ["React", "Node.js", "MongoDB", "Chapa", "Tellbirr"], // Store as array, not JSON string
    role: "Full-Stack Developer",
    description:
      "A modern e-commerce platform with real-time inventory management, payment integration via Chapa and Tellbirr, and comprehensive admin dashboard.",
    demo_link: "https://plink21.com",
    github_link: null, // Private source code
    image_path: "/images/ecommerce-project.png",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    title: "Gym Mobile App",
    tools: ["Flutter", "Firebase", "Node.js"], // Store as array
    role: "Full-Stack Developer",
    description:
      "A comprehensive mobile application for gym management with member tracking, workout plans, progress monitoring, and real-time synchronization using Firebase.",
    demo_link: null, // Mobile app - no live demo
    github_link:
      "https://github.com/samuel-mulu/all-projects/tree/main/flutter_application_gym",
    image_path: "/images/gym-app-project.jpg",
    created_at: "2024-02-20T10:00:00Z",
  },
  {
    id: 3,
    title: "Pharmacy App",
    tools: ["Flutter", "Firebase", "Node.js"], // Store as array
    role: "Full-Stack Developer",
    description:
      "A mobile application for pharmacy management with inventory tracking, prescription management, order processing, and real-time notifications.",
    demo_link: null, // Mobile app - no live demo
    github_link:
      "https://github.com/samuel-mulu/all-projects/tree/main/flutter_application_pharmacy",
    image_path: "/images/pharmacy-app-project.jpg",
    created_at: "2024-03-10T10:00:00Z",
  },
  {
    id: 4,
    title: "Frontend Restaurant Web App",
    tools: ["React", "Chart.js", "Express.js", "PostgreSQL"], // Store as array
    role: "Full-Stack Developer",
    description:
      "A modern restaurant web application with menu management, online ordering system, table reservations, and real-time order tracking.",
    demo_link: "https://frontend-restaurant-web-app.vercel.app/order",
    github_link: "https://github.com/samuel-mulu/frontend-restaurant-web-app",
    image_path: "/images/restaurant-project.jpg",
    created_at: "2024-04-05T10:00:00Z",
  },
  {
    id: 5,
    title: "POS Printer Service",
    tools: ["Node.js", "TypeScript", "PM2", "Algorithm"], // Store as array
    role: "Backend Developer",
    description:
      "A robust background service for POS printer integration with advanced queue management algorithms, running continuously via PM2. Handles thermal printer communication, receipt formatting, and print job optimization.",
    demo_link: null, // Backend service - no demo
    github_link: "https://github.com/samuel-mulu/POS-Printer-Service",
    image_path: "/images/pos-printer-service.png",
    created_at: "2024-05-10T10:00:00Z",
  },
  {
    id: 6,
    title: "Barbershop Management System",
    tools: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"], // Store as array
    role: "Full-Stack Developer",
    description:
      "A complete barbershop management system with appointment scheduling, customer management, staff tracking, payment processing, and analytics dashboard built with Next.js full-stack architecture.",
    demo_link: "https://barbershop-mgmt.vercel.app/",
    github_link: "https://github.com/samuel-mulu/barbershop-mgmt",
    image_path: "/images/barbershop-project.png",
    created_at: "2024-06-15T10:00:00Z",
  },
];

// Skills Data
export const mockSkills = [
  {
    id: 1,
    name: "React",
    type: "front-end",
    category: "Frontend",
    proficiency: 90,
    icon: "react", // FontAwesome brand icon
  },
  {
    id: 2,
    name: "Node.js",
    type: "back-end",
    category: "Backend",
    proficiency: 85,
    icon: "node-js", // FontAwesome brand icon
  },
  {
    id: 3,
    name: "JavaScript",
    type: "front-end",
    category: "Programming",
    proficiency: 95,
    icon: "js", // FontAwesome brand icon
  },
  {
    id: 4,
    name: "TypeScript",
    type: "front-end",
    category: "Programming",
    proficiency: 80,
    icon: "js-square", // FontAwesome brand icon (fallback)
  },
  {
    id: 5,
    name: "Python",
    type: "back-end",
    category: "Programming",
    proficiency: 75,
    icon: "python", // FontAwesome brand icon
  },
  {
    id: 6,
    name: "PostgreSQL",
    type: "back-end",
    category: "Database",
    proficiency: 80,
    icon: "database", // FontAwesome solid icon (fallback)
  },
  {
    id: 7,
    name: "MongoDB",
    type: "back-end",
    category: "Database",
    proficiency: 75,
    icon: "database", // FontAwesome solid icon (fallback)
  },
  {
    id: 8,
    name: "Tailwind CSS",
    type: "front-end",
    category: "Frontend",
    proficiency: 90,
    icon: "css3-alt", // FontAwesome brand icon
  },
  {
    id: 9,
    name: "Express.js",
    type: "back-end",
    category: "Backend",
    proficiency: 85,
    icon: "node-js", // FontAwesome brand icon (fallback)
  },
  {
    id: 10,
    name: "Git",
    type: "back-end",
    category: "Tools",
    proficiency: 90,
    icon: "git-alt", // FontAwesome brand icon
  },
  {
    id: 11,
    name: "Flutter",
    type: "mobile-app",
    category: "Mobile",
    proficiency: 85,
    icon: "mobile-alt", // FontAwesome solid icon
  },
  {
    id: 12,
    name: "React Native",
    type: "mobile-app",
    category: "Mobile",
    proficiency: 80,
    icon: "mobile-alt", // FontAwesome solid icon
  },
];

// Services Data
export const mockServices = [
  {
    id: 1,
    title: "Web Development",
    description:
      "Custom web applications built with modern technologies and best practices.",
    icon: "code",
  },
  {
    id: 2,
    title: "UI/UX Design",
    description:
      "Beautiful and intuitive user interfaces designed with user experience in mind.",
    icon: "paint-brush",
  },
  {
    id: 3,
    title: "API Development",
    description:
      "RESTful and GraphQL APIs designed for scalability and performance.",
    icon: "server",
  },
  {
    id: 4,
    title: "Database Design",
    description:
      "Efficient database schemas and optimization for your applications.",
    icon: "database",
  },
  {
    id: 5,
    title: "Consulting",
    description:
      "Technical consulting and architecture guidance for your projects.",
    icon: "lightbulb",
  },
  {
    id: 6,
    title: "Maintenance & Support",
    description:
      "Ongoing maintenance and support to keep your applications running smoothly.",
    icon: "tools",
  },
];

// Experiences Data
export const mockExperiences = [
  {
    id: 1,
    company: "Blih Marketing",
    role: "Full-Stack & Backend Engineer",
    title: "Full-Stack & Backend Engineer",
    start_date: "2024-01-01",
    end_date: null,
    description:
      "Currently working as a Full-Stack and Backend Engineer, developing enterprise-level web applications and digital marketing solutions. Building scalable backend systems and modern frontend interfaces for various clients including financial institutions, real estate companies, and business groups.",
    location: "Addis Ababa, Ethiopia",
    responsibilities:
      "Developing full-stack web applications, building robust backend APIs, implementing payment integrations, creating responsive frontend interfaces, and maintaining enterprise-level systems.",
    technologies: JSON.stringify([
      "React",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "MongoDB",
      "Express.js",
      "Next.js",
    ]),
    achievements:
      "Successfully delivered multiple enterprise projects for major clients including Global Bank, Oromiya Bank, and various business groups.",
    company_url: "https://blihmarketing.com/",
  },
  {
    id: 2,
    company: "Perfect Technology Innovation Hub",
    role: "Full-Stack Developer",
    title: "Full-Stack Developer",
    start_date: "2022-06-01",
    end_date: "2023-12-31",
    description:
      "Worked for over 1.5 years developing innovative IT solutions including healthcare systems, hotel management platforms, e-commerce solutions, and AI-powered applications. Contributed to building a comprehensive learning platform with course management and student tracking features.",
    location: "Shire-Mekelle, Tigray, Ethiopia",
    responsibilities:
      "Developed full-stack applications for healthcare, hotel management, and e-commerce sectors. Built payment integration systems, implemented AI solutions, and created scalable web applications.",
    technologies: JSON.stringify([
      "React",
      "Node.js",
      "MongoDB",
      "Express.js",
      "Firebase",
      "AI Integration",
      "Payment Gateways",
    ]),
    achievements:
      "Successfully delivered multiple enterprise solutions including hospital management systems, hotel booking platforms, and e-commerce stores with secure payment integrations.",
    company_url: "https://ptech21.com/",
  },
];

// Education Data
export const mockEducation = [
  {
    id: 1,
    degree: "Bachelor of Science",
    field: "Software Engineering",
    institution: "Adigrat University",
    start_date: "2020-02-01",
    end_date: "2024-03-01",
    location: "Ethiopia",
    description:
      "Completed Bachelor of Science degree in Software Engineering with focus on software development, algorithms, database systems, and software engineering principles.",
    pdf_path: "/cv/education-transcript.pdf", // Path to transcript/certificate PDF
  },
];

// Feedback/Testimonials Data
export const mockFeedbacks = [
  {
    id: 1,
    author_name: "John Doe",
    author_role: "CEO, Tech Company",
    rating: 5,
    comment:
      "Excellent work! The project was delivered on time and exceeded our expectations.",
    created_at: "2024-01-20T10:00:00Z",
  },
  {
    id: 2,
    author_name: "Jane Smith",
    author_role: "Product Manager",
    rating: 5,
    comment:
      "Samuel is a talented developer with great attention to detail. Highly recommended!",
    created_at: "2024-02-15T10:00:00Z",
  },
  {
    id: 3,
    author_name: "Mike Johnson",
    author_role: "Startup Founder",
    rating: 5,
    comment:
      "Professional, reliable, and skilled. The best developer I've worked with.",
    created_at: "2024-03-10T10:00:00Z",
  },
];

// Messages Data
export const mockMessages = [
  {
    id: 1,
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    subject: "Project Inquiry",
    message:
      "I'm interested in discussing a potential project. Could we schedule a call?",
    created_at: "2024-04-01T10:00:00Z",
  },
  {
    id: 2,
    name: "David Brown",
    email: "david.brown@example.com",
    subject: "Collaboration Opportunity",
    message: "We have an exciting project and would love to work with you.",
    created_at: "2024-04-05T10:00:00Z",
  },
];

// Reference Icons Data
export const mockReferenceIcons = [
  {
    icon: "github",
    href: "https://github.com/amde-asme-prog",
    label: "GitHub",
  },
  {
    icon: "linkedin",
    href: "https://linkedin.com/in/amdebirhan-asmamaw",
    label: "LinkedIn",
  },
  { icon: "twitter", href: "https://twitter.com/amdebirhan", label: "Twitter" },
  {
    icon: "envelope",
    href: "mailto:samuelmulu810@gmail.com",
    label: "Gmail",
  },
  {
    icon: "phone",
    href: "tel:+251962520885",
    label: "Phone",
  },
];

// Helper function to simulate network delay
export const delay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to create mock response
export const createMockResponse = (data, delayMs = 300) => {
  return delay(delayMs).then(() => ({
    data,
    error: null,
  }));
};
