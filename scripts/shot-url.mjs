// Screenshot a URL (or file path) at a given viewport size.
// Usage: node scripts/shot-url.mjs <url-or-path> <out.png> [width] [height] [fullPage]
import { chromium } from "playwright";
import { resolve } from "node:path";

const [input, output, w, h, full] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: node scripts/shot-url.mjs <url-or-path> <out.png> [width] [height] [fullPage]");
  process.exit(2);
}
const width = parseInt(w || "1280", 10);
const height = parseInt(h || "800", 10);
const isUrl = /^https?:\/\//.test(input);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(isUrl ? input : "file://" + resolve(input), { waitUntil: "load" });
await page.waitForTimeout(700);
await page.screenshot({ path: output, fullPage: full === "full" });
await browser.close();
console.log(`Saved ${output} (${width}x${height}${full === "full" ? ", fullPage" : ""})`);
