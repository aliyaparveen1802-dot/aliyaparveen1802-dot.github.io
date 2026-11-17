import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, CodeXml, Diamond, LayoutGrid, Target } from "lucide-react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface JourneyStage {
  number: string;
  title: string;
  icon: ReactNode;
  description: string;
  items: string[];
}

const stages: JourneyStage[] = [
  {
    number: "01",
    title: "DISCOVER",
    icon: <Target size={23} strokeWidth={1.6} />,
    description:
      "Understand the users, explore their needs, conduct research, and build empathy to uncover meaningful insights that guide the design process.",
    items: [
      "User Research",
      "User Interviews",
      "User Personas",
      "Empathy Mapping",
      "User Understanding",
    ],
  },
  {
    number: "02",
    title: "DEFINE",
    icon: <LayoutGrid size={23} strokeWidth={1.6} />,
    description:
      "Identify user frustrations, analyse research insights, recognise pain points, and define the right problems to solve through thoughtful design decisions.",
    items: [
      "User Pain Points",
      "Problem Statements",
      "User Needs",
      "User Goals",
      "Information Architecture",
    ],
  },
  {
    number: "03",
    title: "DESIGN",
    icon: <CodeXml size={23} strokeWidth={1.6} />,
    description:
      "Transform ideas into visual experiences through structured wireframes, thoughtful interface design, and interactive prototypes.",
    items: [
      "User Flows",
      "Low-Fidelity Wireframes",
      "High-Fidelity Wireframes",
      "UI Design",
      "Interactive Prototypes",
      "Design Systems",
    ],
  },
  {
    number: "04",
    title: "DELIVER",
    icon: (
      <span className="relative flex h-6 w-6 items-center justify-center">
        <Diamond size={23} strokeWidth={1.6} />
        <Check size={10} strokeWidth={2.6} className="absolute inset-0 m-auto" />
      </span>
    ),
    description:
      "Refine the experience through usability evaluation, design improvements, responsive layouts, and attention to every interaction detail.",
    items: [
      "Usability Testing",
      "Design Refinement",
      "Responsive Design",
      "Developer Handoff",
      "Final Experience",
    ],
  },
];

