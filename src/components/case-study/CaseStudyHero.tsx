import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projectDetails, skyvoyageImages, LIVE_PRODUCT_URL } from "../../data/skyvoyage";
import { Frame, Tag } from "./ui";

export default function CaseStudyHero() {
  return (
    <section
      id="top"
      className="px-5 pb-16 pt-[110px] md:px-8 md:pb-20 md:pt-[140px] xl:px-[100px] xl:pt-[170px]"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <a
            href="/#project"
            className="group inline-flex items-center gap-2 text-[14px] text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text)]"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to projects
          </a>
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="accent">UX Case Study</Tag>
            <Tag>Travel / Flight Booking</Tag>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <p
            data-reveal
            className="section-eyebrow-accent text-[12px] font-medium uppercase tracking-[0.2em] text-[color:var(--heading-case-label)] md:text-[13px]"
          >
            Featured project
          </p>
          <h1
            data-reveal
            className="font-tight text-[clamp(52px,11vw,132px)] font-semibold leading-[0.95] tracking-[-0.03em] text-[color:var(--text-strong)]"
          >
            SkyVoyage
          </h1>
          <p
            data-reveal
            className="max-w-[820px] font-tight text-[clamp(24px,3.4vw,44px)] font-medium leading-[1.25] text-[color:var(--heading-case)]"
          >
            Travel with Confidence. Every Step of the Way.
          </p>
          <p
            data-reveal
            className="max-w-[720px] text-[16px] leading-[1.85] text-[color:var(--text-muted)] md:text-[18px]"
          >
            SkyVoyage is designed to simplify the complete travel journey by bringing
            flight booking, airport guidance and flight tracking into one connected
            platform.
          </p>
          <p
            data-reveal
            className="max-w-[720px] text-[16px] leading-[1.85] text-[color:var(--text-muted)] md:text-[18px]"
          >
            The goal is to reduce travel uncertainty and help passengers feel informed,
            prepared and confident throughout their journey.
          </p>
        </div>

        <div
          data-reveal-stagger
          className="grid grid-cols-1 gap-px overflow-hidden rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--border-card)] sm:grid-cols-2 xl:grid-cols-3"
        >
          {projectDetails.map((detail) => (
            <div
              key={detail.label}
              className="flex flex-col gap-2 bg-[color:var(--bg)] p-5 md:p-6"
            >
              <span className="section-eyebrow-accent text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--heading-case-label)]">
                {detail.label}
              </span>
              <span className="text-[15px] leading-[1.65] text-[color:var(--text)]">
                {detail.value}
              </span>
            </div>
          ))}
        </div>

        <Frame
          src={skyvoyageImages.hero}
          alt="SkyVoyage flight search home screen"
          caption="The SkyVoyage home experience — search flights, compare fares and start the journey from one place."
          priority
          parallax
        />

        <div data-reveal>
          <a
            href={LIVE_PRODUCT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-[24px] border-[1.5px] border-[color:var(--border-soft)] px-6 py-3 text-[14px] font-medium text-[color:var(--text)] transition-all duration-300 hover:border-[color:var(--grad-from)] hover:text-[color:var(--text-strong)]"
          >
            View live product
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
