/* ─────────────────────────────────────────────
 * Structured resume data for Zheyu Wu
 * Source of truth for /about page and any
 * future resume-driven components.
 * ───────────────────────────────────────────── */

export const profile = {
  name: "Zheyu Wu",
  title: "Learning Experience Designer",
  location: "Edmonton, AB",
  email: "zheyu8@ualberta.ca",
  phone: "(368) 380-1766",
  linkedin: "https://linkedin.com/in/zheyu-wu",
  headline:
    "Instructional design practitioner specializing in scalable learning delivery and structured program design.",
  summary: [
    "Learning design practitioner with a solid instructional design foundation, experienced in designing, standardizing, and maintaining structured learning programs aligned with learning outcomes and organizational needs.",
    "Hands-on experience selecting and applying appropriate learning modalities\u2014including self-paced digital learning and instructor-led training\u2014supporting scalable delivery for up to 500 learners per semester.",
    "Collaborative partner with experience working across instructors, program leads, and organizational stakeholders to identify learning needs and support effective learning delivery.",
  ],
};

export const stats = [
  { value: "500+", label: "Learners per semester" },
  { value: "3", label: "Countries lived & worked" },
  { value: "3", label: "Languages spoken" },
  { value: "2", label: "Master\u2019s degrees" },
];

export interface Education {
  degree: string;
  institution: string;
  location: string;
  year: string;
  focus: string;
}

export const education: Education[] = [
  {
    degree: "Master of Business Administration (MBA)",
    institution: "University of Alberta",
    location: "Canada",
    year: "2026",
    focus: "Business operations, performance metrics, organizational decision contexts, marketing and customer experience principles for clear, effective communication.",
  },
  {
    degree: "MSc Applied Linguistics",
    institution: "University of Glasgow",
    location: "United Kingdom",
    year: "2022",
    focus: "Learning research methods, data-informed analysis, discourse and communication analysis to improve clarity, engagement, and comprehension.",
  },
  {
    degree: "BA Chinese Language Education",
    institution: "Southwest University",
    location: "China",
    year: "2019",
    focus: "Curriculum design, instructional planning, assessment, educational psychology, and learner needs analysis aligned with diverse learner outcomes.",
  },
];

export interface Experience {
  period: string;
  role: string;
  org: string;
  location: string;
  highlights: string[];
}

export const experience: Experience[] = [
  {
    period: "Aug 2025 \u2014 Present",
    role: "Teaching Assistant",
    org: "University of Alberta",
    location: "Edmonton, AB",
    highlights: [
      "Designed and built self-paced digital learning experiences using Canvas (LMS) and Articulate Storyline 360, enabling scalable online training for ~500 learners per semester.",
      "Facilitated instructor-led seminars for cohorts of ~80 learners per session, guiding application of course concepts through interactive discussions and activities.",
      "Designed a standardized New TA onboarding mini-course that reduced onboarding variability and enabled scalable, repeatable training delivery.",
      "Collaborated with instructors, coordinators, and academic partners to align stakeholder expectations and continuously improve learning quality.",
    ],
  },
  {
    period: "Apr 2025 \u2014 Jan 2026",
    role: "Channel Business Development Intern",
    org: "China Telecom Americas",
    location: "Canada",
    highlights: [
      "Created and analyzed social media content on WeChat and Red Book, with individual posts reaching up to 30,000 views and supporting lead generation.",
      "Designed internal employee training and reference materials to standardize operations, earning recognition as a best internal reference.",
      "Developed offline channel partnerships through collaboration with student associations, enabling new customer touchpoints.",
    ],
  },
  {
    period: "Aug 2022 \u2014 Dec 2023",
    role: "Mandarin Teacher",
    org: "Basis Bilingual School",
    location: "China",
    highlights: [
      "Designed semester-based Mandarin curricula grounded in SLA theory for K\u201312 English-speaking learners, supporting ~100 students with iterative, outcomes-based design.",
      "Built reusable instructional templates and digital learning solutions, incorporating structured interactive activities to support scalable delivery.",
      "Partnered with school leadership, subject leads, and parents to align curriculum design and ensure consistent learning experiences.",
    ],
  },
];

export const volunteerExperience: Experience[] = [
  {
    period: "Apr 2024 \u2014 Jun 2024",
    role: "Training Program Designer",
    org: "Blue Sky Education Institute",
    location: "China",
    highlights: [
      "Developed an introductory training module on key considerations for interacting with children with autism, supporting caregiver awareness and safe practice.",
    ],
  },
];

export const professionalDevelopment = [
  {
    title: "Instructional Design Project Lab",
    year: "2025",
    detail:
      "Cohort-based lab led by Devlin Peck, focused on hands-on project development aligned with industry learning design standards. Applied ID principles to needs analysis, strategy selection, and iterative improvement through expert feedback.",
  },
];

export const tools = [
  "Canvas (LMS)",
  "Articulate Storyline 360",
  "Interactive Quizzes & Polling",
  "Canva",
  "Video Editing",
];

export const coreCompetencies = [
  "Instructional Design",
  "Scalable Delivery",
  "Curriculum Architecture",
  "Learning Needs Analysis",
  "Assessment Design",
  "Self-Paced E-Learning",
  "Instructor-Led Training",
  "Stakeholder Collaboration",
];

export const awards = [
  {
    title: "Entry Awards Scholarship",
    org: "University of Alberta School of Business",
    year: "2024",
  },
  {
    title: "First-Class Academic Scholarship",
    org: "Southwest University",
    year: "2018",
  },
];
