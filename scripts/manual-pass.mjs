// Scripted manual pass: keyboard tab-through + focus visibility, 320px reflow,
// 400% zoom reflow, and rendered color-contrast measurement.
//
// Usage: node scripts/manual-pass.mjs <label> <url> [<url>...]
//   label: folder name under audit/manual-evidence/ (e.g. "before", "after")
// Output: JSON results + screenshots in audit/manual-evidence/<label>/
//
// This is AGENT-WITH-SCRIPTED-TOOLS evidence: it proves keyboard operability,
// focus visibility, reflow and measured contrast ratios. It is NOT screen-reader
// testing and NOT a substitute for human/AT review (see audit/methodology.md).

import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const label = process.argv[2];
const urls = process.argv.slice(3);
if (!label || !urls.length) {
  console.error("Usage: node scripts/manual-pass.mjs <label> <url> [...]");
  process.exit(2);
}
const OUT = join(ROOT, "audit", "manual-evidence", label);
mkdirSync(OUT, { recursive: true });

// ---------- contrast helpers ----------
function luminance(r, g, b) {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(rgb1, rgb2) {
  const l1 = luminance(...rgb1), l2 = luminance(...rgb2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
function parseColor(c) {
  const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m) return null;
  return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
}

const PAGE_CHECKS = `() => {
  const parse = (c) => { const m = c.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/); return m ? {r:+m[1],g:+m[2],b:+m[3],a:m[4]===undefined?1:+m[4]} : null; };
  const lum = (r,g,b) => { const f=(c)=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
  const ratio = (a,b) => { const l1=lum(a.r,a.g,a.b), l2=lum(b.r,b.g,b.b); return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05); };
  const out = { contrastFailures: [], headings: [], altIssues: [], linkTexts: [], landmarks: [], lang: document.documentElement.getAttribute('lang'), title: document.title };
  // landmarks
  for (const el of document.querySelectorAll('header,nav,main,footer,aside,[role="banner"],[role="navigation"],[role="main"],[role="contentinfo"],[role="complementary"]'))
    out.landmarks.push((el.tagName + (el.getAttribute('role') ? '['+el.getAttribute('role')+']' : '')).toLowerCase());
  // headings
  for (const h of document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
    out.headings.push({ level: +h.tagName[1], text: (h.textContent || '').trim().slice(0, 80) });
  // images
  for (const img of document.images) {
    const alt = img.getAttribute('alt');
    out.altIssues.push({ src: (img.currentSrc || img.src || '').split('/').pop().slice(0, 60), alt: alt === null ? 'MISSING' : (alt === '' ? '(empty)' : alt.slice(0, 80)) });
  }
  // links (visible, in-page)
  for (const a of document.querySelectorAll('a[href]')) {
    const r = a.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    out.linkTexts.push((a.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 70));
  }
  // contrast: elements with direct text
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const t = walker.currentNode;
    if (!t.textContent.trim()) continue;
    const el = t.parentElement;
    if (!el || seen.has(el)) continue;
    seen.add(el);
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const fg = parse(cs.color);
    if (!fg) continue;
    // find effective background
    let bg = null, node = el;
    while (node && node !== document.documentElement) {
      const b = parse(getComputedStyle(node).backgroundColor);
      if (b && b.a > 0.9) { bg = b; break; }
      node = node.parentElement;
    }
    if (!bg) { bg = { r: 255, g: 255, b: 255, a: 1 }; }
    const px = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight) || 400;
    const large = px >= 24 || (px >= 18.66 && weight >= 700);
    const req = large ? 3 : 4.5;
    const cr = ratio(fg, bg);
    if (cr < req) {
      out.contrastFailures.push({
        text: t.textContent.trim().slice(0, 60), fg: cs.color, bg: 'rgb(' + bg.r + ',' + bg.g + ',' + bg.b + ')',
        ratio: Math.round(cr * 100) / 100, required: req, fontSize: px + 'px', weight
      });
    }
  }
  out.contrastFailures = out.contrastFailures.slice(0, 25);
  return out;
}`;

async function checkPage(browser, url, pageName) {
  const result = { url, name: pageName, keyboard: {}, reflow320: {}, zoom400: {}, contrast: {} };

  // --- pass 1: keyboard + tab stops + focus visibility ---
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load" });

  // baseline styles for focus comparison
  const stops = [];
  let prevStopKey = null, cycleCount = 0, trapDetected = false;
  const seenKeys = new Map();
  for (let i = 0; i < 120; i++) {
    await page.keyboard.press("Tab");
    const stop = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      let name = el.getAttribute("aria-label") || "";
      if (!name && el.getAttribute("aria-labelledby")) {
        const ref = document.getElementById(el.getAttribute("aria-labelledby"));
        if (ref) name = ref.textContent.trim();
      }
      if (!name && /input|textarea|select/i.test(el.tagName)) {
        // label[for] lookup
        if (el.id) { const l = document.querySelector('label[for="' + CSS.escape(el.id) + '"]'); if (l) name = l.textContent.trim(); }
        if (!name) name = el.getAttribute("placeholder") || el.getAttribute("value") || el.getAttribute("alt") || "";
      }
      if (!name) {
        // approximate accname: visible text + alt text of descendant images
        const imgAlts = Array.from(el.querySelectorAll ? el.querySelectorAll("img[alt]") : []).map((i) => i.alt).join(" ").trim();
        name = ((el.textContent || "").trim().replace(/\s+/g, " ") + " " + imgAlts).trim().slice(0, 60);
      }
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        cls: (el.className && typeof el.className === "string" ? el.className.split(" ")[0] : "") || null,
        name,
        href: el.getAttribute && el.getAttribute("href") ? el.getAttribute("href").slice(0, 60) : null,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        style: { outlineWidth: cs.outlineWidth, outlineStyle: cs.outlineStyle, outlineColor: cs.outlineColor, boxShadow: cs.boxShadow === "none" ? "none" : "set", textDecorationLine: cs.textDecorationLine }
      };
    });
    if (!stop) { stops.push({ stop: i + 1, note: "focus left the document (body) — possible tab escape or end of page" }); continue; }
    const key = `${stop.tag}|${stop.id}|${stop.name}|${stop.href}`;
    seenKeys.set(key, (seenKeys.get(key) || 0) + 1);
    if (key === prevStopKey) cycleCount++;
    prevStopKey = key;
    stops.push({ stop: i + 1, ...stop, visibleFocusIndicator: stop.style.outlineStyle !== "none" && stop.style.outlineWidth !== "0px" });
    if (cycleCount >= 4 && seenKeys.size <= 3) trapDetected = true;
  }
  result.keyboard = {
    tabStops: stops.length,
    uniqueStops: seenKeys.size,
    keyboardTrapSuspected: trapDetected,
    stopsWithoutVisibleFocus: stops.filter((s) => s.tag && s.visibleFocusIndicator === false).length,
    stops: stops,
    skipLink: stops.find((s) => s.name && /skip/i.test(s.name || "")) || null
  };
  // focus screenshot at an early interactive element
  await page.screenshot({ path: join(OUT, `${pageName}-focus-state.png`) });
  await ctx.close();

  // --- pass 2: 320px reflow ---
  const ctx2 = await browser.newContext({ viewport: { width: 320, height: 800 } });
  const p2 = await ctx2.newPage();
  await p2.goto(url, { waitUntil: "load" });
  const r320 = await p2.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyScrollWidth: document.body ? document.body.scrollWidth : null
  }));
  result.reflow320 = { ...r320, horizontalScroll: r320.scrollWidth > r320.clientWidth + 1 };
  await p2.screenshot({ path: join(OUT, `${pageName}-320px.png`), fullPage: false });
  await ctx2.close();

  // --- pass 3: 400% zoom visual render (1280 px window, page scale 4) ---
  // NOTE: CDP page scale enlarges visually WITHOUT reflowing layout, so this is a
  // visual artifact only. The reflow verdict comes from pass 2: 400% browser zoom
  // on a 1280 px window is equivalent to a 320 px CSS viewport (WCAG 1.4.10
  // Understanding defines 320 CSS px as the 400% zoom reflow reference).
  const ctx3 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p3 = await ctx3.newPage();
  await p3.goto(url, { waitUntil: "load" });
  const cdp = await ctx3.newCDPSession(p3);
  await cdp.send("Emulation.setPageScaleFactor", { pageScaleFactor: 4 });
  await p3.waitForTimeout(400);
  await p3.screenshot({ path: join(OUT, `${pageName}-400pct.png`) });
  await ctx3.close();
  result.zoom400 = { note: "visual render only (no reflow); reflow verdict = 320px viewport pass (400% of 1280px = 320px)" };

  // --- pass 4: contrast + structure (fresh page at 1280) ---
  const ctx4 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p4 = await ctx4.newPage();
  await p4.goto(url, { waitUntil: "load" });
  const data = await p4.evaluate(`(() => { try { return (${PAGE_CHECKS})(); } catch (e) { return { error: String(e && e.stack || e) }; } })()`);
  result.contrast = { failures: data.contrastFailures, failureCount: data.contrastFailures.length };
  result.structure = {
    lang: data.lang, title: data.title, landmarks: data.landmarks,
    headingOutline: data.headings, headingsCount: data.headings.length,
    images: data.altIssues, imageCount: data.altIssues.length,
    links: data.linkTexts, linkCount: data.linkTexts.length
  };
  await ctx4.close();
  return result;
}

