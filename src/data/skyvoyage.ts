export const LIVE_PRODUCT_URL = "https://skyvoyage-pi.vercel.app/";

export const skyvoyageImages = {
  hero: "/skyvoyage/sv-home.png",
  heroMobile: "/skyvoyage/sv-home-mobile.png",
  search: "/skyvoyage/sv-search.png",
  results: "/skyvoyage/sv-results.png",
  guide: "/skyvoyage/sv-guide.png",
  guideScroll: "/skyvoyage/sv-guide-scroll.png",
  guideMobile: "/skyvoyage/sv-guide-mobile.png",
  explorer: "/skyvoyage/sv-map.png",
  explorerScroll: "/skyvoyage/sv-map-scroll.png",
  explorerMobile: "/skyvoyage/sv-map-mobile.png",
  navigation: "/skyvoyage/sv-route.png",
  tracking: "/skyvoyage/sv-tracking.png",
  trackingScroll: "/skyvoyage/sv-tracking-scroll.png",
  trackingMobile: "/skyvoyage/sv-tracking-mobile.png",
  dashboard: "/skyvoyage/sv-dashboard.png",
  trip: "/skyvoyage/sv-trips.png",
  onboarding: "/skyvoyage/sv-onboarding.png",
};

export const projectDetails = [
  { label: "Project Type", value: "UX/UI Design" },
  { label: "Platform", value: "Responsive Web Application" },
  { label: "Category", value: "Travel / Flight Booking" },
  { label: "Role", value: "UX/UI Designer" },
  {
    label: "Focus",
    value:
      "User Research, User Journey, Information Architecture, Wireframing, UI Design and Interaction Design",
  },
];

export const problems = [
  {
    title: "Scattered booking information",
    body: "Flight booking details live across different platforms, so travellers lose context between search, payment and boarding.",
  },
  {
    title: "Uncertainty after arrival",
    body: "Once at the airport, travellers often struggle to understand what to do next and where to go.",
  },
  {
    title: "Unstructured waiting time",
    body: "Passengers rarely know which facilities, restaurants or activities are available while they wait.",
  },
  {
    title: "Confusing airport layouts",
    body: "Finding the correct terminal, gate or facility inside an unfamiliar airport can be overwhelming.",
  },
  {
    title: "Fragmented flight status",
    body: "Flight status, boarding time and gate information are usually tracked in different places.",
  },
  {
    title: "First-time traveller anxiety",
    body: "First-time flyers feel anxious when they are unsure what happens next or whether they will make their flight.",
  },
];

export interface SkyFeature {
  index: string;
  title: string;
  body: string;
  status: "Live" | "Live · simulated data" | "Live · simulated route";
  image?: keyof typeof skyvoyageImages;
}

export const features: SkyFeature[] = [
  {
    index: "01",
    title: "Flight Booking",
    body: "Explore flights, compare fares and manage the booking journey in one place — from search to confirmation.",
    status: "Live",
    image: "results",
  },
  {
    index: "02",
    title: "Airport Guide",
    body: "Explore airport facilities, services and useful places around the departure terminal.",
    status: "Live",
    image: "guide",
  },
  {
    index: "03",
    title: "Make the Most of Waiting Time",
    body: "Instead of simply waiting, discover restaurants, shopping, lounges and other airport activities available during the layover.",
    status: "Live",
    image: "explorer",
  },
  {
    index: "04",
    title: "Airport Indoor Navigation",
    body: "Understand airport layouts and follow routes to important locations, including terminals, facilities and boarding gates.",
    status: "Live · simulated route",
    image: "navigation",
  },
  {
    index: "05",
    title: "Flight Tracking",
    body: "Follow the flight journey and check live status, ticket and travel information in one view.",
    status: "Live",
    image: "tracking",
  },
  {
    index: "06",
    title: "Gate Information and Navigation",
    body: "See the assigned gate number and understand how to reach it through the airport map.",
    status: "Live · simulated route",
    image: "guideScroll",
  },
  {
    index: "07",
    title: "Journey Information",
    body: "Keep ticket, boarding and journey details accessible throughout the entire travel experience.",
    status: "Live",
    image: "trip",
  },
];

export const personas = [
  {
    tag: "Persona 01",
    name: "Ananya",
    role: "First-time traveller",
    profile: "A young traveller taking her first flight independently.",
    goals: [
      "Understand the flight booking process.",
      "Know what to do after reaching the airport.",
      "Find the correct gate without confusion.",
      "Make good use of airport waiting time.",
    ],
    pains: [
      "Unfamiliar with airport layouts.",
      "Nervous about missing the flight.",
      "Unsure about boarding procedures.",
      "Difficulty finding airport facilities.",
    ],
    needs: [
      "Simple instructions.",
      "Clear flight information.",
      "Airport maps and directions.",
      "Easy access to boarding details.",
    ],
  },
  {
    tag: "Persona 02",
    name: "Arjun",
    role: "Frequent traveller",
    profile: "A working professional who frequently travels for business.",
    goals: [
      "Save time during airport visits.",
      "Quickly check flight information.",
      "Find the correct boarding gate.",
      "Access useful airport facilities.",
    ],
    pains: [
      "Limited time between activities.",
      "Changes in flight and gate information.",
      "Switching between multiple travel applications.",
      "Difficulty navigating unfamiliar airports.",
    ],
    needs: [
      "Centralised information.",
      "Quick flight tracking.",
      "Efficient airport navigation.",
      "Easy-to-access journey details.",
    ],
  },
];

export type EmotionTone = "low" | "mid" | "high";

export interface JourneyStage {
  step: string;
  title: string;
  action: string;
  thought: string;
  pain: string;
  solution: string;
  emotion: string;
  tone: EmotionTone;
}

