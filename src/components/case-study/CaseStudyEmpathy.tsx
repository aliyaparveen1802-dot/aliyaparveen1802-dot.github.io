import { Brain, Heart, MessageSquare, Footprints } from "lucide-react";
import { empathyMap } from "../../data/skyvoyage";
import { Section } from "./ui";

const quadrants = [
  {
    key: "thinks",
    title: "Thinks",
    icon: Brain,
    items: empathyMap.thinks,
    tone: "text-[color:var(--grad-from)]",
  },
  {
    key: "feels",
    title: "Feels",
    icon: Heart,
    items: empathyMap.feels,
    tone: "text-[#e0a63c]",
  },
  {
    key: "says",
    title: "Says",
    icon: MessageSquare,
    items: empathyMap.says,
    tone: "text-[#e06c6c]",
  },
  {
    key: "does",
    title: "Does",
    icon: Footprints,
    items: empathyMap.does,
    tone: "text-[#3ddc97]",
  },
];

export default function CaseStudyEmpathy() {
  return (
    <Section
      id="empathy"
      label="Section 05 — Empathy Mapping"
      title="What the traveller thinks, feels, says and does."
      intro="One map collecting the internal monologue and visible behaviour behind the journey — built from the two personas and the seven journey stages."
      className="border-t border-[color:var(--border-card)]"
    >
      <div
        data-reveal
        className="flex flex-col items-center gap-3 rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] px-6 py-5 text-center"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--border-soft)] bg-[color:var(--bg)] font-tight text-[18px] font-semibold text-[color:var(--grad-from)]">
          T
        </span>
        <span className="font-tight text-[20px] font-medium text-[color:var(--text-strong)]">
          The traveller
        </span>
        <span className="text-[14px] leading-[1.7] text-[color:var(--text-dim)]">
          First-time flyer and frequent traveller, side by side
        </span>
      </div>

      <div
        data-reveal-stagger
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        {quadrants.map((q) => (
          <article
            key={q.key}
            className="flex h-full flex-col gap-4 rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] p-6 transition-all duration-300 hover:border-[color:var(--border-soft)]"
          >
            <h3 className="section-eyebrow-accent flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[color:var(--heading-case-label)]">
              <span className={q.tone}>
                <q.icon size={15} />
              </span>
              {q.title}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {q.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-[15px] leading-[1.7] text-[color:var(--text-about)]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--border-soft)]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p
        data-reveal
        className="max-w-[820px] rounded-[12px] border border-[color:var(--border-card)] px-5 py-4 text-[14px] leading-[1.75] text-[color:var(--text-dim)]"
      >
        Note: this map synthesises the illustrative personas and journey stages
        above — it is a design artefact, not a record of observed research
        participants. No interview findings are claimed here.
      </p>
    </Section>
  );
}
