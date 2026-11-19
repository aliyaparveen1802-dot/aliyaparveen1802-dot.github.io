/**
 * Certifications & Learning Journey — easy-update data file.
 *
 * To add a certificate:
 *  1. Put the image into public/certificates/ (e.g. public/certificates/ixdf-hci.png)
 *  2. Set `image` to "/certificates/ixdf-hci.png"
 *  3. Set `url` to the official verification/credential link, or leave it null
 *     (no link is rendered when null — links are never invented).
 * Leave `image` as null to show the built-in polished certificate preview.
 */
export interface Certificate {
  id: string;
  index: string;
  title: string;
  organization: string;
  year: string;
  image: string | null;
  url: string | null;
}

export const idfOrganization = {
  name: "Interaction Design Foundation",
  shortName: "IxDF",
  label: "Professional Learning",
};

export const idfCertificates: Certificate[] = [
  {
    id: "ixdf-hci",
    index: "Certificate 01",
    title: "Human-Computer Interaction: The Foundations of UX Design",
    organization: "Interaction Design Foundation (IxDF)",
    year: "2026",
    image: "/certificates/certificate-hci-foundations-of-ux-design.jpg",
    url: null,
  },
  {
    id: "ixdf-ai",
    index: "Certificate 02",
    title: "AI for Designers",
    organization: "Interaction Design Foundation (IxDF)",
    year: "2026",
    image: "/certificates/certificate-ai-for-designers.jpg",
    url: null,
  },
  {
    id: "ixdf-visual",
    index: "Certificate 03",
    title: "Visual Design: The Ultimate Guide",
    organization: "Interaction Design Foundation (IxDF)",
    year: "2026",
    image: null,
    url: null,
  },
];

export const schoolOfTechies = {
  institution: "School of Techies",
  /** School of Techies logo — drop a real file into public/logos/ and point here
   *  (e.g. "/logos/school-of-techies.png") to replace the built-in SVG. */
  logo: "/logos/school-of-techies.svg",
  program: "UX/UI Design Training",
  duration: "6 Months",
  year: "2024",
  description:
    "Completed six months of structured UX/UI design training, developing practical knowledge of user-centered design, wireframing, prototyping, visual design, responsive interfaces, design workflows and industry-standard tools.",
};

export const learningTimeline = [
  {
    year: "2024",
    label: "School of Techies",
    detail: "UX/UI Design Training · 6 Months",
  },
  {
    year: "2026",
    label: "Interaction Design Foundation",
    detail: "3 professional certifications",
  },
];
