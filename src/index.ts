const projects = [
  {
    name: "Index Sync",
    description: "Recordings, transcripts and follow-up tasks.",
    href: "https://index-sync.mikecann.app",
    icon: "🎙️",
    colors: ["#1d4ed8", "#60a5fa"],
  },
  {
    name: "Mike Pod",
    description: "Deep research for a curious mind.",
    href: "https://podcast.mikecann.app",
    icon: "🎧",
    colors: ["#7c3aed", "#c084fc"],
  },
  {
    name: "Cannvas",
    description: "The family dashboard built for a giant touchscreen.",
    href: "https://cannvas.mikecann.app",
    icon: "🏠",
    colors: ["#ea580c", "#fb923c"],
  },
  {
    name: "StashIt",
    description: "A home for useful things worth keeping.",
    href: "https://stashit.mikecann.app",
    icon: "📦",
    colors: ["#059669", "#34d399"],
  },
  {
    name: "Wolfram Physics Notes",
    description: "Notes and research on the Wolfram Physics Project.",
    href: "https://physics.mikecann.app",
    icon: "🪐",
    colors: ["#be123c", "#fb7185"],
  },
  {
    name: "Questions",
    description: "Interesting questions, collected in one place.",
    href: "https://questions.mikecann.app",
    icon: "❔",
    colors: ["#0891b2", "#22d3ee"],
  },
  {
    name: "The Convex 100",
    description: "One hundred languages, one Convex challenge.",
    href: "https://the-convex-100-language-challenge.mikecann.app",
    icon: "💯",
    colors: ["#ca8a04", "#facc15"],
  },
] as const;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function projectCard(project: (typeof projects)[number]): string {
  const [from, to] = project.colors;
  return `
    <a class="app" href="${escapeHtml(project.href)}">
      <span class="icon" aria-hidden="true" style="--from:${from};--to:${to}">${project.icon}</span>
      <span class="copy">
        <strong>${escapeHtml(project.name)}</strong>
        <span>${escapeHtml(project.description)}</span>
      </span>
      <span class="arrow" aria-hidden="true">›</span>
    </a>`;
}

function page(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#f2f2f7">
  <meta name="description" content="Projects, tools and experiments by Mike Cann.">
  <meta property="og:title" content="Mike Cann">
  <meta property="og:description" content="Projects, tools and experiments by Mike Cann.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://mikecann.app/">
  <title>Mike Cann</title>
  <style>
    :root { color-scheme: light dark; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; color: #1c1c1e; background: #f2f2f7; }
    main { width: min(1120px, calc(100% - 40px)); margin: 0 auto; padding: max(72px, env(safe-area-inset-top)) 0 max(64px, env(safe-area-inset-bottom)); }
    header { margin-bottom: 44px; }
    h1 { margin: 0; font-size: clamp(44px, 8vw, 76px); line-height: .95; letter-spacing: -.055em; }
    header p { max-width: 620px; margin: 20px 0 0; color: #636366; font-size: clamp(19px, 2.3vw, 25px); line-height: 1.35; letter-spacing: -.015em; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
    .app { display: grid; grid-template-columns: 88px 1fr auto; gap: 20px; align-items: center; min-height: 126px; padding: 19px; color: inherit; text-decoration: none; border: 1px solid rgba(60,60,67,.12); border-radius: 30px; background: rgba(255,255,255,.78); box-shadow: 0 14px 36px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.8); backdrop-filter: blur(20px); transition: transform 160ms ease, box-shadow 160ms ease; }
    .app:hover { transform: translateY(-3px); box-shadow: 0 20px 44px rgba(0,0,0,.1), inset 0 1px 0 rgba(255,255,255,.9); }
    .app:focus-visible { outline: 4px solid #0a84ff; outline-offset: 4px; }
    .icon { display: grid; width: 88px; height: 88px; place-items: center; border-radius: 22px; font-size: 45px; background: linear-gradient(145deg, var(--to), var(--from)); box-shadow: inset 0 1px 1px rgba(255,255,255,.45), inset 0 -1px 1px rgba(0,0,0,.12), 0 9px 20px color-mix(in srgb, var(--from) 28%, transparent); }
    .copy { display: grid; gap: 7px; min-width: 0; }
    .copy strong { font-size: 22px; letter-spacing: -.025em; }
    .copy span { color: #636366; font-size: 15px; line-height: 1.35; }
    .arrow { color: #aeaeb2; font-size: 36px; font-weight: 300; }
    footer { margin-top: 42px; color: #8e8e93; font-size: 14px; }
    @media (max-width: 760px) {
      main { width: min(100% - 28px, 560px); padding-top: 48px; }
      header { margin-bottom: 30px; }
      .grid { grid-template-columns: 1fr; gap: 13px; }
      .app { grid-template-columns: 72px 1fr auto; min-height: 104px; padding: 16px; border-radius: 25px; }
      .icon { width: 72px; height: 72px; border-radius: 18px; font-size: 37px; }
      .copy strong { font-size: 19px; }
    }
    @media (prefers-reduced-motion: reduce) { .app { transition: none; } }
    @media (prefers-color-scheme: dark) {
      body { color: #f5f5f7; background: #000; }
      header p, .copy span { color: #a1a1a6; }
      .app { border-color: rgba(255,255,255,.12); background: rgba(28,28,30,.82); box-shadow: inset 0 1px 0 rgba(255,255,255,.08); }
      .app:hover { box-shadow: 0 18px 42px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.1); }
      .arrow { color: #636366; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>Mike Cann</h1>
      <p>Things I've made, tools I use, and experiments that got interesting enough to keep.</p>
    </header>
    <section class="grid" aria-label="Projects">${projects.map(projectCard).join("")}</section>
    <footer>Made in Perth, Western Australia.</footer>
  </main>
</body>
</html>`;
}

export default {
  async fetch(request): Promise<Response> {
    const url = new URL(request.url);
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }
    if (url.hostname === "www.mikecann.app") {
      url.hostname = "mikecann.app";
      return Response.redirect(url.toString(), 308);
    }
    if (url.pathname !== "/") return new Response("Not found", { status: 404 });

    const headers = new Headers({
      "Cache-Control": "public, max-age=300",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      "Content-Type": "text/html; charset=utf-8",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Content-Type-Options": "nosniff",
    });
    return new Response(request.method === "HEAD" ? null : page(), { headers });
  },
} satisfies ExportedHandler;
