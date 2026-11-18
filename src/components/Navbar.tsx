import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { links, nav } from "../data/content";
import { LIVE_PRODUCT_URL } from "../router";

interface NavbarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  variant?: "home" | "case-study";
}

const caseStudyNav = [
  { label: "Back to Portfolio", href: "/" },
  { label: "Back to Projects", href: "/#project" },
];

const navId = (href: string) => href.replace(/^#/, "");

function ThemeToggle({
  theme,
  onToggleTheme,
}: {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex h-7 w-[52px] shrink-0 items-center rounded-full border border-[color:var(--border-soft)] px-[3px] transition-colors duration-300"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="flex h-[20px] w-[20px] items-center justify-center rounded-full"
        style={{
          background:
            "linear-gradient(142.83deg, rgba(211,230,252,1) 0%, rgba(200,210,242,1) 100%)",
          alignSelf: theme === "dark" ? "flex-start" : "flex-end",
        }}
      >
        {theme === "dark" ? (
          <Moon size={11} strokeWidth={2.2} color="#424257" />
        ) : (
          <Sun size={11} strokeWidth={2.2} color="#424257" />
        )}
      </motion.span>
    </button>
  );
}

export default function Navbar({
  theme,
  onToggleTheme,
  variant = "home",
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(navId(nav[0].href));
  const items = variant === "case-study" ? caseStudyNav : nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Scrollspy: highlight the nav item for the section in view (home only).
  useEffect(() => {
    if (variant === "case-study") return;
    const ids = nav.map((item) => navId(item.href));
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.scrollY + window.innerHeight * 0.35;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= line) {
          current = id;
        }
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [variant]);

  if (variant === "case-study") {
    return (
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? "backdrop-blur-md bg-[color:var(--bg)]/85" : "bg-[color:var(--bg)]"
        }`}
        style={{ borderBottom: scrolled ? "1px solid var(--border-card)" : "1px solid transparent" }}
      >
        <nav
          aria-label="Main"
          className="relative mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-5 md:px-8 xl:px-[120px]"
        >
          <a
            href={variant === "case-study" ? "/" : "#hero"}
            className="group flex items-center gap-3"
            aria-label="Aliya parveen — home"
          >
            <span
              aria-hidden="true"
              className="hidden h-px w-7 bg-[color:var(--text-muted)] transition-all duration-300 group-hover:w-9 sm:block"
            />
            <span className="text-[14px] font-semibold leading-[125%] text-[color:var(--text)]">
              Aliya parveen
            </span>
          </a>

          <span
            aria-hidden="true"
            className="hidden text-[14px] font-normal text-[color:var(--text-muted)] md:block"
          >
            UXUI Designer
          </span>

          <div className="hidden items-center gap-8 md:flex">
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group relative text-[14px] font-normal text-[color:var(--text)] transition-colors hover:text-[color:var(--text-muted)]"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[color:var(--grad-from)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            {variant === "case-study" && (
              <a
                href={LIVE_PRODUCT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-1.5 text-[14px] font-normal text-[color:var(--text)] transition-colors hover:text-[color:var(--text-muted)]"
              >
                Live Product
                <ArrowUpRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[color:var(--grad-from)] transition-all duration-300 group-hover:w-full" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border-card)] text-[color:var(--text)] transition-colors hover:border-[color:var(--border-soft)] md:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="border-t border-[color:var(--border-card)] bg-[color:var(--bg)] px-5 pb-8 pt-4 md:hidden"
            >
              <div className="mb-3 flex justify-end">
                <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
              </div>
              <ul className="flex flex-col gap-1">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-3 text-[18px] font-medium text-[color:var(--text)] transition-colors hover:bg-[color:var(--chip-bg)]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                {variant === "case-study" && (
                  <li>
                    <a
                      href={LIVE_PRODUCT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-3 text-[18px] font-medium text-[color:var(--text)] transition-colors hover:bg-[color:var(--chip-bg)]"
                    >
                      Live Product
                      <ArrowUpRight size={16} />
                    </a>
                  </li>
                )}
                <li>
                  <a
                    href={links.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg px-3 py-3 text-[18px] font-medium text-[color:var(--text)] transition-colors hover:bg-[color:var(--chip-bg)]"
                  >
                    Behance ↗
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    );
  }

  // ---------- Home: floating glass pill navigation ----------
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex justify-center px-3.5 pt-3 md:px-6 md:pt-4">
        <nav
          aria-label="Main"
          className="relative flex max-w-full items-center gap-1 rounded-full border border-white/10 bg-[rgba(9,9,13,0.72)] py-1.5 pl-3.5 pr-1.5 shadow-[0_12px_40px_-14px_rgba(0,0,0,0.5),0_0_28px_-10px_rgba(188,60,216,0.25)] backdrop-blur-xl"
        >
          <a
            href="#hero"
            aria-label="Aliya parveen — home"
            className="group flex shrink-0 items-center gap-2.5 rounded-full pr-2 md:pr-3"
          >
            <span
              aria-hidden="true"
              className="hidden h-px w-6 bg-white/40 transition-all duration-300 group-hover:w-8 md:block"
            />
            <span className="text-[13px] font-semibold leading-none text-white">
              Aliya parveen
            </span>
          </a>

          <ul className="hidden items-center md:flex">
            {nav.map((item) => {
              const id = navId(item.href);
              const isActive = active === id;
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={`block rounded-full px-3.5 py-2 text-[13px] font-medium leading-none transition-colors duration-200 ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/65 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <span
            aria-hidden="true"
            className="mx-1 hidden h-4 w-px bg-white/10 md:block"
          />

          <span
            role="status"
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2.5 pr-3 text-[12px] font-medium leading-none text-white/90"
          >
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-70 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.85)]" />
            </span>
            Open to Work
          </span>

          <div className="hidden pl-1 md:block">
            <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:border-white/25 md:hidden"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mx-3.5 mt-2 rounded-2xl border border-white/10 bg-[rgba(9,9,13,0.92)] p-1.5 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-0.5">
              {nav.map((item) => {
                const isActive = active === navId(item.href);
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive ? "location" : undefined}
                      className={`block rounded-xl px-3.5 py-3 text-[15px] font-medium transition-colors ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/75 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            <a
              href={links.behance}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 block rounded-xl px-3.5 py-3 text-[15px] font-medium text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              Behance ↗
            </a>
            <div className="mt-1 flex justify-end border-t border-white/10 px-2 pt-2.5">
              <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
