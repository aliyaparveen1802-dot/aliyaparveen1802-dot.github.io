import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { links } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-inner",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 92%" },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <footer
      ref={rootRef}
      className="bg-[var(--bg-footer)] px-5 py-6 md:px-8 xl:px-12"
    >
      <div className="footer-inner mx-auto flex min-h-[104px] max-w-[1440px] flex-col items-center justify-between gap-4 text-center md:min-h-[144px] md:flex-row md:justify-start md:gap-12 md:text-left">
        <p className="text-[14px] font-light leading-[1.6] text-[color:var(--text-footer)]">
          &copy; Copyright 2024. All rights Reserved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[14px] font-light text-[color:var(--text-footer)]">
          <span>Made by Aliya</span>
          <span>in</span>
          <a
            href={links.framerCredit}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline decoration-1 underline-offset-2 transition-colors hover:text-[color:var(--text)]"
          >
            Framer
          </a>
        </div>
      </div>
    </footer>
  );
}