export const journey: JourneyStage[] = [
  {
    step: "01",
    title: "Discover",
    action: "Explores flight options and travel requirements.",
    thought: "Which route and fare work best for me?",
    pain: "Options are spread across too many sites.",
    solution: "One search surface with clear, comparable fares.",
    emotion: "Curious",
    tone: "mid",
  },
  {
    step: "02",
    title: "Book",
    action: "Chooses a flight and completes the booking.",
    thought: "I hope the price and details stay clear.",
    pain: "Hidden steps create doubt before payment.",
    solution: "Guided booking flow with transparent fare breakdown.",
    emotion: "Cautious",
    tone: "mid",
  },
  {
    step: "03",
    title: "Prepare",
    action: "Accesses ticket and journey information.",
    thought: "Do I have everything I need for departure?",
    pain: "Tickets and timings live in different places.",
    solution: "Centralised journey information in one view.",
    emotion: "Relieved",
    tone: "high",
  },
  {
    step: "04",
    title: "Arrive at Airport",
    action: "Understands where to go and what to do next.",
    thought: "Where do I go from the entrance?",
    pain: "Airport terminals are unfamiliar and busy.",
    solution: "Airport guide with terminal, counter and gate details.",
    emotion: "Anxious",
    tone: "low",
  },
  {
    step: "05",
    title: "Explore",
    action: "Discovers services, dining and activities while waiting.",
    thought: "How can I use this waiting time well?",
    pain: "No idea what facilities are nearby.",
    solution: "Airport explorer with categories and walking distance.",
    emotion: "Interested",
    tone: "high",
  },
  {
    step: "06",
    title: "Navigate",
    action: "Uses the airport map to reach the terminal, facility or gate.",
    thought: "Which way is my gate from here?",
    pain: "Signage alone is easy to misread.",
    solution: "Indoor map with route guidance and walking steps.",
    emotion: "Confident",
    tone: "high",
  },
  {
    step: "07",
    title: "Board",
    action: "Checks flight information, gate details and boarding instructions.",
    thought: "I know exactly where to be and when.",
    pain: "Late gate or time changes cause panic.",
    solution: "Live flight tracking with gate and boarding updates.",
    emotion: "Confident",
    tone: "high",
  },
];

export const painSolution = [
  {
    problem: "I don't know what to do while waiting at the airport.",
    solution: "Airport Guide and waiting-time activities.",
  },
  {
    problem: "I cannot find the correct gate.",
    solution: "Airport map and route guidance.",
  },
  {
    problem: "I am worried about missing my flight.",
    solution: "Flight tracking and accessible journey information.",
  },
  {
    problem: "My travel information is spread across multiple platforms.",
    solution: "Centralised flight and journey experience.",
  },
  {
    problem: "I am unfamiliar with the airport.",
    solution: "Airport exploration and navigation.",
  },
];

export const informationArchitecture = [
  {
    area: "Flight Booking",
    items: ["Search flights", "Compare fares", "Booking details", "Confirmation"],
  },
  {
    area: "Airport Guide",
    items: ["Terminal info", "Check-in & gate", "Facilities", "Waiting time"],
  },
  {
    area: "Airport Map",
    items: ["Airport layout", "Facility search", "Route guidance", "Walking steps"],
  },
  {
    area: "Flight Tracking",
    items: ["Flight status", "Boarding time", "Gate updates", "Ticket access"],
  },
  {
    area: "My Journey",
    items: ["Trip overview", "Passengers", "Boarding pass", "Journey timeline"],
  },
];

export const userFlows = [
  {
    id: "Flow 01",
    title: "Book a Flight",
    steps: [
      "Start",
      "Search Flights",
      "Explore Options",
      "Select Flight",
      "Booking Details",
      "Confirmation",
    ],
  },
  {
    id: "Flow 02",
    title: "Airport Navigation",
    steps: [
      "Open Airport Guide",
      "Select Airport",
      "Explore Facilities",
      "Select Destination",
      "View Route",
      "Reach Location",
    ],
  },
  {
    id: "Flow 03",
    title: "Flight Tracking",
    steps: [
      "Open Flight Tracking",
      "Select Journey",
      "View Flight Status",
      "Check Gate Information",
      "Open Airport Map",
      "Navigate to Gate",
    ],
  },
];

export const designDecisions = [
  {
    title: "Simplifying complex travel information",
    body: "Booking, terminal and flight data are grouped into clear, single-purpose views instead of one dense screen.",
  },
  {
    title: "Reducing cognitive load",
    body: "Each screen answers one traveller question at a time, so the next action is always obvious.",
  },
  {
    title: "Clear visual hierarchy",
    body: "Headlines, key numbers and supporting details are separated by size, weight and contrast.",
  },
  {
    title: "Easy navigation",
    body: "A consistent navigation model moves travellers between booking, guide, map and tracking without re-learning.",
  },
  {
    title: "Consistent information architecture",
    body: "The same five areas appear across the product, so location and context are never lost.",
  },
  {
    title: "Accessibility and readable typography",
    body: "High-contrast text, generous line height and large touch targets keep information legible on the move.",
  },
  {
    title: "Responsive layouts",
    body: "Desktop dashboards collapse into focused mobile flows with thumb-reachable navigation.",
  },
  {
    title: "Timely, understandable information",
    body: "Gate, boarding and walking-time details surface when they matter, reducing passenger uncertainty.",
  },
];

export const finalHighlights = [
  "Flight booking with transparent fares",
  "Airport guide with terminal and gate details",
  "Waiting-time activities and facility discovery",
  "Indoor airport navigation with route guidance",
  "Flight tracking with boarding information",
  "Centralised journey and ticket details",
];
