#!/usr/bin/env node
// Snapshot the original course module pages from the Internet Archive.
//
// What it does:
//  1. Downloads the three "Unit 1: Introduction" module pages exactly as captured
//     by the Internet Archive (raw `id_` captures, no archive toolbar injected).
//  2. Downloads the local assets those pages reference (CSS, JS, images) and the
//     module PDFs (lecture slides, reading notes, exams + solutions).
//  3. Writes verbatim HTML + assets under  source/ocw-2011-snapshot/  (untouched).
//  4. Writes a renderable copy under  docs/before/  where only asset URLs are
//     rewritten from absolute ocw.mit.edu paths to relative local paths, so the
//     pages render offline. No other markup is changed.
//
// Run:  node scripts/snapshot-source.mjs
// Everything is fetched from https://web.archive.org (Internet Archive) with the
// exact timestamps recorded in source/README.md. Retrieval date: 2026-10-25.

import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const COURSE = "http://ocw.mit.edu/courses/brain-and-cognitive-sciences/9-00sc-introduction-to-psychology-fall-2011";

// Internet Archive raw captures used (verified status 200 on 2026-10-25).
const PAGES = [
  { ts: "20121126233138", url: `${COURSE}/index.htm`, out: "index.htm" },
  { ts: "20121110125628", url: `${COURSE}/introduction/`, out: "introduction/index.htm" },
  { ts: "20121120090330", url: `${COURSE}/exam-1`, out: "exam-1/index.htm" }
];

const PDFS = [
  `${COURSE}/introduction/MIT9_00SCF11_lec01.pdf`,
  `${COURSE}/introduction/MIT9_00SCF11_read_kr1.pdf`,
  `${COURSE}/exam-1/MIT9_00SCF11_exam1.pdf`,
  `${COURSE}/exam-1/MIT9_00SCF11_exam1_sol.pdf`,
  `${COURSE}/exam-1/MIT9_00SCF11_exam1_2010.pdf`,
  `${COURSE}/exam-1/MIT9_00SCF11_exam1_2010sol.pdf`
];

function fetchRaw(url, ts = "2012") {
  // Ask the Archive for the closest capture to the page captures; use id_ (raw).
  // Uses curl (node fetch was refused connections by the archive in this environment).
  const out = execFileSync("curl", [
    "-sL", "--retry", "4", "--retry-delay", "3", "--max-time", "120",
    `https://web.archive.org/web/${ts}id_/${url}`
  ], { maxBuffer: 64 * 1024 * 1024 });
  if (!out || out.length === 0) throw new Error(`empty response for ${url}`);
  return Buffer.from(out);
}

