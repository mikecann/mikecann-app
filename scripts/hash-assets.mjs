// Gives every file in public/assets a content hash in its name (wormquake.webp -> wormquake.3f9a1c2b.webp)
// and updates the paths in src/ to match. The Worker caches assets for a year as immutable, so a changed
// image has to get a new URL or visitors would keep seeing the old one.
//
//   node scripts/hash-assets.mjs           rename new or changed files and fix the paths in src/
//   node scripts/hash-assets.mjs --check   fail if anything is unhashed, stale, missing or unused
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(import.meta.dirname, "..");
const publicDir = join(root, "public");
const srcDir = join(root, "src");
const check = process.argv.includes("--check");

const sources = readdirSync(srcDir, { recursive: true })
  .filter((file) => file.endsWith(".ts"))
  .map((file) => join(srcDir, file));
const problems = [];
const renames = new Map();

for (const entry of readdirSync(join(publicDir, "assets"), { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || entry.name.startsWith(".")) continue;
  const file = join(entry.parentPath, entry.name);
  const [, base, , ext] = entry.name.match(/^(.*?)(\.[0-9a-f]{8})?(\.[a-z0-9]+)$/i);
  const hash = createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 8);
  const wanted = `${base}.${hash}${ext}`;
  if (entry.name === wanted) continue;
  const url = (name) => "/" + relative(publicDir, join(entry.parentPath, name));
  if (check) problems.push(`${url(entry.name)} should be named ${wanted}. Run npm run assets.`);
  else {
    renameSync(file, join(entry.parentPath, wanted));
    renames.set(url(entry.name), url(wanted));
  }
}

for (const source of sources) {
  let text = readFileSync(source, "utf8");
  for (const [from, to] of renames) text = text.replaceAll(`"${from}"`, `"${to}"`);
  if (renames.size) writeFileSync(source, text);
}
for (const [from, to] of renames) console.log(`${from} -> ${to}`);

// Every /assets path in src/ should exist, and every file should be used by the page.
const referenced = new Set(sources.flatMap((source) => readFileSync(source, "utf8").match(/\/assets\/[\w./-]+/g) ?? []));
for (const path of referenced) {
  if (!existsSync(join(publicDir, path))) problems.push(`${path} is used in src/ but missing from public/.`);
}
for (const entry of readdirSync(join(publicDir, "assets"), { recursive: true, withFileTypes: true })) {
  const path = "/" + relative(publicDir, join(entry.parentPath, entry.name));
  if (entry.isFile() && !entry.name.startsWith(".") && !referenced.has(path)) problems.push(`${path} isn't used by the page.`);
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
