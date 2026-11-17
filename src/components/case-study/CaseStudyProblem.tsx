import {
  Layers,
  MapPin,
  Coffee,
  Signpost,
  Activity,
  HeartCrack,
} from "lucide-react";
import { problems } from "../../data/skyvoyage";
import { Section } from "./ui";

const icons = [Layers, Signpost, Coffee, MapPin, Activity, HeartCrack];

export default function CaseStudyProblem() {
  return (
    <Section
      id="problem"
      label="Section 02 — The Problem"
      title="Travelling should feel exciting, not stressful."
      intro="Most travel tools solve one small piece of the trip. The result is a passenger who is constantly switching context, second-guessing details and carrying the mental load alone."
      className="border-t border-[color:var(--border-card)]"
    >
      <div
        data-reveal-stagger
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {problems.map((problem, i) => {
          const Icon = icons[i % icons.length];
          return (
            <article
              key={problem.title}
              className="group flex h-full flex-col gap-4 rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] p-6 transition-all duration-300 hover:border-[color:var(--border-soft)]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[color:var(--border-card)] bg-[color:var(--bg)] text-[color:var(--grad-from)] transition-colors duration-300 group-hover:border-[color:var(--border-soft)]">
                  <Icon size={18} strokeWidth={1.7} />
                </span>
                <span className="section-eyebrow-accent font-tight text-[13px] font-medium tracking-[0.14em] text-[color:var(--heading-case-label)]">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-tight text-[19px] font-medium leading-[1.4] text-[color:var(--text)]">
                {problem.title}
              </h3>
              <p className="text-[15px] leading-[1.75] text-[color:var(--text-muted)]">
                {problem.body}
              </p>
            </article>
          );
        })}
      </div>

      <p
        data-reveal
        className="max-w-[760px] rounded-[16px] border-l-2 border-[color:var(--grad-from)] bg-[color:var(--chip-bg)] px-6 py-5 text-[16px] leading-[1.8] text-[color:var(--text-about)]"
      >
        Every problem above points to the same root cause: travel information exists, but
        it is not connected at the moment the passenger needs it.
      </p>
    </Section>
  );
}
