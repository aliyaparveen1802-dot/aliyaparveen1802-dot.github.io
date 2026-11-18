import { PencilRuler, Box, Sparkles } from "lucide-react";
import { skyvoyageImages } from "../../data/skyvoyage";
import { LaptopFrame, Section } from "./ui";

const wireStages = [
  {
    step: "01",
    title: "Sketch & structure",
    body: "Flows and information architecture first — what each screen must answer, in what order, before any visual design.",
    Icon: PencilRuler,
  },
  {
    step: "02",
    title: "Low-fidelity layout",
    body: "Grey-box screens fix hierarchy and spacing: navigation, primary task, supporting panels — nothing decorative yet.",
    Icon: Box,
  },
  {
    step: "03",
    title: "High-fidelity screen",
    body: "Palette, type and components applied on top of the validated structure — the screens travellers actually use.",
    Icon: Sparkles,
  },
];

function WireScreen({
  children,
  label,
  caption,
}: {
  children: React.ReactNode;
  label: string;
  caption: string;
}) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] p-4">
        <svg
          viewBox="0 0 320 200"
          role="img"
          aria-label={`${label} low-fidelity wireframe`}
          className="block w-full"
        >
          <rect width="320" height="200" rx="6" fill="#f2f3f7" />
          {children}
        </svg>
      </div>
      <figcaption className="flex flex-col gap-1">
        <span className="section-eyebrow-accent text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--heading-case-label)]">
          {label}
        </span>
        <span className="text-[13px] leading-[1.7] text-[color:var(--text-dim)]">
          {caption}
        </span>
      </figcaption>
    </figure>
  );
}

const navBar = (
  <g>
    <rect x="8" y="8" width="304" height="18" rx="3" fill="#dde1e9" />
    <circle cx="18" cy="17" r="4" fill="#c3c8d4" />
    <rect x="28" y="14" width="34" height="6" rx="3" fill="#c3c8d4" />
    <rect x="248" y="13" width="24" height="8" rx="4" fill="#cbd0db" />
    <rect x="278" y="13" width="24" height="8" rx="4" fill="#cbd0db" />
  </g>
);

function field(x: number, y: number, w: number, h = 14) {
  return (
    <rect
      key={`${x}-${y}-${w}`}
      x={x}
      y={y}
      width={w}
      height={h}
      rx="3"
      fill="#ffffff"
      stroke="#c9cedb"
    />
  );
}

function bar(x: number, y: number, w: number, h = 6, fill = "#d9dde6") {
  return (
    <rect
      key={`${x}-${y}-${w}-${h}`}
      x={x}
      y={y}
      width={w}
      height={h}
      rx="3"
      fill={fill}
    />
  );
}

export function CaseStudyWireframing() {
  return (
    <Section
      id="wireframing"
      label="Section 12 — Wireframing"
      title="Structure before skin."
      intro="Every screen passed through the same three stages — so layout decisions were settled while they were still cheap to change."
      className="border-t border-[color:var(--border-card)]"
    >
      <div
        data-reveal-stagger
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {wireStages.map((stage) => (
          <article
            key={stage.step}
            className="flex h-full flex-col gap-4 rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] p-6 transition-all duration-300 hover:border-[color:var(--border-soft)]"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[color:var(--border-card)] bg-[color:var(--bg)] text-[color:var(--grad-from)]">
                <stage.Icon size={18} strokeWidth={1.7} />
              </span>
              <span className="section-eyebrow-accent font-tight text-[13px] font-medium tracking-[0.14em] text-[color:var(--heading-case-label)]">
                {stage.step}
              </span>
            </div>
            <h3 className="font-tight text-[19px] font-semibold leading-[1.4] text-[color:var(--text)]">
              {stage.title}
            </h3>
            <p className="text-[15px] leading-[1.75] text-[color:var(--text-muted)]">
              {stage.body}
            </p>
          </article>
        ))}
      </div>

      <p
        data-reveal
        className="max-w-[820px] rounded-[12px] border border-[color:var(--border-card)] px-5 py-4 text-[14px] leading-[1.75] text-[color:var(--text-dim)]"
      >
        Note: the low-fidelity screens in the next section are schematic
        representations drawn for this case study to document structure — they
        are not scans of original paper sketches, and no usability testing is
        claimed at any stage.
      </p>
    </Section>
  );
}

