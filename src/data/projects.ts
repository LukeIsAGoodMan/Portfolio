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
    slug: "adaptive-learning-engine",
    title: "Adaptive Learning Engine",
    year: "2025",
    category: "Ed-Tech Platform",
    description:
      "An AI-powered learning platform that dynamically adjusts content difficulty, pacing, and modality based on real-time learner performance data.",
    icon: "\u{1F9E0}",
    tags: ["AI/ML", "Adaptive Learning", "React", "Python"],
    featured: true,
  },
  {
    slug: "microlearning-os",
    title: "Microlearning OS",
    year: "2025",
    category: "Mobile Learning",
    description:
      "A bite-sized learning delivery system designed for corporate upskilling. Three-minute modules with spaced repetition and gamification loops.",
    icon: "\u{1F4F1}",
    tags: ["Mobile", "Gamification", "Spaced Repetition"],
    featured: true,
  },
  {
    slug: "vr-lab-simulations",
    title: "VR Lab Simulations",
    year: "2024",
    category: "Immersive Learning",
    description:
      "Photorealistic virtual laboratory environments for chemistry and biology students with full haptic feedback integration.",
    icon: "\u{1F97D}",
    tags: ["VR/XR", "Unity", "Haptics", "STEM"],
    featured: true,
  },
  {
    slug: "competency-framework",
    title: "Competency Framework",
    year: "2024",
    category: "Assessment Design",
    description:
      "A rubric-based assessment engine mapping learner progress to competency matrices across 200+ skill dimensions.",
    icon: "\u{1F4CA}",
    tags: ["Assessment", "Data Viz", "Competency Mapping"],
    featured: true,
  },
  {
    slug: "onboarding-journey",
    title: "Onboarding Journey",
    year: "2023",
    category: "Instructional Design",
    description:
      "A 90-day structured onboarding experience for a Fortune 500 tech company. Reduced time-to-productivity by 40%.",
    icon: "\u{1F680}",
    tags: ["Corporate L&D", "Journey Mapping", "ADDIE"],
    featured: true,
  },
];
