import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { skyvoyageImages, LIVE_PRODUCT_URL } from "../data/skyvoyage";
import { CASE_STUDY_PATH } from "../router";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface ProjectLink {
  href: string;
  external: boolean;
  image: string;
  alt: string;
  urlLabel: string;
  badge: string;
  badgeTone: "accent" | "success";
  title: string;
  category: string;
  description: string;
  cta: string;
}

const cards: ProjectLink[] = [
  {
    href: CASE_STUDY_PATH,
    external: false,
    image: skyvoyageImages.navigation,
    alt: "SkyVoyage indoor airport navigation route",
    urlLabel: "skyvoyage-pi.vercel.app",
    badge: "UX Case Study",
    badgeTone: "accent",
    title: "SkyVoyage UX Case Study",
    category: "Research · Journey · IA · Interaction",
    description:
      "The full design process — problems, personas, journey mapping, information architecture, user flows and the decisions behind the interface.",
    cta: "Read the case study",
  },
  {
    href: LIVE_PRODUCT_URL,
    external: true,
    image: skyvoyageImages.hero,
    alt: "SkyVoyage flight search home screen",
    urlLabel: "skyvoyage-pi.vercel.app",
    badge: "Live Product",
    badgeTone: "success",
    title: "SkyVoyage — Live Product",
    category: "UI Design · Responsive Web",
    description:
      "The shipped experience: flight search, airport guide, indoor navigation and live flight tracking — ready to explore in your browser.",
    cta: "Visit live site",
  },
];

export default function ProjectSection() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".proj-label, .proj-heading",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: rootRef.current, start: "top 82%" },
        }
      );

      gsap.fromTo(
        ".proj-card",
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.14,
          scrollTrigger: { trigger: rootRef.current, start: "top 65%" },
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
      id="project"
      ref={rootRef}
      className="flex flex-col items-center px-5 py-20 md:px-8 md:py-24 xl:px-[100px] xl:py-28"
      style={{ scrollMarginTop: "30px" }}
    >
      <div className="flex w-full max-w-[1200px] flex-col gap-10">
        <div className="flex items-start gap-4">
          <p className="proj-label section-eyebrow-accent pt-[10px] text-[14px] font-medium text-[color:var(--heading-case-label)]">
            PROJECT
          </p>
          <div className="flex flex-col gap-4">
            <h2 className="proj-heading font-tight text-[clamp(34px,5vw,64px)] font-semibold leading-[1.08] tracking-[-0.02em] text-[color:var(--text-strong)]">
              SkyVoyage
            </h2>
            <p className="proj-heading max-w-[680px] font-tight text-[clamp(19px,2.4vw,28px)] font-medium leading-[1.4] text-[color:var(--heading-case)]">
              Travel with Confidence. Every Step of the Way.
            </p>
            <p className="proj-heading max-w-[680px] text-[16px] leading-[1.8] text-[color:var(--text-muted)] md:text-[17px]">
              A responsive travel platform that brings flight booking, airport guidance
              and live flight tracking into one connected journey — designed to reduce
              travel uncertainty at every step.
            </p>
            <div className="proj-heading flex flex-wrap gap-2">
              {[
                "UX Research",
                "UI Design",
                "Responsive Web",
                "Live Product",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[color:var(--border-card)] px-3.5 py-1.5 text-[12px] font-medium text-[color:var(--text-muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-7">
          {cards.map((card) => (
            <a
              key={card.href}
              href={card.href}
              target={card.external ? "_blank" : undefined}
              rel={card.external ? "noopener noreferrer" : undefined}
              className="proj-card group flex flex-col gap-5"
            >
              <div className="overflow-hidden rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] transition-colors duration-500 group-hover:border-[color:var(--border-soft)]">
                <div className="flex items-center gap-2 border-b border-[color:var(--border-card)] px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a48]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a48]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a48]" />
                  <span className="ml-3 hidden truncate rounded-full bg-[color:var(--bg)] px-3 py-1 text-[11px] text-[color:var(--text-muted)] sm:block">
                    {card.urlLabel}
                  </span>
                  <span
                    className={`ml-auto shrink-0 rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${
                      card.badgeTone === "success"
                        ? "border-[#2f8f66] text-[#1f9d6b]"
                        : "border-[color:var(--border-soft)] text-[color:var(--grad-from)]"
                    }`}
                  >
                    {card.badge}
                  </span>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0) 55%)",
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-tight text-[clamp(24px,2.6vw,34px)] font-semibold leading-[1.3] text-[color:var(--text)]">
                      {card.title}
                    </h3>
                    <p className="text-[15px] leading-[1.7] text-[color:var(--text-muted)]">
                      {card.category}
                    </p>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] border border-[color:var(--border-card)] text-[color:var(--text)] transition-all duration-300 group-hover:border-[color:var(--grad-from)] group-hover:bg-[color:var(--chip-bg)]">
                    {card.external ? (
                      <ArrowUpRight
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    ) : (
                      <ArrowRight
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    )}
                  </span>
                </div>
                <p className="max-w-[540px] text-[16px] leading-[1.8] text-[color:var(--text-muted)]">
                  {card.description}
                </p>
                <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[color:var(--text)] transition-colors duration-300 group-hover:text-[color:var(--grad-from)]">
                  {card.cta}
                  {card.external ? (
                    <ArrowUpRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  ) : (
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
