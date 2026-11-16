import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";
import { projects } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function CaseStudies() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cs-label, .cs-heading",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
        }
      );

      gsap.fromTo(
        ".project-card",
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".project-grid", start: "top 82%" },
        }
      );
    }, rootRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced]);

  return (
    <section
      id="case-studies"
      ref={rootRef}
      className="flex flex-col items-center gap-8 bg-[color:var(--bg)] px-5 py-20 md:px-8 md:py-24 xl:px-[100px] xl:py-28"
      style={{ scrollMarginTop: "30px" }}
    >
      <div className="w-full max-w-[1200px]">
        <div className="flex items-start gap-4">
          <p className="cs-label text-[14px] font-medium text-[color:var(--heading-case-label)]">
            01
          </p>
          <h2 className="cs-heading font-tight text-[clamp(26px,3vw,32px)] font-medium leading-[1.4] text-[color:var(--heading-case)]">
            Case study
          </h2>
        </div>

        <div className="project-grid mt-8 grid grid-cols-1 gap-9 md:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
