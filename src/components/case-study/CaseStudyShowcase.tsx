import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Type } from "lucide-react";
import {
  designTokens,
  showcaseLaptops,
  showcaseScreens,
  skyvoyageImages,
} from "../../data/skyvoyage";
import { LaptopFrame, Section, Tag } from "./ui";

export default function CaseStudyShowcase() {
  const [active, setActive] = useState(0);
  const count = showcaseScreens.length;
  const screen = showcaseScreens[active];
  const image = skyvoyageImages[screen.image];

  const prev = () => setActive((i) => (i - 1 + count) % count);
  const next = () => setActive((i) => (i + 1) % count);

  useEffect(() => {
    showcaseScreens.forEach((s) => {
      const preload = new Image();
      preload.src = skyvoyageImages[s.image];
    });
  }, []);

  return (
    <Section
      id="showcase"
      label="Section 18 — Interface Showcase"
      title="Every screen, exactly as it ships."
      intro="No concepts and no placeholders — each mockup below is a real interface from the live product, presented in device frames with the same palette, type and spacing the product uses."
      className="border-t border-[color:var(--border-card)]"
    >
      {/* Interactive stage: browser frame + info panel */}
      <div
        data-reveal
        className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_310px] xl:gap-12"
      >
        <div key={screen.id} className="cs-swap">
          <LaptopFrame
            src={image}
            alt={`SkyVoyage — ${screen.title}`}
            className="w-full"
            priority={active === 0}
            reveal={false}
          />
        </div>

        <aside
          aria-live="polite"
          className="flex flex-col gap-5 self-start rounded-[20px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <Tag tone="accent">{screen.stage}</Tag>
            <span className="font-tight text-[13px] font-medium text-[color:var(--text-dim)]">
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </div>
          <h3 className="font-tight text-[24px] font-medium leading-[1.3] text-[color:var(--text-strong)]">
            {screen.title}
          </h3>
          <p className="text-[15px] leading-[1.8] text-[color:var(--text-muted)]">
            {screen.note}
          </p>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-[color:var(--border-card)] pt-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous screen"
                onClick={prev}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border-card)] text-[color:var(--text-muted)] transition-all duration-300 hover:border-[color:var(--grad-from)] hover:text-[color:var(--text-strong)]"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Next screen"
                onClick={next}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border-card)] text-[color:var(--text-muted)] transition-all duration-300 hover:border-[color:var(--grad-from)] hover:text-[color:var(--text-strong)]"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <Tag>Web · 1440 × 900</Tag>
          </div>
        </aside>
      </div>

      {/* Thumbnail filmstrip */}
      <div
        data-reveal-stagger
        role="tablist"
        aria-label="Product screens"
        className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-3"
      >
        {showcaseScreens.map((s, i) => {
          const selected = i === active;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={`Show ${s.title}`}
              onClick={() => setActive(i)}
              className={`group/thumb flex shrink-0 flex-col gap-2 rounded-[14px] border p-2 text-left transition-all duration-300 ${
                selected
                  ? "border-[color:var(--grad-from)] bg-[color:var(--chip-bg)]"
                  : "border-[color:var(--border-card)] hover:border-[color:var(--border-soft)]"
              }`}
            >
              <img
                src={skyvoyageImages[s.image]}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className={`h-14 w-24 rounded-[8px] object-cover object-top transition-all duration-300 ${
                  selected
                    ? ""
                    : "opacity-55 group-hover/thumb:scale-[1.05] group-hover/thumb:opacity-100"
                }`}
              />
              <span
                className={`px-1 text-[10px] font-medium uppercase tracking-[0.14em] ${
                  selected
                    ? "text-[color:var(--grad-from)]"
                    : "text-[color:var(--text-dim)]"
                }`}
              >
                {s.stage}
              </span>
            </button>
          );
        })}
      </div>

      {/* Laptop row */}
      <div className="flex flex-col gap-8 md:gap-10">
        <div
          data-reveal
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div className="flex flex-col gap-2">
            <p className="section-eyebrow-accent text-[12px] font-medium uppercase tracking-[0.2em] text-[color:var(--heading-case-label)] md:text-[13px]">
              Desktop experience
            </p>
            <h3 className="font-tight text-[clamp(20px,2.4vw,30px)] font-medium leading-[1.3] text-[color:var(--text-strong)]">
              The same journey, at full size.
            </h3>
          </div>
          <Tag>Web · 1440 × 900</Tag>
        </div>

        <div
          data-reveal-stagger
          className="cs-laptop-row grid grid-cols-2 gap-5 md:gap-8 xl:grid-cols-4"
        >
          {showcaseLaptops.map((p, i) => (
            <div key={p.id} className={i % 2 === 1 ? "xl:mt-12" : ""}>
              <LaptopFrame
                reveal={false}
                float
                floatDelay={i * 0.9}
                src={skyvoyageImages[p.image]}
                alt={`SkyVoyage ${p.label} screen`}
                caption={
                  <>
                    <span className="section-eyebrow-accent text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--heading-case-label)]">
                      {p.label}
                    </span>
                    <span className="text-[13px] leading-[1.7] text-[color:var(--text-dim)]">
                      {p.caption}
                    </span>
                  </>
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Design system strip */}
      <div data-reveal-stagger className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {designTokens.map((t) => (
          <div
            key={t.label}
            className="flex items-center gap-3 rounded-[14px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] px-4 py-3.5"
          >
            {t.color ? (
              <span
                aria-hidden="true"
                className="h-7 w-7 shrink-0 rounded-[8px] border border-white/15"
                style={{ background: t.color }}
              />
            ) : (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] border border-[color:var(--border-soft)] text-[color:var(--grad-from)]">
                <Type size={14} />
              </span>
            )}
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="section-eyebrow-accent text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--heading-case-label)]">
                {t.label}
              </span>
              <span className="truncate text-[13px] text-[color:var(--text-muted)]">
                {t.value}
              </span>
            </span>
          </div>
        ))}
      </div>

      <p
        data-reveal
        className="max-w-[820px] text-[15px] leading-[1.8] text-[color:var(--text-dim)]"
      >
        Every screen above is captured from the live build at its shipped size —
        1440 × 900 on desktop, with responsive layouts for smaller screens —
        so what you see here is what travellers get.
      </p>
    </Section>
  );
}
