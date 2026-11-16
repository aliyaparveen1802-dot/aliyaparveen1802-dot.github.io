import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { projects } from "../data/content";
import { skyvoyageImages } from "../data/skyvoyage";
import { CASE_STUDY_PATH } from "../router";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface GalleryItem {
  title: string;
  pill: string;
  image: string;
  href: string;
  external: boolean;
  fit?: "contain";
}

const byId = Object.fromEntries(projects.map((p) => [p.id, p]));

function behance(id: string, title: string, pill: string): GalleryItem {
  const p = byId[id];
  return {
    title,
    pill,
    image: p.image,
    href: p.href,
    external: true,
    fit: p.fit === "contain" ? "contain" : undefined,
  };
}

const sky = (title: string, pill: string, image: string): GalleryItem => ({
  title,
  pill,
  image,
  href: CASE_STUDY_PATH,
  external: false,
});

const rowOne: GalleryItem[] = [
  sky("SkyVoyage", "UX Case Study", skyvoyageImages.hero),
  behance("health-track", "Health Track", "Mobile"),
  sky("SkyVoyage", "Airport Guide", skyvoyageImages.guide),
  behance("zen-ui", "Zen Cycle UI", "Mobile"),
  sky("SkyVoyage", "Live Tracking", skyvoyageImages.tracking),
  behance("moni-cakes", "Moni Cakes", "Web"),
  sky("SkyVoyage", "Navigation", skyvoyageImages.explorer),
];

const rowTwo: GalleryItem[] = [
  behance("zen-ux", "Zen Cycle UX", "Mobile"),
  sky("SkyVoyage", "Search", skyvoyageImages.results),
  behance("costume-order", "Costume Order", "Web"),
  sky("SkyVoyage", "Route Planner", skyvoyageImages.navigation),
  behance("logo", "Logo", "Logo"),
  behance("daily-travel", "Daily Travel", "Logo"),
  behance("prototype", "Lot of Prototype", "Prototype"),
];

const rows = [rowOne, rowTwo];

function GalleryCard({
  item,
  number,
  copy,
}: {
  item: GalleryItem;
  number: number;
  copy: boolean;
}) {
  return (
    <li
      aria-hidden={copy || undefined}
      className="mr-4 w-[286px] shrink-0 sm:w-[340px] md:mr-5 md:w-[430px] xl:mr-6 xl:w-[520px]"
    >
      <a
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        tabIndex={copy ? -1 : undefined}
        aria-label={`${item.title} — ${item.pill}`}
        className="gal-card group relative block aspect-[16/10] overflow-hidden rounded-[14px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] transition-colors duration-500"
      >
        <img
          src={item.image}
          alt={`${item.title} project preview`}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] ${
            item.fit === "contain"
              ? "object-contain p-6"
              : "object-cover object-center"
          }`}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-80"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.06) 45%, rgba(0,0,0,0.3) 100%)",
          }}
        />

        <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/45 font-tight text-[12px] font-semibold text-[color:var(--grad-from)] backdrop-blur-sm md:h-10 md:w-10 md:text-[13px]">
          {String(number).padStart(2, "0")}
        </span>

        <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#e3e4e6] backdrop-blur-sm">
          {item.pill}
        </span>

        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <span className="font-tight text-[14px] font-bold uppercase leading-tight tracking-[0.03em] text-white md:text-[17px]">
            {item.title}
          </span>
          <ArrowUpRight
            size={18}
            className="shrink-0 text-[color:var(--grad-from)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 md:size-5"
          />
        </span>
      </a>
    </li>
  );
}

export default function ProjectGallery() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = rootRef.current;
    if (!el || reduced) return;

    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => el.classList.toggle("gal-paused", !entries[0]?.isIntersecting),
        { threshold: 0 }
      );
      io.observe(el);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: el, start: "top 78%" },
      });

      tl.fromTo(
        ".gal-eyebrow",
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7 },
        0
      )
        .fromTo(
          ".gal-heading",
          { y: 48, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.95 },
          0.12
        )
        .fromTo(
          ".gal-sub",
          { y: 26, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8 },
          0.4
        )
        .fromTo(
          ".gal-row",
          { y: 56, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.16 },
          0.55
        );
    }, rootRef);

    return () => {
      io?.disconnect();
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced]);

  return (
    <section
      id="case-studies"
      ref={rootRef}
      className="flex flex-col items-center gap-10 overflow-hidden bg-[color:var(--bg)] py-20 md:gap-12 md:py-24 xl:py-28"
      style={{ scrollMarginTop: "30px" }}
    >
      <div className="flex w-full max-w-[1400px] flex-col items-center gap-5 px-5 text-center md:px-8">
        <div className="gal-eyebrow flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.34em] text-[color:var(--text-dim)] md:text-[12px]">
          <span
            aria-hidden="true"
            className="h-px w-9 bg-[color:var(--grad-from)] md:w-12"
          />
          <span>Selected Projects</span>
          <span className="text-[color:var(--heading-case-label)]">·</span>
          <span>01 — 09</span>
        </div>

        <h2 className="gal-heading font-tight text-[clamp(38px,7.4vw,104px)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-[color:var(--text-strong)]">
          Explore what I’ve built
          <span className="text-[color:var(--grad-from)]">.</span>
        </h2>

        <p className="gal-sub max-w-[640px] text-[15px] leading-[1.7] text-[color:var(--text-muted)] md:text-[17px]">
          A curated collection of my design projects, digital experiences and
          creative solutions, thoughtfully designed and brought to life.
        </p>
      </div>

      <div className="flex w-full flex-col gap-4 md:gap-5">
        {rows.map((items, rowIndex) => (
          <div
            key={rowIndex}
            className={`gal-row w-full overflow-hidden ${
              rowIndex === 1 ? "gal-row--reverse" : ""
            }`}
          >
            <ul
              className={`gal-track flex w-max items-center ${
                rowIndex === 1 ? "gal-track--reverse" : ""
              }`}
            >
              {[...items, ...items].map((item, i) => (
                <GalleryCard
                  key={`${rowIndex}-${i}`}
                  item={item}
                  number={(i % items.length) + 1}
                  copy={i >= items.length}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
