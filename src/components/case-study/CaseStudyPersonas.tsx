import { Target, AlertTriangle, HeartHandshake, User } from "lucide-react";
import { personas } from "../../data/skyvoyage";
import { Section } from "./ui";

function PersonaList({
  icon,
  title,
  items,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  tone: "goal" | "pain" | "need";
}) {
  const color =
    tone === "goal"
      ? "text-[color:var(--grad-from)]"
      : tone === "pain"
        ? "text-[#e0a63c]"
        : "text-[color:var(--text-muted)]";
  return (
    <div className="flex flex-col gap-3">
      <h4 className="section-eyebrow-accent flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--heading-case-label)]">
        <span className={color}>{icon}</span>
        {title}
      </h4>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
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
    </div>
  );
}

export default function CaseStudyPersonas() {
  return (
    <Section
      id="personas"
      label="Section 05 — User Personas"
      title="Designing for two very different travellers."
      intro="Two contrasting profiles shaped the experience: one needs reassurance and clear guidance, the other needs speed and everything in one place."
      className="border-t border-[color:var(--border-card)]"
    >
      <div
        data-reveal-stagger
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {personas.map((persona) => (
          <article
            key={persona.name}
            className="flex h-full flex-col gap-7 rounded-[20px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] p-6 transition-all duration-300 hover:border-[color:var(--border-soft)] md:p-8"
          >
            <header className="flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[color:var(--border-soft)] bg-[color:var(--bg)] font-tight text-[20px] font-semibold text-[color:var(--grad-from)]">
                    {persona.name.charAt(0)}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="section-eyebrow-accent text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--heading-case-label)]">
                      {persona.tag}
                    </span>
                    <h3 className="font-tight text-[28px] font-medium leading-[1.2] text-[color:var(--text-strong)]">
                      {persona.name}
                    </h3>
                  </div>
                </div>
                <span className="flex items-center gap-2 rounded-full border border-[color:var(--border-card)] px-3 py-1.5 text-[12px] text-[color:var(--text-muted)]">
                  <User size={13} />
                  {persona.role}
                </span>
              </div>
              <p className="text-[15px] leading-[1.75] text-[color:var(--text-muted)]">
                {persona.profile}
              </p>
            </header>

            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <PersonaList
                icon={<Target size={14} />}
                title="Goals"
                items={persona.goals}
                tone="goal"
              />
              <PersonaList
                icon={<AlertTriangle size={14} />}
                title="Pain points"
                items={persona.pains}
                tone="pain"
              />
            </div>
            <div className="border-t border-[color:var(--border-card)] pt-6">
              <PersonaList
                icon={<HeartHandshake size={14} />}
                title="Needs"
                items={persona.needs}
                tone="need"
              />
            </div>
          </article>
        ))}
      </div>

      <p
        data-reveal
        className="max-w-[820px] rounded-[12px] border border-[color:var(--border-card)] px-5 py-4 text-[14px] leading-[1.75] text-[color:var(--text-dim)]"
      >
        Note: these are illustrative personas built from design assumptions about
        traveller behaviour. They are not verified research participants, and no
        interview findings are claimed here.
      </p>
    </Section>
  );
}
