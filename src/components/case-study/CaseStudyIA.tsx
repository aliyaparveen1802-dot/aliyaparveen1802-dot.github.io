import { informationArchitecture } from "../../data/skyvoyage";
import { Section, Tag } from "./ui";

export default function CaseStudyIA() {
  return (
    <Section
      id="ia"
      label="Section 10 — Information Architecture"
      title="Five areas, one connected journey."
      intro="The product is organised around the moments that matter to a passenger. Each area owns one responsibility, and every area links back to the same journey."
      className="border-t border-[color:var(--border-card)]"
    >
      <div data-reveal className="flex flex-col items-center">
        <div className="rounded-[14px] border border-[color:var(--border-soft)] bg-[color:var(--chip-bg)] px-7 py-4 text-center">
          <span className="font-tight text-[18px] font-medium text-[color:var(--text-strong)] md:text-[20px]">
            Passenger Journey
          </span>
        </div>

        <span
          aria-hidden="true"
          className="hidden h-8 w-px bg-[color:var(--border-card)] lg:block"
        />
        <span
          aria-hidden="true"
          className="hidden h-px w-[80%] bg-[color:var(--border-card)] lg:block"
        />
      </div>

      <div aria-hidden="true" className="hidden w-full grid-cols-5 gap-4 lg:grid">
        {informationArchitecture.map((node) => (
          <span
            key={`stub-${node.area}`}
            className="mx-auto h-4 w-px bg-[color:var(--border-card)]"
          />
        ))}
      </div>

      <div
        data-reveal-stagger
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        {informationArchitecture.map((node, i) => (
          <div
            key={node.area}
            className="flex h-full flex-col gap-4 rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] p-5 transition-all duration-300 hover:border-[color:var(--border-soft)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="section-eyebrow-accent font-tight text-[12px] font-medium tracking-[0.16em] text-[color:var(--heading-case-label)]">
                0{i + 1}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--grad-from)]" />
            </div>
            <h3 className="font-tight text-[19px] font-semibold leading-[1.35] text-[color:var(--text-strong)]">
              {node.area}
            </h3>
            <ul className="flex flex-col gap-2">
              {node.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-[14px] leading-[1.6] text-[color:var(--text-muted)]"
                >
                  <span
                    aria-hidden="true"
                    className="h-px w-2.5 shrink-0 bg-[color:var(--border-soft)]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div data-reveal className="flex flex-wrap items-center gap-3">
        <Tag tone="success">All five areas are live</Tag>
        <p className="text-[14px] leading-[1.7] text-[color:var(--text-dim)]">
          Every area above exists in the shipped product and is reachable from the main
          navigation.
        </p>
      </div>
    </Section>
  );
}
