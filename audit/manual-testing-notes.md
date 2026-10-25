# Manual testing notes (scripted, by the audit agent)

All results reproducible: `node scripts/manual-pass.mjs <label> <urls...>` after
`python3 -m http.server 8900 --directory docs`. Raw JSON:
`manual-evidence/before/manual-pass-results.json`. Screenshots in the same folder.

These are **scripted agent checks**, not screen-reader results. VoiceOver checks
are pending a human pass (see `methodology.md`).

## Keyboard (before)

Checked by pressing Tab 120× per page and logging every focus target
(tag, accessible-name approximation incl. inner `img[alt]`, position).

| Finding | Evidence |
|---|---|
| No keyboard trap detected (focus cycles through the whole document) | `manual-pass-results.json` → `keyboard.keyboardTrapSuspected: false` on all 3 pages |
| ~60–80 unique tab stops per page; content links reachable (e.g., unit page: "K&R" at stop 71, "Lecture 1: Introduction" at 75, "Lecture Slides (PDF)" at 82) | targeted reachability probe |
| Focus indicator: browser default outline present on all tab stops (0–2 ambiguous) | computed `outline-style/width` per stop |
| **Skip link unreachable**: `class="skip"` link has `tabindex="-1"` — Tab never lands on it; without JS it does nothing for keyboard users (2.4.1) | DOM: `<a href="#main" class="skip" tabindex="-1">skip to content</a>` (target `id="main"` exists) |
| **Video popup focus behavior**: Enter on "Lecture 1: Introduction" opens the dialog but focus stays on the trigger; dialog content is not reached next (2.4.3) | scripted popup test + `before-video-popup.png` |
| **Popup not dismissible with Escape** (verified: still open after Esc); only the image close link (alt="Close") closes it | scripted popup test |
| **Player controls not keyboard operable**: injected Flash-era JW player exposes no focusable play/seek control; popup focusables = close link + 2 unlabeled `<input>`s + 2 download links (2.1.1 / 4.1.2) | popup focusable inventory |
| 15 sidebar "Expand Menu" links: `href="#"` + `onclick="toggleMenu(...)"`; Enter works (JS fires) but the page scrolls to top and no expanded/collapsed state is conveyed (4.1.2) | keyboard stops 16–59, DOM inspection |
| "Email this page" is `href="javascript:emailPopUp()"` — dead link without JS (2.1.1-adjacent robustness) | DOM, both pages |

## Screen-reader structure (structural proxy, NOT a screen-reader result)

Headings/landmarks were extracted from the DOM. What a screen-reader user would
get from the headings rotor is evidenced by this outline, but rotor behavior
itself was **not** tested (pending human):

- Only `<h1>` on every page = the site logo image ("MIT OpenCourseWare").
- The page topic ("Introduction") is a `<span id="parent-fieldname-title">`, not
  a heading — it never appears in a headings list.
- First content headings are sidebar `<h3>`s ("Syllabus", "Vision II", …), then
  `<h2>` "Session Overview" — heading levels skip (h1→h3; axe `heading-order`).
- Zero landmarks on all pages (axe `landmark-one-main` + `region`: 20–55 nodes).

## Reflow (before)

- 320 px viewport (WCAG's 400%-of-1280 reference): unit + exam pages render a
  952 px-wide document → horizontal scrolling, content cut off
  (`before_introduction_index-320px.png`). Course home page happens to fit
  (different template). → 1.4.10 fail.
- 400% visual zoom render saved (`*-400pct.png`) as an artifact only; the reflow
  verdict comes from the 320 px pass (page-scale does not reflow layout).

## Contrast (before)

Measured for every visible text node (foreground vs. first opaque ancestor
background), WCAG relative luminance, 4.5:1 (3:1 large text):

- Unit + exam pages: 1 automated flag — "OCW Scholar" banner, white text resolved
  against white (1.0:1). Manual inspection: the text sits on a dark background
  *image* (CSS image-replacement), so it is readable with images on; it becomes
  invisible if images are disabled. Logged as a LOW robustness issue, not a
  1.4.3 failure.
- Course home: 0 flags. The 2012 design's link/body colors pass 4.5:1.

## Media (before)

- The video section on the session page is a "View Full Video" popup + 5 chapter
  popups; each offers only "> Download from iTunes U (MP4)" and
  "> Download from Internet Archive (MP4)".
- **No captions, no transcript, no audio description anywhere in the module.**
  The player (Flash-era JW Player) has no caption control. YouTube (the modern
  embed source) carries only machine-generated, uncorrected auto-captions; the
  official human transcript exists as a PDF on the modern OCW site but was never
  linked from this module.
- All 6 download links per platform point to the **same full-lecture MP4** —
  the 5 "chapter" download links do not download chapters.
- One broken href: `hhttp://itunes.apple.com/...` (typo).
- The lecture is inherently visual (optical illusions, in-class demonstrations —
  the page's own Session Overview says so), so visual-only information exists
  that no transcript can carry (1.2.5).

## Content (before)

- Cryptic link text: `[K&R]` and `[Stangor]` (textbook-abbreviation links).
- 7 links with `href="#?w=535"` — no matching anchor in the document (pa11y
  NoSuchID); the links only work through `onclick`.
- Page `<title>`s are long pipe-separated strings but descriptive (passes 2.4.2,
  with a remark).
- `lang="en"` present on all pages (passes 3.1.1).
- Search field keeps its label as its *value* ("Enter search keyword"), cleared
  on focus; no `<label>` (3.3.2 / 4.1.2; axe critical `label`).

## PDFs (before)

Inspected with pypdf (tag tree, alt entries, text extraction). All six PDFs are
tagged, carry document titles and `Lang: EN` — but the tags don't help where it
matters:

- Slides PDF: 20 `/Alt` entries, mostly export junk ("Text Box:", "scan569.jpg",
  "A_B_color_constrast", empty "Text Box: "); 1 of 4 figures has no alt at all;
  38 of 54 pages carry < 200 characters of text — the slide visuals (brain
  photographs, illusion images, a bar chart) carry the meaning without text
  alternatives; chart data ("A Gap Between Attitudes & Actions") is unavailable
  as text/tables.
- Reading PDF: contains **no table and no content raster figures** (verified by
  page-by-page render inspection) — "Table 1" and "Table 3" are references to
  the copyrighted textbook (pp. 14, 29), not content in the PDF (I-27). The tag
  tree marks bullet glyphs as /Figure with bullet-character alt (tag noise).
- Exam PDFs (2010): the brain-lobe diagram (Q4/Q5) and the neuron cartoon (Q6)
  on pages 18–19 have zero alt entries — unanswerable without vision (I-29).
- Solutions mark answers with text ("Answer: D") — no color-only marking found
  (passes).
- Quiz/exam content exists only as PDF; no HTML alternative (robustness issue;
  drives the HTML quiz remediation).
