import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Framer, Linkedin, Mail, Phone, Twitter } from "lucide-react";
import { links } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface Chip {
  label: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}

const contactChips: Chip[] = [
  { label: links.phoneText, href: links.phone, icon: <Phone size={15} /> },
  { label: links.emailText, href: links.email, icon: <Mail size={15} /> },
];

const socialChips: Chip[] = [
  {
    label: "Behance",
    href: links.behance,
    icon: <Twitter size={15} />,
    external: true,
  },
  {
    label: "Framer",
    href: links.framer,
    icon: <Framer size={15} />,
    external: true,
  },
  {
    label: "Linkedin",
    href: links.linkedin,
    icon: <Linkedin size={15} />,
    external: true,
  },
];

function ChipList({ title, items }: { title: string; items: Chip[] }) {
  return (
    <div className="flex flex-col gap-3">
          <h3 className="text-[18px] font-semibold leading-[1.4] text-[#ffffff]">{title}</h3>
      <ul className="flex flex-col gap-[8px]">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="contact-chip flex items-center gap-4 rounded-[12px] bg-[color:var(--chip-bg)] px-5 py-[13px] text-[14px] text-[color:var(--chip-text)] transition-all duration-300 hover:bg-[color:var(--border-card)] hover:text-[color:var(--text)]"
            >
              <span aria-hidden="true" className="shrink-0 opacity-70">
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-line",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: rootRef.current, start: "top 72%" },
        }
      );

      gsap.fromTo(
        ".contact-sub",
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
        }
      );

      gsap.fromTo(
        ".contact-orb",
        { scale: 0.6, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 70%" },
        }
      );

      gsap.fromTo(
        ".contact-col",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".contact-cols", start: "top 82%" },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="contact"
      ref={rootRef}
      className="px-5 pb-16 pt-16 md:px-8 md:pb-20 md:pt-20 xl:px-12 xl:pt-[70px]"
      style={{ scrollMarginTop: "72px" }}
    >
      <div className="flex flex-col gap-14">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-8 xl:pl-[100px]">
            <div className="flex flex-col gap-5">
              <h1 className="font-tight text-[clamp(44px,6.2vw,88px)] font-semibold leading-[1.2] text-[color:var(--heading-collab)]">
                <span className="block overflow-hidden">
                  <span className="contact-line block">Let&rsquo;s</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="contact-line block">Collaborate</span>
                </span>
              </h1>

              <p className="contact-sub font-tight text-[clamp(24px,2.8vw,38px)] font-medium leading-[1.4] text-[color:var(--text-muted)]">
                call with me -
              </p>
            </div>

            <a
              href={links.phone}
              aria-label={`Call ${links.phoneText}`}
              className="contact-orb group relative hidden h-[190px] w-[190px] shrink-0 items-center justify-center overflow-hidden rounded-full xl:flex xl:h-[252px] xl:w-[252px]"
              style={{
                background:
                  "radial-gradient(circle at 38% 72%, rgba(210,210,220,0.42) 0%, rgba(90,90,105,0.22) 38%, rgba(10,10,14,0.9) 72%)",
                boxShadow: "0 0 90px rgba(255,255,255,0.05)",
              }}
            >
              <ArrowUpRight
                size={64}
                strokeWidth={1.2}
                className="text-[#9a9aa5] transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2"
              />
            </a>
          </div>

          <a
            href={links.phone}
            className="contact-orb group relative flex w-fit items-center gap-3 overflow-hidden rounded-[200px] bg-[color:var(--pill-bg)] px-8 py-4 text-[16px] font-medium text-[color:var(--pill-text)] transition-transform duration-300 hover:scale-[1.02] xl:hidden"
          >
            {links.phoneText}
            <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="contact-cols flex flex-col gap-10">
          <div className="contact-col">
            <ChipList title="Contact" items={contactChips} />
          </div>
          <div className="contact-col">
            <ChipList title="Social Media" items={socialChips} />
          </div>
        </div>
      </div>
    </section>
  );
}
