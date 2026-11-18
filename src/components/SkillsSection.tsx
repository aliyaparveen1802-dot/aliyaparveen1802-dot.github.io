import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layers, Palette, Search, Sparkles, Wrench, Workflow } from "lucide-react";
import { skillCategories, tools } from "../data/skills";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_ICONS: Record<string, typeof Layers> = {
  ux: Layers,
  research: Search,
  ui: Palette,
  proto: Workflow,
  ai: Sparkles,
  tools: Wrench,
};

export default function SkillsSection() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: "top 82%" },
        })
        .fromTo(
          ".skills-head > *",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, stagger: 0.09, ease: "power3.out" }
        );

      gsap.utils.toArray<HTMLElement>(".skill-card").forEach((card) => {
        const head = card.querySelector(".skill-card-head");
        const chips = card.querySelectorAll(".skill-chip, .tool-btn");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
        if (head) {
          tl.fromTo(
            head,
            { y: 26, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", clearProps: "all" }
          );
        }
        if (chips.length) {
          tl.fromTo(
            chips,
            { y: 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.035,
              ease: "power3.out",
              clearProps: "all",
            },
            head ? "-=0.3" : 0
          );
        }
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    const raf = window.requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="skills"
      className="relative overflow-hidden px-5 py-16 md:px-8 md:py-20 xl:px-[100px] xl:py-24"
      style={{ scrollMarginTop: "90px" }}
    >
      {/* Animated background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="skills-grid-bg absolute inset-0 opacity-60" />
        <span className="skills-orb-a absolute -left-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--grad-from)_60%,transparent),transparent_70%)] opacity-30 blur-3xl md:h-96 md:w-96" />
        <span className="skills-orb-b absolute -right-28 top-1/3 h-80 w-80 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--grad-to)_55%,transparent),transparent_70%)] opacity-25 blur-3xl md:h-[420px] md:w-[420px]" />
        <span className="skills-orb-a absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_45%,transparent),transparent_70%)] opacity-20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-10 md:gap-14">
        {/* Header */}
        <header className="skills-head flex flex-col items-center gap-4 text-center">
          <span className="section-eyebrow-accent flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.2em] text-[color:var(--heading-case-label)] md:text-[13px]">
            <span className="h-px w-8 bg-[linear-gradient(90deg,transparent,var(--grad-from))]" />
            Key Skills &amp; Tools · 01 — 06
            <span className="h-px w-8 bg-[linear-gradient(270deg,transparent,var(--grad-from))]" />
          </span>
          <h2 className="font-tight text-[clamp(32px,4.6vw,56px)] font-semibold leading-[1.1] tracking-[-0.01em] text-[color:var(--heading-case)]">
            My Design Toolkit<span className="grad-text">.</span>
          </h2>
          <p className="max-w-[620px] text-[16px] leading-[1.8] text-[color:var(--text-muted)] md:text-[17px]">
            The skills, tools and thinking behind every experience I create.
          </p>
        </header>

        {/* Category grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {skillCategories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id];
            const isTools = cat.id === "tools";
            return (
              <article
                key={cat.id}
                className="glass-card skill-card flex flex-col gap-5 rounded-[24px] p-6 transition-all duration-300 md:p-7"
              >
                <div className="skill-card-head flex items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[color:var(--border-card)] bg-[color:var(--bg)] text-[color:var(--grad-from)]">
                    {Icon && <Icon size={19} strokeWidth={1.9} />}
                  </span>
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="section-eyebrow-accent text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--heading-case-label)]">
                      {cat.index}
                    </span>
                    <h3 className="font-tight text-[17px] font-semibold leading-[1.25] text-[color:var(--text-strong)] md:text-[18px]">
                      {cat.title}
                    </h3>
                  </div>
                  <span className="ml-auto shrink-0 rounded-full border border-[color:var(--border-card)] bg-[color:var(--bg)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--text-dim)]">
                    {isTools ? tools.length : cat.items.length}
                  </span>
                </div>

                {isTools ? (
                  <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 xl:grid-cols-4">
                    {tools.map((tool, i) => (
                      <span
                        key={tool.name}
                        className="tool-btn group/tool flex flex-col items-center gap-2 rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--bg)]/60 px-2 py-3.5 transition-all duration-300 hover:scale-[1.06] hover:border-[color:var(--grad-from)] hover:shadow-[0_0_22px_-6px_rgba(188,60,216,0.65)]"
                      >
                        <span
                          className="tool-float flex h-9 w-9 items-center justify-center rounded-[10px] bg-white p-[6px] shadow-[0_3px_8px_rgba(0,0,0,0.28)]"
                          style={{ animationDelay: `${i * 0.5}s` }}
                        >
                          <img
                            src={tool.file}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-contain"
                          />
                        </span>
                        <span className="text-center text-[11px] font-medium leading-[1.3] text-[color:var(--text-muted)] transition-colors duration-300 group-hover/tool:text-[color:var(--text-strong)]">
                          {tool.name}
                        </span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {cat.items.map((item) => (
                      <span
                        key={item}
                        className="skill-chip cursor-default select-none rounded-full border border-[color:var(--border-card)] bg-[color:var(--bg)]/70 px-3.5 py-2 text-[13px] leading-none text-[color:var(--text-muted)] transition-all duration-300 hover:scale-[1.05] hover:border-[color:var(--grad-from)] hover:bg-[color:var(--chip-bg)] hover:text-[color:var(--text-strong)] hover:shadow-[0_0_18px_-5px_rgba(188,60,216,0.7)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
