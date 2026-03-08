export interface Project {
  slug: string;
  title: string;
  year: string;
  category: string;
  description: string;
  icon: string;
  tags: string[];
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: "scalable-digital-learning",
    title: "Self-Paced Digital Learning System",
    year: "2025",
    category: "Scalable Delivery",
    description:
      "Designed and built self-paced digital learning experiences using Canvas LMS and Articulate Storyline 360, enabling scalable online training for approximately 500 learners per semester.",
    icon: "\u{1F4BB}",
    tags: ["Canvas LMS", "Articulate Storyline 360", "Self-Paced", "500+ Learners"],
    featured: true,
  },
  {
    slug: "ta-onboarding-program",
    title: "TA Onboarding Mini-Course",
    year: "2025",
    category: "Instructional Design",
    description:
      "Created a standardized onboarding program that reduced variability across the teaching team, improved instructional consistency, and enabled scalable, repeatable training delivery.",
    icon: "\u{1F680}",
    tags: ["Onboarding", "Standardization", "LMS", "Repeatable Training"],
    featured: true,
  },
  {
    slug: "k12-mandarin-curriculum",
    title: "K\u201312 Mandarin Curriculum",
    year: "2023",
    category: "Curriculum Design",
    description:
      "Designed semester-based Mandarin curricula grounded in second language acquisition theory for English-speaking learners, supporting ~100 students with iterative, outcomes-based design.",
    icon: "\u{1F4DA}",
    tags: ["K\u201312", "SLA Theory", "Assessment", "Iterative Design"],
    featured: true,
  },
  {
    slug: "instructor-led-seminars",
    title: "Interactive Seminar Design",
    year: "2025",
    category: "Facilitation Design",
    description:
      "Facilitated instructor-led seminars for cohorts of ~80 learners per session, designing interactive discussions and application activities aligned with course objectives.",
    icon: "\u{1F3A4}",
    tags: ["ILT", "80 Learners/Session", "Discussion Design", "Blended"],
    featured: true,
  },
  {
    slug: "corporate-training-system",
    title: "Employee Training & Reference System",
    year: "2025",
    category: "Corporate Training",
    description:
      "Designed internal employee training materials to standardize social media operations and content practices at China Telecom Americas, recognized as best internal reference across the team.",
    icon: "\u{1F4C8}",
    tags: ["Corporate L&D", "Standardization", "Best Practice"],
    featured: true,
  },
  {
    slug: "autism-caregiver-training",
    title: "Caregiver Awareness Training",
    year: "2024",
    category: "Training Design",
    description:
      "Developed an introductory training module outlining key considerations for interacting with children with autism, supporting basic caregiver awareness and safe practice.",
    icon: "\u{1F49C}",
    tags: ["Sensitive Content", "Caregiver Training", "Volunteer"],
    featured: false,
  },
];
