import type { ReactNode } from "react";
import { BatteryFull, Signal, Wifi } from "lucide-react";

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
                className="section-eyebrow-accent text-[12px] font-medium uppercase tracking-[0.2em] text-[color:var(--heading-case-label)] md:text-[13px]"
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
  reveal = true,
}: {
  src: string;
  alt: string;
  caption?: string;
  label?: string;
  className?: string;
  imgClassName?: string;
  parallax?: boolean;
  priority?: boolean;
  reveal?: boolean;
}) {
  return (
    <figure
      data-reveal={reveal ? true : undefined}
      className={`flex flex-col gap-3 ${className}`}
    >
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

export function PhoneFrame({
  src,
  alt,
  caption,
  className = "",
  reveal = true,
  float = false,
  floatDelay = 0,
  priority = false,
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
  className?: string;
  reveal?: boolean;
  float?: boolean;
  floatDelay?: number;
  priority?: boolean;
}) {
  return (
    <figure
      data-reveal={reveal ? true : undefined}
      className={`group flex flex-col gap-4 ${className}`}
    >
      <div className="transition-all duration-500 ease-out group-hover:-translate-y-2.5">
        <div
          className={`rounded-[44px] border border-[#3a3a48]/70 bg-gradient-to-b from-[#26262f] via-[#15151c] to-[#0c0c12] p-[10px] shadow-[0_44px_90px_-30px_rgba(0,0,0,0.85)] transition-all duration-500 ease-out group-hover:border-[#E6FF19]/40 group-hover:shadow-[0_60px_110px_-32px_rgba(0,0,0,0.95)] ${float ? "cs-float" : ""}`}
          style={float ? { animationDelay: `${floatDelay}s` } : undefined}
        >
        <div className="relative w-full overflow-hidden rounded-[36px] bg-black">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-[9px] z-20 h-[22px] w-[72px] -translate-x-1/2 rounded-full bg-black"
          />
          <div className="relative z-10 flex items-center justify-between bg-[#07131c] px-6 pt-2.5 pb-1 text-[11px] font-semibold text-white/90">
            <span>9:41</span>
            <span className="flex items-center gap-1.5" aria-hidden="true">
              <Signal size={12} strokeWidth={2.4} />
              <Wifi size={12} strokeWidth={2.4} />
              <BatteryFull size={15} strokeWidth={2} />
            </span>
          </div>
          <img
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="block w-full"
          />
          <div className="flex justify-center bg-[#07131c] pt-2 pb-2.5">
            <span className="h-[4px] w-[112px] rounded-full bg-white/60" />
          </div>
        </div>
        </div>
      </div>
      {caption && (
        <figcaption className="flex flex-col gap-1.5 text-[13px] leading-[1.7] text-[color:var(--text-dim)]">
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

export function LaptopFrame({
  src,
  alt,
  caption,
  className = "",
  imgClassName = "",
  parallax = false,
  priority = false,
  reveal = true,
  float = false,
  floatDelay = 0,
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
  className?: string;
  imgClassName?: string;
  parallax?: boolean;
  priority?: boolean;
  reveal?: boolean;
  float?: boolean;
  floatDelay?: number;
}) {
  return (
    <figure
      data-reveal={reveal ? true : undefined}
      className={`group cs-laptop flex flex-col gap-3 ${className}`}
    >
      <div
        className={`transition-all duration-500 ease-out group-hover:-translate-y-2 ${float ? "cs-float" : ""}`}
        style={float ? { animationDelay: `${floatDelay}s` } : undefined}
      >
        <div className="rounded-t-[14px] border border-b-0 border-[#3a3a48]/70 bg-gradient-to-b from-[#26262f] via-[#15151c] to-[#0c0c12] p-[10px] pb-[12px] shadow-[0_44px_90px_-30px_rgba(0,0,0,0.85)]">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[5px] bg-black">
            <img
              src={src}
              alt={alt}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              data-parallax={parallax ? "" : undefined}
              className={`block w-full object-cover object-top ${
                parallax ? "h-[112%]" : "h-full"
              } ${imgClassName}`}
            />
          </div>
        </div>
        <div className="relative mx-[-1.5%] h-[13px] w-[103%] rounded-b-[10px] bg-gradient-to-b from-[#2a2a34] via-[#1a1a22] to-[#0c0c12] shadow-[0_18px_30px_-14px_rgba(0,0,0,0.8)]">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-[5px] w-[16%] -translate-x-1/2 rounded-b-[6px] bg-[#0a0a0f]"
          />
        </div>
      </div>
      {caption && (
        <figcaption className="flex flex-col gap-1.5 text-[13px] leading-[1.7] text-[color:var(--text-dim)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
