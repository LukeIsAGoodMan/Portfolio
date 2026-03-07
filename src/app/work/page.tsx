"use client";

import ProjectCard from "@/components/ProjectCard";
import SectionReveal from "@/components/SectionReveal";
import StaggerChildren, { StaggerItem } from "@/components/StaggerChildren";
import { projects } from "@/data/projects";

export default function Work() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <SectionReveal>
        <h1 className="font-serif text-4xl md:text-5xl mb-4">Work</h1>
        <p className="text-muted mb-12 max-w-xl">
          A selection of projects I&apos;ve worked on. Each one represents a
          unique challenge and a thoughtful solution.
        </p>
      </SectionReveal>

      <StaggerChildren
        staggerDelay={0.1}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        {projects.map((project) => (
          <StaggerItem key={project.slug}>
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </StaggerChildren>
    </section>
  );
}
