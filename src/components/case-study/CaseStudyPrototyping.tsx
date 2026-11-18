import { ArrowUpRight, MousePointerClick } from "lucide-react";
import { LIVE_PRODUCT_URL, prototypeMoments } from "../../data/skyvoyage";
import { Section, Tag } from "./ui";

export default function CaseStudyPrototyping() {
  return (
    <Section
      id="prototyping"
      label="Section 17 — Prototyping"
      title="From static screens to a clickable journey."
      intro="The key flows were wired into an interactive prototype, then carried into the live build — so every transition in this study exists in the product travellers can open today."
      className="border-t border-[color:var(--border-card)]"
    >
      <div
        data-reveal-stagger
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        {prototypeMoments.map((moment, i) => (
          <article
            key={moment.title}
            className="group flex h-full flex-col gap-4 rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] p-6 transition-all duration-300 hover:border-[color:var(--border-soft)]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="section-eyebrow-accent font-tight text-[13px] font-medium tracking-[0.14em] text-[color:var(--heading-case-label)]">
                {moment.stage}
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[color:var(--border-card)] bg-[color:var(--bg)] text-[color:var(--grad-from)]">
                <MousePointerClick size={16} strokeWidth={1.7} />
              </span>
            </div>
            <h3 className="font-tight text-[19px] font-semibold leading-[1.4] text-[color:var(--text-strong)]">
              {moment.title}
            </h3>
            <p className="text-[15px] leading-[1.75] text-[color:var(--text-muted)]">
              {moment.note}
            </p>
            <span className="mt-auto text-[13px] text-[color:var(--text-dim)]">
              Prototype step {String(i + 1).padStart(2, "0")} · interactive
            </span>
          </article>
        ))}
      </div>

      <div
        data-reveal
        className="flex flex-col items-start gap-5 rounded-[20px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] p-7 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="accent">Interactive prototype</Tag>
            <Tag tone="success">Shipped as live build</Tag>
          </div>
          <p className="max-w-[560px] text-[15px] leading-[1.75] text-[color:var(--text-muted)]">
            The prototype became the product — same flows, same information
            order. Flight, gate and facility details inside it are clearly
            labelled demo data.
          </p>
        </div>
        <a
          href={LIVE_PRODUCT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center gap-2 rounded-[24px] border-[1.5px] border-[color:var(--grad-from)] bg-[color:var(--bg)] px-6 py-3 text-[14px] font-medium text-[color:var(--text-strong)] transition-all duration-300 hover:bg-[color:var(--chip-bg)]"
        >
          Open the live product
          <ArrowUpRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </Section>
  );
}