export default function MyDesignJourney() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
      });

      tl.fromTo(
        ".jd-heading",
        { y: 56, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12 },
        0
      )
        .fromTo(
          ".jd-lede",
          { y: 26, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8 },
          0.45
        )
        .fromTo(
          ".jd-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: "power2.inOut" },
          0.55
        )
        .fromTo(
          ".journey-node",
          { scale: 0, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.5,
            ease: "back.out(2)",
            stagger: 0.16,
            clearProps: "transform,opacity,visibility",
          },
          0.9
        )
        .fromTo(
          ".journey-mnode",
          { scale: 0, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(2)", stagger: 0.16 },
          0.9
        )
        .fromTo(
          ".journey-mline",
          { scaleY: 0 },
          { scaleY: 1, duration: 0.7, ease: "power2.inOut", stagger: 0.12 },
          1.25
        )
        .fromTo(
          ".jd-num",
          { y: 32, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.11 },
          1.0
        )
        .fromTo(
          ".jd-icon",
          { y: 16, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.11,
            clearProps: "all",
          },
          1.2
        )
        .fromTo(
          ".jd-title",
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1 },
          1.45
        )
        .fromTo(
          ".jd-desc",
          { y: 22, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1 },
          1.6
        )
        .fromTo(
          ".jd-items",
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1 },
          1.75
        )
        .fromTo(
          ".jd-travels",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8 },
          2.1
        );

      gsap.fromTo(
        ".jd-progress",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            end: "bottom 65%",
            scrub: 0.7,
          },
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
      id="design-journey"
      ref={rootRef}
      className="relative flex flex-col items-center overflow-hidden bg-[color:var(--bg)] px-5 py-20 md:px-8 md:py-24 xl:px-[100px] xl:py-28"
      style={{ scrollMarginTop: "30px" }}
    >
      <div aria-hidden="true" className="jd-dots pointer-events-none absolute inset-0" />

      <div className="relative flex w-full max-w-[1200px] flex-col gap-14 md:gap-16 xl:gap-20">
        {/* Section header — large heading left, supporting paragraph right */}
        <div className="grid gap-7 md:grid-cols-[1.15fr_0.85fr] md:items-start md:gap-10">
          <h2 className="font-tight text-[clamp(44px,6.4vw,84px)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-[color:var(--text-strong)]">
            <span className="jd-heading block">My Design</span>{" "}
            <span className="jd-heading block">
              Journey<span className="text-[color:var(--grad-from)]">.</span>
            </span>
          </h2>
          <p className="jd-lede max-w-[520px] text-[16px] leading-[1.75] text-[color:var(--text-muted)] md:justify-self-end md:pt-[clamp(28px,4vw,72px)] md:text-[17px]">
            Every meaningful digital experience begins with understanding people.
            From research and empathy to thoughtful design and refinement, I follow
            a user-centred process to turn real problems into intuitive solutions.
          </p>
        </div>

        {/* Horizontal timeline + four stage columns */}
        <div className="jd-rail relative">
          <div
            aria-hidden="true"
            className="jd-line absolute left-0 top-0 hidden h-px w-full origin-left bg-[color:var(--border-soft)] md:block"
          />
          <div
            aria-hidden="true"
            className="jd-progress absolute left-0 top-0 hidden h-px w-full origin-left scale-x-0 md:block"
            style={{
              background: "linear-gradient(90deg, var(--grad-from), var(--grad-to))",
            }}
          />
          <div aria-hidden="true" className="jd-travels pointer-events-none absolute inset-0 hidden md:block">
            <span className="jd-travel journey-travel-a" />
            <span className="jd-travel journey-travel-b" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4">
            {stages.map((stage, index) => (
              <article
                key={stage.number}
                className={[
                  "journey-stage group relative flex gap-4 transition-colors duration-500 md:block",
                  index > 0
                    ? "md:border-l md:border-[color:var(--border-card)] md:group-hover:border-[color:var(--border-soft)] md:pl-6 lg:pl-8"
                    : "",
                  index < stages.length - 1 ? "md:pr-6 lg:pr-8" : "",
                ].join(" ")}
              >
                {/* Mobile: vertical timeline rail */}
                <div aria-hidden="true" className="journey-mrail flex w-3 shrink-0 flex-col items-center md:hidden">
                  <span className="journey-mnode" />
                  {index < stages.length - 1 && <span className="journey-mline" />}
                </div>

                <div className="min-w-0 flex-1 pb-10 md:pb-0 md:pt-14">
                  {/* Desktop: node on the horizontal timeline */}
                  <span aria-hidden="true" className="journey-node hidden md:block" />

                  <div className="flex items-start justify-between gap-4">
                    <div className="jd-num">
                      <span
                        className="journey-num-fill block font-tight text-[clamp(54px,5.8vw,86px)] font-bold leading-none text-transparent"
                        style={{
                          WebkitTextStroke: "1.5px var(--grad-from)",
                          animationDelay: `${index * 0.7}s`,
                        }}
                      >
                        {stage.number}
                      </span>
                    </div>
                    <div
                      className="jd-icon flex h-7 w-7 shrink-0 items-center justify-center text-[color:var(--grad-from)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110 md:mt-2"
                    >
                      <span
                        className="journey-icon-float inline-flex"
                        style={{ animationDelay: `${index * 0.55}s` }}
                      >
                        {stage.icon}
                      </span>
                    </div>
                  </div>

                  <h3 className="jd-title mt-6 font-tight text-[20px] font-bold uppercase leading-none tracking-[0.02em] text-[color:var(--heading-case)] transition-colors duration-500 group-hover:text-[color:var(--text-strong)] lg:text-[24px]">
                    {stage.title}
                  </h3>

                  <p className="jd-desc mt-3.5 max-w-[46ch] text-[15px] leading-[1.75] text-[color:var(--text-muted)] lg:text-[16px]">
                    {stage.description}
                  </p>

                  <ul className="jd-items mt-5 flex flex-wrap gap-2">
                    {stage.items.map((item) => (
                      <li
                        key={item}
                        className="section-eyebrow-accent rounded-full border border-[color:var(--border-card)] px-3 py-1 text-[11.5px] font-medium text-[color:var(--text-dim)] transition-colors duration-500 group-hover:border-[color:var(--border-soft)]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
