import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutImages } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

function AboutText({ size = "lg" }: { size?: "lg" | "sm" }) {
  const first =
    "I\u2019m a UI/UX designer driven by a passion for crafting ";
  const rest =
    "delightful and engaging digital experiences that leave a lasting impression. Beyond design, I\u2019m a music enthusiast, an avid gamer, and an explorer at heart, always seeking inspiration through travel and new adventures.";

  return (
    <div className="flex flex-col gap-6">
      <h2
        className={`about-heading grad-text font-tight font-semibold uppercase ${
          size === "lg" ? "text-[clamp(28px,3vw,40px)]" : "text-[clamp(24px,4vw,34px)]"
        } leading-[1.4] tracking-[0.06em]`}
      >
        A bit about me
      </h2>
      <p
        className={`about-body font-[family-name:var(--font-work)] leading-[1.5] text-[color:var(--text-about)] ${
          size === "lg"
            ? "max-w-[570px] text-[clamp(20px,2.3vw,32px)]"
            : "max-w-[570px] text-[clamp(18px,3vw,24px)]"
        }`}
      >
        <span className="font-light">{first}</span>
        <span className="font-semibold">{rest}</span>
      </p>
    </div>
  );
}

export default function About() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-heading",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
        }
      );

      gsap.fromTo(
        ".about-body",
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.1,
          scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
        }
      );

      gsap.fromTo(
        ".about-img",
        { y: 44, opacity: 0, scale: 1.03 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: rootRef.current, start: "top 72%" },
        }
      );

      gsap.utils.toArray<HTMLElement>(".about-parallax").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="about"
      ref={rootRef}
      className="bg-[color:var(--bg)] px-5 py-16 md:px-8 md:py-20 xl:px-8 xl:py-[74px]"
      style={{ scrollMarginTop: "72px" }}
    >
      <div className="mx-auto flex w-full max-w-[1184px] flex-col">
        {/* Mobile: text only */}
        <div className="md:hidden">
          <AboutText size="sm" />
        </div>

        {/* Tablet: text + 2 side-by-side images */}
        <div className="hidden flex-col gap-10 md:flex xl:hidden">
          <AboutText />
          <div className="grid grid-cols-2 gap-8">
            <div className="about-img relative h-[331px] overflow-hidden rounded-[16px] border border-[color:var(--border-card)]">
              <img
                src={aboutImages.landscape}
                alt="Music corner — guitar and microphone by the window"
                loading="lazy"
                decoding="async"
                className="about-parallax h-[115%] w-full object-cover"
              />
            </div>
            <div className="about-img relative h-[331px] overflow-hidden rounded-[16px] border border-[color:var(--border-card)]">
              <img
                src={aboutImages.landscapeAlt}
                alt="Traveller standing on a rocky mountain trail"
                loading="lazy"
                decoding="async"
                className="about-parallax h-[115%] w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Desktop ≥1024: text | single image | 2 stacked */}
        <div className="hidden items-center gap-8 xl:flex">
          <div className="flex flex-1 flex-col gap-6">
            <AboutText />
          </div>

          <div className="about-img relative h-[385px] w-[267px] shrink-0 overflow-hidden rounded-[16px] border border-[color:var(--border-card)]">
            <img
              src={aboutImages.landscape}
              alt="Music corner — guitar and microphone by the window"
              loading="lazy"
              decoding="async"
              className="about-parallax h-[115%] w-full object-cover"
            />
          </div>

          <div className="flex w-[272px] shrink-0 flex-col gap-8">
            <div className="about-img relative h-[323px] overflow-hidden rounded-[16px] border border-[color:var(--border-card)]">
              <img
                src={aboutImages.vertical1}
                alt="Playing video games with a controller"
                loading="lazy"
                decoding="async"
                className="about-parallax h-[115%] w-full object-cover"
              />
            </div>
            <div className="about-img relative h-[320px] overflow-hidden rounded-[16px] border border-[color:var(--border-card)]">
              <img
                src={aboutImages.vertical2}
                alt="Hiking in the mountains"
                loading="lazy"
                decoding="async"
                className="about-parallax h-[115%] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
