import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Award,
  Clock,
  Frame,
  Maximize2,
  PenTool,
  Sparkles,
  X,
} from "lucide-react";
import {
  idfCertificates,
  idfOrganization,
  learningTimeline,
  schoolOfTechies,
  type Certificate,
} from "../data/certifications";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

function CertificatePreview({ cert, full = false }: { cert: Certificate; full?: boolean }) {
  if (cert.image) {
    return (
      <img
        src={cert.image}
        alt={`${cert.title} — certificate`}
        className={`w-full rounded-[14px] border border-[color:var(--border-card)] object-cover ${
          full ? "max-h-[70vh]" : "aspect-[4/3]"
        }`}
      />
    );
  }

  return (
    <div
      className={`relative flex w-full flex-col items-center justify-center overflow-hidden rounded-[14px] border border-[#d8d1bf] bg-[#F8F6F0] px-5 text-center shadow-inner ${
        full ? "aspect-[4/2.7] px-12 py-10" : "aspect-[4/3] py-6"
      }`}
      aria-hidden="true"
    >
      <span className="pointer-events-none absolute inset-[9px] rounded-[9px] border border-[#c9b98f]/70" />
      <span className="pointer-events-none absolute inset-[15px] rounded-[5px] border border-[#c9b98f]/35" />

      <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#101D25] text-[11px] font-semibold text-[#F8F6F0]">
        {idfOrganization.shortName}
      </span>
      <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#8b8471]">
        Certificate of Completion
      </span>
      <p
        className={`mt-2.5 max-w-[92%] font-tight font-medium leading-[1.3] text-[#1b1b22] ${
          full ? "text-[clamp(17px,2.4vw,26px)]" : "text-[clamp(12px,1.4vw,15px)]"
        }`}
      >
        {cert.title}
      </p>
      <span className="mt-2.5 text-[10px] tracking-[0.12em] text-[#6f6a5c]">
        {idfOrganization.name} · {cert.year}
      </span>

      <span className="absolute bottom-4 left-6 flex flex-col items-start gap-1">
        <span className="h-px w-20 bg-[#b7ae95]" />
        <span className="text-[8px] uppercase tracking-[0.18em] text-[#9a9280]">
          Issued by {idfOrganization.shortName}
        </span>
      </span>
      <span className="absolute bottom-4 right-5 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#c9b98f] bg-[radial-gradient(circle_at_35%_30%,#f3e7c4,#d9c68d)] text-[#7a6a35] shadow-[0_3px_8px_rgba(0,0,0,0.18)]">
        <Award size={18} strokeWidth={2} />
      </span>
    </div>
  );
}

