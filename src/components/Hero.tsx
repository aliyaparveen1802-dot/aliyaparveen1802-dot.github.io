import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import ToolsMarquee from "./ToolsMarquee";
import { links } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface HeroProps {
  ready: boolean;
}

const WORDS = "I\u2019m a Designer Specialising in UX/UI and Interaction Design"
  .split(" ")
  .map((w) => ({ text: w, accent: w === "UX/UI" }));

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
        ".hero-name",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0
      )
        .fromTo(
          ".hero-word",
          { yPercent: 115, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.06 },
          0.15
        )
        .fromTo(
          ".hero-cta",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          0.65
        )
        .fromTo(
          ".hero-marquee",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          0.8
        );
    }, rootRef);

    return () => ctx.revert();
  }, [ready, reduced]);

  useEffect(() => {
    if (!ready || reduced) return;
    const ctx = gsap.context(() => {
      gsap.to(".hero-inner", {
        yPercent: 6,
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
      className="relative px-5 pb-14 pt-[130px] md:px-8 md:pt-[200px] xl:px-[100px] xl:pt-[clamp(220px,31vh,292px)]"
    >
      <div className="hero-inner mx-auto flex w-full max-w-[1200px] flex-col items-start gap-10">
        <div className="flex flex-col items-start gap-4">
          <h3
            className="hero-name grad-text font-tight text-[clamp(30px,4.5vw,55px)] font-semibold leading-[1.3]"
            style={hidden ? { opacity: 0 } : undefined}
          >
            Aliya parveen!
          </h3>

          <h1 className="max-w-[1140px] font-tight text-[clamp(34px,6.2vw,88px)] font-semibold leading-[1.2] tracking-[-0.005em]">
            {WORDS.map((w, i) => (
              <span key={`${w.text}-${i}`}>
                <span className="inline-block overflow-hidden align-bottom">
                  <span
                    className={`hero-word inline-block ${
                      w.accent
                        ? "text-[color:var(--accent)]"
                        : "text-[color:var(--text-strong)]"
                    }`}
                    style={hidden ? { opacity: 0 } : undefined}
                  >
                    {w.text}
                  </span>
                </span>
                {i < WORDS.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
        </div>

        <a
          href={links.behance}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-cta group inline-flex items-center gap-2 rounded-[24px] border-[1.5px] border-[color:var(--border-soft)] px-6 py-3 text-[14px] font-medium text-[color:var(--text)] transition-all duration-300 hover:border-[color:var(--grad-from)] hover:text-[color:var(--text-strong)]"
          style={hidden ? { opacity: 0 } : undefined}
        >
          Visit Link
          <ArrowUpRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>

        <div className="hero-marquee mt-2 w-full" style={hidden ? { opacity: 0 } : undefined}>
          <ToolsMarquee />
        </div>
      </div>
    </section>
  );
}
