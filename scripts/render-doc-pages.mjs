// Render the Markdown reports/program documents as accessible HTML pages under
// docs/, so the site links to deployed pages instead of GitHub blob URLs.
// Usage: node scripts/render-doc-pages.mjs
// Regenerates:
//   docs/report/conformance-report.html   <- report/conformance-report.md
//   docs/report/prioritization-model.html <- program/prioritization-model.md
//   docs/program/remediation-workflow.html<- program/remediation-workflow.md
// The Markdown sources stay canonical; re-run this script after editing them.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

const PAGES = [
  {
    md: "report/conformance-report.md",
    out: "docs/report/conformance-report.html",
    title: "WCAG 2.1 AA conformance report — remediated module",
    kicker: "Case study · Reports",
    src: "https://github.com/iwyusdaz/accessibility-remediation-case-study/blob/main/report/conformance-report.md",
    rel: "../", // path prefix from the page back to docs/
    lede: "Criterion-by-criterion conformance of the remediated module. This is the web version of <code>report/conformance-report.md</code>; the Markdown source is canonical."
  },
  {
    md: "program/prioritization-model.md",
    out: "docs/report/prioritization-model.html",
    title: "Prioritization model: remediating a course catalog at scale",
    kicker: "Lakeside State University — program view",
    src: "https://github.com/iwyusdaz/accessibility-remediation-case-study/blob/main/program/prioritization-model.md",
    rel: "../",
    lede: "How one audited module scales to ~300 courses without pretending the hours don't exist. Web version of <code>program/prioritization-model.md</code>."
  },
  {
    md: "program/remediation-workflow.md",
    out: "docs/program/remediation-workflow.html",
    title: "Remediation workflow: intake → audit → fix → verify → sign-off",
    kicker: "Lakeside State University — program view",
    src: "https://github.com/iwyusdaz/accessibility-remediation-case-study/blob/main/program/remediation-workflow.md",
    rel: "../",
    lede: "The repeatable pipeline used for the pilot module, ready to run per course at catalog scale. Web version of <code>program/remediation-workflow.md</code>."
  }
];

