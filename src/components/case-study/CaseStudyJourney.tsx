import { Frown, Meh, Smile, ArrowRight } from "lucide-react";
import { journey, type EmotionTone } from "../../data/skyvoyage";
import { Section } from "./ui";

const toneMeta: Record<
  EmotionTone,
  { color: string; Icon: typeof Smile; y: number }
> = {
  low: { color: "#e06c6c", Icon: Frown, y: 118 },
  mid: { color: "#e0a63c", Icon: Meh, y: 68 },
  high: { color: "#3ddc97", Icon: Smile, y: 24 },
};

function EmotionCurve() {
  const width = 1000;
  const step = width / journey.length;
  const points = journey.map((stage, i) => ({
    x: step * i + step / 2,
    y: toneMeta[stage.tone].y,
    label: stage.emotion,
    color: toneMeta[stage.tone].color,
  }));

  const line = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `${points[0].x},150 ${line} ${points[points.length - 1].x},150`;

  return (
    <div data-reveal className="hidden overflow-hidden rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] p-5 md:block">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--heading-case-label)]">
          Emotional experience
        </span>
        <span className="text-[12px] text-[color:var(--text-dim)]">
          Uncertainty drops once SkyVoyage takes over
        </span>
      </div>
      <svg
        viewBox="0 0 1000 160"
        role="img"
        aria-label="Emotional curve across the seven journey stages"
        className="h-[160px] w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="journeyArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--grad-from)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--grad-from)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[24, 68, 118].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="1000"
            y2={y}
            stroke="var(--border-card)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        ))}
        <polygon points={area} fill="url(#journeyArea)" />
        <polyline
          points={line}
          fill="none"
          stroke="var(--grad-from)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="7" fill="var(--bg)" stroke={p.color} strokeWidth="3" />
            <text
              x={p.x}
              y={p.y - 16}
              textAnchor="middle"
              fontSize="14"
              fill="var(--text-muted)"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-2 flex justify-between px-1">
        {journey.map((stage) => (
          <span
            key={stage.step}
            className="w-[13%] text-center text-[11px] uppercase tracking-[0.1em] text-[color:var(--heading-case-label)]"
          >
            {stage.title}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function CaseStudyJourney() {
  return (
    <Section
      id="journey"
      label="Section 06 — User Journey Map"
      title="Where the journey breaks — and where SkyVoyage repairs it."
      intro="Seven stages from first search to boarding. Each stage maps the user action, the thought behind it, the pain involved, the SkyVoyage answer and the emotional state of the traveller."
      className="border-t border-[color:var(--border-card)]"
    >
      <EmotionCurve />

      <div className="flex items-center justify-between gap-4">
        <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-[color:var(--heading-case-label)]">
          Journey timeline
        </span>
        <span className="flex items-center gap-2 text-[13px] text-[color:var(--text-dim)]">
          Scroll horizontally
          <ArrowRight size={14} />
        </span>
      </div>

      <div
        data-reveal-stagger
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0"
        style={{ scrollbarWidth: "thin" }}
      >
        {journey.map((stage) => {
          const emotion = toneMeta[stage.tone];
          return (
            <article
              key={stage.step}
              className="flex w-[290px] shrink-0 snap-start flex-col gap-5 rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] p-5 sm:w-[320px]"
            >
              <header className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-tight text-[12px] font-medium tracking-[0.18em] text-[color:var(--heading-case-label)]">
                    {stage.step}
                  </span>
                  <h3 className="font-tight text-[22px] font-medium leading-[1.3] text-[color:var(--text-strong)]">
                    {stage.title}
                  </h3>
                </div>
                <span
                  className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium"
                  style={{ color: emotion.color, borderColor: emotion.color }}
                >
                  <emotion.Icon size={13} />
                  {stage.emotion}
                </span>
              </header>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--heading-case-label)]">
                    User action
                  </span>
                  <p className="text-[14.5px] leading-[1.7] text-[color:var(--text-about)]">
                    {stage.action}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--heading-case-label)]">
                    User thoughts
                  </span>
                  <p className="text-[14.5px] italic leading-[1.7] text-[color:var(--text-muted)]">
                    &ldquo;{stage.thought}&rdquo;
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e0a63c]">
                    Pain point
                  </span>
                  <p className="text-[14.5px] leading-[1.7] text-[color:var(--text-muted)]">
                    {stage.pain}
                  </p>
                </div>

                <div className="mt-auto flex flex-col gap-1.5 border-t border-[color:var(--border-card)] pt-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--grad-from)]">
                    SkyVoyage solution
                  </span>
                  <p className="text-[14.5px] leading-[1.7] text-[color:var(--text-strong)]">
                    {stage.solution}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p
        data-reveal
        className="max-w-[820px] text-[15px] leading-[1.8] text-[color:var(--text-dim)]"
      >
        SkyVoyage has the greatest impact between arrival and boarding — the point where
        travellers normally lose confidence — by replacing guesswork with airport context,
        routes and live flight information.
      </p>
    </Section>
  );
}
