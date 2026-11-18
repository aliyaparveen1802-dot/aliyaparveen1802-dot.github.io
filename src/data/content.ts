export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  href: string;
  fit?: "cover" | "contain";
}

const BEHANCE = "https://www.behance.net";

export const projects: Project[] = [
  {
    id: "health-track",
    title: "Health Track",
    category: "Mobile App",
    image: "https://framerusercontent.com/images/WoWEoxF1KGfzuJzWGBAkOkQkE.png",
    href: `${BEHANCE}/gallery/214271347/Health-Track-casestudy`,
  },
  {
    id: "moni-cakes",
    title: "Moni cakes",
    category: "Website Landing Design",
    image: "https://framerusercontent.com/images/uOzDxaMrs3cDCzCTW49MdtmeY.png",
    href: `${BEHANCE}/gallery/210257789/Moni-Customized-Cake-Creations-Website-Design`,
  },
  {
    id: "costume-order",
    title: "Costume Order",
    category: "Website Landing Screen",
    image:
      "https://framerusercontent.com/images/VxhjJ2QwJfZeTYSuSGfGJG5sBI.png?scale-down-to=4096",
    href: `${BEHANCE}/gallery/211656587/Fancify-Kids-Little-Costumes-Big-Imagination`,
  },
  {
    id: "logo",
    title: "Logo",
    category: "Logo Design",
    image: "https://framerusercontent.com/images/ViAYwvHvsUFQ5ogqv3NYzd14xY.png",
    href: `${BEHANCE}/gallery/213981559/Logo-Health-track`,
  },
  {
    id: "prototype",
    title: "Lot of prototype",
    category: "Done by Aliya",
    image: "https://framerusercontent.com/images/UI4CwqXZs42UYYQ5kY8oQDw.png",
    href: `${BEHANCE}/gallery/218748399/My-prototype-skill`,
    fit: "contain",
  },
  {
    id: "daily-travel",
    title: "Daily Travel",
    category: "Logo Design",
    image: "https://framerusercontent.com/images/0pMQMYJq5oybVqTyRBT29asV8.png",
    href: `${BEHANCE}/gallery/218728789/Logo-casestudy`,
  },
  {
    id: "zen-ui",
    title: "zen cycle UI casestudy",
    category: "Mobile App",
    image: "https://framerusercontent.com/images/KGxXfVngWpUNzGV9oKPhvDE.jpg",
    href: `${BEHANCE}/gallery/219130177/zen-cycle-UI-casestudy`,
  },
  {
    id: "zen-ux",
    title: "Zen cycle UX casestudy",
    category: "Mobile App",
    image: "https://framerusercontent.com/images/oEu1V7t5weqA9uoDnyd9zclVvzw.png",
    href: `${BEHANCE}/gallery/219129637/ZEN-CYCLE-UX-CASESTUDY`,
  },
];

export const aboutImages = {
  landscape: "https://framerusercontent.com/images/4sFKSJs5FPAzWZ5xGg1Oln6v1o.png",
  landscapeAlt: "https://framerusercontent.com/images/UDgvnzKhNvi3d7CQZ99sNXD6U.jpg",
  vertical1: "https://framerusercontent.com/images/clGpell9FfI9j6tIIAkVhS3yG0.jpg",
  vertical2: "https://framerusercontent.com/images/DpX1EAJdUbOzlZ9hs4uuD4vsl9Y.jpg",
};

export const aboutCopy = {
  heading: "A bit about me",
  body: "I'm a UI/UX designer driven by a passion for crafting delightful and engaging digital experiences that leave a lasting impression. Beyond design, I'm a music enthusiast, an avid gamer, and an explorer at heart, always seeking inspiration through travel and new adventures.",
};

export const links = {
  behance: "https://www.behance.net/aliyaparveen1",
  framer: "https://adoptpetshelter.framer.website/hero-section",
  linkedin: "https://www.linkedin.com/in/aliya-parveen-78a6aa31b/",
  phone: "tel:+918122231802",
  phoneText: "8122231802",
  email: "mailto:aliya.uxui@gmail.com",
  emailText: "aliya.uxui@gmail.com",
  framerCredit: "https://www.framer.com/?via=cristianmielu",
};

export const nav = [
  { label: "Home", href: "#hero" },
  { label: "Projects", href: "#project" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