const browser = await chromium.launch();
const results = [];
for (const u of urls) {
  const name = u.replace(/https?:\/\/[^/]+\//, "").replace(/[/?#]/g, "_").replace(/\.html?$/, "").replace(/\/$/, "").replace(/\/index$/, "") || "home";
  console.log("checking", u);
  results.push(await checkPage(browser, u, name));
}
await browser.close();
writeFileSync(join(OUT, "manual-pass-results.json"), JSON.stringify(results, null, 2));
// console summary
for (const r of results) {
  console.log(`\n== ${r.name}`);
  console.log(`  keyboard: ${r.keyboard.tabStops} stops, ${r.keyboard.uniqueStops} unique, trap=${r.keyboard.keyboardTrapSuspected}, no-visible-focus=${r.keyboard.stopsWithoutVisibleFocus}`);
  console.log(`  reflow 320px (=400% zoom of 1280): hScroll=${r.reflow320.horizontalScroll} (doc ${r.reflow320.scrollWidth}px vs viewport ${r.reflow320.clientWidth}px)`);
  console.log(`  contrast failures: ${r.contrast.failureCount}`);
  console.log(`  landmarks: ${r.structure.landmarks.join(", ") || "none"}`);
  console.log(`  headings: ${r.structure.headingsCount}, images: ${r.structure.imageCount}, links: ${r.structure.linkCount}`);
}
