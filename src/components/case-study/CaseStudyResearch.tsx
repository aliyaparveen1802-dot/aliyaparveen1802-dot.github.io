import { Compass, HelpCircle, Lightbulb } from "lucide-react";
import { researchQuestions } from "../../data/skyvoyage";
import { Section, Tag } from "./ui";

export default function CaseStudyResearch() {
  return (
    <Section
      id="research"
      label="Section 03 — User Research"
      title="Starting from the traveller's reality."
      intro="Before any screen was drawn, the problem space was framed around four questions — where travel fragments, what breaks after arrival, how waiting time feels and where status anxiety comes from."
      className="border-t border-[color:var(--border-card)]"
    >
      <div
        data-reveal-stagger
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        {researchQuestions.map((item, i) => (
          <article
            key={item.question}
            className="group flex h-full flex-col gap-4 rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] p-6 transition-all duration-300 hover:border-[color:var(--border-soft)]"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[color:var(--border-card)] bg-[color:var(--bg)] text-[color:var(--grad-from)] transition-colors duration-300 group-hover:border-[color:var(--border-soft)]">
                <HelpCircle size={18} strokeWidth={1.7} />
              </span>
              <span className="section-eyebrow-accent font-tight text-[13px] font-medium tracking-[0.14em] text-[color:var(--heading-case-label)]">
                Q{i + 1}
              </span>
            </div>
            <h3 className="font-tight text-[19px] font-medium leading-[1.4] text-[color:var(--text)]">
              {item.question}
            </h3>
            <div className="mt-auto flex gap-3 border-t border-[color:var(--border-card)] pt-4">
              <Lightbulb
                size={15}
                className="mt-1 shrink-0 text-[color:var(--grad-from)]"
              />
              <p className="text-[15px] leading-[1.75] text-[color:var(--text-muted)]">
                {item.direction}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div
        data-reveal
        className="flex flex-col gap-4 rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] p-6"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Compass size={16} className="text-[color:var(--grad-from)]" />
          <span className="section-eyebrow-accent text-[12px] font-medium uppercase tracking-[0.18em] text-[color:var(--heading-case-label)]">
            Research approach
          </span>
          <Tag>Assumption-based</Tag>
        </div>
        <p className="max-w-[820px] text-[15px] leading-[1.8] text-[color:var(--text-muted)]">
          These questions and the directions above were developed as design
          assumptions about traveller behaviour, then carried through personas,
          journey mapping and the interface itself. No interviews, participant
          sessions or usability test results are claimed anywhere in this study.
        </p>
      </div>
    </Section>
  );
}
