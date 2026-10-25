# Decision log

Design and process decisions for this case study, with alternatives considered.

## 1. Source module: MIT OCW 9.00SC Introduction to Psychology, Unit 1

**Decision.** Audit and remediate Unit 1 ("Introduction") of *9.00SC
Introduction to Psychology, Fall 2011* (Prof. John Gabrieli, MIT OpenCourseWare),
an OCW Scholar course, retrieved 2026-10-25 from Internet Archive captures of the
2011–2012 site. License: CC BY-NC-SA 3.0 US, verified on the retrieved page
itself (`rel="license"` link).

**Why.**
- One coherent week of content in **every required format**: session web page,
  lecture slide PDF (54 pages), study-outline PDF (10 pages, whose outline
  references textbook-only summary tables), a ~50-minute lecture video
  (publisher transcript exists on the modern OCW site), and practice exams with
  solutions (usable as the module quiz).
- **Real problems**: the video section of the original page is a
  "Flash and JavaScript are required" shell with only download links — no
  embedded accessible player, no captions or transcript linked from the page.
  The slide PDF carries meaning mostly in figures with export junk alt text
  ("Text Box:", filenames); the study-outline PDF contains no table and no
  content raster figures — its "Table 1"/"Table 3" are references to the
  copyrighted textbook, which became a content-completeness fix (I-27).
- **License is verifiable and permissive enough**: redistribution and adaptation
  permitted (BY-NC-SA); nothing needs "NoDerivatives" workarounds.
- **Non-math topic** (per plan guidance; math accessibility is out of scope).

**Alternatives considered.**
- *Saylor Academy units (CC BY)*: cleaner HTML, but too few genuine issues for a
  credible ≥25-issue audit of the original.
- *LibreTexts / Pressbooks chapters (CC BY / CC BY-NC-SA)*: modern platform,
  few issues; no slide deck or exam component per chapter.
- *Wikiversity (CC BY-SA)*: poor content coherence — no single module combining
  all five formats.
- *A modern MIT OCW page (live)*: accessible rebuild, would understate the real
  remediation problem; the 2011 design is the authentic "original" that students
  of that era actually used.

**Trade-off acknowledged.** The video is ~50 minutes (the plan prefers ≤10
minutes to limit caption work). Because the publisher's human transcript exists,
the caption work is text conversion + timing alignment rather than transcription,
so the length does not add meaningful risk. The video is linked, not copied (size).

## 2. Audit the archived snapshot, served locally

**Decision.** The audit target is the Internet Archive snapshot in
`docs/before/`, served over a local HTTP server — not the live web.archive.org
rendering.

**Why.** Live archive pages inject the Wayback toolbar and rewrite URLs, which
would pollute both screenshots and axe results. A local, static snapshot is
reproducible by any reviewer (`node scripts/snapshot-source.mjs` + `npm run serve`).
**Trade-off:** the snapshot is one capture date per page (Nov 2012), not the
"moving" live site.

## 3. PDF issues audited from the file structure, not assumed

**Decision.** Claims about the PDFs come from inspecting the actual PDF tag
trees (pypdf: `/StructTreeRoot`, `/MarkInfo`, `/Alt` entries, table tags), text
extraction, and page text density.

**Why.** "PDFs are untagged" is the stock claim in accessibility case studies —
and it would have been **wrong** here: all six module PDFs are tagged with
document titles and language set. The real, checkable defects are different:
figures with junk/missing alt text, an outline that references summary tables
that exist only in the copyrighted textbook (the PDF itself has no table and no
content raster figures — the outline's reference became the I-27
content-completeness fix), and chart data unavailable as text. Documenting the
method keeps the audit falsifiable.

## 4. Slides and lecture notes become HTML, not tagged PDFs

**Decision.** The remediated module presents the slides as HTML sections with
speaker notes, and the reading as a semantic HTML lesson page with a proper
HTML table. No PDF is shipped in the remediated module.

**Why.** HTML reflows, works with screen readers without PDF reader mode quirks,
is searchable, and is maintainable by instructors. The original PDFs remain in
`docs/before/` for comparison. Tagging the PDFs properly was rejected because
tag repair at scale needs Acrobat Pro workflows the target audience (faculty,
small ID teams) does not have.

## 5. Captions derived from the publisher transcript, timings aligned

**Decision.** `docs/module/media/captions-en.vtt` uses MIT's official human
transcript as the text source. Cue timings were aligned automatically against
the timing skeleton of YouTube's automatic captions for the same video (the
only timing source available), then hand-reviewed at chapter boundaries.

**Why.** The video itself is remote (too large for the repo) and its only
embedded captions are machine-generated and uncorrected — exactly the 1.2.2
failure mode. Deriving captions from the publisher transcript gives correct
text with plausible timings without touching the (NC-licensed) video file.

**Honesty boundary.** No speech-to-text comparison against the audio has been
run, so caption accuracy is documented as "text from the publisher transcript;
timing alignment machine-assisted; final audio check pending" — and the STT
word-error-rate check stays `PENDING: requires API key`
(`npm run eval:pending`). Nothing is labeled "fixed" on that evidence alone.

