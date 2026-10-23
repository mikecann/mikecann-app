import type { App } from "./apps";
import { slug } from "./html";

// The "B4 Scrapbook" look: a dotted paper desk with polaroid prints, washi tape, pins,
// index cards and luggage tags. Per-app colours and positions are generated in appStyles().
const base = `
:root {
  color-scheme: light dark;
  --desk: #f3ede2;
  --dot: rgba(92, 70, 44, .16);
  --ink: #221c16;
  --ink-2: #483e34;
  --muted: #675d51;
  --accent: #c2462a;
  --focus: #c2462a;

  /* Prints, index cards and tags are all "paper" sitting on the desk */
  --print: #fffdf8;
  --print-ink: #221c16;
  --print-mut: #5d5449;
  --print-edge: rgba(60, 40, 20, .08);
  --photo-edge: rgba(0, 0, 0, .08);
  --shadow: 0 1px 1px rgba(70, 48, 24, .12), 0 10px 22px -12px rgba(70, 48, 24, .42), 0 26px 44px -30px rgba(70, 48, 24, .45);
  --shadow-up: 0 2px 2px rgba(70, 48, 24, .1), 0 22px 38px -14px rgba(70, 48, 24, .42), 0 46px 70px -36px rgba(70, 48, 24, .5);
  --tape-alpha: 72%;

  --card: #fffdf6;
  --card-rule: rgba(80, 130, 190, .22);
  --card-red: rgba(214, 82, 70, .55);

  --tag: #ead6aa;
  --tag-ink: #33281a;
  --tag-mut: #66553a;
  --tag-ring: #f6ecd6;
  --cord: #a8936c;

  --serif: ui-serif, "New York", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  --sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  --ease: cubic-bezier(.2, .7, .2, 1);
  --gutter: clamp(20px, 4.4vw, 64px);
}
/* Dark mode is the same desk after sunset: dark prints, kraft tags and dimmer tape. */
@media (prefers-color-scheme: dark) {
  :root {
    --desk: #1c1915;
    --dot: rgba(255, 236, 210, .085);
    --ink: #f1eadf;
    --ink-2: #d8cfc2;
    --muted: #aca193;
    --accent: #f08c66;
    --focus: #f4a582;

    --print: #2a2622;
    --print-ink: #f3ece1;
    --print-mut: #b8ad9f;
    --print-edge: rgba(255, 240, 220, .07);
    --photo-edge: rgba(255, 255, 255, .06);
    --shadow: 0 1px 1px rgba(0, 0, 0, .4), 0 12px 24px -12px rgba(0, 0, 0, .75), 0 28px 46px -30px rgba(0, 0, 0, .8);
    --shadow-up: 0 2px 2px rgba(0, 0, 0, .35), 0 24px 40px -14px rgba(0, 0, 0, .8), 0 48px 72px -36px rgba(0, 0, 0, .85);
    --tape-alpha: 58%;

    --card: #2a2622;
    --card-rule: rgba(140, 180, 230, .14);
    --card-red: rgba(240, 120, 100, .42);

    --tag: #4a3c29;
    --tag-ink: #f5e9d2;
    --tag-mut: #d3c2a3;
    --tag-ring: #5c4b35;
    --cord: #8f7b5a;
  }
}

* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  overflow-x: clip;
  color: var(--ink);
  font-family: var(--sans);
  font-size: 17px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  /* Faint dot-grid notebook paper */
  background: radial-gradient(circle, var(--dot) 1px, transparent 1.5px) 11px 11px / 24px 24px, var(--desk);
}
/* Very light grain so the desk reads as paper stock rather than a flat fill.
   It's a file rather than a data: URL so the CSP can stay at img-src 'self'. */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: .55;
  background-image: url("/assets/grain.3ef36257.svg");
}
a { color: inherit; }
a:focus-visible { outline: 3px solid var(--focus); outline-offset: 6px; border-radius: 4px; }
img { display: block; max-width: 100%; }
h1, h2, h3, p { margin: 0; }
.sprite { position: absolute; }

.wrap { width: min(1200px, 100% - var(--gutter) * 2); margin: 0 auto; }

/* ---------- Header ---------- */
.masthead {
  display: grid;
  grid-template-columns: 236px minmax(0, 1fr);
  align-items: center;
  gap: 40px;
  padding-top: 84px;
}
/* The X photo as a die-cut sticker: white border all the way round, slapped on at a slant. */
.sticker {
  width: 216px;
  height: 216px;
  margin-left: 6px;
  border-radius: 50%;
  padding: 8px;
  background: #fff;
  position: relative;
  transform: rotate(9deg);
  box-shadow: 0 1px 1px rgba(60, 40, 20, .14), 0 14px 26px -12px rgba(60, 40, 20, .45);
}
/* A soft sheen across the vinyl */
.sticker::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, .34) 0 22%, transparent 46%);
  pointer-events: none;
}
.sticker img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; object-position: 50% 40%; }
@media (prefers-color-scheme: dark) {
  .sticker { box-shadow: 0 1px 1px rgba(0, 0, 0, .5), 0 16px 30px -12px rgba(0, 0, 0, .8); }
}
.masthead h1 {
  font-family: var(--serif);
  font-weight: 500;
  font-size: clamp(64px, 10vw, 144px);
  line-height: .9;
  letter-spacing: -.035em;
}
.masthead h1 .pen { position: relative; display: inline-block; font-style: italic; letter-spacing: -.04em; }
/* A quick pen underline, like Mike signed the page. */
.scribble {
  position: absolute;
  left: 2%;
  bottom: -.2em;
  width: 98%;
  height: .26em;
  overflow: visible;
  color: var(--accent);
}
.scribble path { fill: none; stroke: currentColor; stroke-width: 5; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
.masthead p {
  max-width: 26em;
  text-wrap: balance;
  margin-top: 40px;
  font-size: clamp(18px, 1.6vw, 21px);
  line-height: 1.5;
  color: var(--ink-2);
}

/* ---------- Section headings ---------- */
section { margin-top: 112px; }
.section-head {
  display: flex;
  align-items: baseline;
  gap: 20px;
  margin-bottom: 44px;
}
.section-head h2 {
  font-family: var(--serif);
  font-weight: 500;
  font-size: clamp(32px, 3.5vw, 46px);
  line-height: 1.05;
  letter-spacing: -.02em;
}
.section-head.quiet h2 { font-size: clamp(28px, 2.7vw, 36px); }
.section-note {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--muted);
  font-size: 15px;
  white-space: nowrap;
}
.section-note svg { width: 13px; height: 13px; }

/* ---------- The pinboard of prints ---------- */
/* Desktop columns, tilts and nudges for each print come from appStyles(). */
.board {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 36px;
  row-gap: 60px;
  align-items: start;
}

.print {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 14px 14px 0;
  background: var(--print);
  color: var(--print-ink);
  text-decoration: none;
  box-shadow: var(--shadow), inset 0 0 0 1px var(--print-edge);
  transform: rotate(var(--r, 0deg));
  transition: transform .45s var(--ease), box-shadow .45s var(--ease);
}
.print:hover, .print:focus-visible, .print:has(.stretch:focus-visible) {
  z-index: 5;
  transform: rotate(0deg) translateY(-6px) scale(1.012);
  box-shadow: var(--shadow-up), inset 0 0 0 1px var(--print-edge);
}
.print:focus-visible { border-radius: 2px; }

.photo { position: relative; order: -1; background: rgba(0, 0, 0, .08); }
.photo > img { width: 100%; height: auto; }
/* A hairline so dark and light photos both look printed onto the paper. */
.photo::after { content: ""; position: absolute; inset: 0; box-shadow: inset 0 0 0 1px var(--photo-edge); pointer-events: none; }

/* The kind label is a little sticker in the app's own colours, stuck over the photo's edge. */
.kind {
  position: absolute;
  right: 14px;
  bottom: -13px;
  z-index: 1;
  padding: 4px 10px 5px;
  border-radius: 4px;
  background: var(--k-bg, #221c16);
  color: var(--k-fg, #fff);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  transform: rotate(-2.5deg);
  box-shadow: 0 1px 2px rgba(0, 0, 0, .18);
}

.cap { padding: 22px 6px 20px; }
.name { display: flex; align-items: center; gap: 11px; }
.name .ico { width: 28px; height: 28px; border-radius: 7px; flex: none; }
.print h3 {
  font-family: var(--serif);
  font-weight: 500;
  font-size: 27px;
  line-height: 1.1;
  letter-spacing: -.012em;
}
.go { flex: none; width: 13px; height: 13px; margin-left: auto; color: var(--print-mut); transition: transform .35s var(--ease), color .35s var(--ease); }
.print:hover .go { transform: translate(2px, -2px); color: var(--print-ink); }
.cap p { margin-top: 7px; color: var(--print-mut); font-size: 15.5px; line-height: 1.5; max-width: 34em; }

/* Washi tape: translucent, faintly striped, with torn zigzag ends. ::before and ::after are the two strips. */
.print::before, .print::after {
  content: "";
  position: absolute;
  z-index: 2;
  width: 112px;
  height: 30px;
  background:
    repeating-linear-gradient(90deg, rgba(255, 255, 255, .2) 0 5px, transparent 5px 11px),
    color-mix(in srgb, var(--tape) var(--tape-alpha), transparent);
  clip-path: polygon(0 0, 100% 0, 97% 17%, 100% 33%, 97% 50%, 100% 67%, 97% 83%, 100% 100%, 0 100%, 3% 83%, 0 67%, 3% 50%, 0 33%, 3% 17%);
  pointer-events: none;
}
/* One strip across the top middle */
.tape-top::before { top: -15px; left: calc(50% - 56px); transform: rotate(-3deg); }
.tape-top::after { display: none; }
/* Two strips over the top corners */
.tape-corners::before { top: 4px; left: -34px; transform: rotate(-38deg); width: 104px; }
.tape-corners::after { top: 4px; right: -34px; transform: rotate(38deg); width: 104px; }
/* A single strip over one corner */
.tape-left::before { top: 2px; left: -30px; transform: rotate(-36deg); width: 100px; }
.tape-left::after { display: none; }
.tape-right::before { top: 2px; right: -30px; transform: rotate(36deg); width: 100px; }
.tape-right::after { display: none; }

/* A drawing pin instead of tape */
.pin::after { display: none; }
.pin::before {
  top: -9px;
  left: calc(50% - 11px);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  clip-path: none;
  background: radial-gradient(circle at 36% 32%, rgba(255, 255, 255, .85) 0 2.5px, transparent 4px), radial-gradient(circle at 50% 50%, var(--pin) 0 62%, color-mix(in srgb, var(--pin) 70%, #000) 100%);
  box-shadow: 3px 5px 5px -1px rgba(0, 0, 0, .35);
}

/* ---------- The featured print (Poddle) ---------- */
.hero { padding-bottom: 14px; }
.hero-in {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  background: #ebe1d5;
  color: #2b1b12;
}
.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
  padding: 38px 0 40px 40px;
}
.app-icon {
  width: 88px;
  height: 88px;
  border-radius: 21px;
  box-shadow: 0 12px 24px -10px rgba(190, 60, 20, .55), 0 0 0 1px rgba(0, 0, 0, .04);
}
.hero-name { display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; }
.hero h3 { font-size: clamp(50px, 5vw, 70px); line-height: .95; letter-spacing: -.03em; }
/* The hero isn't one big link, so the App Store badge can be its own link once Poddle is out.
   This stretches the name's link over the whole print instead. */
.stretch { text-decoration: none; }
.stretch::after { content: ""; position: absolute; inset: 0; z-index: 3; }
.stretch:focus-visible { outline: none; }
.hero:has(.stretch:focus-visible) { outline: 3px solid var(--focus); outline-offset: 6px; }
.hero-kind { font-size: 14.5px; font-weight: 600; color: #a93a22; }
.hero p { margin: 14px 0 30px; font-size: 18px; line-height: 1.45; color: #5c4639; max-width: 17em; }
.hero-photo { position: relative; min-height: 100%; }
.hero-photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 45%;
}
.hero-photo::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  z-index: 1;
  width: 12%;
  background: linear-gradient(to right, #ebe1d5, transparent);
}
.hero .go { position: absolute; top: 30px; right: 30px; z-index: 1; color: #6b5243; }

.badge-wrap { position: relative; align-self: flex-start; display: inline-block; }
.badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 18px 9px 13px;
  border-radius: 12px;
  background: #000;
  color: #fff;
  text-decoration: none;
  box-shadow: 0 0 0 1px #a6a6a6 inset;
}
/* Once it's a real link it sits above the stretched Poddle link. */
a.badge { z-index: 4; }
.badge svg { width: 25px; height: 30px; fill: #fff; flex: none; margin-top: -3px; }
.badge span { display: grid; line-height: 1.05; }
.badge small { font-size: 11.5px; letter-spacing: .01em; }
.badge b { font-size: 22px; font-weight: 600; letter-spacing: -.02em; }
/* Circled in red pen, because it's the bit Mike's excited about. */
.ring {
  position: absolute;
  left: -22px;
  top: -15px;
  width: calc(100% + 46px);
  height: calc(100% + 30px);
  overflow: visible;
  color: #d6402a;
  pointer-events: none;
}
.ring path { fill: none; stroke: currentColor; stroke-width: 2.6; stroke-linecap: round; vector-effect: non-scaling-stroke; }

/* ---------- Private apps: pinned index cards ---------- */
.cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 40px 36px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.card {
  position: relative;
  display: block;
  height: 100%;
  padding: 0 22px 10px;
  color: var(--print-ink);
  text-decoration: none;
  /* Index card: a red rule under the heading line, then faint blue ruled lines the text sits on. */
  background:
    linear-gradient(var(--card-red), var(--card-red)) 0 66px / 100% 1.5px no-repeat,
    repeating-linear-gradient(to bottom, transparent 0 25px, var(--card-rule) 25px 26px) 0 66px / 100% calc(100% - 66px) no-repeat,
    var(--card);
  box-shadow: var(--shadow), inset 0 0 0 1px var(--print-edge);
  transform: rotate(var(--r, 0deg));
  transition: transform .45s var(--ease), box-shadow .45s var(--ease);
}
.cards li:nth-child(3n + 1) .card { --r: -1deg; }
.cards li:nth-child(3n + 2) .card { --r: .7deg; }
.cards li:nth-child(3n + 3) .card { --r: -.5deg; }
.cards li:nth-child(4) .card { --r: .9deg; }
.cards li:nth-child(6) .card { --r: 1.2deg; }
.card:hover, .card:focus-visible { z-index: 2; transform: rotate(0deg) translateY(-4px); box-shadow: var(--shadow-up), inset 0 0 0 1px var(--print-edge); }
.card::before {
  content: "";
  position: absolute;
  top: -8px;
  left: calc(50% - 10px);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(circle at 36% 32%, rgba(255, 255, 255, .85) 0 2.5px, transparent 4px), radial-gradient(circle, var(--pin, #c2462a) 0 62%, color-mix(in srgb, var(--pin, #c2462a) 70%, #000) 100%);
  box-shadow: 3px 5px 5px -1px rgba(0, 0, 0, .35);
}
.card-head { display: flex; align-items: center; gap: 13px; height: 66px; }
.pico { flex: none; width: 38px; height: 38px; border-radius: 10px; }
.card h3 { font-size: 18px; font-weight: 650; letter-spacing: -.01em; }
.lock {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  color: var(--print-mut);
  font-size: 13px;
  font-weight: 500;
}
.lock svg { width: 12px; height: 12px; }
/* line-height matches the ruled lines so each line of text sits on one */
.card p { padding-top: 4px; color: var(--print-mut); font-size: 15px; line-height: 26px; min-height: 56px; }

/* ---------- Elsewhere: luggage tags ---------- */
.tags {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 34px 44px;
  list-style: none;
  margin: 0;
  padding: 0 0 0 30px;
}
.tag {
  position: relative;
  display: block;
  max-width: 320px;
  height: 100%;
  color: var(--tag-ink);
  text-decoration: none;
  transform: rotate(var(--r, 0deg));
  transform-origin: 0 50%;
  transition: transform .45s var(--ease);
  filter: drop-shadow(0 1px 1px rgba(70, 48, 24, .18)) drop-shadow(0 8px 10px rgba(70, 48, 24, .16));
}
@media (prefers-color-scheme: dark) {
  .tag { filter: drop-shadow(0 1px 1px rgba(0, 0, 0, .5)) drop-shadow(0 8px 10px rgba(0, 0, 0, .4)); }
}
.tags li:nth-child(odd) .tag { --r: -1.2deg; }
.tags li:nth-child(even) .tag { --r: .9deg; }
.tags li:nth-child(3) .tag { --r: 1.6deg; }
.tag:hover, .tag:focus-visible { transform: rotate(0deg) translateX(4px); }
.tag-card {
  display: grid;
  align-content: center;
  gap: 6px;
  height: 100%;
  min-height: 104px;
  padding: 16px 22px 16px 64px;
  background: var(--tag);
  /* Classic shipping tag: the end with the hole has its corners snipped off */
  clip-path: polygon(26px 0, 100% 0, 100% 100%, 26px 100%, 0 calc(100% - 26px), 0 26px);
}
/* Reinforced hole, punched through to the desk */
.tag-card::before {
  content: "";
  position: absolute;
  left: 22px;
  top: calc(50% - 12px);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--desk) 0 6px, var(--tag-ring) 6.5px 100%);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
}
.cord { position: absolute; z-index: 1; left: -38px; top: calc(50% - 30px); width: 72px; height: 60px; overflow: visible; color: var(--cord); pointer-events: none; }
.cord path { fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; }
.el-name { font-family: var(--serif); font-size: 25px; line-height: 1.15; letter-spacing: -.01em; }
.el-url {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--tag-mut);
  font-family: var(--mono);
  font-size: 13px;
}
.el-url svg { width: 11px; height: 11px; transition: transform .3s var(--ease); }
.tag:hover .el-url svg { transform: translate(2px, -2px); }

/* ---------- Footer ---------- */
footer { margin-top: 104px; padding: 0 0 72px; text-align: center; }
.footer-tape {
  display: inline-block;
  padding: 9px 26px 10px;
  color: var(--ink-2);
  font-size: 15px;
  background: color-mix(in srgb, #e3cf9f var(--tape-alpha), transparent);
  clip-path: polygon(0 0, 100% 0, 98.5% 17%, 100% 33%, 98.5% 50%, 100% 67%, 98.5% 83%, 100% 100%, 0 100%, 1.5% 83%, 0 67%, 1.5% 50%, 0 33%, 1.5% 17%);
  transform: rotate(-1.2deg);
}
@media (prefers-color-scheme: dark) {
  .footer-tape { background: color-mix(in srgb, #8a7550 60%, transparent); }
}

/* ---------- Tablet ---------- */
@media (max-width: 1100px) {
  .masthead { grid-template-columns: 190px minmax(0, 1fr); gap: 32px; }
  .sticker { width: 180px; height: 180px; padding: 7px; }
  .board { grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 32px; }
  .board > .hero { grid-column: 1 / -1; }
  .board > :nth-child(odd of .print:not(.hero)) { margin-top: 30px; }
  .hero-copy { padding: 32px 0 34px 32px; }
  .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .tags { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* ---------- Phone ---------- */
@media (max-width: 700px) {
  body { font-size: 16px; background-size: 22px 22px, auto; }
  .masthead {
    grid-template-columns: 128px minmax(0, 1fr);
    grid-template-areas: "pic name" "text text";
    gap: 0 22px;
    padding-top: 40px;
  }
  .intro { display: contents; }
  .sticker { grid-area: pic; width: 128px; height: 128px; padding: 5px; margin-left: 2px; }
  .masthead h1 { grid-area: name; align-self: center; font-size: 60px; line-height: .92; }
  .masthead h1 .pen { display: block; width: max-content; }
  .masthead p { grid-area: text; margin-top: 34px; font-size: 18px; }
  section { margin-top: 80px; }
  .section-head { flex-direction: column; align-items: flex-start; gap: 8px; margin-bottom: 34px; }

  .board { grid-template-columns: minmax(0, 1fr); row-gap: 48px; }
  .board > .print, .board > :nth-child(odd of .print:not(.hero)) { margin: 0; }
  /* Stacked in one column, alternating gently left and right */
  .board > .print:nth-child(odd) { --r: -1.1deg; }
  .board > .print:nth-child(even) { --r: 1.1deg; }
  .print { padding: 11px 11px 0; }
  .cap { padding: 20px 4px 18px; }
  .print h3 { font-size: 25px; }
  .cap p { font-size: 15px; }
  .hero { padding-bottom: 11px; }
  /* Prints fill the screen width here, so diagonal corner tape would run off the edge.
     Stick it along the top edge near the corners instead. */
  .tape-corners::before, .tape-left::before { top: -13px; left: 14px; width: 72px; height: 26px; transform: rotate(-5deg); }
  .tape-corners::after, .tape-right::before { top: -13px; right: 14px; width: 72px; height: 26px; transform: rotate(4deg); }
  .hero-in { grid-template-columns: minmax(0, 1fr); }
  .hero-copy { padding: 26px 22px 30px; gap: 20px; }
  .app-icon { width: 70px; height: 70px; border-radius: 16px; }
  .hero h3 { font-size: 50px; }
  .hero p { margin: 12px 0 26px; font-size: 16.5px; }
  .hero-photo { min-height: 0; aspect-ratio: 1 / 1; }
  .hero-photo img { object-position: 50% 42%; }
  .hero .go { top: 28px; right: 24px; }
  .ring { left: -18px; width: calc(100% + 38px); }

  .cards { grid-template-columns: minmax(0, 1fr); gap: 30px; }
  .card p { min-height: 30px; }
  .tags { grid-template-columns: minmax(0, 1fr); gap: 20px; padding-left: 26px; }
  /* Hung at slightly different spots down the page rather than one stiff column */
  .tags li:nth-child(even) .tag { margin-left: 22px; }
  .tag { max-width: 290px; }
  .tag-card { min-height: 88px; padding: 14px 18px 14px 60px; }
  .el-name { font-size: 23px; }
  footer { margin-top: 80px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition: none !important; }
  /* Keep everything where it is; hover and focus only lift the shadow. */
  .print:hover, .print:focus-visible, .print:has(.stretch:focus-visible), .card:hover, .card:focus-visible { transform: rotate(var(--r, 0deg)); }
  .tag:hover, .tag:focus-visible { transform: rotate(var(--r, 0deg)); }
  .print:hover .go, .tag:hover .el-url svg { transform: none; }
}
`;

/** Each app's colours, tilt and desktop position, keyed by a class made from its name. */
function appStyles(apps: App[]): string {
  const rules = apps.map((app) => {
    const cls = `.a-${slug(app.name)}`;
    if (app.status === "private") return app.pin ? `${cls} { --pin: ${app.pin}; }` : "";
    const { span, tilt, nudge, stuck, sticker } = app.print;
    const vars = [`--r: ${tilt}deg`, `${stuck.with === "pin" ? "--pin" : "--tape"}: ${stuck.color}`];
    if (sticker) vars.push(`--k-bg: ${sticker.background}`, `--k-fg: ${sticker.text}`);
    const margin = `${nudge?.top ?? 0}px ${nudge?.right ?? 0}px 0 ${nudge?.left ?? 0}px`;
    return `${cls} { ${vars.join("; ")}; }\n@media (min-width: 1101px) { ${cls} { grid-column: span ${span}; margin: ${margin}; } }`;
  });
  return rules.filter(Boolean).join("\n");
}

export function styles(apps: App[]): string {
  return `${base}\n${appStyles(apps)}\n`;
}
