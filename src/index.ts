import { css, html } from "./page";

// The page is the same for every request, so the CSP can allow exactly its one <style> block
// by hash instead of falling back to style-src 'unsafe-inline'. Web Crypto is async and can't
// run while the module loads, so the headers are built on the first request and reused.
let pageHeaders: Promise<Record<string, string>> | undefined;

async function buildPageHeaders(): Promise<Record<string, string>> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(css));
  const styleHash = btoa(Array.from(new Uint8Array(digest), (byte) => String.fromCharCode(byte)).join(""));
  return {
    "Cache-Control": "public, max-age=300",
    // The only script is the Cloudflare Web Analytics beacon, which Cloudflare injects into the
    // HTML on the way out. It loads from static.cloudflareinsights.com and reports back to this
    // site's own /cdn-cgi/rum, hence script-src for that host and connect-src 'self'.
    "Content-Security-Policy": `default-src 'none'; script-src https://static.cloudflareinsights.com; connect-src 'self'; style-src 'sha256-${styleHash}'; img-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,
    "Content-Type": "text/html; charset=utf-8",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
  };
}

function notFound(): Response {
  return new Response("Not found", { status: 404 });
}

async function asset(request: Request, env: Env): Promise<Response> {
  const response = await env.ASSETS.fetch(request);
  if (!response.ok && response.status !== 304) return notFound();
  const headers = new Headers(response.headers);
  // Every file in public/assets has a content hash in its name (npm run assets), so a changed
  // image gets a new URL and browsers can keep the old one for a year without asking again.
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(response.body, { status: response.status, headers });
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }
    if (url.hostname === "www.mikecann.app") {
      url.hostname = "mikecann.app";
      return Response.redirect(url.toString(), 308);
    }
    if (url.pathname === "/") {
      pageHeaders ??= buildPageHeaders();
      return new Response(request.method === "HEAD" ? null : html, { headers: await pageHeaders });
    }
    if (url.pathname.startsWith("/assets/")) return asset(request, env);
    return notFound();
  },
} satisfies ExportedHandler<Env>;
