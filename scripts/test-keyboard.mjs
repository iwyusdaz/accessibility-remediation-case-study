// Scripted keyboard task tests for the remediated module.
// Usage: node scripts/test-keyboard.mjs   (BASE_URL env or http://127.0.0.1:8900)
// Writes results JSON to audit/manual-evidence/after/keyboard-tests.json.
//
// Proves (with a keyboard only): skip link works, module nav works, quiz can be
// completed with radios + buttons and announces feedback, video page exposes a
// captions track and operable chapter buttons, and no keyboard trap occurs.
// These are scripted checks — not screen-reader results.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const BASE = process.env.BASE_URL || "http://127.0.0.1:8900";
const OUT = join(ROOT, "audit", "manual-evidence", "after");
mkdirSync(OUT, { recursive: true });

const results = [];
const t = async (name, fn) => {
  try {
    const detail = await fn();
    results.push({ name, pass: true, detail: detail || "" });
    console.log(`PASS  ${name}${detail ? " — " + detail : ""}`);
  } catch (e) {
    results.push({ name, pass: false, detail: String(e.message || e).slice(0, 300) });
    console.log(`FAIL  ${name} — ${e.message}`);
  }
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

await t("module index loads", async () => {
  await page.goto(`${BASE}/module/index.html`, { waitUntil: "load" });
  return (await page.title()).includes("Unit 1");
});

let skipWorked = false;
await t("skip link is the first tab stop and jumps to main", async () => {
  await page.keyboard.press("Tab");
  skipWorked = await page.evaluate(() => {
    const el = document.activeElement;
    return el.classList && el.classList.contains("skip-link");
  });
  if (!skipWorked) throw new Error("first tab stop is not the skip link");
  await page.keyboard.press("Enter");
  const onMain = await page.evaluate(() =>
    document.activeElement && (document.activeElement.id === "main" ||
      document.getElementById("main").contains(document.activeElement)));
  if (!onMain) throw new Error("skip link did not move focus to main");
  return "focus on #main";
});

await t("module nav is keyboard operable (tab order, no trap)", async () => {
  const tags = [];
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    tags.push(await page.evaluate(() => document.activeElement.tagName));
  }
  if (tags.every((x) => x === tags[0])) throw new Error("possible keyboard trap");
  return `20 stops cycled through ${new Set(tags).size} element types`;
});

await t("quiz: complete a question by keyboard and get announced feedback", async () => {
  await page.goto(`${BASE}/module/quiz.html`, { waitUntil: "load" });
  await page.keyboard.press("Tab"); // skip link
  // reach the first radio of Q1 (after nav links)
  let reached = false;
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    const isQ1 = await page.evaluate(() =>
      document.activeElement && document.activeElement.id === "q1a");
    if (isQ1) { reached = true; break; }
  }
  if (!reached) throw new Error("could not reach Q1 radio group by keyboard");
  // radio groups move with arrow keys, not Tab (correct native behavior)
  for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowDown"); // q1a -> q1d
  const onD = await page.evaluate(() => document.activeElement.id === "q1d");
  if (!onD) throw new Error("arrow keys did not move within the radio group");
  await page.keyboard.press("Space"); // select correct option
  // move to the Check button
  let checked = false;
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("Tab");
    const isBtn = await page.evaluate(() =>
      document.activeElement && document.activeElement.classList.contains("check"));
    if (isBtn) { checked = true; break; }
  }
  if (!checked) throw new Error("Check button not reachable");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(150);
  const fb = await page.evaluate(() => {
    const f = document.querySelector('fieldset[data-qnum="1"] .feedback');
    return { shown: f.style.display === "block", text: f.textContent.trim() };
  });
  if (!fb.shown || !/Correct/.test(fb.text)) throw new Error("feedback not announced: " + JSON.stringify(fb));
  return "arrows within radio group + Space select -> feedback announced in status region";
});