## 6. Screen-reader evidence without VoiceOver automation

**Decision.** Scripted checks use Playwright `ariaSnapshot()` plus keyboard,
reflow and contrast scripts; VoiceOver manual testing is **not** claimed. A
step-by-step human VoiceOver protocol, an AT-user review invitation, and a
caption-accuracy human check protocol are provided in `evaluation/human-protocol/`.

**Why.** Guidepup VoiceOver automation does not function on macOS 27 (verified;
see TOOLS.md in the workspace). Fabricating "VoiceOver testing" or presenting
aria snapshots as screen-reader testing would overstate the evidence. The
absence of a review by a daily assistive-technology user is stated as a
limitation in the README, the conformance report, and the program materials.

## 7. Severity model based on task blocking

**Decision.** Issues are ranked critical / high / medium / low by whether they
block a task (quiz submission, video access), create major difficulty, leave a
workaround, or are best practice — not by WCAG level alone.

**Why.** Teams triage by impact. A level-AA color contrast fail on a footnote
and a keyboard-trapped quiz are both "AA", but they are not the same urgency.
(Conformance reporting still uses the formal WCAG status vocabulary.)

## 8. Program view: benchmark-cited effort estimates, not AI-agent timing

**Decision.** The prioritization model cites published human captioning and
remediation benchmarks (with URLs and access dates) for effort estimates. No
estimate is derived from how long an AI agent took.

**Why.** The model's purpose is staffing and scheduling decisions for human
teams. Agent processing time would produce misleading numbers.

## 9. Fictional framing, real content

**Decision.** The institutional story (Lakeside State University, 300-course
catalog, prioritization table) is fictional and labeled; the audited module is
real. Lakeside State University is described everywhere as "a fictional US
public university preparing for ADA Title II digital accessibility compliance."

**Why.** The craft evidence must be real to be credible; the program story
needs a scale example that would be dishonest to claim about a real employer.

## 10. Revisions from the agent review, 2026-10-26

A fresh-context reviewer agent audited the published repo
(`evaluation/agent-review.md`, committed this round). Headline findings and
what was changed:

1. **I-10 and I-11 were factually wrong — the evidence chain was corrected.**
   Every "before" page has the page topic as a real `<h1>`; the earlier entries
   ("topic not a heading", "logo is the only h1") misread the markup. The
   actual defects: two h1s per page (logo image h1 first), topic h1 buried
   after the sidebar's 15 third-level headings. Restated in the issue log and
   corrected at every propagation site (landing page, conformance report
   1.3.1/2.4.6, manual-testing notes, VoiceOver protocol step B2). The
   "Does Not Support" before-verdicts for 1.3.1/2.4.6 stand on the remaining
   grounds (no landmarks, level skips, state-less toggles, duplicate h1).
   Severity retained at high: heading navigation is broken at the top level on
   every page. Lesson: the audit corrected two PDF claims (I-27/I-28) and
   missed two heading claims — both classes are now review-checked.
2. **Live-site defects fixed:** the landing page's two screenshots 404'd on
   GitHub Pages (`../audit/…` escapes the deployment root) — screenshots now
   live in `docs/assets/`; the video page linked `../../evaluation/METHODS.html`
   (not deployed) and a nonexistent `#evaluation` anchor — fixed. The whole
   -site link check was rewritten (`scripts/check-links.mjs`: all pages, image
   targets, prefix escapes, fragment targets) because the old single-page
   crawl was blind to exactly those classes (documented in methodology).
3. **Data integrity:** `audit/issue-log.csv` was regenerated with a proper CSV
   writer — 6 rows had field-count errors and I-27's row still carried
   fragments of the disproved table claim in its criterion/level cells. I-27
   now has an explicit non-SC classification (content-completeness gap). All
   severity counts were re-derived from the CSV (3 critical / 10 high /
   14 medium / 6 low) and propagated to every surface that publishes counts.
4. **Conformance report completeness:** added the four missing WCAG 2.1 Level
   A rows (2.5.1–2.5.4); 2.5.3 Label in Name was actually tested
   (`scripts/check-label-in-name.mjs`: 207 controls on 9 pages, 0 violations)
   before claiming Supports. 1.2.2/1.2.5 remain Partially Supports pending the
   STT check — not upgraded. Three before-statuses were sharpened on review
   (2.1.1 Does Not Support — the video was simply unavailable to keyboard
   users; 2.4.7 Partially Supports; single status per cell in 3.3.1/3.3.3).
5. **Smaller accuracy fixes:** the pre-correction "Table 1" wording in this
   file (§1, §3) and ATTRIBUTION.md; I-24's count (17 of 20 junk, not 20);
   `package.json` license string (3.0 US, not 4.0); quiz wrong-answer feedback
   now links the specific lesson section; the prioritization model's formula
   is stated once — (Impact + Exposure) ÷ Effort — with numeric Effort scores
   so the course ranking is checkable (re-ranked accordingly); the conformance
   report and program documents are rendered as site pages
   (`docs/report/`, `docs/program/`), and the landing page links the live
   "before" snapshot for click-through comparison.
