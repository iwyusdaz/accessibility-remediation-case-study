# Issue log — readable summary

Master tracker: `audit/issue-log.csv` (33 issues). Source module: Unit 1
("Introduction"), *9.00SC Introduction to Psychology, Fall 2011*, MIT
OpenCourseWare (CC BY-NC-SA 3.0 US). All issues below were verified against the
retrieved original (`docs/before/` + PDFs) on 2026-10-25; the "status" column in
the CSV tracks the remediation. I-10, I-11, I-24 and I-27 were restated during
verification for accuracy — corrections are recorded in the CSV rows' notes
(I-10/I-11 in the 2026-10-26 fresh-context review round).

**Counts by WCAG principle**

| Principle | Issues |
|---|---|
| Perceivable | 15 (I-01, I-02, I-03, I-07*, I-20, I-21, I-24, I-25, I-26, I-27, I-28, I-29, I-31 + remarks) |
| Operable | 12 (I-04, I-05, I-06, I-09, I-12, I-14, I-15*, I-22, I-31*, I-32, I-33, I-07*) |
| Understandable | 5 (I-16, I-17, I-30*, I-31*, I-33*) |
| Robust | 8 (I-10, I-11, I-13, I-18, I-19, I-23, I-15*, I-30*) |

*\* several issues span principles; primary mapping is in the CSV.*

**Counts by severity**

| Severity | Count | IDs |
|---|---|---|
| Critical | 3 | I-01 (no captions), I-02 (no audio description for visual lecture), I-16 (unlabeled search field) |
| High | 10 | I-03, I-04, I-10, I-11, I-14, I-20, I-24, I-25, I-26, I-29 (exam figures) |
| Medium | 14 | I-05, I-06, I-07, I-09, I-12, I-13, I-15, I-17, I-18, I-19, I-22, I-27, I-30, I-31 |
| Low | 6 | I-08, I-21, I-23, I-28, I-32, I-33 |

**Counts by content type**

| Content type | Issues |
|---|---|
| Video / media (page + player + popups) | 9 |
| Page structure & navigation (all 3 HTML pages) | 12 |
| Forms (site search, popup inputs) | 3 |
| Visual / layout | 3 |
| PDFs (slides, reading, exams) | 6 |
| Content / link text | 3 |

## Five detailed examples

### 1. I-01 — Lecture video has no captions (1.2.2, Critical)

The only way to watch Lecture 1 inside the module is a JS popup embedding a
Flash-era JW Player. The player has no caption control; the module links no
caption file and no transcript; YouTube (the modern embed source) carries only
machine-generated, uncorrected auto-captions. A deaf learner can download an MP4
— and still gets no words.

**Before:** `audit/manual-evidence/before/before-video-popup.png` (popup with
player, no CC control).

**Fix:** `docs/module/video.html` embeds a standard `<video>` element with
`<track kind="captions" src="media/captions-en.vtt">`. Caption **text** comes
from MIT's official human transcript (PDF); cue timings were aligned against the
auto-caption timing skeleton and reviewed. Caption accuracy against the audio is
**pending** (STT word-error-rate check: `npm run eval:pending`; human protocol:
`evaluation/human-protocol/caption-accuracy-check.md`). Caption accuracy is NOT
marked "fixed" anywhere on STT-dependent evidence.

### 2. I-02 — Visual-only lecture content, no audio description (1.2.5, Critical)

The Session Overview promises "fascinating examples and fun demonstrations on
topics like optical illusions" — content that exists only on screen. There is no
audio description, and the demo visuals are described nowhere in text.

**Fix:** `docs/module/video.html` adds a chapter-by-chapter **extended text
description** (honestly labeled as a text alternative, not a recorded audio
description), and the HTML slide deck reproduces the on-screen visuals with
descriptions and data.

### 3. I-14 — Skip link that keyboard users cannot reach (2.4.1, High)

```html
<a href="#main" class="skip" tabindex="-1">skip to content</a>
```

`tabindex="-1"` removes the link from the Tab order. A scripted 120-key tab
through the page (79 unique stops) never lands on it; without JavaScript the
bypass mechanism simply does not function. Keyboard users must tab through
~60 navigation stops to reach content.

**Before:** `audit/manual-evidence/before/manual-pass-results.json`
(`keyboard.stops`, skip link absent; DOM inspection).

**Fix:** keyboard-reachable skip link as the first tab stop on every remediated
page, visible on focus, target verified.

### 4. I-20 — Fixed-width layout fails 320 px reflow (1.4.10, High)

At a 320 px viewport (WCAG's 400%-zoom reference), the unit and exam pages
render a 952 px-wide document — the content column is cut off and horizontal
scrolling is required for every sentence.

**Before:** `audit/manual-evidence/before/before_introduction_index-320px.png`
(cropped content at 320 px).

**Fix:** the remediated module uses a fluid layout with relative units; reflow
verified at 320 px and at 400% zoom (no horizontal scroll):
`audit/manual-evidence/after/`.

### 5. I-27 — Textbook-only tables referenced, never included (Medium)

The study-outline PDF tells learners: "See p. 14, Table 1 for summary of Schools
of Psychological Thought" and "See p. 29, Table 3 for Summary of Research
Methods" — but those tables live in the copyrighted textbook, not in the
distributed PDF. A learner studying from the module alone cannot see the
summaries the outline depends on. (An earlier draft of this log claimed the
PDF contained an untagged table; a page-by-page render inspection showed the
PDF contains no table at all — the claim was corrected.)

**Before:** page renders of the study-outline PDF (no table anywhere);
text line 333: "See p. 14, Table 1 …".

**Fix:** `docs/module/lesson.html` includes a Schools of Psychological Thought
summary table built **from the outline's own text** (credited in a table
caption), making the module self-contained; the textbook references remain, with
a note about what the textbook adds.

## Issue ↔ WCAG quick map (for the conformance report)

| WCAG criterion | Issues |
|---|---|
| 1.1.1 Non-text Content | I-24, I-25, I-26, I-28, I-29 (+ I-21 fallback) |
| 1.2.1 / 1.2.2 / 1.2.3 / 1.2.5 | I-01, I-02, I-03 |
| 1.3.1 Info and Relationships | I-10, I-11, I-12, I-13, I-15 (+ I-23 remark, I-27 content gap) |
| 1.4.3 / contrast | I-21 (robustness only) |
| 1.4.10 Reflow | I-20 |
| 2.1.1 / 2.1.2 Keyboard | I-04, I-32, I-06 |
| 2.4.1 Bypass Blocks | I-14, I-09 |
| 2.4.3 Focus Order | I-05 |
| 2.4.4 Link Purpose | I-07, I-08, I-15, I-31 |
| 2.4.6 Headings and Labels | I-12 |
| 2.5.8 Target Size (2.2, best practice) | I-22 |
| 3.3.2 Labels or Instructions | I-16, I-17 |
| 4.1.2 Name, Role, Value | I-16, I-18, I-19, I-15 |
| 2.4.2 Page Titled (remark) | I-33 |
