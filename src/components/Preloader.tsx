import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface PreloaderProps {
  onDone: () => void;
}

export default function Preloader({ onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      onDone();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => onDone(),
      });
      tl.fromTo(
        ".preloader-text",
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.08 }
      )
        .to(".preloader-text", {
          yPercent: -110,
          opacity: 0,
          duration: 0.55,
          ease: "power3.in",
          stagger: 0.05,
          delay: 0.35,
        })
        .to(
          rootRef.current,
          { yPercent: -100, duration: 0.7, ease: "power4.inOut" },
          "-=0.2"
        );
    }, rootRef);

    return () => ctx.revert();
  }, [onDone, reduced]);

  if (reduced) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#060608]"
    >
      <div className="overflow-hidden px-6 text-center">
        <span className="preloader-text grad-text block text-[clamp(32px,6vw,56px)] font-semibold leading-tight">
          Aliya parveen!
        </span>
      </div>
    </div>
  );
}
