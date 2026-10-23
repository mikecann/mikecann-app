// Everything the page lists. Add an app by adding one entry to `apps`; the page and its CSS are generated from it.
// Images live in public/assets. After adding or changing one, run `npm run assets` to give it a hashed filename.

// Flip to true once Apple releases Poddle. The App Store link 404s until then,
// so for now the badge is plain "Coming soon" text rather than a link.
export const APP_STORE_LIVE = false;
const PODDLE_APP_STORE_URL = "https://apps.apple.com/app/id6825613455";

export interface Image {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/** How an app's print sits on the board. */
export interface Print {
  /** Width on desktop in columns of a 12-column grid. Each row of prints should add up to 12. */
  span: number;
  /** Degrees the print leans when it isn't hovered. */
  tilt: number;
  /** Desktop-only nudges in px, so prints overlap a little instead of lining up like a spreadsheet. */
  nudge?: { top?: number; right?: number; left?: number };
  /** What holds it to the page, and the colour of the tape or pin. */
  stuck: { with: "tape-top" | "tape-corners" | "tape-left" | "tape-right" | "pin"; color: string };
  /** Colours of the little kind sticker on the photo. */
  sticker?: { background: string; text: string };
}

interface BaseApp {
  name: string;
  href: string;
  description: string;
  /** Square, shown at 28 to 38px. Optional on prints, where the photo can do the job. */
  icon?: string;
}

/** Made for other people to use, so it gets a polaroid print with a screenshot in "Things you can use". */
export interface PrintApp extends BaseApp {
  /** "soon" means it's waiting on the App Store. */
  status: "open" | "soon";
  kind: string;
  image: Image;
  print: Print;
  /** Shown as the big print at the top, with the copy beside the photo. */
  featured?: boolean;
  appStore?: string;
}

/** Just for me and the family, so it gets a pinned index card with its icon in the section below the board. */
export interface CardApp extends BaseApp {
  /**
   * "personal" means anyone can open it, so the card links straight through with an arrow.
   * "private" needs a sign-in, so the card gets a lock (and no screenshot of a login page).
   */
  status: "personal" | "private";
  icon: string;
  /** Colour of the drawing pin. */
  pin?: string;
}

export type App = PrintApp | CardApp;

export function isCard(app: App): app is CardApp {
  return app.status === "personal" || app.status === "private";
}

export const apps: App[] = [
  {
    name: "Poddle",
    href: "https://poddle.mikecann.app",
    status: APP_STORE_LIVE ? "open" : "soon",
    kind: "iPhone app",
    description: "My podcast player for iPhone, made to replace Overcast.",
    icon: "/assets/icons/poddle.4e8b61bb.webp",
    image: { src: "/assets/shots/poddle.2139328f.webp", width: 860, height: 1055, alt: "Two iPhones showing Poddle's Up Next queue and Now Playing screen" },
    featured: true,
    appStore: PODDLE_APP_STORE_URL,
    print: { span: 8, tilt: -1.1, stuck: { with: "tape-corners", color: "#ee7b5c" } },
  },
  {
    name: "StashIt",
    href: "https://stashit.mikecann.app",
    status: "open",
    kind: "App",
    description: "A home for useful things worth keeping.",
    icon: "/assets/icons/stashit.6aad896b.webp",
    image: { src: "/assets/shots/stashit.08c53704.webp", width: 900, height: 900, alt: "An illustrated treasure chest overflowing with books and scrolls, above the StashIt wordmark" },
    print: { span: 4, tilt: 2.4, nudge: { top: 30, left: -62 }, stuck: { with: "tape-top", color: "#f5cf4f" }, sticker: { background: "#a8312a", text: "#fff6e6" } },
  },
  {
    name: "Wormquake",
    href: "https://wormquake.mikecann.app",
    status: "open",
    kind: "Game",
    description: "A destructible worm arena game inspired by Liero.",
    icon: "/assets/icons/wormquake.c1853214.svg",
    image: { src: "/assets/shots/wormquake.1a20f3da.webp", width: 1320, height: 825, alt: "Wormquake gameplay: two worms by their home core, above caverns flecked with gold" },
    print: { span: 7, tilt: 0.9, stuck: { with: "tape-corners", color: "#dcf58b" }, sticker: { background: "#0b1c20", text: "#dcf58b" } },
  },
  {
    name: "Build Your Own Universe",
    href: "https://physics.mikecann.app",
    status: "open",
    kind: "Interactive explainer",
    description: "A poke-everything tour of the Wolfram Physics Project.",
    icon: "/assets/icons/physics.11972bad.svg",
    image: { src: "/assets/shots/physics.f19780b7.webp", width: 1016, height: 762, alt: "A web of points and lines grown from a single rule" },
    print: { span: 5, tilt: -1.8, nudge: { top: 44, left: -18 }, stuck: { with: "tape-top", color: "#f3b01c" }, sticker: { background: "#15120b", text: "#f3b01c" } },
  },
  {
    name: "The Convex 100",
    href: "https://the-convex-100-language-challenge.mikecann.app",
    status: "open",
    kind: "Challenge",
    description: "Convex in 100 programming languages, from Fortran to Mojo.",
    icon: "/assets/icons/convex100.39e48d08.webp",
    image: { src: "/assets/shots/convex100.55a49801.webp", width: 1120, height: 700, alt: "The Convex 100 Language Challenge homepage with its dotted 100 logo" },
    print: { span: 5, tilt: -1.4, nudge: { top: 12 }, stuck: { with: "tape-left", color: "#c77dd6" }, sticker: { background: "#8d2676", text: "#fff" } },
  },
  {
    name: "Magic Jev Ball",
    href: "https://magic-jev.mikecann.app",
    status: "open",
    kind: "Toy",
    description: "A Magic 8 Ball that picks the answer that fits your question.",
    icon: "/assets/icons/magic-jev.51d28e0e.svg",
    image: { src: "/assets/shots/magic-jev.854fdd83.webp", width: 900, height: 900, alt: "A glossy black 8-ball under the Magic Jev Ball title and a box to type a question" },
    print: { span: 3, tilt: 2.1, nudge: { top: 56, left: -20 }, stuck: { with: "pin", color: "#3b3bb3" }, sticker: { background: "#f5c46a", text: "#12121f" } },
  },
  {
    name: "Questions",
    href: "https://questions.mikecann.app",
    status: "open",
    kind: "Tool",
    description: "Live Q&A for talks.",
    icon: "/assets/icons/questions.f194e924.svg",
    image: { src: "/assets/shots/questions.3d281862.webp", width: 1000, height: 750, alt: "The Join a Q&A card, with a box for the session code and a Join button" },
    print: { span: 4, tilt: -1.2, nudge: { top: 18, left: -6 }, stuck: { with: "tape-right", color: "#5fd4ad" }, sticker: { background: "#7cf0c8", text: "#0f1217" } },
  },
  {
    name: "Mike Pod",
    href: "https://podcast.mikecann.app",
    status: "personal",
    description: "Deep research for a curious mind.",
    icon: "/assets/icons/mike-pod.4eb29178.webp",
    pin: "#d9a521",
  },
  {
    name: "Keel Retreat Pool",
    href: "https://pool.mikecann.app",
    status: "personal",
    description: "The 3D model and renders for our pool and alfresco build.",
    icon: "/assets/icons/pool.4152b6c2.svg",
    pin: "#3d6f9a",
  },
  {
    name: "Cannvas",
    href: "https://cannvas.mikecann.app",
    status: "private",
    description: "Our family dashboard for a giant touchscreen.",
    icon: "/assets/icons/cannvas.08a443e4.svg",
  },
  {
    name: "Inventory",
    href: "https://inventory.mikecann.app",
    status: "private",
    description: "Find the stuff stored around the house.",
    icon: "/assets/icons/inventory.f9d0f9fa.svg",
    pin: "#2f6f5a",
  },
  {
    name: "Cann Finances",
    href: "https://finances.mikecann.app",
    status: "private",
    description: "Our family finances and spending.",
    icon: "/assets/icons/finances.613d18e4.svg",
    pin: "#d9a521",
  },
  {
    name: "Measured Mike",
    href: "https://health.mikecann.app",
    status: "private",
    description: "My health records over time.",
    icon: "/assets/icons/measured-mike.de4b8447.svg",
    pin: "#3d6f9a",
  },
  {
    name: "Index Sync",
    href: "https://index-sync.mikecann.app",
    status: "private",
    description: "Recordings and transcripts from my Pebble Index ring.",
    icon: "/assets/icons/index-sync.af42b53b.svg",
    pin: "#2f6f5a",
  },
  {
    name: "Agent Archive",
    href: "https://agent-archive.mikecann.app",
    status: "private",
    description: "A searchable archive of my AI agent chats.",
    icon: "/assets/icons/agent-archive.9d9226c5.svg",
  },
];

/** Luggage tags at the bottom. The label is the href without https://. */
export const elsewhere: { name: string; href: string }[] = [
  { name: "Blog", href: "https://mikecann.blog" },
  { name: "Mikerosoft", href: "https://mikerosoft.app" },
  { name: "Let's Build It", href: "https://letsbuildit.app" },
  { name: "Video to Markdown", href: "https://video-to-markdown.com" },
  { name: "GitHub", href: "https://github.com/mikecann" },
  { name: "X", href: "https://x.com/mikeysee" },
];
