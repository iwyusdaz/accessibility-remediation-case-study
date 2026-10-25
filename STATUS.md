# Status

Updated: 2026-10-26 (revision round from the fresh-context agent review)

## Done
- Source module selected, license verified on the retrieved page (CC BY-NC-SA
  3.0 US), snapshot retrieved from Internet Archive into `source/` + renderable
  copy in `docs/before/`
- Automated audits of the original (axe-core 4.11.1, Lighthouse 13.0.1,
  pa11y 9.0.0) saved in `audit/automated-results/before/`
- Scripted manual pass of the original (keyboard, focus, 320 px reflow,
  measured contrast, PDF tag trees) in `audit/manual-testing-notes.md` +
  `audit/manual-evidence/before/`
- Issue log: 33 issues (3 critical / 10 high / 14 medium / 6 low), all fixed;
  four entries corrected during verification for accuracy (I-27/I-28 in the
  authoring session; I-10/I-11 in the 2026-10-26 review round)
- **2026-10-26 revision round (from `evaluation/agent-review.md`):** I-10/I-11
  evidence chain corrected everywhere (topic IS an h1; real defects are the
  duplicate logo-first h1 and the topic buried after 15 sidebar h3s); live
  404s fixed (landing screenshots moved into `docs/assets/`, video-page links
  and `#evidence` anchor); `audit/issue-log.csv` regenerated with a proper CSV
  writer (I-27 row scrubbed of disproved-claim fragments, explicit
  non-SC classification); conformance report completed with WCAG 2.1 Level A
  2.5.1–2.5.4 (2.5.3 Label in Name actually tested: 207 controls, 0
  violations — `scripts/check-label-in-name.mjs`); whole-site link check
  rewritten (`scripts/check-links.mjs`: images, prefix escapes, fragments);
  conformance report + program documents rendered as site pages
  (`docs/report/`, `docs/program/`); quiz feedback links the specific lesson
  section; prioritization model unified to one checkable formula with numeric
  Effort scores; script evidence re-run (manual pass on all 9 site pages,
  11/11 keyboard tests, label-in-name, link check local + live, gitleaks)
- Remediated module in `docs/module/` (overview, lesson with data table,
  54-slide HTML deck with speaker notes, video page with captions from the
  publisher transcript + chapter buttons + text description, full transcript,
  accessible quiz with live-region feedback)
- Verification of the remediated site: 0 axe violations on all 9 pages,
  Lighthouse 100 on all 8 audited pages, 11/11 scripted keyboard task tests,
  320 px reflow pass, 0 measured contrast failures (ratios documented in CSS)
- Reports: `report/conformance-report.md` (not an official VPAT),
  `report/before-after.md`, `report/executive-summary.md`
- Program materials: `program/prioritization-model.md` (benchmark-cited),
  `program/remediation-workflow.md` (Mermaid + text), `program/faculty-quick-guide.md`
  + `docs/faculty-quick-guide.html`
- Pending pipeline verified: `npm run eval:pending` exits 1 with a clear
  message and zero network calls without keys; `npm run eval:dry-run` writes
  stubs to `dry-run/` labeled "DRY RUN – NOT REAL RESULTS"
- Demo video: scripted keyboard navigation, captioned + transcribed, honestly
  labeled as automation (`docs/assets/demo-keyboard-navigation.*`)
- Evaluation: `evaluation/METHODS.md` (+ HTML mirror),
  `evaluation/agent-review.md`, three human protocols in
  `evaluation/human-protocol/`
- ADA Title II dates verified against Purdue and CSU Stanislaus pages
  (2026-10-25); extension to April 26, 2027 for large entities; archived-content
  exception noted
- Published on GitHub Pages

## Pending (requires human action or API keys)
- **Caption accuracy (STT word-error-rate):** `npm run eval:pending` after
  adding STT keys to `.env` (see `.env.example`). Until then the conformance
  report lists 1.2.2/1.2.5 as Partially Supports; caption text comes from the
  publisher's official transcript.
- **VoiceOver manual pass:** Guidepup automation does not work on macOS 27;
  a human must run `evaluation/human-protocol/voiceover-protocol.md`
  (before/after rotor checks).
- **Daily AT user review:** invitation template in
  `evaluation/human-protocol/at-user-review-invite.md`; strongest missing
  evidence.
- **Caption timing spot-check:** human review of `.vtt` timing comfort
  (`evaluation/human-protocol/caption-accuracy-check.md`).
- **Fresh-context reviewer pass** (the agent review ran in the authoring
  session; same-model and same-context limitations disclosed).

## Known limitations (disclosed, not fixable here)
- No review by a person who uses assistive technology daily.
- No VoiceOver automation evidence; aria snapshots + keyboard scripts are not
  screen-reader testing.
- "Lakeside State University" is fictional; the audited module is real.
- Not an official VPAT; no conformance certification is claimed.
- [Email]/[LinkedIn] placeholders are the owner's to fill in.
