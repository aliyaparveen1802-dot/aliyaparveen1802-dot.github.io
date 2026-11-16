import { designDecisions, skyvoyageImages } from "../../data/skyvoyage";
import { Frame, Section } from "./ui";

export default function CaseStudyDecisions() {
  return (
    <Section
      id="decisions"
      label="Section 09 — Design Decisions"
      title="Decisions that shaped the interface."
      intro="Every screen had to answer a traveller question quickly. These are the principles applied across the product."
      className="border-t border-[color:var(--border-card)]"
    >
      <div
        data-reveal-stagger
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {designDecisions.map((decision, i) => (
          <article
            key={decision.title}
            className="flex h-full flex-col gap-4 rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] p-5 transition-all duration-300 hover:border-[color:var(--border-soft)]"
          >
            <span className="font-tight text-[12px] font-medium tracking-[0.18em] text-[color:var(--grad-from)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-tight text-[17px] font-medium leading-[1.45] text-[color:var(--text-strong)]">
              {decision.title}
            </h3>
            <p className="text-[14.5px] leading-[1.75] text-[color:var(--text-muted)]">
              {decision.body}
            </p>
          </article>
        ))}
      </div>

      <div
        data-reveal-stagger
        className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        <Frame
          src={skyvoyageImages.search}
          alt="SkyVoyage flight search form"
          caption="Search keeps trip type, route, dates, passengers and class in one scannable form."
        />
        <Frame
          src={skyvoyageImages.guideScroll}
          alt="SkyVoyage airport guide with terminal details"
          caption="Airport guide surfaces terminal, gate, counter and timing as large, readable facts."
        />
        <Frame
          src={skyvoyageImages.explorerScroll}
          alt="SkyVoyage airport explorer with facilities"
          caption="Facilities are grouped by category with walking distance, so waiting time becomes a choice."
          className="md:col-span-2 xl:col-span-1"
        />
      </div>
    </Section>
  );
}
