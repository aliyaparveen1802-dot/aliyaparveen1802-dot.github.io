import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Preloader from "./components/Preloader";
import Hero from "./components/Hero";
import ProjectSection from "./components/ProjectSection";
import CaseStudies from "./components/CaseStudies";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import SkyVoyageCaseStudy from "./components/case-study/SkyVoyageCaseStudy";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { useTheme } from "./hooks/useTheme";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { useRoute, useLinkInterceptor } from "./router";

export default function App() {
  useSmoothScroll();
  const { theme, toggle } = useTheme();
  const reduced = usePrefersReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const { isCaseStudy, navigate } = useRoute();

  useLinkInterceptor(navigate);

  const handlePreloaderDone = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    if (reduced) setLoaded(true);
  }, [reduced]);

  return (
    <div className="relative min-h-screen bg-[color:var(--bg)]">
      {!loaded && !reduced && <Preloader onDone={handlePreloaderDone} />}
      <Navbar
        theme={theme}
        onToggleTheme={toggle}
        variant={isCaseStudy ? "case-study" : "home"}
      />

      <main className="flex flex-col">
        {isCaseStudy ? (
          <SkyVoyageCaseStudy />
        ) : (
          <>
            <div className="order-1">
              <Hero ready={loaded} />
            </div>
            <div className="order-2">
              <ProjectSection />
            </div>
            <div className="order-3 md:order-4">
              <About />
            </div>
            <div className="order-4 md:order-3">
              <CaseStudies />
            </div>
            <div className="order-5">
              <Contact />
            </div>
            <div className="order-6">
              <Footer />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
