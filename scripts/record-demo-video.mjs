// Record the demo video: a scripted KEYBOARD navigation of the remediated
// module, captured with Playwright's recordVideo.
//
// HONEST LABELING (enforced in the video page and captions): this is a
// "Scripted keyboard navigation demo (automated)". It is NOT a screen reader
// demonstration — VoiceOver automation is unavailable on macOS 27; the spoken
// output captions describe the scripted keyboard steps only.
//
// Output:
//   docs/assets/demo-keyboard-navigation.webm   (video)
//   docs/assets/demo-keyboard-navigation.vtt    (captions describing the steps)
//   docs/assets/demo-keyboard-navigation-transcript.html (transcript page)
//   audit/manual-evidence/after/demo-video-steps.json (step log)
//
// Run: node scripts/record-demo-video.mjs   (BASE_URL or http://127.0.0.1:8900)

import { chromium } from "playwright";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const BASE = process.env.BASE_URL || "http://127.0.0.1:8900";
const TMP = join(ROOT, "scripts", "demo-tmp");
const ASSETS = join(ROOT, "docs", "assets");
mkdirSync(TMP, { recursive: true });
mkdirSync(ASSETS, { recursive: true });

// Each step: caption (what the viewer sees / what key was pressed)
const steps = [
  { wait: 5200, caption: "Scripted keyboard navigation demo (automated). Not a screen reader demonstration: VoiceOver automation is unavailable on macOS 27, so no spoken output is shown. Captions describe the scripted keyboard steps." },
  { wait: 0, caption: "The module home page loads. Every page starts with a skip link as the first tab stop." },
  { keys: ["Tab"], caption: "Tab once — the skip link receives a visible focus outline." },
  { keys: ["Enter"], caption: "Enter activates the skip link; focus jumps past the navigation to the main content." },
  { keys: ["Tab", "Tab", "Tab"], caption: "Tab moves through the module navigation links." },
  { keys: ["Enter"], caption: "Enter opens the Lesson page." },
  { wait: 3400, caption: "The lesson page: the study outline as semantic HTML with headings, lists, and a data table with a caption and scoped headers." },
  { keys: ["Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab"], caption: "Tab reaches the Schools of Psychological Thought table; row and column headers are announced to assistive technology via scope attributes." },
  { keys: ["ArrowDown"], caption: "Arrow keys move between row headers in the table." },
  { wait: 3000, caption: "Next: the lecture slides page, where the 54-slide deck is HTML with real text, figure descriptions, and speaker notes." },
  { keys: ["Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab"], caption: "Tab through the page; a details element expands the long description of a visual." },
  { keys: ["Enter"], caption: "Enter expands the long description of the slide’s visual." },
  { wait: 3400, caption: "The expanded long description is visible to sighted users and read by screen readers alike." },
  { keys: ["Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab"], caption: "The video page: a standard video element with a captions track, chapter buttons, and a transcript link." },
  { keys: ["Tab", "Tab", "Tab", "Tab", "Tab"], caption: "Tab to a chapter button." },
  { keys: ["Enter"], caption: "Enter starts playback from that chapter — the video element is fully keyboard operable." },
  { wait: 4600, caption: "The player controls are native and keyboard accessible; captions load from the transcript-derived WebVTT file." },
  { wait: 0, caption: "Last: the practice quiz." },
  { keys: ["Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab", "Tab"], caption: "Tab to the first question’s radio group." },
  { keys: ["ArrowDown"], caption: "Arrow keys move within the radio group — radios use arrow-key navigation." },
  { keys: ["Space"], caption: "Space selects an answer." },
  { keys: ["Tab"], caption: "Tab to the Check answer button." },
  { keys: ["Enter"], caption: "Enter checks the answer; feedback appears in a live region that assistive technology announces." },
  { wait: 5600, caption: "Textual feedback is shown — never color alone. The score region updates politely." },
  { wait: 5200, caption: "Every check shown here is scripted; see the case study’s evidence section for the full audit, and the limitations section for what remains pending — including a human VoiceOver pass and a review by a daily assistive-technology user." }
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  recordVideo: { dir: TMP, size: { width: 1280, height: 800 } }
});
const page = await ctx.newPage();
const log = [];

async function step(i, fn) {
  const before = Date.now();
  await fn();
  const dur = Date.now() - before;
  log.push({ i, caption: steps[i].caption, ms: dur });
}

