import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      {/* Placeholder image */}
      <div className="relative aspect-[4/3] rounded-sm bg-[#EFEDE8] mb-5 overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
        <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-wider text-muted">
          {project.category}
        </div>
        {/* Hover overlay — baby blue tint */}
        <div className="absolute inset-0 bg-accent/0 transition-colors duration-300 group-hover:bg-accent/10" />
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-serif text-lg">{project.title}</h3>
        <span className="text-xs uppercase tracking-wider text-muted">
          {project.year}
        </span>
      </div>

      <p className="text-sm text-muted leading-relaxed">
        {project.description}
      </p>
    </div>
  );
}
