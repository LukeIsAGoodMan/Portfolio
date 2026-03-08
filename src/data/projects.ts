export interface Project {
  slug: string;
  title: string;
  year: string;
  category: string;
  description: string;
  icon: string;
  tags: string[];
  featured: boolean;
  /** Short Apple-style display title for MockupCard hero text */
  displayTitle?: string;
  /** Key metric shown on the MockupCard */
  stat?: string;
  /** Card size in the bento grid: large spans 2 cols */
  size?: "large" | "medium" | "small";
  /** Link to a case study page (if available) */
  caseStudy?: string;
}

export const projects: Project[] = [
  {
    slug: "ta-onboarding-program",
    title: "TA Onboarding Mini-Course",
    displayTitle: "Standardize.\nScale.\nRepeat.",
    stat: "30 hrs saved / semester",
    year: "2025",
    category: "Instructional Design",
    description:
      "Created a standardized onboarding program that reduced variability across the teaching team, improved instructional consistency, and enabled scalable, repeatable training delivery.",
    icon: "\u{1F680}",
    tags: ["Onboarding", "Standardization", "LMS", "Repeatable Training"],
    featured: true,
    size: "large",
    caseStudy: "/work/ta-onboarding",
  },
  {
    slug: "scalable-digital-learning",
    title: "Self-Paced Digital Learning System",
    displayTitle: "500 Learners.\nOne Platform.",
    stat: "500+ learners / semester",
    year: "2025",
    category: "Scalable Delivery",
    description:
      "Designed and built self-paced digital learning experiences using Canvas LMS and Articulate Storyline 360, enabling scalable online training for approximately 500 learners per semester.",
    icon: "\u{1F4BB}",
    tags: ["Canvas LMS", "Articulate Storyline 360", "Self-Paced", "500+ Learners"],
    featured: true,
    size: "medium",
  },
  {
    slug: "k12-mandarin-curriculum",
    title: "Global Mandarin Framework",
    displayTitle: "Bridge\nLanguages.\nBridge Worlds.",
    stat: "K\u201312 \u00b7 3 Countries",
    year: "2023",
    category: "Curriculum Design",
    description:
      "Designed semester-based Mandarin curricula grounded in second language acquisition theory for English-speaking learners, supporting ~100 students with iterative, outcomes-based design.",
    icon: "\u{1F4DA}",
    tags: ["K\u201312", "SLA Theory", "Assessment", "Iterative Design"],
    featured: true,
    size: "medium",
  },
  {
    slug: "corporate-training-system",
    title: "Corporate Authority System",
    displayTitle: "Best Internal\nReference.",
    stat: "30K views / post",
    year: "2025",
    category: "Channel Development",
    description:
      "Designed internal employee training materials to standardize social media operations and content practices at China Telecom Americas, recognized as best internal reference across the team.",
    icon: "\u{1F4C8}",
    tags: ["Corporate L&D", "Standardization", "Best Practice"],
    featured: true,
    size: "small",
  },
  {
    slug: "instructor-led-seminars",
    title: "The LXD Playbook",
    displayTitle: "Design for\nthe Room.",
    stat: "80 learners / session",
    year: "2025",
    category: "Philosophy",
    description:
      "Facilitated instructor-led seminars for cohorts of ~80 learners per session, designing interactive discussions and application activities aligned with course objectives.",
    icon: "\u{1F3A4}",
    tags: ["ILT", "80 Learners/Session", "Discussion Design", "Blended"],
    featured: true,
    size: "medium",
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
