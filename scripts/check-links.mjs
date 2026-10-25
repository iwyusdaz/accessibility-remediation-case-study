// Whole-site link/image/fragment checker for the case study deployment.
// Usage:
//   node scripts/check-links.mjs <docs-dir>            # local (filesystem) mode
//   node scripts/check-links.mjs <base-url>            # live mode (crawl + fetch)
//
// Checks, per page:
//   - every href/src (a, link, img, source, track, video, script, iframe)
//     resolves INSIDE the deployment root (flags "../" prefix escapes)
//   - every local target exists (filesystem or HTTP status)
//   - every same-site fragment target (#id) exists in the target page
//   - every <img> src exists and (live mode) returns 200
//
// This replaces the earlier single-page, same-origin crawl that was blind to
// image targets, prefix-escaping hrefs and fragment targets (agent review
// F12/F2/F3, 2026-10-26). Results: linkcheck-results/<slug>.json
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve, posix } from "node:path";

const arg = process.argv[2];
const includeBefore = process.argv.includes("--include-before");
if (!arg) {
  console.error("Usage: node scripts/check-links.mjs <docs-dir | base-url> [--include-before]");
  process.exit(2);
}
const ATTR = /(?:href|src|poster)\s*=\s*"([^"]*)"/g;
const ID = /id\s*=\s*"([^"]*)"/g;
const SKIP = /^(mailto:|tel:|javascript:|data:)/i;

// strip code samples so documented-broken examples (e.g. href="#?w=535" quoted
// in prose) are not scanned as real attributes
function stripCode(html) {
  return html.replace(/<(code|pre|kbd|samp)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
}

function listHtml(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...listHtml(p));
    else if (/\.x?html?$/i.test(e.name)) out.push(p);
  }
  return out;
}

const results = { mode: "", start: arg, pagesChecked: 0, linksChecked: 0, imagesChecked: 0, fragmentsChecked: 0, externalSkipped: 0, broken: [], generatedAt: new Date().toISOString() };
const seenFragCache = new Map(); // file path or url -> Set of ids

function idsOfLocal(file) {
  if (seenFragCache.has(file)) return seenFragCache.get(file);
  const ids = new Set();
  if (existsSync(file)) {
    const html = readFileSync(file, "utf8");
    for (const m of html.matchAll(ID)) ids.add(m[1]);
  }
  seenFragCache.set(file, ids);
  return ids;
}

// ---------- local (filesystem) mode ----------
function runLocal(root) {
  results.mode = "local";
  root = resolve(root);
  // default scope: the published site. The preserved original (docs/before/)
  // is excluded unless --include-before: it is the 2011–2012 snapshot kept as
  // retrieved, dead external navigation included (it is the audit SUBJECT).
  for (const file of listHtml(root)) {
    const relPage0 = file.slice(root.length + 1);
    if (!includeBefore && (relPage0 === "before" || relPage0.startsWith("before/"))) continue;
    results.pagesChecked += 1;
    const html = stripCode(readFileSync(file, "utf8"));
    const relPage = relPage0;
    for (const m of html.matchAll(ATTR)) {
      const raw = m[1];
      if (!raw || SKIP.test(raw)) continue;
      if (/^https?:/i.test(raw)) { results.externalSkipped += 1; continue; }
      results.linksChecked += 1;
      const [pathPart, frag] = raw.split("#");
      const target = resolve(dirname(file), pathPart || file);
      const relTarget = target.slice(root.length + 1);
      if (!target.startsWith(root)) {
        results.broken.push({ page: relPage, ref: raw, reason: "escapes the deployment root (prefix escape)" });
        continue;
      }
      if (pathPart && !existsSync(target)) {
        results.broken.push({ page: relPage, ref: raw, reason: "target not found" });
        continue;
      }
      if (pathPart && /\.(x?html?)$/i.test(target) === false) results.imagesChecked += 1;
      if (frag !== undefined) {
        results.fragmentsChecked += 1;
        if (!pathPart && !/\.(x?html?)$/i.test(file)) continue;
        const ids = idsOfLocal(pathPart ? target : file);
        if (!ids.has(frag)) results.broken.push({ page: relPage, ref: raw, reason: "fragment target not found" });
      }
    }
  }
}

