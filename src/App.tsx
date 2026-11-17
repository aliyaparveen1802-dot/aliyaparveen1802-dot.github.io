import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Preloader from "./components/Preloader";
import Hero from "./components/Hero";
import ProjectSection from "./components/ProjectSection";
import MyDesignJourney from "./components/MyDesignJourney";
import ProjectGallery from "./components/ProjectGallery";
import SkillsSection from "./components/SkillsSection";
import CertificationsSection from "./components/CertificationsSection";
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
    <div className="relative min-h-screen">
      {/* Page-wide ambient accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <span className="page-glow-haze absolute inset-0" />
        <span className="page-glow-a absolute bottom-[-42%] left-1/2 h-[85%] w-[min(1300px,160%)]" />
        <span className="page-glow-b absolute bottom-[-34%] left-1/2 h-[68%] w-[min(950px,120%)]" />
      </div>
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
            <div className="order-3">
              <MyDesignJourney />
            </div>
            <div className="order-4 md:order-7">
              <About />
            </div>
            <div className="order-5 md:order-4">
              <ProjectGallery />
            </div>
            <div className="order-6 md:order-5">
              <SkillsSection />
            </div>
            <div className="order-7 md:order-6">
              <CertificationsSection />
            </div>
            <div className="order-8">
              <Contact />
            </div>
            <div className="order-9">
              <Footer />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
