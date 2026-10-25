# Audit methodology

**Case study:** WCAG 2.1 AA audit and remediation of one real course module —
Unit 1 ("Introduction") of *9.00SC Introduction to Psychology, Fall 2011*
(Prof. John Gabrieli, MIT OpenCourseWare, CC BY-NC-SA 3.0 US).
Fictional framing: piloted for Lakeside State University, **a fictional US public
university preparing for ADA Title II digital accessibility compliance**.

**Audit dates:** 2026-10-25 (original) / 2026-10-25 (remediated verification).

## Scope

One module ≈ one week of a course:

| Artifact | Format | Audited how |
|---|---|---|
| Course home page (`before/index.htm`) | HTML | axe, pa11y, Lighthouse, scripted keyboard/reflow/contrast pass, DOM inspection |
| Unit 1 session page (`before/introduction/index.htm`) | HTML | same |
| Exam 1 page (`before/exam-1/index.htm`) | HTML | same |
| Lecture 1 slides (`MIT9_00SCF11_lec01.pdf`, 54 pp.) | PDF | PDF tag-tree inspection (pypdf: `/StructTreeRoot`, `/MarkInfo`, `/Alt`, table tags), text extraction, page text density |
| Study outline PDF (`MIT9_00SCF11_read_kr1.pdf`, 10 pp., contains Table 1) | PDF | same |
| Exam 1 + practice exams + solutions (4 PDFs) | PDF | same |
| Lecture 1 video (~50 min) | streaming (Flash-era player; MP4 at Internet Archive) | markup inspection, popup behavior test with keyboard, caption/transcript availability check |
| Video popup (JS dialog with embedded player) | HTML/JS | keyboard operability test (Tab/Enter/Escape), focusable-element inventory |

The audit target is the Internet Archive snapshot in `docs/before/`, served over
local HTTP (`python3 -m http.server 8900 --directory docs`). The snapshot is the
original module as captured in November 2012; asset paths are localized (disclosed
in `source/README.md`), analytics beacons neutralized. The video itself stays at
the publisher (linked, not copied); the in-module video section and its JS popup
are audited from the snapshot.

## Standard and tools

- **Standard:** WCAG 2.1 Level A + AA ([W3C WCAG 2.1](https://www.w3.org/TR/WCAG21/)).
  WCAG 2.2 was additionally noted as best practice where relevant
  (e.g., 2.4.11 Focus Not Obscured, 2.5.8 Target Size) and labeled as
  "exceeds requirement" in the remediation.
- **Tools (all pinned, see repo `package.json` and workspace TOOLS.md):**
  - axe-core **4.11.1** via Playwright 1.57.0 (WCAG 2.1 A/AA + best-practice rules)
  - Lighthouse **13.0.1** (accessibility category), Google Chrome (system), headless
  - pa11y **9.0.0** (`--standard WCAG2AA`, HTML_CodeSniffer rules) as a second engine
  - Playwright **1.57.0** scripted checks (keyboard, focus, reflow, screenshots)
  - pypdf for PDF structure inspection
  - Contrast ratios computed from rendered `getComputedStyle` colors with the
    WCAG relative-luminance formula (script: `scripts/manual-pass.mjs`)
- **Browsers:** Chromium 143 (Playwright headless) for scripted checks; Chrome
  (system) for Lighthouse. Safari was not scriptable in this environment; the
  scripted checks use standard rendering paths (no engine-specific behavior is
  claimed).
- **WAVE / axe DevTools browser extensions** were not used (no GUI browser session
  in this environment); the CLI engines above cover the same rule sets.

## Who did what — method transparency

This audit was performed by an **AI agent with scripted tools** (documented
here as "Agent (scripted tools)"). Every automated and scripted result in this
folder is reproducible from the repository. The following checks are **pending
human verification** and are explicitly marked as such in the conformance report:

| Check | Status |
|---|---|
| axe / Lighthouse / pa11y runs | Done — Agent (scripted tools), exports in `automated-results/` |
| Keyboard tab-through, operability, traps | Done — Agent (scripted tools, Playwright) |
| Focus visibility | Done — Agent (scripted: computed outline/box-shadow on focus + screenshots) |
| 320 px reflow (= 400% zoom of 1280 px window) | Done — Agent (scripted) |
| Rendered color-contrast measurement | Done — Agent (scripted, WCAG formula) |
| PDF tag-tree inspection | Done — Agent (scripted, pypdf) |
| Caption/transcript availability + popup behavior | Done — Agent (scripted) |
| **VoiceOver screen-reader pass (before/after rotor checks)** | **PENDING human** — protocol in `evaluation/human-protocol/voiceover-protocol.md`. VoiceOver automation (Guidepup) does not function on macOS 27, and aria snapshots are not a substitute for a real screen reader. No screen-reader results are claimed anywhere in this repo. |
| **Caption accuracy against the audio** | **PENDING** — publisher-transcript text + machine-aligned timings; STT word-error-rate check via `npm run eval:pending` after keys are added; human protocol in `evaluation/human-protocol/caption-accuracy-check.md`. |
| **Review by a daily assistive-technology user** | **PENDING human** — invitation template in `evaluation/human-protocol/at-user-review-invite.md`. Absence of this review is a stated limitation. |

## Sampling

All module pages were audited (no sampling — the module is 3 HTML pages +
6 PDFs + 1 video section). The case study site itself (`docs/index.html`,
`docs/module/*`, `docs/program/*`) was audited with the same axe/keyboard/
reflow/contrast suite (see `automated-results/after/`).

## Known limits of automated tools

Automated engines catch only a minority of WCAG failures that require judgment
(alt text *quality*, reading order *meaning*, link purpose, captions accuracy).
That is why the issue log is built from the scripted manual pass and file
inspection, with the automated exports as corroboration. Tool scores (e.g.,
Lighthouse accessibility score) are **not** conformance claims.
