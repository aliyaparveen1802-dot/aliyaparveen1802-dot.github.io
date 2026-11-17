import { AlertTriangle } from "lucide-react";
import { painThemes } from "../../data/skyvoyage";
import { Section } from "./ui";

export default function CaseStudyPainPoints() {
  return (
    <Section
      id="pains"
      label="Section 07 — Pain Points"
      title="Where it hurts, grouped by moment."
      intro="Pains pulled from the two personas and every stage of the journey map, grouped into the three moments where they surface."
      className="border-t border-[color:var(--border-card)]"
    >
      <div
        data-reveal-stagger
        className="grid grid-cols-1 gap-5 lg:grid-cols-3"
      >
        {painThemes.map((theme, i) => (
          <article
            key={theme.title}
            className="flex h-full flex-col gap-5 rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] p-6 transition-all duration-300 hover:border-[color:var(--border-soft)]"
          >
            <header className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[color:var(--border-card)] bg-[color:var(--bg)] text-[#e06c6c]">
                  <AlertTriangle size={18} strokeWidth={1.7} />
                </span>
                <span className="section-eyebrow-accent font-tight text-[13px] font-medium tracking-[0.14em] text-[color:var(--heading-case-label)]">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-tight text-[20px] font-medium leading-[1.35] text-[color:var(--text-strong)]">
                {theme.title}
              </h3>
              <p className="text-[14.5px] leading-[1.7] text-[color:var(--text-muted)]">
                {theme.intro}
              </p>
            </header>

            <ul className="mt-auto flex flex-col gap-3 border-t border-[color:var(--border-card)] pt-4">
              {theme.items.map((item) => (
                <li key={item.text} className="flex flex-col gap-1">
                  <span className="text-[14.5px] leading-[1.7] text-[color:var(--text-about)]">
                    {item.text}
                  </span>
                  <span className="section-eyebrow-accent text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--heading-case-label)]">
                    {item.source}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p
        data-reveal
        className="max-w-[760px] rounded-[16px] border-l-2 border-[color:var(--grad-from)] bg-[color:var(--chip-bg)] px-6 py-5 text-[16px] leading-[1.8] text-[color:var(--text-about)]"
      >
        Every theme above reappears in the persona goals, the journey map and
        the problem-to-solution mapping that follows — the same pains, seen
        from three angles.
      </p>
    </Section>
  );
}
