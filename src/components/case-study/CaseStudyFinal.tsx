import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { finalHighlights, LIVE_PRODUCT_URL, skyvoyageImages } from "../../data/skyvoyage";
import { Frame, PhoneFrame, Section, Tag } from "./ui";

export default function CaseStudyFinal() {
  return (
    <Section
      id="final"
      label="Section 11 — Final Experience"
      title="A calmer way to travel."
      intro="The shipped product connects every step of the journey — from the first search to the boarding gate — in one interface."
      className="border-t border-[color:var(--border-card)]"
    >
      <div
        data-reveal-stagger
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {finalHighlights.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-[14px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] px-5 py-4"
          >
            <Check
              size={16}
              className="mt-0.5 shrink-0 text-[#3ddc97]"
              strokeWidth={2.4}
            />
            <span className="text-[15px] leading-[1.7] text-[color:var(--text)]">
              {item}
            </span>
          </div>
        ))}
      </div>

      <div
        data-reveal-stagger
        className="grid grid-cols-1 items-start gap-6 md:grid-cols-3"
      >
        <Frame
          src={skyvoyageImages.tracking}
          alt="SkyVoyage flight tracking with boarding information"
          caption="Live flight tracking — status, terminal, gate and boarding time in one view."
          className="md:col-span-2"
        />
        <PhoneFrame
          src={skyvoyageImages.trackingMobile}
          alt="SkyVoyage flight tracking on mobile"
          caption="The same journey, sized for a phone."
        />
      </div>

      <div
        data-reveal
        className="flex flex-col items-start gap-6 rounded-[20px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] p-7 md:flex-row md:items-center md:justify-between md:p-9"
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="accent">Case study complete</Tag>
            <Tag tone="success">Live product</Tag>
          </div>
          <p className="max-w-[560px] font-tight text-[clamp(22px,2.6vw,30px)] font-medium leading-[1.35] text-[color:var(--text-strong)]">
            Explore SkyVoyage as a traveller would.
          </p>
          <p className="max-w-[560px] text-[15px] leading-[1.75] text-[color:var(--text-muted)]">
            The live build opens in a new tab. Flight, gate and facility details inside it
            are clearly labelled demo data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={LIVE_PRODUCT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-[24px] border-[1.5px] border-[color:var(--grad-from)] bg-[color:var(--bg)] px-6 py-3 text-[14px] font-medium text-[color:var(--text-strong)] transition-all duration-300 hover:bg-[color:var(--chip-bg)]"
          >
            View live product
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
          <a
            href="/#project"
            className="group inline-flex items-center gap-2 rounded-[24px] border-[1.5px] border-[color:var(--border-soft)] px-6 py-3 text-[14px] font-medium text-[color:var(--text)] transition-all duration-300 hover:border-[color:var(--grad-from)]"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to projects
          </a>
        </div>
      </div>
    </Section>
  );
}
