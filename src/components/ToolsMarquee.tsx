const TOOLS: { name: string; kind: "full" | "icon"; src?: string; svg?: string }[] = [
  {
    name: "Framer",
    kind: "icon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="42" height="42"><path fill="#0055FF" d="M12 8h24v12H24L12 8z"/><path fill="#00AAFF" d="M12 20h24l-12 12H12V20z"/><path fill="#00E0FF" d="M12 32h12v12L12 32z"/></svg>`,
  },
  {
    name: "Procreate",
    kind: "icon",
    src: "https://framerusercontent.com/images/8jM9w6CqcYXOLA4IZW6maOcgPTo.png",
  },
  {
    name: "Figma",
    kind: "icon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="34" height="34"><path fill="#F24E1E" d="M16 8h8v8h-8a4 4 0 010-8z"/><path fill="#FF7262" d="M24 8h4a4 4 0 010 8h-4V8z"/><path fill="#A259FF" d="M16 16h8v8h-8a4 4 0 010-8z"/><circle cx="28" cy="20" r="4" fill="#1ABCFE"/><path fill="#0ACF83" d="M16 24h8v4a4 4 0 11-8 0v-4z"/></svg>`,
  },
  {
    name: "Photoshop",
    kind: "full",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 82" width="84" height="82"><rect width="84" height="82" rx="19" fill="#001E36"/><text x="42" y="52" text-anchor="middle" font-family="Inter, sans-serif" font-size="30" font-weight="700" fill="#31A8FF">Ps</text></svg>`,
  },
  {
    name: "Illustrator",
    kind: "full",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 82" width="84" height="82"><rect width="84" height="82" rx="19" fill="#2B0000"/><text x="42" y="52" text-anchor="middle" font-family="Inter, sans-serif" font-size="30" font-weight="700" fill="#FF9A00">Ai</text></svg>`,
  },
  {
    name: "MailChimp",
    kind: "icon",
    src: "https://framerusercontent.com/images/SothcyL8yBc68J4WIJzEfekgB8.png",
  },
];

function Tile({ tool }: { tool: (typeof TOOLS)[number] }) {
  if (tool.kind === "full") {
    return (
      <li
        aria-label={tool.name}
        className="mr-[121px] h-[82px] w-[84px] shrink-0 overflow-hidden rounded-[19px]"
        dangerouslySetInnerHTML={{ __html: tool.svg! }}
      />
    );
  }

  return (
    <li
      aria-label={tool.name}
      className="mr-[121px] flex h-[82px] w-[84px] shrink-0 items-center justify-center rounded-[19px] bg-[color:var(--tile-bg)]"
    >
      {tool.svg ? (
        <span
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: tool.svg }}
          className="flex items-center justify-center"
        />
      ) : (
        <img
          src={tool.src}
          alt={tool.name}
          width={46}
          height={44}
          loading="eager"
          decoding="async"
          className="h-[44px] w-[46px] object-contain"
        />
      )}
    </li>
  );
}

export default function ToolsMarquee() {
  const doubled = [...TOOLS, ...TOOLS];

  return (
    <section aria-label="Design tools" className="marquee-mask w-full overflow-hidden">
      <ul className="marquee-track flex w-max items-center">
        {doubled.map((tool, i) => (
          <Tile key={`${tool.name}-${i}`} tool={tool} />
        ))}
      </ul>
    </section>
  );
}
