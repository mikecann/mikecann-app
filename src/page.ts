import { APP_STORE_LIVE, apps, elsewhere, isCard, type CardApp, type PrintApp } from "./apps";
import { escapeHtml, slug } from "./html";
import { styles } from "./styles";

const TITLE = "Mike's Apps";
const DESCRIPTION = "The apps Mike Cann has built that are still up and running.";

const arrow = `<svg class="go" aria-hidden="true"><use href="#arrow"/></svg>`;
const lock = `<svg aria-hidden="true"><use href="#lock"/></svg>`;

function icon(src: string | undefined, className: string): string {
  return src ? `<img class="${className}" src="${escapeHtml(src)}" width="64" height="64" alt="">` : "";
}

function photo(app: PrintApp, eager: boolean): string {
  const { src, width, height, alt } = app.image;
  const loading = eager ? `fetchpriority="high"` : `loading="lazy"`;
  return `<img src="${escapeHtml(src)}" width="${width}" height="${height}" alt="${escapeHtml(alt)}" ${loading} decoding="async">`;
}

function appStoreBadge(app: PrintApp): string {
  if (!app.appStore) return "";
  const apple = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.960-1.040-2.040.027-3.910 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.090 1.013 1.454 2.208 3.090 3.792 3.039 1.520-.065 2.090-.987 3.935-.987 1.831 0 2.350.987 3.960.948 1.637-.026 2.676-1.480 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.220-4.857-.026-3.040 2.480-4.494 2.597-4.559-1.429-2.090-3.623-2.324-4.390-2.376-2-.156-3.675 1.090-4.610 1.090zM15.530 3.830c.843-1.012 1.400-2.427 1.245-3.830-1.207.052-2.662.805-3.532 1.818-.780.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>`;
  const ring = `<svg class="ring" viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true"><path d="M150 7C116 1 52 2 24 12 6 19 1 34 6 50c6 19 42 27 94 27 50 0 88-7 95-27 6-17-4-33-30-41-22-7-58-8-84-5"/></svg>`;
  const badge = APP_STORE_LIVE
    ? `<a class="badge" href="${escapeHtml(app.appStore)}">${apple}<span><b>App Store</b></span></a>`
    : `<span class="badge">${apple}<span><small>Coming soon to the</small><b>App Store</b></span></span>`;
  return `<span class="badge-wrap">${badge}${ring}</span>`;
}

function featuredPrint(app: PrintApp): string {
  return `
          <div class="print hero a-${slug(app.name)} ${app.print.stuck.with}">
            <div class="hero-in">
              <div class="hero-copy">
                ${icon(app.icon, "app-icon")}
                <div>
                  <div class="hero-name">
                    <h3><a class="stretch" href="${escapeHtml(app.href)}">${escapeHtml(app.name)}</a></h3>
                    <span class="hero-kind">${escapeHtml(app.kind)}</span>
                  </div>
                  <p>${escapeHtml(app.description)}</p>
                  ${appStoreBadge(app)}
                </div>
              </div>
              <div class="hero-photo">${photo(app, true)}</div>
            </div>
            ${arrow}
          </div>`;
}

function print(app: PrintApp, index: number): string {
  if (app.featured) return featuredPrint(app);
  return `
          <a class="print a-${slug(app.name)} ${app.print.stuck.with}" href="${escapeHtml(app.href)}">
            <div class="cap">
              <div class="name">${icon(app.icon, "ico")}<h3>${escapeHtml(app.name)}</h3>${arrow}</div>
              <p>${escapeHtml(app.description)}</p>
            </div>
            <div class="photo">
              ${photo(app, index < 2)}
              <span class="kind">${escapeHtml(app.kind)}</span>
            </div>
          </a>`;
}