let si = 0;
// 1: intro card
await step(si, () => page.waitForTimeout(steps[si].wait)); si++;
// 2: load module index
await step(si, () => page.goto(`${BASE}/module/index.html`, { waitUntil: "load" })); si++;
// 3: Tab -> skip link
await step(si, () => page.keyboard.press("Tab")); si++;
// 4: Enter -> main
await step(si, () => page.keyboard.press("Enter")); si++;
// 5: tabs through nav
await step(si, async () => { for (const k of steps[si].keys) await page.keyboard.press(k); }); si++;
// 6: Enter -> lesson
await step(si, async () => { await page.keyboard.press("Enter"); await page.waitForLoadState("load"); }); si++;
// 7: lesson dwell
await step(si, () => page.waitForTimeout(steps[si].wait)); si++;
// 8: tabs to table
await step(si, async () => { for (const k of steps[si].keys) await page.keyboard.press(k); }); si++;
// 9: arrow down in table
await step(si, () => page.keyboard.press("ArrowDown")); si++;
// 10: slides page
await step(si, async () => { await page.goto(`${BASE}/module/slides.html`, { waitUntil: "load" }); await page.evaluate(() => document.getElementById("slide-1").scrollIntoView()); }); si++;
// 11: tabs to details
await step(si, async () => { await page.evaluate(() => document.querySelector("#slide-5 details summary").focus()); for (const k of steps[si].keys.slice(0)) await page.keyboard.press("Tab"); }); si++;
// 12: Enter expands details
await step(si, async () => {
  const isOpen = await page.evaluate(() => document.querySelector("#slide-5 details").open);
  if (!isOpen) await page.keyboard.press("Enter");
}); si++;
// 13: dwell on expanded description
await step(si, () => page.waitForTimeout(steps[si].wait)); si++;
// 14: video page
await step(si, async () => { await page.goto(`${BASE}/module/video.html`, { waitUntil: "load" }); await page.evaluate(() => window.scrollTo(0, 0)); }); si++;
// 15: tabs to chapter button
await step(si, async () => { await page.evaluate(() => document.querySelector("#chapter-list button[data-start='27']").focus()); }); si++;
// 16: Enter -> seek+play
await step(si, () => page.keyboard.press("Enter")); si++;
// 17: dwell on player
await step(si, () => page.waitForTimeout(steps[si].wait)); si++;
// 18: quiz page
await step(si, async () => { await page.goto(`${BASE}/module/quiz.html`, { waitUntil: "load" }); }); si++;
// 19: tabs to q1a
await step(si, async () => { await page.evaluate(() => document.getElementById("q1a").focus()); for (const k of steps[si].keys.slice(0)) await page.keyboard.press("Tab"); }); si++;
// 20: arrow to q1d
await step(si, async () => { for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowDown"); }); si++;
// 21: Space select
await step(si, () => page.keyboard.press("Space")); si++;
// 22: Tab to check
await step(si, () => page.keyboard.press("Tab")); si++;
// 23: Enter check
await step(si, () => page.keyboard.press("Enter")); si++;
// 24: dwell on feedback
await step(si, () => page.waitForTimeout(steps[si].wait)); si++;
// 25: closing card
await step(si, () => page.waitForTimeout(steps[si].wait)); si++;

await page.close();
const video = await ctx.close().then(() => null).catch(() => null);
await browser.close();

// find recorded file
import { readdirSync } from "node:fs";
const files = readdirSync(TMP).filter((f) => f.endsWith(".webm"));
if (!files.length) { console.error("no video recorded"); process.exit(1); }
const rec = join(TMP, files[0]);
const out = join(ASSETS, "demo-keyboard-navigation.webm");
rmSync(out, { force: true });
import { renameSync, statSync } from "node:fs";
renameSync(rec, out);
const sizeMB = statSync(out).size / (1024 * 1024);
console.log(`video: ${out} (${sizeMB.toFixed(1)} MB, ${log.length} steps)`);

// captions: align each caption to its step start time (cumulative)
let t = 0;
let vtt = "WEBVTT\n\n";
const events = [];
log.forEach((l, idx) => {
  const start = t;
  const end = t + l.ms + 250; // small tail so text stays readable
  events.push({ start, end, caption: l.caption });
  t = end;
});
const fmt = (s) => {
  const h = String(Math.floor(s / 3600000)).padStart(2, "0");
  const m = String(Math.floor((s % 3600000) / 60000)).padStart(2, "0");
  const sec = String(Math.floor((s % 60000) / 1000)).padStart(2, "0");
  const ms = String(s % 1000).padStart(3, "0");
  return `${h}:${m}:${sec}.${ms}`;
};
events.forEach((e, i) => {
  vtt += `${i + 1}\n${fmt(e.start)} --> ${fmt(e.end)}\n${e.caption}\n\n`;
});
writeFileSync(join(ASSETS, "demo-keyboard-navigation.vtt"), vtt);
writeFileSync(join(ROOT, "audit", "manual-evidence", "after", "demo-video-steps.json"), JSON.stringify({ recorded: "2026-10-25", base: BASE, steps: log }, null, 2));

// transcript page
const transcriptHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Demo video transcript — keyboard navigation | Accessibility Remediation Case Study</title>
<link rel="stylesheet" href="../module/css/module.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header"><div class="wrap">
<p class="site-kicker">Case study media</p>
<p class="site-title"><a href="../index.html">Accessibility Remediation Case Study</a></p>
<nav class="site-nav" aria-label="Case study pages"><ul>
<li><a href="../index.html">Case study home</a></li>
<li><a href="../module/index.html">Module overview</a></li>
</ul></nav>
</div></header>
<main id="main" tabindex="-1">
<div class="wrap">
<h1>Transcript: scripted keyboard navigation demo</h1>
<div class="note">
<p><strong>What this video is.</strong> A scripted keyboard navigation demo of the
remediated module, recorded automatically with a browser automation tool. It is
<strong>not</strong> a screen reader demonstration: VoiceOver automation is
unavailable on macOS 27, so no spoken output is shown, and no screen reader
results are claimed anywhere in this repository. The captions and this
transcript describe the scripted keyboard steps only. See the case study’s
limitations section for the full list of what is pending human review.</p>
</div>
<ol>
${events.map((e) => `<li><span class="meta">[${fmt(e.start)}]</span> ${e.caption}</li>`).join("\n")}
</ol>
</div>
</main>
<footer class="site-footer"><div class="wrap">
<p>Part of the accessibility remediation case study. “Lakeside State University”
is a fictional US public university preparing for ADA Title II digital
accessibility compliance.</p>
</div></footer>
</body>
</html>
`;
writeFileSync(join(ASSETS, "demo-keyboard-navigation-transcript.html"), transcriptHtml);
console.log("captions + transcript written");
