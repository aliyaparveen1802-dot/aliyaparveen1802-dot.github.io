import { Type } from "lucide-react";
import { paletteRoles, typeSpecimen } from "../../data/skyvoyage";
import { Section, Tag } from "./ui";

export default function CaseStudyTypography() {
  return (
    <Section
      id="typography"
      label="Section 15 — Typography & Colour Theory"
      title="One typeface, four roles. Three colours, one job each."
      intro="The visual system stays small on purpose — a single geometric sans across roles and a three-colour palette that reads comfortably in a dim terminal."
      className="border-t border-[color:var(--border-card)]"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div data-reveal className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="section-eyebrow-accent flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.18em] text-[color:var(--heading-case-label)]">
              <Type size={14} />
              Type specimen
            </span>
            <Tag>Inter · Inter Tight</Tag>
          </div>

          <div className="flex flex-col gap-3 overflow-hidden rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)]">
            <div className="flex items-baseline justify-between gap-4 border-b border-[color:var(--border-card)] px-6 py-5">
              <span className="font-tight text-[clamp(40px,5vw,64px)] font-semibold leading-none tracking-[-0.03em] text-[color:var(--text-strong)]">
                Aa
              </span>
              <span className="flex flex-col items-end gap-1">
                <span className="font-tight text-[18px] font-medium text-[color:var(--text-strong)]">
                  Inter Tight / Inter
                </span>
                <span className="text-[13px] text-[color:var(--text-dim)]">
                  Tight geometric sans
                </span>
              </span>
            </div>

            {typeSpecimen.map((row) => (
              <div
                key={row.role}
                className="flex flex-col gap-1.5 border-b border-[color:var(--border-card)] px-6 py-4 last:border-b-0"
              >
                <span className="section-eyebrow-accent text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--heading-case-label)]">
                  {row.role}
                </span>
                <span
                  className={`text-[color:var(--text-strong)] ${
                    row.role === "Display"
                      ? "font-tight text-[26px] font-semibold tracking-[-0.02em]"
                      : row.role === "Heading"
                        ? "text-[19px] font-medium"
                        : row.role === "Caption"
                          ? "text-[12px] font-medium uppercase tracking-[0.16em] text-[color:var(--text-muted)]"
                          : "text-[15px] leading-[1.7]"
                  }`}
                >
                  {row.sample}
                </span>
                <span className="text-[12.5px] text-[color:var(--text-dim)]">
                  {row.note}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div data-reveal className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="section-eyebrow-accent text-[12px] font-medium uppercase tracking-[0.18em] text-[color:var(--heading-case-label)]">
              Colour roles
            </span>
            <Tag tone="accent">3 + 1 system</Tag>
          </div>

          <div className="flex flex-col gap-3">
            {paletteRoles.map((token) => (
              <div
                key={token.label}
                className="flex items-start gap-4 rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] px-5 py-4"
              >
                {token.color ? (
                  <span
                    aria-hidden="true"
                    className="h-11 w-11 shrink-0 rounded-[10px] border border-white/15"
                    style={{ background: token.color }}
                  />
                ) : (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-[color:var(--border-soft)] text-[color:var(--grad-from)]">
                    <Type size={17} />
                  </span>
                )}
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="section-eyebrow-accent text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--heading-case-label)]">
                      {token.label}
                    </span>
                    <span className="text-[13px] text-[color:var(--text-muted)]">
                      {token.value}
                    </span>
                  </span>
                  <span className="text-[14.5px] leading-[1.7] text-[color:var(--text-about)]">
                    {token.role}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <p className="max-w-[560px] text-[14px] leading-[1.75] text-[color:var(--text-dim)]">
            The acid lime accent is reserved for status and active states, so it
            never competes with the information travellers actually need to read.
          </p>
        </div>
      </div>
    </Section>
  );
}
