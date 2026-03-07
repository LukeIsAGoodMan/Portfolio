"use client";

import SectionReveal from "@/components/SectionReveal";
import StaggerChildren, { StaggerItem } from "@/components/StaggerChildren";

const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "TailwindCSS",
  "Figma",
  "Python",
  "UI/UX Design",
];

const timeline = [
  {
    year: "2024 — Present",
    role: "Senior Developer",
    company: "Company Name",
  },
  {
    year: "2022 — 2024",
    role: "Full-Stack Developer",
    company: "Another Company",
  },
  {
    year: "2020 — 2022",
    role: "Junior Developer",
    company: "Startup Inc.",
  },
];

export default function About() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      {/* Intro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
        {/* Portrait placeholder */}
        <SectionReveal direction="left">
          <div className="aspect-[3/4] rounded-sm bg-[#EFEDE8] flex items-center justify-center text-muted text-sm">
            Portrait
          </div>
        </SectionReveal>

        <SectionReveal direction="right" delay={0.15}>
          <div className="flex flex-col justify-center max-w-[64ch]">
            <h1 className="font-serif text-4xl md:text-5xl mb-6">About Me</h1>
            <p className="text-muted leading-[1.8] mb-4">
              I&apos;m a designer and developer passionate about creating
              elegant digital experiences. With a background in both design and
              engineering, I bring a unique perspective to every project.
            </p>
            <p className="text-muted leading-[1.8]">
              I believe in the power of simplicity and craft. Every detail
              matters — from typography to transitions, from layout to loading
              states.
            </p>
          </div>
        </SectionReveal>
      </div>

      {/* Skills */}
      <div className="mb-24">
        <SectionReveal>
          <h2 className="font-serif text-3xl mb-8">Skills</h2>
        </SectionReveal>
        <StaggerChildren staggerDelay={0.06} className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <StaggerItem key={skill}>
              <span className="inline-block px-4 py-2 text-sm border border-[var(--border)] rounded-md text-muted transition-all hover:text-foreground hover:bg-[var(--accent-soft)]">
                {skill}
              </span>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>

      {/* Timeline */}
      <div>
        <SectionReveal>
          <h2 className="font-serif text-3xl mb-10">Experience</h2>
        </SectionReveal>
        <StaggerChildren
          staggerDelay={0.15}
          className="space-y-16 border-l border-[var(--border)] pl-8"
        >
          {timeline.map((item) => (
            <StaggerItem key={item.year}>
              <div className="relative">
                <div className="absolute -left-[41px] top-1.5 w-2 h-2 rounded-full bg-accent" />
                <p className="text-xs uppercase tracking-wider text-muted mb-2">
                  {item.year}
                </p>
                <p className="font-serif text-lg">{item.role}</p>
                <p className="text-sm text-muted">{item.company}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
