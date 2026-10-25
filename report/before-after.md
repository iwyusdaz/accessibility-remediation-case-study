# Before / after evidence

All measurements 2026-10-25. Raw exports: `audit/automated-results/` (JSON),
`audit/manual-evidence/` (JSON + screenshots). Reproduce with
`npm run serve` + the commands in `audit/methodology.md`.

**Important honesty note:** tool scores are not conformance. They are one
input; the issue log (33 issues, all agent-verified) and the scripted manual
pass carry most of the findings.

## 1. Automated tool counts

### axe-core 4.11.1 (WCAG 2.1 A/AA + best practice)

| Page | Before | After |
|---|---|---|
| Course home | 5 violations (1 critical, 1 serious, 3 moderate) | — (replaced by module pages) |
| Unit 1 session page | 4 violations (1 critical, 3 moderate) | — |
| Exam 1 page | 4 violations (1 critical, 3 moderate) | — |
| Module overview | — | **0** |
| Lesson | — | **0** |
| Slides | — | **0** |
| Video | — | **0** |
| Quiz | — | **0** |
| Transcript | — | **0** |
| Case study landing | — | **0** |
| Faculty guide | — | **0** |
| Demo transcript | — | **0** |
| **Total** | **13** | **0** |

Recurring before-failures: unlabeled search field (critical, 3 pages), missing
frame titles (serious, home), heading-order skips, no main landmark, 20–55
elements outside landmarks per page.

### Lighthouse 13.0.1 (accessibility category)

| Page | Before | After |
|---|---|---|
| Course home | 77 | — |
| Unit 1 page | 81 | — |
| Exam 1 page | 79 | — |
| Landing / faculty guide / module × 5 pages / transcript | — | **100 (all 8 audited pages)** |

Before-failure audits beyond axe's set: `target-size` (24–35 undersized touch
targets per page).

### pa11y 9.0.0 (WCAG2AA, second engine)

| Page | Before | After |
|---|---|---|
| Course home | 4 | — |
| Unit 1 page | 8 | — |
| Exam 1 page | 2 | — |
| All remediated pages | — | **0** |

Unique pa11y contributions: 6 chapter links with `href="#?w=535"` and no
matching anchor; H91/H68 form-field name errors.

## 2. Issue log outcome

33 issues logged (see `audit/issue-log.csv`); **33 fixed**, 0 critical or
serious remaining:

| Severity | Before | Fixed |
|---|---|---|
| Critical | 3 | 3 (I-01 captions — with accuracy check pending; I-02 audio description — as text alternative; I-16 unlabeled search) |
| High | 11 | 11 |
| Medium | 13 | 13 |
| Low | 6 | 6 |

Two corrections made during verification (documented in the log): the reading
PDF's "Table 1" turned out to be a textbook reference, not an untagged in-PDF
table (I-27); the reading PDF contains no content figures at all (I-28).

## 3. Scripted manual pass

| Check | Before | After |
|---|---|---|
| Keyboard trap | none found | none found (11/11 task tests pass) |
| Skip link | unreachable (`tabindex="-1"`) | first tab stop, moves focus to main |
| Focus visibility | default outlines (0–2 ambiguous stops) | explicit 3px ring on every focusable element incl. video (`:focus-within`), 5.50:1 |
| 320 px reflow | unit + exam pages: 952 px documents → fail | all 9 pages: no horizontal scroll |
| Contrast failures (measured) | 1 flagged (image-replacement banner; documented) | 0 |
| Landmarks | none | header/nav/main/footer on every page |
| Headings | logo-only h1; topic missing | one content h1 per page, logical order |
| Video | Flash-era popup; no captions; no transcript; focus not moved; Escape dead | `<video>` + captions track + chapter buttons + transcript; operable by keyboard |

Screenshot pairs (`audit/manual-evidence/`):

| View | Before | After |
|---|---|---|
| Session page (desktop) | `before/before-unit-introduction.png` | `after/after-module-overview.png` |
| Lesson/table | — | `after/after-lesson.png` |
| Quiz with feedback | — | `after/after-quiz-feedback.png` |
| Video popup vs player | `before/before-video-popup.png` | (inline player, `module/video.html`) |
| 320 px reflow | `before/before_introduction_index-320px.png` | `after/module_*-320px.png` (no scroll) |

## 4. Notes

- **Time per remediation task (pilot, agent-produced — not used as a human
  benchmark):** HTML lesson conversion and slide-deck rebuild were the largest
  single tasks; caption derivation from the publisher transcript was a build
  step (see `docs/module/media/captions-build-report.json`). Human-effort
  estimates for scaling deliberately come from published benchmarks, not from
  these agent timings (`program/prioritization-model.md`).
- The original course home page happens to fit 320 px; unit and exam pages do
  not — the fixed-width grid differs between templates.
- All "after" numbers include the case study site itself: reviewers can run
  the same suite against the live Pages deployment.
