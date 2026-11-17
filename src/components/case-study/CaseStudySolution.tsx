import { features, skyvoyageImages } from "../../data/skyvoyage";
import { LaptopFrame, Section, Tag } from "./ui";

export default function CaseStudySolution() {
  return (
    <Section
      id="solution"
      label="Section 09 — The Solution"
      title="One Journey. One Platform. Less Stress."
      intro="SkyVoyage connects the moments that usually live in separate apps — booking, airport guidance, waiting time, navigation and flight status — into one continuous passenger journey."
      className="border-t border-[color:var(--border-card)]"
    >
      <blockquote
        data-reveal
        className="relative rounded-[20px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] px-7 py-9 md:px-12 md:py-12"
      >
        <span
          aria-hidden="true"
          className="grad-text font-tight text-[64px] leading-none opacity-40 md:text-[96px]"
        >
          &ldquo;
        </span>
        <p className="relative -mt-4 max-w-[860px] font-tight text-[clamp(20px,2.6vw,32px)] font-medium leading-[1.45] text-[color:var(--text-strong)] md:-mt-6">
          Passengers should never feel lost or panic because they don&rsquo;t know what to
          do next.
        </p>
      </blockquote>

      <div className="flex flex-col gap-14 md:gap-20">
        {features.map((feature, i) => {
          const image = feature.image ? skyvoyageImages[feature.image] : undefined;
          const flipped = i % 2 === 1;
          return (
            <article
              key={feature.index}
              className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14"
            >
              <div
                data-reveal
                className={`flex flex-col gap-5 ${flipped ? "lg:order-2" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-tight text-[clamp(34px,4vw,54px)] font-semibold leading-none text-[color:var(--heading-case-label)]">
                    {feature.index}
                  </span>
                  <span className="h-px flex-1 bg-[color:var(--border-card)]" />
                  <Tag tone={feature.status.startsWith("Live") ? "success" : "neutral"}>
                    {feature.status}
                  </Tag>
                </div>
                <h3 className="font-tight text-[clamp(24px,3vw,34px)] font-medium leading-[1.3] text-[color:var(--text-strong)]">
                  {feature.title}
                </h3>
                <p className="max-w-[520px] text-[16px] leading-[1.85] text-[color:var(--text-muted)]">
                  {feature.body}
                </p>
              </div>

              {image && (
                <LaptopFrame
                  src={image}
                  alt={`${feature.title} in the SkyVoyage product`}
                  className={flipped ? "lg:order-1" : ""}
                />
              )}
            </article>
          );
        })}
      </div>

      <p
        data-reveal
        className="max-w-[820px] text-[15px] leading-[1.8] text-[color:var(--text-dim)]"
      >
        Every feature described above is available in the live product. Flight, gate,
        facility and walking-route details in this build are clearly labelled as demo
        data inside SkyVoyage itself.
      </p>
    </Section>
  );
}