// local path for an ocw.mit.edu absolute path like /styles/common.css
function localPath(p) {
  return p.replace(/^\//, "").split("?")[0];
}

// rewrite absolute ocw.mit.edu asset URLs in an HTML page to relative local paths
function rewrite(html, pageDir) {
  const rel = (p) => {
    const depth = pageDir.split("/").filter(Boolean).length;
    return "../".repeat(depth) + localPath(p);
  };
  let out = html;
  // css / js / img src and href attributes pointing at the site
  out = out.replace(/(src|href)="(\/(?:styles|scripts|images|courses|js)\/[^"]+)"/g, (m, attr, p) => {
    return `${attr}="${rel(p)}"`;
  });
  // protocol-relative tracking pixel — neutralize (keeps markup intact, blocks the call)
  out = out.replace(/src="\/\/statse\.webtrendslive\.com[^"]*"/g, 'src="images/trans.gif"');
  out = out.replace(/src="http:\/\/statse\.webtrendslive\.com[^"]*"/g, 'src="images/trans.gif"');
  // internal course links that are out of snapshot scope -> point at the live Archive capture
  const scope = [
    "index.htm", "introduction/index.htm", "exam-1/index.htm",
    "introduction/MIT9_00SCF11_lec01.pdf", "introduction/MIT9_00SCF11_read_kr1.pdf",
    "exam-1/MIT9_00SCF11_exam1.pdf", "exam-1/MIT9_00SCF11_exam1_sol.pdf",
    "exam-1/MIT9_00SCF11_exam1_2010.pdf", "exam-1/MIT9_00SCF11_exam1_2010sol.pdf"
  ];
  out = out.replace(/href="\/courses\/brain-and-cognitive-sciences\/9-00sc-introduction-to-psychology-fall-2011\/([^"]+)"/g, (m, p) => {
    const clean = p.split("#")[0].replace(/\/$/, "");
    if (scope.includes(clean) || scope.includes(clean + "/index.htm") || scope.includes(clean === "index.htm" ? clean : clean + "/index.htm")) {
      if (clean.endsWith(".pdf")) return `href="${rel("/courses/brain-and-cognitive-sciences/9-00sc-introduction-to-psychology-fall-2011/" + clean)}"`;
      if (clean === "index.htm") return `href="${rel("/courses/brain-and-cognitive-sciences/9-00sc-introduction-to-psychology-fall-2011/index.htm")}"`;
      if (scope.includes(clean + "/index.htm")) return `href="${rel("/courses/brain-and-cognitive-sciences/9-00sc-introduction-to-psychology-fall-2011/" + clean + "/index.htm")}"`;
    }
    // out of scope: link to the Internet Archive capture so nothing is dead
    return `href="https://web.archive.org/web/2012/http://ocw.mit.edu/courses/brain-and-cognitive-sciences/9-00sc-introduction-to-psychology-fall-2011/${p}"`;
  });
  // site chrome links that are out of scope -> live archive
  out = out.replace(/href="\/((?:about|help|terms|search|courses|donate|xml)[^"]*)"/g, (m, p) => `href="https://web.archive.org/web/2012/http://ocw.mit.edu/${p}"`);
  return out;
}

const downloadList = new Map(); // url path -> local file

async function main() {
  const srcDir = join(ROOT, "source", "ocw-2011-snapshot");
  const beforeDir = join(ROOT, "docs", "before");

  for (const page of PAGES) {
    const buf = fetchRaw(page.url, page.ts);
    const srcFile = join(srcDir, page.out);
    mkdirSync(dirname(srcFile), { recursive: true });
    writeFileSync(srcFile, buf);
    const beforeFile = join(beforeDir, page.out);
    mkdirSync(dirname(beforeFile), { recursive: true });
    const pageDir = dirname(page.out);
    writeFileSync(beforeFile, rewrite(buf.toString("utf8"), pageDir));
    console.log(`page  ${page.out}  (${buf.length} bytes)`);

    // collect assets from this page
    const html = buf.toString("utf8");
    for (const m of html.matchAll(/(?:src|href)="(\/(?:styles|scripts|images)\/[^"]+)"/g)) {
      downloadList.set(m[1], localPath(m[1]));
    }
    for (const m of html.matchAll(/src="(\/courses\/[^"]+\.(?:jpg|png|gif))"/g)) {
      downloadList.set(m[1], localPath(m[1]));
    }
  }

  for (const pdf of PDFS) {
    const p = pdf.replace("http://ocw.mit.edu/", "");
    downloadList.set(p, localPath(p));
  }

  for (const [urlPath, file] of downloadList) {
    const dest = join(srcDir, file);
    if (existsSync(dest)) { console.log(`skip  ${file} (already present)`); continue; }
    mkdirSync(dirname(dest), { recursive: true });
    const buf = fetchRaw(urlPath.replace(/^\//, "http://ocw.mit.edu/"));
    writeFileSync(dest, buf);
    // copy into docs/before as well (same relative layout)
    const dest2 = join(beforeDir, file);
    mkdirSync(dirname(dest2), { recursive: true });
    writeFileSync(dest2, buf);
    console.log(`asset ${file}  (${buf.length} bytes)`);
  }
  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
