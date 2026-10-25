// Shared Playwright helpers for this repo's audit and verification scripts.
// Playwright (1.57.0) is resolved from the workspace root node_modules.
import { chromium } from "playwright";

export const BASE = process.env.BASE_URL || "http://127.0.0.1:8900";

export async function withBrowser(fn) {
  const browser = await chromium.launch();
  try {
    return await fn(browser);
  } finally {
    await browser.close();
  }
}

export async function newPage(browser, opts = {}) {
  return browser.newContext({
    viewport: { width: 1280, height: 800 },
    ...opts
  }).then((c) => c.newPage());
}

export function ensureSlash(u) {
  return u.endsWith("/") ? u : u + "/";
}
