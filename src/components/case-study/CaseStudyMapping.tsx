import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { painSolution } from "../../data/skyvoyage";
import { Section } from "./ui";

export default function CaseStudyMapping() {
  const [active, setActive] = useState(0);

  return (
    <Section
      id="mapping"
      label="Section 06 — Pain Point to Solution"
      title="Every problem has a designed answer."
      intro="Hover or tap a problem to see how SkyVoyage responds to it."
      className="border-t border-[color:var(--border-card)]"
    >
      <div data-reveal-stagger className="flex flex-col gap-3">
        {painSolution.map((pair, i) => {
          const isActive = active === i;
          return (
            <button
              key={pair.problem}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={isActive}
              className={`group grid w-full grid-cols-1 items-center gap-4 rounded-[16px] border p-5 text-left transition-all duration-300 md:grid-cols-[1fr_auto_1fr] md:gap-6 md:p-6 ${
                isActive
                  ? "border-[color:var(--grad-from)] bg-[color:var(--chip-bg)]"
                  : "border-[color:var(--border-card)] bg-[color:var(--chip-bg)] hover:border-[color:var(--border-soft)]"
              }`}
            >
              <span className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full transition-colors duration-300 ${
                    isActive ? "bg-[#e06c6c]" : "bg-[color:var(--border-soft)]"
                  }`}
                />
                <span
                  className={`text-[16px] leading-[1.7] transition-colors duration-300 ${
                    isActive
                      ? "text-[color:var(--text-strong)]"
                      : "text-[color:var(--text-muted)]"
                  }`}
                >
                  {pair.problem}
                </span>
              </span>

              <span
                aria-hidden="true"
                className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 md:flex ${
                  isActive
                    ? "border-[color:var(--grad-from)] text-[color:var(--grad-from)]"
                    : "border-[color:var(--border-card)] text-[color:var(--text-dim)]"
                }`}
              >
                <ArrowRight
                  size={15}
                  className={`transition-transform duration-300 ${
                    isActive ? "translate-x-0.5" : ""
                  }`}
                />
              </span>

              <span className="flex items-start gap-3">
                <CheckCircle2
                  size={16}
                  className={`mt-0.5 shrink-0 transition-colors duration-300 ${
                    isActive ? "text-[#3ddc97]" : "text-[color:var(--border-soft)]"
                  }`}
                />
                <span
                  className={`text-[16px] leading-[1.7] transition-colors duration-300 ${
                    isActive
                      ? "text-[color:var(--text-strong)]"
                      : "text-[color:var(--text-dim)]"
                  }`}
                >
                  {pair.solution}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </Section>
  );
}
