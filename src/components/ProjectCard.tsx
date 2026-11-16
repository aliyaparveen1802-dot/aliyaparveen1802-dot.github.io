import { ArrowUpRight } from "lucide-react";
import type { Project } from "../data/content";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card group flex flex-col gap-[13px]">
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} — ${project.category}`}
        className="relative block h-[320px] overflow-hidden rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] sm:h-[400px] xl:h-[520px]"
      >
        <img
          src={project.image}
          alt={`${project.title} — ${project.category}`}
          loading="lazy"
          decoding="async"
          className={`h-full w-full transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] ${
            project.fit === "contain" ? "object-contain p-6" : "object-cover"
          }`}
        />
        <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
      </a>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-tight text-[clamp(24px,2.6vw,38px)] font-medium leading-[1.4] text-[color:var(--text)]">
            {project.title}
          </h3>
          <p className="text-[16px] leading-[1.8] text-[color:var(--text-muted)]">
            {project.category}
          </p>
        </div>
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.title} on Behance`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] border border-[color:var(--border-card)] text-[color:var(--text)] transition-all duration-300 group-hover:border-[color:var(--grad-from)] group-hover:bg-[color:var(--chip-bg)]"
        >
          <ArrowUpRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </article>
  );
}
