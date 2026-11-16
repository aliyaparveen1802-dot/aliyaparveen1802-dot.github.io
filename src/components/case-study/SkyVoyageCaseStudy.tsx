import { useEffect, useRef } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { scrollToPosition } from "../../hooks/useSmoothScroll";
import CaseStudyHero from "./CaseStudyHero";
import CaseStudyProblem from "./CaseStudyProblem";
import CaseStudySolution from "./CaseStudySolution";
import CaseStudyPersonas from "./CaseStudyPersonas";
import CaseStudyJourney from "./CaseStudyJourney";
import CaseStudyMapping from "./CaseStudyMapping";
import CaseStudyIA from "./CaseStudyIA";
import CaseStudyFlows from "./CaseStudyFlows";
import CaseStudyDecisions from "./CaseStudyDecisions";
import CaseStudyFinal from "./CaseStudyFinal";

const DEFAULT_TITLE = "Aliya Parveen — UX/UI Designer";

export default function SkyVoyageCaseStudy() {
  const rootRef = useRef<HTMLDivElement>(null);
  useScrollReveal(rootRef);

  useEffect(() => {
    document.title = "SkyVoyage — UX Case Study | Aliya Parveen";
    scrollToPosition(0, 0, { immediate: true });
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  return (
    <div ref={rootRef} className="bg-[color:var(--bg)]">
      <CaseStudyHero />
      <CaseStudyProblem />
      <CaseStudySolution />
      <CaseStudyPersonas />
      <CaseStudyJourney />
      <CaseStudyMapping />
      <CaseStudyIA />
      <CaseStudyFlows />
      <CaseStudyDecisions />
      <CaseStudyFinal />
    </div>
  );
}
