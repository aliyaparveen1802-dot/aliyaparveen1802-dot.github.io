import { ArrowRight } from "lucide-react";
import { userFlows } from "../../data/skyvoyage";
import { Section } from "./ui";

export default function CaseStudyFlows() {
  return (
    <Section
      id="flows"
      label="Section 09 — User Flow"
      title="Three flows that carry the traveller forward."
      intro="Each flow keeps the number of decisions low and the next step visible — from booking a flight to reaching the boarding gate."
      className="border-t border-[color:var(--border-card)]"
    >
      <div data-reveal-stagger className="flex flex-col gap-6">
        {userFlows.map((flow) => (
          <div
            key={flow.id}
            className="rounded-[20px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] p-5 md:p-7"
          >
            <div className="mb-6 flex items-center gap-4">
              <span className="font-tight text-[12px] font-medium uppercase tracking-[0.18em] text-[color:var(--grad-from)]">
                {flow.id}
              </span>
              <span className="h-px flex-1 bg-[color:var(--border-card)]" />
              <h3 className="font-tight text-[20px] font-medium text-[color:var(--text-strong)] md:text-[24px]">
                {flow.title}
              </h3>
            </div>

            <div
              className="-mx-5 flex items-center gap-3 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0"
              style={{ scrollbarWidth: "thin" }}
            >
              {flow.steps.map((step, i) => (
                <div key={step} className="flex shrink-0 items-center gap-3">
                  <span className="flex items-center gap-2.5 rounded-full border border-[color:var(--border-soft)] bg-[color:var(--bg)] px-4 py-2.5 text-[14px] font-medium text-[color:var(--text)] transition-colors duration-300 hover:border-[color:var(--grad-from)]">
                    <span className="font-tight text-[11px] tracking-[0.14em] text-[color:var(--heading-case-label)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step}
                  </span>
                  {i < flow.steps.length - 1 && (
                    <ArrowRight
                      size={15}
                      className="shrink-0 text-[color:var(--heading-case-label)]"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
