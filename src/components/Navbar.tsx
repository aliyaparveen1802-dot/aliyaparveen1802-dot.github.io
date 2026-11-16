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
