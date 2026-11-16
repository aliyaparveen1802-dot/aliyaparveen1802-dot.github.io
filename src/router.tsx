import { useCallback, useEffect, useState } from "react";
import { scrollToPosition } from "./hooks/useSmoothScroll";

export const CASE_STUDY_PATH = "/projects/skyvoyage/ux-case-study";
export const LIVE_PRODUCT_URL = "https://skyvoyage-pi.vercel.app/";

function readLocation(): string {
  if (typeof window === "undefined") return "/";
  return window.location.pathname + window.location.search;
}

function readPath(): string {
  return readLocation().split("?")[0];
}

/** Scrolls to an in-page hash, waiting for the target to mount after a route change. */
export function scrollToHash(hash: string) {
  const id = hash.startsWith("#") ? hash : `#${hash}`;
  if (id === "#") return;
  let tries = 0;
  const attempt = () => {
    const el = document.querySelector(id);
    if (el) {
      scrollToPosition(el as HTMLElement, -80);
      return;
    }
    if (++tries < 90) requestAnimationFrame(attempt);
  };
  requestAnimationFrame(attempt);
}

export function useRoute() {
  const [route, setRoute] = useState(readLocation);

  useEffect(() => {
    const onPopState = () => {
      const hash = window.location.hash;
      if (hash) scrollToHash(hash);
      else scrollToPosition(0, 0, { immediate: true });
      setRoute(readLocation());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((href: string) => {
    const url = new URL(href, window.location.origin);

    if (url.origin !== window.location.origin) {
      window.location.href = href;
      return;
    }

    const next = url.pathname + url.search;

    if (next === readLocation()) {
      if (url.hash) scrollToHash(url.hash);
      else scrollToPosition(0, 0, { immediate: true });
      return;
    }

    if (url.hash) scrollToHash(url.hash);
    else scrollToPosition(0, 0, { immediate: true });

    window.history.pushState({}, "", next + url.hash);
    setRoute(readLocation());
  }, []);

  const path = readPath();

  return {
    route,
    path,
    isCaseStudy: path === CASE_STUDY_PATH,
    navigate,
  };
}

/** Intercepts internal <a> clicks so the app can route without a full reload. */
export function useLinkInterceptor(navigate: (href: string) => void) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.(
        "a[href]"
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (!href.startsWith("/") || href.startsWith("//")) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      event.preventDefault();
      navigate(href);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate]);
}
