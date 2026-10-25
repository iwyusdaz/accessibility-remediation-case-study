// WCAG 2.5.3 Label in Name (Level A) scripted check.
// Usage: node scripts/check-label-in-name.mjs [base-url]
//   base-url defaults to http://127.0.0.1:8900 (npm run serve).
// For every control that has a visible text label, verifies the visible label
// text is contained in the control's accessible name (Playwright ariaSnapshot).
// Writes results to audit/manual-evidence/after/label-in-name.json.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const BASE = (process.argv[2] || process.env.BASE_URL || "http://127.0.0.1:8900").replace(/\/$/, "");
const OUT = join(ROOT, "audit", "manual-evidence", "after");
mkdirSync(OUT, { recursive: true });

const PAGES = [
  "/index.html",
  "/faculty-quick-guide.html",
  "/module/index.html",
  "/module/lesson.html",
  "/module/slides.html",
  "/module/video.html",
  "/module/transcript.html",
  "/module/quiz.html",
  "/assets/demo-keyboard-navigation-transcript.html"
];

const SELECTOR = 'a[href], button, summary, [role="button"], input:not([type="hidden"]):not([type="image"]), select, textarea';

const norm = (s) => (s || "").replace(/\s+/g, " ").trim().toLowerCase();

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

const results = [];
let checked = 0;
for (const p of PAGES) {
  const url = BASE + p;
  await page.goto(url, { waitUntil: "load" });
  const els = page.locator(SELECTOR);
  const n = await els.count();
  const violations = [];
  let pageChecked = 0;
  for (let i = 0; i < n; i++) {
    const el = els.nth(i);
    // visible label text for this control
    const visible = await el.evaluate((e) => {
      const txt = (e) => (((e.textContent || "") + " " + Array.from(e.querySelectorAll("img[alt]")).map((im) => im.alt).join(" "))).replace(/\s+/g, " ").trim();
      if (/^(input|select|textarea)$/i.test(e.tagName)) {
        let label = "";
        if (e.id) {
          const l = document.querySelector('label[for="' + CSS.escape(e.id) + '"]');
          if (l) label = txt(l);
        }
        if (!label) {
          const wrap = e.closest("label");
          if (wrap) label = txt(wrap);
        }
        return label;
      }
      return txt(e);
    });
    if (!visible) continue; // no visible text label -> 2.5.3 not applicable for this control
    // A <summary> element's accessible name IS its text content (HTML-AAM);
    // Playwright ariaSnapshot reports it as an unnamed group/text node, so the
    // snapshot parse below would miss the name. Use the content directly.
    const isSummary = await el.evaluate((e) => e.tagName === "SUMMARY");
    let accName;
    if (isSummary) {
      accName = visible;
    } else {
      let snap = "";
      try { snap = await el.ariaSnapshot(); } catch { continue; }
      const m = snap.match(/^-\s+\S+\s+"((?:[^"\\]|\\.)*)"/m);
      accName = m ? m[1].replace(/\\"/g, '"') : "";
    }
    checked += 1;
    pageChecked += 1;
    if (!norm(accName).includes(norm(visible))) {
      violations.push({ selector: SELECTOR, visible, accName, snapshot: snap.split("\n")[0] });
    }
  }
  results.push({ page: p, controlsWithVisibleLabel: pageChecked, violations });
  console.log(`${p}: ${pageChecked} labeled controls, ${violations.length} violations`);
  for (const v of violations) console.log(`  VIOLATION: visible="${v.visible}" accName="${v.accName}"`);
}
await browser.close();
const totalViolations = results.reduce((a, r) => a + r.violations.length, 0);
writeFileSync(join(OUT, "label-in-name.json"), JSON.stringify({ date: new Date().toISOString().slice(0, 10), base: BASE, checked, results, totalViolations }, null, 2));
console.log(`\n${checked} controls checked, ${totalViolations} Label-in-Name violations`);
process.exit(totalViolations ? 1 : 0);