// ---------- live mode ----------
async function fetchIds(url) {
  if (seenFragCache.has(url)) return seenFragCache.get(url);
  const ids = new Set();
  try {
    const res = await fetch(url);
    if (res.ok) {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("text/html")) {
        const html = await res.text();
        for (const m of html.matchAll(ID)) ids.add(m[1]);
      }
    }
  } catch { /* network error handled by caller */ }
  seenFragCache.set(url, ids);
  return ids;
}

async function runLive(base) {
  results.mode = "live";
  const baseU = new URL(base);
  const prefix = baseU.pathname.replace(/[^/]*$/, ""); // deployment prefix
  const queue = [baseU.href];
  const seen = new Set();
  while (queue.length && seen.size < 300) {
    const url = queue.shift();
    if (seen.has(url)) continue;
    seen.add(url);
    let res;
    try { res = await fetch(url, { redirect: "follow" }); }
    catch (e) { results.broken.push({ page: url, ref: url, reason: "fetch error: " + e.message }); continue; }
    if (res.status !== 200) { results.broken.push({ page: url, ref: url, reason: "HTTP " + res.status }); continue; }
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("text/html")) continue;
    results.pagesChecked += 1;
    const html = stripCode(await res.text());
    for (const m of html.matchAll(ATTR)) {
      const raw = m[1];
      if (!raw || SKIP.test(raw)) continue;
      if (/^https?:/i.test(raw) && !raw.startsWith(baseU.origin)) { results.externalSkipped += 1; continue; }
      results.linksChecked += 1;
    const u = new URL(raw, url);
    const [pathPart, frag] = [u.pathname + u.search, u.hash.slice(1)];
    // preserved-original pages are out of scope as referrers in live mode too
    const uPath = u.pathname.startsWith(prefix) ? u.pathname.slice(prefix.length) : u.pathname;
    if (!includeBefore && (uPath === "before" || uPath.startsWith("before/"))) continue;
      if (u.origin === baseU.origin && !u.pathname.startsWith(prefix)) {
        results.broken.push({ page: url, ref: raw, reason: `resolves outside the deployment prefix (${prefix})` });
        continue;
      }
      const target = u.origin + pathPart;
      const isHtml = /\.(x?html?)$/i.test(pathPart) || pathPart.endsWith("/");
      if (!isHtml) {
        results.imagesChecked += 1;
        try {
          const r2 = await fetch(target, { method: "HEAD" });
          if (r2.status === 405) { const r3 = await fetch(target); if (r3.status !== 200) { results.broken.push({ page: url, ref: raw, reason: "HTTP " + r3.status }); continue; } }
          else if (r2.status !== 200) results.broken.push({ page: url, ref: raw, reason: "HTTP " + r2.status });
        } catch (e) { results.broken.push({ page: url, ref: raw, reason: "fetch error: " + e.message }); }
        continue;
      }
      const targetUrl = pathPart.endsWith("/") ? target.replace(/\/$/, "/index.html") : target;
      if (frag !== undefined || !seen.has(targetUrl)) {
        if (frag !== undefined) {
          results.fragmentsChecked += 1;
          const ids = await fetchIds(targetUrl);
          if (!ids.has(frag)) results.broken.push({ page: url, ref: raw, reason: "fragment target not found" });
        }
      }
      if (!seen.has(targetUrl) && !queue.includes(targetUrl) && seen.size + queue.length < 300) {
        // queue html pages for crawling
        const head = await fetch(targetUrl, { method: "HEAD" }).catch(() => null);
        if (head && head.ok && (head.headers.get("content-type") || "").includes("text/html")) queue.push(targetUrl);
      }
    }
  }
}

if (/^https?:\/\//i.test(arg)) await runLive(arg);
else runLocal(arg);

const slug = (results.mode === "live" ? new URL(arg).host + "_live" : "local_docs");
mkdirSync("linkcheck-results", { recursive: true });
writeFileSync(`linkcheck-results/${slug}.json`, JSON.stringify(results, null, 2));
console.log(`Mode: ${results.mode} | pages: ${results.pagesChecked}, refs: ${results.linksChecked} (incl. ${results.imagesChecked} non-HTML targets), fragments: ${results.fragmentsChecked}, external skipped: ${results.externalSkipped}`);
console.log(`Broken: ${results.broken.length}`);
for (const b of results.broken) console.log(`  BROKEN: ${b.ref} (on ${b.page}) — ${b.reason}`);
process.exit(results.broken.length ? 1 : 0);