export function CaseStudyLowFi() {
  return (
    <Section
      id="lowfi"
      label="Section 13 — Low-Fidelity Wireframes"
      title="Grey boxes, real decisions."
      intro="Three core screens reduced to structure — navigation, primary task and supporting panels, before palette or components."
      className="border-t border-[color:var(--border-card)]"
    >
      <div
        data-reveal-stagger
        className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        <WireScreen
          label="Flight Search"
          caption="Single form for trip type, route, dates and passengers, feeding a scannable results list."
        >
          {navBar}
          <rect x="8" y="34" width="304" height="64" rx="4" fill="#e6e9f0" />
          {field(16, 46, 80)}
          {field(102, 46, 60)}
          {field(168, 46, 50)}
          <rect x="230" y="46" width="44" height="14" rx="7" fill="#cfd4de" />
          {bar(16, 70, 130, 8)}
          {bar(16, 84, 90, 6, "#e3e6ed")}
          {[108, 140, 172].map((y) => (
            <g key={y}>
              <rect
                x="8"
                y={y}
                width="304"
                height="26"
                rx="3"
                fill="#ffffff"
                stroke="#d6dae3"
              />
              {bar(16, y + 7, 70, 7)}
              {bar(16, y + 17, 46, 5, "#e3e6ed")}
              {bar(248, y + 9, 48, 8)}
            </g>
          ))}
        </WireScreen>

        <WireScreen
          label="Airport Guide"
          caption="Terminal facts as a single header, with facilities in a fixed grid below."
        >
          {navBar}
          <rect x="8" y="34" width="304" height="42" rx="4" fill="#e6e9f0" />
          {bar(16, 44, 120, 8)}
          {bar(16, 58, 70, 6, "#e3e6ed")}
          <rect x="250" y="46" width="44" height="14" rx="7" fill="#cfd4de" />
          {[8, 112, 216].map((x) => (
            <g key={`r1-${x}`}>
              <rect
                x={x}
                y="86"
                width="96"
                height="48"
                rx="4"
                fill="#ffffff"
                stroke="#d6dae3"
              />
              <circle cx={x + 14} cy="102" r="6" fill="#dfe3eb" />
              {bar(x + 8, 114, 52, 6)}
              {bar(x + 8, 124, 36, 5, "#e3e6ed")}
            </g>
          ))}
          {[8, 112, 216].map((x) => (
            <g key={`r2-${x}`}>
              <rect
                x={x}
                y="142"
                width="96"
                height="48"
                rx="4"
                fill="#ffffff"
                stroke="#d6dae3"
              />
              <circle cx={x + 14} cy="158" r="6" fill="#dfe3eb" />
              {bar(x + 8, 170, 52, 6)}
              {bar(x + 8, 180, 36, 5, "#e3e6ed")}
            </g>
          ))}
        </WireScreen>

        <WireScreen
          label="Flight Tracking"
          caption="Status banner up top, gate and timing rows beneath, map pinned at the bottom."
        >
          {navBar}
          <rect x="8" y="34" width="304" height="38" rx="4" fill="#e6e9f0" />
          {bar(16, 44, 96, 8)}
          {bar(16, 58, 64, 6, "#e3e6ed")}
          <rect x="244" y="46" width="50" height="14" rx="7" fill="#cfd4de" />
          {[82, 112, 142].map((y) => (
            <g key={y}>
              <rect
                x="8"
                y={y}
                width="304"
                height="24"
                rx="3"
                fill="#ffffff"
                stroke="#d6dae3"
              />
              {bar(16, y + 9, 74, 7)}
              {bar(236, y + 9, 60, 7, "#cbd0db")}
            </g>
          ))}
          <rect
            x="8"
            y="174"
            width="304"
            height="18"
            rx="4"
            fill="#ffffff"
            stroke="#d6dae3"
          />
          <path
            d="M22 184 L96 180 L172 187 L298 181"
            fill="none"
            stroke="#c3c8d4"
            strokeWidth="2"
            strokeDasharray="5 4"
          />
          <circle cx="22" cy="184" r="3.5" fill="#b8bec9" />
          <circle cx="298" cy="181" r="3.5" fill="#b8bec9" />
        </WireScreen>
      </div>

      <p
        data-reveal
        className="max-w-[820px] text-[15px] leading-[1.8] text-[color:var(--text-dim)]"
      >
        Each wireframe maps directly to a shipped screen: search, guide and
        tracking kept the same information order from grey box to final UI.
      </p>
    </Section>
  );
}

export function CaseStudyHiFi() {
  const screens: {
    src: string;
    alt: string;
    caption: string;
  }[] = [
    {
      src: skyvoyageImages.search,
      alt: "SkyVoyage high-fidelity flight search screen",
      caption:
        "Search — trip type, route, dates, passengers and class in one scannable form.",
    },
    {
      src: skyvoyageImages.guide,
      alt: "SkyVoyage high-fidelity airport guide screen",
      caption:
        "Airport guide — terminal, check-in, gate and facilities as large, readable facts.",
    },
    {
      src: skyvoyageImages.tracking,
      alt: "SkyVoyage high-fidelity flight tracking screen",
      caption:
        "Flight tracking — status, terminal, gate and boarding time in one view.",
    },
  ];

  return (
    <Section
      id="hifi"
      label="Section 14 — High-Fidelity Wireframes"
      title="The structure, fully dressed."
      intro="Palette, typography and components applied on the settled layout — the same three screens as the grey boxes, now as they ship."
      className="border-t border-[color:var(--border-card)]"
    >
      <div
        data-reveal-stagger
        className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {screens.map((screen) => (
          <LaptopFrame
            key={screen.src}
            src={screen.src}
            alt={screen.alt}
            caption={screen.caption}
          />
        ))}
      </div>
    </Section>
  );
}
