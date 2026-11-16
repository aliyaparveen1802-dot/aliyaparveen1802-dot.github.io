import type { ReactNode } from "react";

export function Section({
  id,
  label,
  title,
  intro,
  children,
  className = "",
  titleId,
}: {
  id: string;
  label: string;
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
  titleId?: string;
}) {
  return (
    <section
      id={id}
      className={`px-5 py-16 md:px-8 md:py-20 xl:px-[100px] xl:py-24 ${className}`}
      style={{ scrollMarginTop: "90px" }}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10">
        {(label || title) && (
          <header className="flex flex-col gap-4">
            {label && (
              <p
                data-reveal
                className="text-[12px] font-medium uppercase tracking-[0.2em] text-[color:var(--heading-case-label)] md:text-[13px]"
              >
                {label}
              </p>
            )}
            {title && (
              <h2
                id={titleId}
                data-reveal
                className="max-w-[900px] font-tight text-[clamp(28px,4vw,50px)] font-medium leading-[1.15] tracking-[-0.01em] text-[color:var(--heading-case)]"
              >
                {title}
              </h2>
            )}
            {intro && (
              <p
                data-reveal
                className="max-w-[760px] text-[16px] leading-[1.8] text-[color:var(--text-muted)] md:text-[17px]"
              >
                {intro}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export function Frame({
  src,
  alt,
  caption,
  label = "skyvoyage-pi.vercel.app",
  className = "",
  imgClassName = "",
  parallax = false,
  priority = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  label?: string;
  className?: string;
  imgClassName?: string;
  parallax?: boolean;
  priority?: boolean;
}) {
  return (
    <figure data-reveal className={`flex flex-col gap-3 ${className}`}>
      <div className="overflow-hidden rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)]">
        <div className="flex items-center gap-2 border-b border-[color:var(--border-card)] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a48]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a48]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a48]" />
          <span className="ml-3 hidden truncate rounded-full bg-[color:var(--bg)] px-3 py-1 text-[11px] text-[color:var(--text-muted)] sm:block">
            {label}
          </span>
        </div>
        <div className="relative overflow-hidden">
          <img
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            data-parallax={parallax ? "" : undefined}
            className={`w-full object-cover ${parallax ? "h-[112%]" : ""} ${imgClassName}`}
          />
        </div>
      </div>
      {caption && (
        <figcaption className="text-[13px] leading-[1.7] text-[color:var(--text-dim)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function Tag({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "success";
}) {
  const styles =
    tone === "accent"
      ? "border-[color:var(--border-soft)] text-[color:var(--grad-from)]"
      : tone === "success"
        ? "border-[#2f8f66] text-[#1f9d6b]"
        : "border-[color:var(--border-card)] text-[color:var(--text-muted)]";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${styles}`}
    >
      {children}
    </span>
  );
}
