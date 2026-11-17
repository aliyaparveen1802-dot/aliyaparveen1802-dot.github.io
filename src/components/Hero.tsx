import { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface HeroProps {
  ready: boolean;
}

const LINES: { text: string; accent?: boolean }[][] = [
  [
    { text: "I\u2019m" },
    { text: "a" },
    { text: "Designer" },
    { text: "Specialising" },
    { text: "in" },
  ],
  [
    { text: "UX/UI", accent: true },
    { text: "and" },
    { text: "Interaction" },
    { text: "Design" },
  ],
];

export default function Hero({ ready }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const played = useRef(false);

  const hidden = !ready && !reduced;

  useLayoutEffect(() => {
    if (!ready || reduced || played.current) return;
    played.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-glows",
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: "sine.out" },
        0
      ).fromTo(
        ".hero-word",
        { yPercent: 115, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.07 },
        0.2
      );
    }, rootRef);

    return () => ctx.revert();
  }, [ready, reduced]);

  useEffect(() => {
    if (!ready || reduced) return;
    const ctx = gsap.context(() => {
      gsap.to(".hero-inner", {
        yPercent: 5,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [ready, reduced]);

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative overflow-hidden bg-[color:var(--bg)] px-5 pt-[clamp(150px,25vh,250px)] pb-[clamp(130px,22vh,230px)] md:px-8 xl:px-[100px]"
    >
      {/* Animated accent glow — bottom centre */}
      <div
        aria-hidden="true"
        className="hero-glows pointer-events-none absolute inset-0 overflow-hidden"
        style={hidden ? { opacity: 0 } : undefined}
      >
        <span className="hero-glow-haze absolute inset-0" />
        <span className="hero-glow-a absolute bottom-[-42%] left-1/2 h-[85%] w-[min(1300px,160%)]" />
        <span className="hero-glow-b absolute bottom-[-34%] left-1/2 h-[68%] w-[min(950px,120%)]" />
      </div>

      <div className="hero-inner relative mx-auto flex w-full max-w-[1200px] flex-col items-center text-center">
        <h1 className="font-tight text-[clamp(32px,5.9vw,80px)] font-bold leading-[1.06] tracking-[-0.03em] text-[color:var(--text-strong)]">
          {LINES.map((line, li) => (
            <span key={li} className="block">
              {line.map((w, wi) => (
                <span key={`${li}-${wi}`}>
                  <span className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
                    <span
                      className={`hero-word inline-block ${
                        w.accent ? "text-[color:var(--accent)]" : ""
                      }`}
                      style={hidden ? { opacity: 0 } : undefined}
                    >
                      {w.text}
                    </span>
                  </span>
                  {wi < line.length - 1 ? " " : null}
                </span>
              ))}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