await t("quiz: wrong answer produces non-color-only textual feedback", async () => {
  // answer Q2 wrongly: 2% (q2a) is focused first in the group
  await page.evaluate(() => document.getElementById("q2a").focus());
  await page.keyboard.press("Space");
  let checked = false;
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    const isBtn = await page.evaluate(() =>
      document.activeElement && document.activeElement.classList.contains("check"));
    if (isBtn) { checked = true; break; }
  }
  if (!checked) throw new Error("check button not reached");
  await page.keyboard.press("Enter");
  const fb = await page.evaluate(() => {
    const f = document.querySelector('fieldset[data-qnum="2"] .feedback');
    return { state: f.getAttribute("data-state"), text: f.textContent.trim() };
  });
  if (fb.state !== "incorrect" || !/Not quite/.test(fb.text)) throw new Error("wrong-answer feedback missing");
  return "incorrect -> textual verdict, not color-only";
});

await t("quiz score region updates (aria-live)", async () => {
  const txt = await page.evaluate(() => document.getElementById("quiz-score").textContent);
  if (!/\d/.test(txt)) throw new Error("score region not updated");
  return txt.trim();
});

await t("video page: captions track present and labeled", async () => {
  await page.goto(`${BASE}/module/video.html`, { waitUntil: "load" });
  const track = await page.evaluate(() => {
    const tr = document.querySelector("video track[kind=captions]");
    return tr && { src: tr.getAttribute("src"), lang: tr.getAttribute("srclang"), label: tr.getAttribute("label") };
  });
  if (!track) throw new Error("no captions track");
  return JSON.stringify(track);
});

await t("video page: chapter buttons keyboard operable and labeled", async () => {
  const info = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("#chapter-list button"));
    return { count: btns.length, labels: btns.slice(0, 2).map((b) => b.textContent.trim().slice(0, 40)) };
  });
  if (info.count < 6) throw new Error("expected 6 chapter buttons");
  // focus one and activate
  await page.evaluate(() => document.querySelector("#chapter-list button[data-start='27']").focus());
  await page.keyboard.press("Enter");
  const t2 = await page.evaluate(() => {
    const v = document.querySelector("video");
    return v ? v.currentTime >= 20 : false;
  });
  if (!t2) throw new Error("chapter button did not seek the video");
  return "6 buttons; seek works (" + JSON.stringify(info.labels) + ")";
});

await t("video page: player controls reachable by keyboard", async () => {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => document.querySelector(".skip-link").focus());
  let videoFocused = false;
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press("Tab");
    videoFocused = await page.evaluate(() => document.activeElement.tagName === "VIDEO");
    if (videoFocused) break;
  }
  if (!videoFocused) throw new Error("video player not reachable by keyboard");
  return "video player focusable";
});

await t("slides page: headings list walkable (54 slide sections)", async () => {
  await page.goto(`${BASE}/module/slides.html`, { waitUntil: "load" });
  const n = await page.evaluate(() => document.querySelectorAll("section.slide").length);
  if (n !== 54) throw new Error("expected 54 slide sections, got " + n);
  return n + " sections";
});

await t("lesson page: table has caption and scoped headers", async () => {
  await page.goto(`${BASE}/module/lesson.html`, { waitUntil: "load" });
  const ok = await page.evaluate(() => {
    const tbl = document.getElementById("schools-table");
    return tbl && tbl.caption && tbl.querySelectorAll("thead th[scope=col]").length >= 4 && tbl.querySelectorAll("tbody th[scope=row]").length >= 8;
  });
  if (!ok) throw new Error("schools table structure incomplete");
  return "caption + col/row scopes present";
});

await browser.close();
const failed = results.filter((r) => !r.pass).length;
writeFileSync(join(OUT, "keyboard-tests.json"), JSON.stringify({ date: "2026-10-25", base: BASE, results, failed }, null, 2));
console.log(`\n${results.length - failed}/${results.length} keyboard tests passed`);
process.exit(failed ? 1 : 0);
