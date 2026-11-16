export interface SkillCategory {
  id: string;
  index: string;
  title: string;
  items: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "ux",
    index: "01",
    title: "UX & Product Design",
    items: [
      "User Experience (UX) Design",
      "Product Design",
      "User-Centered Design",
      "Design Thinking",
      "User Journey Mapping",
      "Information Architecture",
      "Interaction Design",
      "Responsive & Adaptive Design",
    ],
  },
  {
    id: "research",
    index: "02",
    title: "UX Research & Strategy",
    items: [
      "User Research",
      "User Personas",
      "Empathy Mapping",
      "User Interviews",
      "Competitor Analysis",
      "User Flows",
      "Wireframing",
      "Usability Testing",
      "Problem Solving",
    ],
  },
  {
    id: "ui",
    index: "03",
    title: "UI & Visual Design",
    items: [
      "User Interface Design",
      "High-Fidelity UI",
      "Low-Fidelity Wireframes",
      "Design Systems",
      "Component Libraries",
      "Typography & Color Theory",
      "Visual Hierarchy",
      "Accessibility (WCAG)",
      "Mobile & Web Design",
    ],
  },
  {
    id: "proto",
    index: "04",
    title: "Prototyping & Development Collaboration",
    items: [
      "Interactive Prototyping",
      "Micro-Interactions",
      "Responsive Prototypes",
      "Developer Handoff",
      "Design Documentation",
      "Design QA",
      "Cross-Functional Collaboration",
      "Design Validation",
    ],
  },
  {
    id: "ai",
    index: "05",
    title: "AI-Powered Design & Workflow",
    items: [
      "AI-Assisted UI/UX Design",
      "AI Prompt Engineering",
      "AI-Powered Prototyping",
      "AI Design Exploration",
      "AI-Assisted Research",
      "AI Workflow Automation",
      "Vibe Coding",
      "AI-Assisted Website Development",
    ],
  },
  {
    id: "tools",
    index: "06",
    title: "Tools & Technologies",
    items: [],
  },
];

export interface Tool {
  name: string;
  file: string;
}

export const tools: Tool[] = [
  { name: "Figma", file: "/logos/figma.svg" },
  { name: "FigJam", file: "/logos/figjam.svg" },
  { name: "Framer", file: "/logos/framer.svg" },
  { name: "Miro", file: "/logos/miro.svg" },
  { name: "Lucidchart", file: "/logos/lucidchart.svg" },
  { name: "Adobe Photoshop", file: "/logos/photoshop.svg" },
  { name: "Canva", file: "/logos/canva.svg" },
  { name: "ChatGPT", file: "/logos/chatgpt.svg" },
  { name: "Claude", file: "/logos/claude.svg" },
  { name: "Gemini", file: "/logos/gemini.svg" },
  { name: "GitHub", file: "/logos/github.svg" },
  { name: "VS Code", file: "/logos/vscode.svg" },
];