// which .md targets have rendered pages (for link rewriting)
const MD_TO_HTML = {
  "prioritization-model.md": "../report/prioritization-model.html",
  "remediation-workflow.md": "../program/remediation-workflow.html",
  "faculty-quick-guide.md": "../faculty-quick-guide.html",
  "conformance-report.md": "../report/conformance-report.html"
};

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(s) {
  s = esc(s);
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return "\x00" + (codes.length - 1) + "\x00"; });
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, text, url) => {
    const href = MD_TO_HTML[url.split("/").pop()] || url;
    const external = /^https?:/.test(href);
    return `<a href="${href}"${external ? ' rel="noopener"' : ""}>${text}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  s = s.replace(/\x00(\d+)\x00/g, (_, i) => `<code>${codes[i]}</code>`);
  return s;
}

function mdToHtml(md) {
  const lines = md.split("\n");
  const out = [];
  let i = 0;
  let h1done = false;
  while (i < lines.length) {
    const line = lines[i];
    if (/^```/.test(line)) {
      const lang = line.slice(3).trim();
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      if (lang === "mermaid") {
        out.push('<p class="meta">Diagram source (Mermaid). If it does not render, the text description below is the same process.</p>');
      }
      out.push(`<pre><code${lang && lang !== "mermaid" ? ` class="language-${lang}"` : ""}>${esc(buf.join("\n"))}</code></pre>`);
      continue;
    }
    if (/^\|/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|?\s*$/.test(lines[i + 1])) {
      const header = line.split("|").slice(1, -1).map((c) => c.trim());
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        rows.push(lines[i].split("|").slice(1, -1).map((c) => c.trim()));
        i++;
      }
      const th = (c, scope) => `<th scope="${scope}">${inline(c)}</th>`;
      const td = (c) => `<td>${inline(c)}</td>`;
      // tabindex=0: these containers scroll at narrow widths (module.css
      // .table-scroll), so keyboard users must be able to reach the scroll area
      // (axe scrollable-region-focusable)
      out.push('<div class="table-scroll" tabindex="0"><table class="data">');
      if (header.some((c) => c !== "")) {
        out.push("<thead><tr>" + header.map((c) => th(c, "col")).join("") + "</tr></thead>");
      }
      out.push("<tbody>" + rows.map((r) => "<tr>" + r.map((c, ci) => (ci === 0 ? th(c, "row") : td(c))).join("") + "</tr>").join("") + "</tbody>");
      out.push("</table></div>");
      continue;
    }
    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
      let lvl = m[1].length;
      if (lvl === 1 && !h1done) { h1done = true; i++; continue; } // <h1> comes from the template
      if (lvl === 1) lvl = 2;
      out.push(`<h${lvl}>${inline(m[2])}</h${lvl}>`);
      i++;
      continue;
    }
    if (/^(-|\d+\.)\s+/.test(line)) {
      const ol = /^\d+\./.test(line);
      const items = [];
      let cur = null;
      while (i < lines.length && /^(-|\d+\.)\s+/.test(lines[i] || "") || (cur && /^\s{2,}\S/.test(lines[i] || "") && !/^\s*[-*]\s/.test(lines[i]))) {
        const lm = lines[i].match(/^(-|\d+\.)\s+(.*)$/);
        if (lm) { cur = lm[2]; items.push(cur); }
        else if (cur) items[items.length - 1] += " " + lines[i].trim();
        i++;
      }
      out.push(`<${ol ? "ol" : "ul"}>` + items.map((it) => `<li>${inline(it)}</li>`).join("") + `</${ol ? "ol" : "ul"}>`);
      continue;
    }
    if (/^>\s?/.test(line)) {
      const paras = [[]];
      while (i < lines.length && /^>/ .test(lines[i])) {
        const content = lines[i].replace(/^>\s?/, "");
        if (content.trim() === "") { if (paras[paras.length - 1].length) paras.push([]); }
        else paras[paras.length - 1].push(content.trim());
        i++;
      }
      out.push("<blockquote>" + paras.filter((p) => p.length).map((p) => `<p>${inline(p.join(" "))}</p>`).join("") + "</blockquote>");
      continue;
    }
    if (/^---+\s*$/.test(line)) { out.push("<hr>"); i++; continue; }
    if (line.trim() === "") { i++; continue; }
    // paragraph: gather until blank line or block start
    const buf = [line.trim()];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,4}\s|```|\||>|-\s|\d+\.\s|---+\s*$)/.test(lines[i])) {
      buf.push(lines[i].trim());
      i++;
    }
    out.push(`<p>${inline(buf.join(" "))}</p>`);
  }
  return out.join("\n");
}

function template(page, bodyHtml) {
  const rel = page.rel;
  const selfHref = page.out === "docs/report/prioritization-model.html" ? "prioritization-model.html"
    : page.out === "docs/program/remediation-workflow.html" ? "remediation-workflow.html"
    : "conformance-report.html";
  const selfLabel = page.out.includes("conformance") ? "Conformance report"
    : page.out.includes("prioritization") ? "Prioritization model"
    : "Remediation workflow";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title} | Accessibility Remediation Case Study</title>
<link rel="stylesheet" href="${rel}module/css/module.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header">
  <div class="wrap">
    <p class="site-kicker">${page.kicker}</p>
    <p class="site-title"><a href="${rel}index.html">Accessibility Remediation Case Study</a></p>
    <nav class="site-nav" aria-label="Case study pages">
      <ul>
        <li><a href="${rel}index.html">Case study home</a></li>
        <li><a href="${rel}module/index.html">Remediated module</a></li>
        <li><a href="${rel}faculty-quick-guide.html">Faculty quick guide</a></li>
        <li><a href="${selfHref}" aria-current="page">${selfLabel}</a></li>
      </ul>
    </nav>
  </div>
</header>
<main id="main" tabindex="-1">
<div class="wrap">

<h1>${page.title}</h1>
<p class="lede">${page.lede} <a href="${page.src}" rel="noopener">Markdown source</a>.</p>

${bodyHtml}

</div>
</main>
<footer class="site-footer">
  <div class="wrap">
    <p>Part of the case study “Accessibility remediation of a real course
    module.” Content adapted from <em>9.00SC Introduction to Psychology, Fall
    2011</em> (Unit&nbsp;1) by Prof. John Gabrieli, MIT OpenCourseWare, licensed
    CC BY-NC-SA 3.0 US; this adaptation is licensed alike (see
    <a href="${rel}index.html#attribution">attribution</a>).
    “Lakeside State University” is a fictional US public university preparing for
    ADA Title II digital accessibility compliance.</p>
  </div>
</footer>
</body>
</html>
`;
}

for (const page of PAGES) {
  const md = readFileSync(join(ROOT, page.md), "utf8");
  const body = mdToHtml(md);
  const html = template(page, body);
  const outPath = join(ROOT, page.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  console.log("rendered", page.out, `(${html.length} bytes)`);
}
