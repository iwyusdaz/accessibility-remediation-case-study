# Changelog

## 1.0.1 — 2026-10-26
Revision round from the fresh-context agent review (`evaluation/agent-review.md`).
- **Corrected I-10/I-11 evidence chain:** the page topic IS an `<h1>` on every
  before page; the actual defects are the duplicate logo-first h1 and the topic
  heading buried after 15 sidebar h3s. Restated in the issue log and corrected
  at every propagation site (landing, conformance report, manual-testing notes,
  VoiceOver protocol). "Does Not Support" before-verdicts for 1.3.1/2.4.6 stand
  on the remaining grounds.
- **Live-site fixes:** landing-page screenshots moved into `docs/assets/`
  (the `../audit/` sources 404'd on GitHub Pages); video-page evaluation links
  and the `#evidence` anchor fixed; whole-site link checker added
  (`scripts/check-links.mjs` — images, prefix escapes, fragments, all pages).
- **Data integrity:** `audit/issue-log.csv` regenerated with a proper CSV
  writer (6 malformed rows fixed; I-27 scrubbed of disproved-claim fragments,
  explicit non-SC classification); severity counts re-derived from the CSV
  (3 critical / 10 high / 14 medium / 6 low) and propagated everywhere.
- **Conformance report:** added the four missing WCAG 2.1 Level A rows
  (2.5.1-2.5.4); 2.5.3 Label in Name actually tested (207 controls, 0
  violations - `scripts/check-label-in-name.mjs`). 1.2.2/1.2.5 remain
  Partially Supports pending the STT check.
- **Site pages:** conformance report, prioritization model, and remediation
  workflow rendered under `docs/report/` + `docs/program/`; landing page links
  the live "before" snapshot; quiz wrong-answer feedback links the specific
  lesson section; prioritization model unified to one checkable formula with
  numeric Effort scores; scripted evidence re-run (manual pass on all 9 pages,
  11/11 keyboard tests, axe 0 violations on all 13 pages, gitleaks clean).

## 1.0.0 — 2026-10-25
First release.
- Real source module: MIT OCW 9.00SC Introduction to Psychology, Unit 1
  (CC BY-NC-SA 3.0 US), retrieved from Internet Archive captures.
- WCAG 2.1 AA audit of the original: axe-core 4.11.1, Lighthouse 13.0.1,
  pa11y 9.0.0, scripted keyboard/reflow/contrast passes; issue log with
  25+ issues.
- Remediated module in semantic HTML: lesson (with accessible data table),
  slides with speaker notes, video page (linked video, corrected-caption VTT
  derived from the publisher transcript, transcript page), accessible quiz.
- Conformance report (criterion-by-criterion, before → after), before/after
  evidence, executive summary.
- Program materials: catalog prioritization model with cited effort benchmarks,
  remediation workflow, faculty quick guide.
- Pending pipeline for caption accuracy (STT word-error-rate) with dry-run mode.
- Demo video: scripted keyboard navigation, captioned, honestly labeled.
