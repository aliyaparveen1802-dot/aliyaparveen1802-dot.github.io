import { useEffect, useRef } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { scrollToPosition } from "../../hooks/useSmoothScroll";
import CaseStudyHero from "./CaseStudyHero";
import CaseStudyProblem from "./CaseStudyProblem";
import CaseStudyResearch from "./CaseStudyResearch";
import CaseStudyPersonas from "./CaseStudyPersonas";
import CaseStudyEmpathy from "./CaseStudyEmpathy";
import CaseStudyJourney from "./CaseStudyJourney";
import CaseStudyPainPoints from "./CaseStudyPainPoints";
import CaseStudyMapping from "./CaseStudyMapping";
import CaseStudySolution from "./CaseStudySolution";
import CaseStudyIA from "./CaseStudyIA";
import CaseStudyFlows from "./CaseStudyFlows";
import {
  CaseStudyWireframing,
  CaseStudyLowFi,
  CaseStudyHiFi,
} from "./CaseStudyWireframing";
import CaseStudyTypography from "./CaseStudyTypography";
import CaseStudyDecisions from "./CaseStudyDecisions";
import CaseStudyPrototyping from "./CaseStudyPrototyping";
import CaseStudyShowcase from "./CaseStudyShowcase";
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
      <CaseStudyResearch />
      <CaseStudyPersonas />
      <CaseStudyEmpathy />
      <CaseStudyJourney />
      <CaseStudyPainPoints />
      <CaseStudyMapping />
      <CaseStudySolution />
      <CaseStudyIA />
      <CaseStudyFlows />
      <CaseStudyWireframing />
      <CaseStudyLowFi />
      <CaseStudyHiFi />
      <CaseStudyTypography />
      <CaseStudyDecisions />
      <CaseStudyPrototyping />
      <CaseStudyShowcase />
      <CaseStudyFinal />
    </div>
  );
}