export default function CertificationsSection() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<Certificate | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const openCert = (cert: Certificate, trigger: HTMLElement | null) => {
    lastTrigger.current = trigger;
    setActive(cert);
  };
  const closeCert = () => setActive(null);

  // ---------- entrance animations ----------
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: "top 82%" } })
        .fromTo(
          ".cert-head > *",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: "power3.out", clearProps: "all" }
        );

      gsap.utils.toArray<HTMLElement>(".cert-org").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", clearProps: "all", scrollTrigger: { trigger: el, start: "top 88%" } }
        );
      });

      gsap.fromTo(
        ".cert-grid > .cert-card",
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: { trigger: ".cert-grid", start: "top 86%" },
        }
      );

      gsap.fromTo(
        ".cert-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: "power2.inOut",
          scrollTrigger: { trigger: ".cert-timeline", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".cert-node",
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.25,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: { trigger: ".cert-timeline", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".cert-school",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: { trigger: ".cert-school", start: "top 88%" },
        }
      );
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    const raf = window.requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [reduced]);

  // ---------- lightbox: focus, escape, scroll lock ----------
  useEffect(() => {
    if (!active) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCert();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      lastTrigger.current?.focus();
    };
  }, [active]);

  // ---------- 3D tilt ----------
  const tiltMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    el.style.transform = `perspective(1000px) rotateX(${((0.5 - py) * 6).toFixed(2)}deg) rotateY(${((px - 0.5) * 6).toFixed(2)}deg)`;
  };
  const tiltLeave = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.transform = "";
    el.style.setProperty("--gx", "50%");
    el.style.setProperty("--gy", "0%");
  };

  return (
    <section
      ref={rootRef}
      id="certifications"
      className="relative overflow-hidden px-5 py-16 md:px-8 md:py-20 xl:px-[100px] xl:py-24"
      style={{ scrollMarginTop: "90px" }}
    >
      {/* background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="skills-orb-a absolute -right-24 top-12 h-72 w-72 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--grad-to)_55%,transparent),transparent_70%)] opacity-25 blur-3xl md:h-96 md:w-96" />
        <span className="skills-orb-b absolute -left-32 bottom-16 h-80 w-80 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--grad-from)_50%,transparent),transparent_70%)] opacity-25 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-12 md:gap-16">
        {/* ---------- Header ---------- */}
        <header className="cert-head flex flex-col items-center gap-4 text-center">
          <span className="rounded-full border border-[color:var(--border-card)] bg-[color:var(--chip-bg)]/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] backdrop-blur-md">
            <span className="cert-label">Learn · Explore · Evolve</span>
          </span>
          <h2 className="font-tight text-[clamp(30px,4.4vw,54px)] font-medium leading-[1.12] tracking-[-0.01em] text-[color:var(--heading-case)]">
            Credentials &amp; Continuous Learning
          </h2>
          <p className="max-w-[680px] text-[16px] leading-[1.8] text-[color:var(--text-muted)] md:text-[17px]">
            Always learning, continuously evolving — building stronger design
            foundations through hands-on practice and industry-led learning.
          </p>
        </header>

        {/* ---------- 01 · IxDF organization header ---------- */}
        <div className="cert-org glass-card flex flex-wrap items-center gap-5 rounded-[22px] p-5 md:gap-7 md:p-6">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] border border-[color:var(--border-soft)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--grad-from)_30%,transparent),color-mix(in_srgb,var(--grad-to)_16%,transparent))] font-tight text-[18px] font-semibold text-[color:var(--text-strong)] md:h-[74px] md:w-[74px] md:text-[21px]">
            {idfOrganization.shortName}
          </span>
          <div className="flex min-w-0 flex-col gap-2">
            <span className="section-eyebrow-accent text-[11px] font-medium uppercase tracking-[0.2em] text-[color:var(--heading-case-label)]">
              01 — Organization
            </span>
            <h3 className="font-tight text-[clamp(19px,2.4vw,26px)] font-medium leading-[1.25] text-[color:var(--text-strong)]">
              {idfOrganization.name}
            </h3>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--border-card)] bg-[color:var(--bg)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
              <Sparkles size={12} className="text-[color:var(--grad-from)]" />
              {idfOrganization.label}
            </span>
          </div>
          <span className="ml-auto hidden rounded-[16px] border border-[color:var(--border-card)] bg-[color:var(--bg)] px-5 py-3 text-center md:block">
            <span className="block font-tight text-[26px] font-semibold leading-none text-[color:var(--text-strong)]">
              {idfCertificates.length}
            </span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-dim)]">
              Certificates · {idfCertificates[0]?.year}
            </span>
          </span>
        </div>

        {/* ---------- Certificate grid ---------- */}
        <div className="cert-grid grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {idfCertificates.map((cert) => (
            <article key={cert.id} className="cert-card group flex flex-col">
              <div
                className="cert-tilt flex h-full flex-col gap-4 rounded-[20px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)]/85 p-4 backdrop-blur-md"
                onMouseMove={tiltMove}
                onMouseLeave={tiltLeave}
              >
                <CertificatePreview cert={cert} />

                <div className="flex flex-1 flex-col gap-3 px-1.5 pb-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-[color:var(--border-card)] bg-[color:var(--bg)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--heading-case-label)]">
                      <span className="section-eyebrow-accent">{cert.index}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] font-medium text-[color:var(--text-dim)]">
                      <Clock size={12} />
                      {cert.year}
                    </span>
                  </div>

                  <h4 className="font-tight text-[17px] font-medium leading-[1.35] text-[color:var(--text-strong)]">
                    {cert.title}
                  </h4>
                  <p className="text-[13px] leading-[1.6] text-[color:var(--text-muted)]">
                    {cert.organization}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-2.5 border-t border-[color:var(--border-card)] pt-3.5">
                    <button
                      type="button"
                      onClick={(e) => openCert(cert, e.currentTarget.closest(".cert-card"))}
                      className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-[color:var(--bg)] px-4 py-2 text-[13px] font-medium text-[color:var(--text-strong)] transition-all duration-300 hover:border-[color:var(--grad-from)] hover:shadow-[0_0_18px_-6px_rgba(188,60,216,0.65)]"
                    >
                      <Maximize2 size={13} />
                      View Certificate
                    </button>
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${cert.title} credential in a new tab`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border-card)] text-[color:var(--text-muted)] transition-all duration-300 hover:border-[color:var(--grad-from)] hover:text-[color:var(--text-strong)]"
                      >
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ---------- Learning timeline 2024 → 2026 ---------- */}
        <div className="cert-timeline relative flex items-start justify-between gap-4 px-1 pt-2">
          <span
            aria-hidden="true"
            className="cert-line absolute left-3 right-3 top-[13px] h-px origin-left bg-[linear-gradient(90deg,var(--grad-from),var(--grad-to))]"
          />
          {learningTimeline.map((node) => (
            <div key={node.year} className="cert-node relative flex flex-1 flex-col items-center gap-2 text-center">
              <span className="cert-dot z-10 h-[15px] w-[15px] rounded-full border-[3px] border-[color:var(--bg)] bg-[linear-gradient(135deg,var(--grad-from),var(--grad-to))]" />
              <span className="font-tight text-[19px] font-semibold leading-none text-[color:var(--text-strong)]">
                {node.year}
              </span>
              <span className="text-[13px] font-medium text-[color:var(--text-muted)]">{node.label}</span>
              <span className="text-[11.5px] leading-[1.5] text-[color:var(--text-dim)]">{node.detail}</span>
            </div>
          ))}
        </div>

        {/* ---------- 02 · School of Techies ---------- */}
        <article className="cert-school glass-card overflow-hidden rounded-[24px]">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)]">
            {/* visual / timeline column */}
            <div className="relative flex flex-col justify-between gap-6 border-b border-[color:var(--border-card)] bg-[linear-gradient(150deg,color-mix(in_srgb,var(--grad-from)_16%,transparent),transparent_65%)] p-6 lg:border-b-0 lg:border-r md:p-8">
              <span className="pointer-events-none absolute bottom-4 right-5 font-tight text-[64px] font-semibold leading-none text-[color:var(--border-card)] opacity-70 select-none">
                {schoolOfTechies.year}
              </span>
              <div className="relative flex flex-col gap-3">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--border-card)] bg-[color:var(--bg)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--heading-case-label)]">
                  <span className="section-eyebrow-accent">02 — Education Milestone</span>
                </span>
                <img
                  src={schoolOfTechies.logo}
                  alt="School of Techies logo"
                  className="h-16 w-16 rounded-full shadow-[0_8px_24px_-10px_rgba(0,0,0,0.7)]"
                />
              </div>
              <div className="relative flex items-center gap-2">
                {[PenTool, Frame, Sparkles].map((Icon, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span className="flex h-11 w-11 items-center justify-center rounded-[13px] border border-[color:var(--border-card)] bg-[color:var(--chip-bg)] text-[color:var(--text-strong)] transition-transform duration-300 hover:-translate-y-1">
                      <Icon size={17} strokeWidth={1.8} />
                    </span>
                    {i < 2 && <span aria-hidden="true" className="h-px w-5 bg-[color:var(--border-soft)]" />}
                  </span>
                ))}
              </div>
            </div>

            {/* content column */}
            <div className="flex flex-col gap-4 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-card)] bg-[color:var(--bg)] px-3.5 py-1.5 text-[12.5px] font-medium text-[color:var(--text-strong)]">
                  <img
                    src={schoolOfTechies.logo}
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5 rounded-full"
                  />
                  {schoolOfTechies.institution}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border-card)] px-3 py-1.5 text-[12px] text-[color:var(--text-muted)]">
                  <Clock size={12} />
                  {schoolOfTechies.duration}
                </span>
                <span className="inline-flex items-center rounded-full border border-[color:var(--border-soft)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--grad-from)]">
                  {schoolOfTechies.year}
                </span>
              </div>

              <h3 className="font-tight text-[clamp(21px,2.6vw,30px)] font-medium leading-[1.3] text-[color:var(--text-strong)]">
                {schoolOfTechies.program}
              </h3>

              <p className="max-w-[640px] text-[15px] leading-[1.85] text-[color:var(--text-muted)]">
                {schoolOfTechies.description}
              </p>

              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {["User-centered design", "Wireframing", "Prototyping", "Visual design", "Responsive interfaces", "Design workflows"].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-[color:var(--border-card)] bg-[color:var(--bg)] px-3 py-1 text-[12px] text-[color:var(--text-dim)]"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* ---------- Lightbox ---------- */}
      {active && (
        <div
          className="cert-fade-in fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-md md:p-8"
          onClick={closeCert}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${active.title} — certificate preview`}
            className="cert-zoom-in relative my-auto w-full max-w-[880px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={closeCert}
              aria-label="Close certificate"
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-all duration-300 hover:border-[color:var(--grad-from)] hover:bg-white/20 md:-top-14"
            >
              <X size={17} />
            </button>

            <div className="flex flex-col gap-4 rounded-[20px] border border-[color:var(--border-card)] bg-[color:var(--bg)] p-4 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] md:p-5">
              <CertificatePreview cert={active} full />
              <div className="flex flex-wrap items-end justify-between gap-3 px-1 pb-1">
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="section-eyebrow-accent text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--heading-case-label)]">
                    {active.index} · {active.year}
                  </span>
                  <h4 className="font-tight text-[clamp(17px,2.2vw,23px)] font-medium leading-[1.3] text-[color:var(--text-strong)]">
                    {active.title}
                  </h4>
                  <p className="text-[13px] text-[color:var(--text-muted)]">{active.organization}</p>
                </div>
                {active.url && (
                  <a
                    href={active.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] px-4 py-2 text-[13px] font-medium text-[color:var(--text-strong)] transition-all duration-300 hover:border-[color:var(--grad-from)]"
                  >
                    Open credential
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