function card(app: CardApp): string {
  // Locked cards say so. Ones anyone can open get the same arrow as the prints.
  const corner = app.status === "private" ? `<span class="lock">${lock}Private</span>` : arrow;
  return `
          <li class="${app.status}">
            <a class="card a-${slug(app.name)}" href="${escapeHtml(app.href)}">
              <div class="card-head">${icon(app.icon, "pico")}<h3>${escapeHtml(app.name)}</h3>${corner}</div>
              <p>${escapeHtml(app.description)}</p>
            </a>
          </li>`;
}

function tag(link: { name: string; href: string }): string {
  const cord = `<svg class="cord" viewBox="0 0 72 60" aria-hidden="true"><path d="M72 30C58 30 48 21 36 19S12 21 2 36"/></svg>`;
  const label = link.href.replace(/^https?:\/\//, "");
  return `
          <li><a class="tag" href="${escapeHtml(link.href)}">${cord}<span class="tag-card"><span class="el-name">${escapeHtml(link.name)}</span><span class="el-url">${escapeHtml(label)}<svg aria-hidden="true"><use href="#arrow"/></svg></span></span></a></li>`;
}

const printApps = apps.filter((app): app is PrintApp => !isCard(app));
const cardApps = apps.filter(isCard);

/** The page's only stylesheet. index.ts hashes it for the CSP. */
export const css = styles(apps);

export const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#f3ede2" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#1c1915" media="(prefers-color-scheme: dark)">
  <meta name="description" content="${escapeHtml(DESCRIPTION)}">
  <meta property="og:title" content="${escapeHtml(TITLE)}">
  <meta property="og:description" content="${escapeHtml(DESCRIPTION)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://mikecann.app/">
  <title>${escapeHtml(TITLE)}</title>
  <link rel="icon" type="image/png" href="/assets/favicon.eca86a18.png">
  <style>${css}</style>
</head>
<body>
  <!-- One arrow and one lock, reused everywhere -->
  <svg class="sprite" width="0" height="0" aria-hidden="true">
    <symbol id="arrow" viewBox="0 0 12 12"><path d="M3 9 9 3M4 3h5v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="lock" viewBox="0 0 12 12"><rect x="2" y="5.2" width="8" height="5.8" rx="1.4" fill="currentColor"/><path d="M4 5.4V3.9a2 2 0 0 1 4 0v1.5" fill="none" stroke="currentColor" stroke-width="1.4"/></symbol>
  </svg>

  <div class="wrap">
    <header class="masthead">
      <div class="sticker">
        <img src="/assets/mike.9f8ff4b9.webp" width="400" height="400" alt="Mike in a black cap, grinning at the camera">
      </div>
      <div class="intro">
        <h1>Mike’s <span class="pen">Apps<svg class="scribble" viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden="true"><path d="M4 20c38-8 96-13 160-12 46 1 86 4 132 1M58 26c52-6 120-8 190-4"/></svg></span></h1>
        <!-- The &nbsp; keeps "I've built" together when the line is balanced -->
        <p>Hi, I'm Mike. These are the apps I've&nbsp;built that are still up and running.</p>
      </div>
    </header>

    <main>
      <section aria-labelledby="open-apps">
        <div class="section-head">
          <h2 id="open-apps">Things you can use</h2>
        </div>
        <div class="board">${printApps.map(print).join("")}
        </div>
      </section>

      <section aria-labelledby="personal-apps">
        <div class="section-head quiet">
          <h2 id="personal-apps">Just for me and the family</h2>
          <span class="section-note">${lock}The locked ones need a sign-in.</span>
        </div>
        <ul class="cards">${cardApps.map(card).join("")}
        </ul>
      </section>

      <section aria-labelledby="elsewhere">
        <div class="section-head quiet">
          <h2 id="elsewhere">Elsewhere</h2>
        </div>
        <ul class="tags">${elsewhere.map(tag).join("")}
        </ul>
      </section>
    </main>

    <footer><span class="footer-tape">Made in Perth, Western Australia.</span></footer>
  </div>
</body>
</html>`;
