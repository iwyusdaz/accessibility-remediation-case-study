# Agent review — accessibility-remediation-case-study

Reviewer: separate AI reviewer agent (fresh context), 2026-10-26. Limitation: the reviewer may share the same underlying model as the author. This is not human or educator review.

---

## 1. Scope and method

This review was performed in a fresh context by a reviewer agent that did not build the repository. Per the portfolio overview (§2, "Replacing [HUMAN] tasks"), it covers:

| Method | What was actually done |
|---|---|
| Cognitive walkthrough | Walked the live site end to end as a higher-ed instructional designer remediating a first course: landing → module overview → lesson → slides → video → transcript → quiz → conformance report → prioritization model. Details in §3. |
| Heuristic evaluation | Nielsen's 10 heuristics against the live site, severity 0–4, with evidence (§4). |
| Structured review | Completed the repo's only structured review form (the result template in `evaluation/human-protocol/at-user-review-invite.md`), adapted and clearly labeled — see §2. Note: the review instruction expected a reviewer form in `evaluation/human-protocol/`; none exists there (see finding F13). |
| Repo-specific probes | Evidence-chain sampling (I-14, I-20, I-24, I-26, I-27, I-28 + the I-10/I-11 break), CSV forensics, PDF tag-tree re-inspection (pypdf/pymupdf), conformance-report completeness check against the full WCAG 2.1 A/AA criterion list, honesty-boundary greps, benchmark and ADA Title II source verification (live fetches of 3Play Media, WebAIM, Equidox, Purdue, CSU Stanislaus), license audit (§5). |
| Site quality | axe-core (workspace `tooling/audit-axe.mjs`) on 5 live URLs incl. module pages → `/tmp/review04-axe`; Playwright keyboard/quiz/video spot-checks (13 checks); same-origin link crawl (11 pages); 320 px reflow check; manual scan of all `docs/**` HTML for escaping paths and broken fragments. |

All file references are repo-relative unless marked "live".

---

## 2. Structured review form (completed)

The repo's only structured review form is the "Result template" in `evaluation/human-protocol/at-user-review-invite.md`, written for a paid daily-AT-user reviewer. It is completed here **adapted and clearly labeled**: this reviewer is an AI agent doing a heuristic/structured review, **not** a person who uses assistive technology daily, and this review does not substitute for that review (portfolio rule: never simulate disabled users).

```
Reviewer: AI reviewer agent (fresh context, 2026-10-26) — METHOD LABEL: Agent heuristic review.
AT used: N/A (agent review; Playwright/Chromium scripted checks + axe-core CLI, no assistive technology)
Date: 2026-10-26    Paid: N/A
Tasks attempted:
  - Land on live case study, follow problem → module → findings → fixes → scaling narrative
  - Open remediated module pages (lesson, slides, video, transcript, quiz) and use them
  - Keyboard-only pass: skip link, module nav, radio groups (arrow keys), check-answer,
    live-region feedback, video chapter buttons, video focus indicator
  - Use the conformance report + prioritization model to answer "what do I do about MY course?"
  - Verify evidence chain for sampled issue IDs against tool exports and live pages
Issues found (severity, description):
  - F1 (severity 3, honesty/accuracy): issue-log I-10/I-11 misstate the original markup —
    see §5.1. Propagated into the live landing page, the conformance report, manual-testing
    notes, and the VoiceOver protocol.
  - F2 (severity 3, live defect): both before/after screenshots on the live landing page are 404.
  - F3 (severity 2, live defect): two broken links on the live video page (../../evaluation/…),
    one broken in-page anchor (#evaluation does not exist on the landing page).
  - F4 (severity 3, data integrity): audit/issue-log.csv does not parse as CSV (6 malformed
    rows); I-27's row is field-shifted and still carries fragments of the disproved claim.
  - F5 (severity 2, consistency): severity counts are published as three different
    distributions in five different files; none matches the CSV.
  - F6 (severity 2, spec gap): conformance report omits WCAG 2.1 Level A 2.5.1–2.5.4.
  - F7–F12: see §6 (stale pre-correction claim in DECISIONS.md/ATTRIBUTION.md; I-24 count;
    incomplete after-pass JSON; program docs not rendered on the live site; package.json
    license string; vague quiz error suggestions).
What the automated audits missed:
  - Broken <img> targets and prefix-escaping links (axe and the same-origin link crawler
    are both structurally blind to these)
  - Broken in-page fragment targets
  - Factual errors in the issue log's prose (claims about the original markup that no tool checks)
  - CSV structural corruption and cross-file count drift
Changes made in response: none by this reviewer (review only; suggested revisions in §6).
Permission to quote: N/A (agent review; label governs).
```

---

## 3. Cognitive walkthrough — higher-ed instructional designer, first remediation

Persona: an ID at a US public university who has just been told their courses must meet WCAG 2.1 AA by April 2027 and must pilot the process on one module.

**What works well on the path (genuinely good):**

1. **The first screen answers "is this real?"** The lede + framing note states the fictional client and the real module up front; the evaluation-status note appears before any claim is made. The "no screen-reader testing has been done" statement on the landing page is unusually honest and builds trust for everything that follows.
2. **The module is coherent as a module.** The overview page's "What is in this module" table plus "Suggested order" (read → skim → watch → quiz) matches how an ID would actually pilot a week of content. Each remediated artifact corresponds to something they have in their own LMS.
3. **The video page is the strongest page in the repo.** Captions-status `<dl>` (text source / timing method / accuracy pending / audio description status), the text description of visuals organized by chapter with anchor links into the slides, and fallback links to the MP4/YouTube/publisher page — an ID could copy this pattern directly for their own lecture videos.
4. **The prioritization model is usable as-is** — verified benchmarks with URLs and access dates, a 10-course worked example, sequencing that matches reality (fix-forward → quick wins → vendor captioning → archives), and explicit out-of-scope flags for math and code-heavy courses.
5. **The regulatory anchor is accurate.** Purdue (April 20, 2026 extension; large entities to April 26, 2027) and CSU Stanislaus (archived-content and pre-existing-document exceptions) were fetched by this reviewer and support the claims as written.

**Where the walkthrough stumbles (in walk order):**

1. **First screen, "Before and after": both images are broken on the live site** (F2). The first visual thing the persona sees is two 404 figures — on an accessibility case study whose whole pitch is evidence quality. The correct assets already exist at live `assets/before-after-pair.png` (HTTP 200).
2. **Findings table numbers don't reconcile with the CSV it links** (F5). The persona who clicks through to `issue-log.csv` and counts rows gets 10 high / 14 medium, not the 11 / 13 the landing page, README, STATUS, and before-after all publish — and `issue-log.md` publishes a third set of numbers with I-30 double-listed. For a repo whose brand is "every claim traces," a counting mismatch is exactly the kind of thing a hiring manager will catch.
3. **The conformance report — the artifact that answers "what do I do about MY course?" — is a GitHub blob link.** The persona must leave the site and read raw Markdown to learn the one thing the spec says the report is for (structure it like a VPAT table). The faculty guide got a rendered HTML page; the conformance report and the program materials did not. This is the largest single gap between the repo's ambitions and the landing-page experience (F9).
4. **The video page's honesty section — the most scrutinized section of the repo — contains two dead links and one dead anchor on the live site** (F3). An ID verifying the caption story clicks "evaluation/METHODS" in the captions-status block and gets a 404. Bad place to be broken.
5. **The inaccessible original is live but unlinked.** `before/index.htm` (HTTP 200) is never linked from the landing page or the module pages (only referred to as `docs/before/` in code font). The persona cannot do the single most persuasive thing: open the original in one tab and the remediation in the other. One link fixes it.
6. **Quiz feedback is a dead end for the exact learner it addresses.** A wrong answer says "Re-read the relevant lesson section and try again" — no link, no section name. For a persona evaluating this as a reusable quiz pattern, the suggestion is too vague to act on (F11).
7. **The "Scaling to 300 courses" section ships the persona to GitHub raw Markdown for two of its three links** (F9). Same root cause as (3).

The narrative itself (problem → module → findings → fixes → scaling) is complete and nothing in it overclaims. The stumbles are all defects of deployment and consistency, not of design.

---

## 4. Heuristic evaluation (Nielsen's 10) — live site

| # | Heuristic | Severity | Evidence |
|---|---|---|---|
| 1 | Visibility of system status | 1 | Quiz live region populates with verdict + score (verified by scripted test and locally by this reviewer); video chapter buttons give no textual confirmation, but the visible seek is adequate feedback. |
| 2 | Match between system and real world | 0 | Plain language throughout; Title II framing matches how universities actually talk about the rule. |
| 3 | User control and freedom | 0 | Quiz is retakeable and states "no time limit"; native video controls; no dead ends except where links are broken (F2/F3). |
| 4 | Consistency and standards | 1 | Module nav consistent across pages with `aria-current`; however the landing page links program materials to GitHub while the faculty guide is a site page — inconsistent depth of the same class of artifact (F9). |
| 5 | Error prevention | 0 | Per-question checking; no destructive operations. |
| 6 | Recognition rather than recall | 0 | Module contents table, suggested order, chapter buttons all reduce recall load. |
| 7 | Flexibility and efficiency of use | 0 | Chapter shortcuts into a 50-minute video are the right accelerator. |
| 8 | Aesthetic and minimalist design | 3 | The two broken hero images on the landing page (F2) — the flagship view renders with visible breakage. |
| 9 | Help users recognize, diagnose, recover from errors | 2 | Quiz wrong-answer feedback is textual and non-color-only (good), but "re-read the relevant lesson section" names no section and links nowhere (F11). |
| 10 | Help and documentation | 1 | Methodology/METHODS are thorough and honest; but the repo's own link-integrity method (same-origin crawler on one page) is exactly what missed F2/F3 — see F12. |

Aggregate: the site is structurally excellent (axe 0 violations on all 5 audited live URLs; 12/13 of this reviewer's scripted checks pass) with severity-3 defects that are all deployment/consistency bugs, not design bugs.

---

## 5. Repo-specific probes (as flagged by the builder)

### 5.1 Evidence chain — 5 sampled IDs, plus one break found beyond the sample

Sampled IDs and their verification outcome (all checked against raw exports and files, not the repo's summaries):

| ID | Export/scripted evidence | Fix present | Live verification | Verdict |
|---|---|---|---|---|
| I-01 (captions) | `docs/module/media/captions-build-report.json` (method, 828 cues, aligned 71%, accuracyStatus PENDING) | `<track kind="captions" src="media/captions-en.vtt" … default>` in `docs/module/video.html:52` | VTT fetches on live with 828 cue markers; track labeled and default | Holds |
| I-14 (skip link) | `manual-pass-results.json` (before): 79 unique stops, no skip-link stop; `class="skip" tabindex="-1"` present in before HTML | Skip link first tab stop on all remediated pages | Live: Tab lands on "Skip to main content", Enter moves focus to `#main` on quiz page | Holds |
| I-20 (reflow) | before JSON: `scrollWidth: 952` on unit + exam pages (home passes — correctly reported) | Fluid layout | Live landing: `scrollWidth=320` at 320 px viewport | Holds |
| I-24 (junk alt) | Raw `/Alt` inventory of `MIT9_00SCF11_lec01.pdf`: 20 entries; junk examples quoted in the log are all real (`scan569.jpg`, `A_B_color_constrast`, empty `Text Box:`) | HTML deck with figure descriptions | slides.html figures have alt + long descriptions | Holds, **but the count overstates**: ~17 of 20 are junk; 3 carry real descriptions ("Graph shows experiencer reports…", "Diagram showing psychology at the center…"). See F8. |
| I-26 (chart) | PDF page 51 text: only title + one alt sentence; no data values | `slides.html` has two chart-data `<table>`s with honest "approximate values read from the slide's bar chart" captions (line 745, 756) | — | Holds (note: the "approximate values" were AI-read from the chart image; the label doesn't say by whom — add "values estimated from the chart image during remediation; verify against the original figure" per the repo's own labeling standard) |

**The break beyond the sample — I-10 and I-11 are factually wrong (F1, MUST-FIX):**

- I-10 claims the page topic "Introduction" "is a styled `<span id="parent-fieldname-title">`, **not a heading — it never appears in a screen reader's headings list**." I extracted all `<h1>` elements from all three before pages: every page has exactly the markup `<h1><span id="parent-fieldname-title">Introduction</span></h1>` (or the equivalent plain topic h1). The repo's own export (`manual-pass-results.json`, `structure.headingOutline`) shows `{"level": 1, "text": "Introduction"}`. The topic **is** a heading.
- I-11 claims "The **only** `<h1>` on every page is the site logo image." False — there are **two** h1s per page (logo + topic). The real defect is different: a duplicate h1, the logo h1 first, and the topic h1 buried after ~17 sidebar `<h3>`s in DOM order.
- The conformance report's overall "Before: Does Not Support" for 1.3.1 survives on its other grounds (no landmarks, h1→h3 skips, state-less toggles), but the specific rationale ("page topic not a heading (I-10)") is wrong, and 2.4.6's remark repeats it.
- Propagation: `docs/index.html:52–53` and `:105` (live), `report/conformance-report.md` (1.3.1, 2.4.6), `audit/manual-testing-notes.md:33–35`, and `evaluation/human-protocol/voiceover-protocol.md` step B2, which instructs a human to "confirm" that "the page topic 'Introduction' is missing" — an expectation the human will **not** observe, immediately undermining the protocol's credibility.

This is the same class of error the author's own corrections (I-27/I-28) were praised for catching — and it sits in the two highest-severity heading entries.

### 5.2 The two corrected entries (I-27 / I-28)

- **The replacement findings are verified true by this reviewer's independent inspection.** `MIT9_00SCF11_read_kr1.pdf` tag tree: `/Part /H3 /P /StyleSpan /L /LI /LI_Label /LI_Title /Figure` — no `/Table /TR /TH /TD`; 3 `/Figure` tags of which 2 carry alt `'•'` (bullet glyphs); pymupdf raster inventory: **0 raster images** in the whole PDF. Both corrections ("no table in the PDF; reference is to the textbook"; "no content-carrying raster figures") hold.
- **The correction is transparent in the right places**: issue-log.md example 5 narrates the correction ("An earlier draft of this log claimed the PDF contained an untagged table… the claim was corrected"), and before-after.md repeats it.
- **But the CSV row for I-27 is structurally corrupted and semantically self-contradicting** (F4): after parsing, its `wcag_criterion` cell contains the orphaned fragment `" /TR"` and its `level` cell contains `" /TH or /TD — the table is not programmatically a table; header/data associations are lost."` — i.e., **the disproved original claim still lives in the master tracker's criterion/level cells**, the criterion is effectively empty, and `users_affected`/`effort`/`status` are field-shifted into the wrong columns. Five other rows (I-10, I-11, I-15, I-17, I-24) also fail to parse as CSV (field-count errors from unescaped quotes).
- **The pre-correction claim also survives in two other files** (F7): `DECISIONS.md` §1 ("a real data table ('Table 1: Schools of Psychological Thought')… the study-outline PDF visually presents 'Table 1' but has no table structure in its PDF tag tree") and §3 ("a visually present table with no table structure in the tag tree"), and `ATTRIBUTION.md` ("10 pages, **contains** 'Table 1: Schools of Psychological Thought'"). DECISIONS.md §3 is directly contradicted by the corrected finding: there is no visually present table to have structure missing from. A reviewer reading DECISIONS.md before issue-log.md will come away with the disproved claim.

### 5.3 Conformance report completeness

- **Level AA table: complete (20/20 criteria).** Verified programmatically.
- **Level A table: 26/30 — missing 2.5.1 Pointer Gestures, 2.5.2 Pointer Cancellation, 2.5.3 Label in Name, 2.5.4 Motion Actuation** (F6, MUST-FIX against the spec's "all WCAG 2.1 A and AA criteria"). All four are almost certainly "Supports" (no pointer-gesture or motion-actuation functionality; visible labels appear to match accessible names), but they must be stated and 2.5.3 should actually be checked (e.g., link text "Skip to main content" vs accessible name; the chapter buttons' visible labels vs names).
- **1.2.2 / 1.2.5 were NOT upgraded without evidence** — confirmed. Both read "Partially Supports" with explicit pending notes (STT WER check + human timing spot-check; recorded audio description as future work). The README, STATUS.md, video page, and caption build report all repeat the pending status consistently. This boundary held under verification.
- Minor status-vocabulary inconsistencies: 3.3.1 and 3.3.3 "Before" cells read "Not Applicable → Supports" (two statuses in one cell — pick one per column); 2.1.1 "Before: Partially Supports" sits oddly next to I-04's description ("keyboard-only users cannot play/pause/seek" — the video function is simply unavailable; "Does Not Support" is the more defensible VPAT reading); 2.4.7 "Before: Supports" with the remark "2 ambiguous stops" could equally be "Partially Supports". None of these changes the overall "Partially Supports WCAG 2.1 AA" verdict, which is correctly conservative.

### 5.4 Honesty boundaries

All checks pass; nothing was found that overclaims:

- **No conformance-certification claims.** "Not an official VPAT" appears in the conformance report, README, STATUS.md, and the live landing page; "WCAG certified" appears only in negation. Overall verdict is "Partially Supports WCAG 2.1 AA" with named gaps.
- **No screen-reader testing claims anywhere.** Every VoiceOver/screen-reader mention across `.md` and `.html` is a pending marker, a negation, or a protocol reference (greps verified). `manual-testing-notes.md` opens with "These are scripted agent checks, not screen-reader results."
- **Demo video labeling is exact**: "a scripted keyboard navigation demo… **not** a screen reader demonstration" on the landing page, in the captions (step 0), and on the transcript page.
- **Lakeside one-liner**: "a fictional US public university preparing for ADA Title II digital accessibility compliance" appears verbatim on the README, the landing page, all six module-page footers, the demo transcript page, and both program documents (with grammatical variant "is a fictional…" in two spots — same words).
- **AI disclosure**: README footer ("Built with AI assistance… every claim is reproducible") and the landing page's "Methods, labels, and authorship" section.
- **[Email] / [LinkedIn] untouched** in README.md; STATUS.md notes they are the owner's.
- One caveat on the meta-level: README's "Every claim traces to a tool export or a scripted check" is now false in both directions — I-10/I-11 trace to no correct export, and the malformed CSV rows trace to no intact export. Fix the findings or soften the sentence (prefer fixing the findings).

### 5.5 Prioritization model

- **Benchmarks are real, cited, and verified by this reviewer via live fetches:**
  - 3Play Media, "How Long Does It Take To Manually Caption Videos?" — the page says a trained transcriptionist takes "around 4 to 5 hours" per hour of content, first-timers "20 to 100 hours," timecodes "add 1–2 hours," auto-captions "60% to 84%" accuracy, updated Oct 28, 2021. Every figure in the repo matches, including the update date.
  - WebAIM discussion thread 8492 (Dec 2017) — "around 1 hour per page" for tough PDFs and "around 5 minutes per page" for pure text (one practitioner among several; the repo's "practitioner consensus" slightly overstates — suggest "practitioner estimates (WebAIM list, 2017)").
  - Equidox — "15–30 minutes" for simple text PDFs, complex ones far longer. Matches.
  - Access dates (2026-10-25) recorded. **No agent-time estimates are used** — the model explicitly says so and before-after.md quarantines the pilot's agent timings. This is the single most-mocked failure mode of AI-built portfolio repos and this repo avoids it cleanly.
- **Scoring coherence**: mostly coherent, but the priority formula is stated three different ways (F10): section title says "Impact × Exposure × Effort"; the text says "Priority score = (Impact + Exposure) × Effort multiplier" and then immediately "Effort is a cost — we divide by it rather than add it"; the table header says "(I+E)×E⁻¹". The Effort dimension is defined as 1–3 but never assigned numerically in the worked table (only verbal "low/very low/high"), so the rank order (e.g., rank 2 "5/very low" above rank 8 "5/medium", rank 4 "5/high" above rank 8) is plausible but not checkable. Pick one formula, publish the numeric Effort scores, and the table becomes verifiable.
- Impact×Exposure ranks, effort benchmark arithmetic (e.g., BIOL-101: 3.5 hr × 4–5 ≈ 14–17.5 hr + 40 simple PDFs × 5 min ≈ 3.3–8 hr ≈ 26 hr; PSY-100: 30 hr × 4–5 ≈ 150+ hr) are internally consistent with the cited benchmarks.

### 5.6 ADA Title II facts

Verified against the cited sources as written:

- Purdue (fetched): original deadline "April 24, 2026" for large covered entities; DOJ extended by one year citing an April 20, 2026 Federal Register notice; "April 26, 2027"; requirements unchanged. Matches the repo exactly, including the April 20 extension date.
- CSU Stanislaus (fetched): summarizes the archived-content exception ("created before the compliance deadline, held solely for reference, research, or recordkeeping… unchanged") and the pre-existing-documents exception; notes the extension to April 26, 2027. The prioritization model's sequencing step 4 ("verify the archived-content exception applies… document the exemption per item") accurately paraphrases it.
- No date or claim in the repo drifts from the sources. The one refinement: Purdue's page alone doesn't cover the exceptions (the repo correctly attributes them to CSU Stanislaus).

### 5.7 License compliance

- `LICENSE` = CC BY-NC-SA **3.0 US** — matches the source license (ShareAlike honored, NC preserved). `LICENSE-CODE` = MIT. Correct structure.
- `ATTRIBUTION.md` is genuinely complete: title/author/publisher/URL/license/license-verification method (`rel="license"` on the retrieved page), retrieval date and mechanism (Wayback raw `id_` captures with timestamps in `source/README.md`), and a per-artifact changes table. Third-party items (YouTube auto-captions used only as a timing skeleton, brain-image credit handling, Hermann grid public-domain status, W3C citation policy) are all disclosed. This is exemplary.
- **Video is linked, not copied — confirmed.** `video.html` sources the MP4 from archive.org; no lecture video file exists in the repo; `source/README.md` states the reason and links the publisher page. The only video in the repo is the author's own small demo webm.
- Two blemishes (F7/F9): `package.json` description says "content CC BY-NC-SA **4.0**" (source and repo are 3.0 US); `ATTRIBUTION.md` and `LICENSE-CODE` both reference a `docs/program/` directory that is empty (and therefore not deployed).

### 5.8 Site quality (the case study site passing its own audit)

- **axe (live)**: 0 violations on landing, module overview, quiz, video, lesson (exports in `/tmp/review04-axe`). The repo's "0 violations on all 9 pages" claim is consistent with what this reviewer could check (5 of 9).
- **Playwright spot-checks (13)**: 12 pass — skip link first tab stop + focus-to-main on landing and quiz; 5 fieldsets/legends/20 radios; arrow-key radio navigation within groups; live-region feedback populated with textual (non-color-only) verdict and score; captions track present/labeled/default and VTT fetchable with 828 cues; transcript linked; 6 chapter buttons with real start times; video focus ring 3px solid; 320 px reflow pass on the landing page. The single failure is the broken-images defect (F2).
- **Link integrity**: same-origin crawl of 11 live pages = 0 broken `<a>` links — but the crawler's design (same-origin only, hash-stripped, prefix-filtered) is structurally blind to all three real defects: `<img>` targets (F2), prefix-escaping hrefs (F3), and fragment targets (F3). The repo's linkcheck evidence (`linkcheck-results/` — one file, landing page only) gave false confidence. Recommend: extend the check to all pages, validate fragments, flag any href/src that resolves outside the Pages prefix, and check `<img>` srcs (F12).

---

## 6. Ranked findings

Severity: 4 = blocks publication, 3 = must fix before this is shown to a hiring manager, 2 = should fix, 1 = polish.

### F1 (3, honesty/accuracy) — I-10 and I-11 misstate the original markup, and the error is propagated
Evidence: §5.1. Every before page contains the topic as an `<h1>`; the real issues are the duplicate logo-h1, its precedence, and DOM-order burial after sidebar h3s.
**Revision:** Restate I-10 ("Page topic wrapped in `<h1>` but preceded by a logo-image h1 and buried after 17 sidebar h3s; duplicate top-level heading") and I-11 ("Two h1s per page: logo image h1 first, then topic h1; heading navigation starts from the site name"). Then correct every propagation site: `report/conformance-report.md` rows 1.3.1 and 2.4.6 (the "Does Not Support" verdicts can stand on the remaining grounds — say so explicitly), `docs/index.html` lines 52–53 and 105, `audit/manual-testing-notes.md` lines 33–35, and `evaluation/human-protocol/voiceover-protocol.md` step B2 (change the expectation from "confirm the topic is missing" to "confirm two h1s and the logo-first order").

### F2 (3, live defect) — Both before/after images on the live landing page are 404
Evidence: `docs/index.html:56,65` use `src="../audit/manual-evidence/…"`; `audit/` is not under `docs/` so it is not deployed, and `../` escapes the project prefix anyway. Verified: both live URLs 404; live `assets/before-after-pair.png` is 200.
**Revision:** Point the two figures at `assets/before-after-pair.png`, or copy the two screenshots into `docs/assets/`. Add a CI rule: no href/src may resolve outside the docs root.

### F3 (2, live defect) — Two broken links and one broken anchor on the live video page
Evidence: `docs/module/video.html:133,135` link `../../evaluation/METHODS.html` → 404 live (the file is mirrored at `docs/evaluation/METHODS.html`, reachable as `../evaluation/METHODS.html`); `video.html:46` links `../index.html#evaluation` but `docs/index.html` has no `id="evaluation"` (the evidence section is `#evidence`).
**Revision:** Fix both link forms; grep for other `../..` escapes (this reviewer's scan found only these).

### F4 (3, data integrity) — `audit/issue-log.csv` is not valid CSV, and I-27's row still carries the disproved claim
Evidence: §5.2 — 6 rows fail to parse (I-10, I-11, I-15, I-17, I-24, I-27); I-27's `wcag_criterion` = `" /TR"` and `level` = `" /TH or /TD — the table is not programmatically a table…"`, with `users_affected`/`effort`/`status` shifted.
**Revision:** Regenerate the CSV with a proper writer (Python `csv` module or a script in `scripts/`), quote all fields containing quotes/commas, give I-27 an explicit criterion (1.3.1 Info and Relationships, or reclassify as a content-completeness gap with no SC and say so), and scrub the old-claim fragments. Re-derive every downstream count from the regenerated file.

### F5 (2, consistency) — Severity counts are published as three different distributions
Evidence: actual CSV = 3 critical / 10 high / 14 medium / 6 low (I-30 is medium); README, STATUS, before-after, and the live findings table all say 3/11/13/6; issue-log.md says 3/11/12/6 and lists 14 medium IDs with I-30 also listed under High.
**Revision:** Pick the CSV's numbers (after F4), recompute, and update all five files. While in issue-log.md, fix the Medium row (count 12 vs 14 IDs listed, I-30 double-listed).

### F6 (2, spec gap) — Conformance report omits WCAG 2.1 Level A 2.5.1–2.5.4
Evidence: §5.3; the spec's success criterion is "all WCAG 2.1 A and AA criteria."
**Revision:** Add four rows with verified statuses (2.5.1/2.5.2/2.5.4 are trivially Supports/N-A here; actually test 2.5.3 Label in Name across buttons/links/inputs before claiming Supports).

### F7 (2, stale claims) — The pre-correction "untagged/visually-present-table" claim survives in DECISIONS.md and ATTRIBUTION.md
Evidence: §5.2 (DECISIONS.md §1 and §3; ATTRIBUTION.md row 2).
**Revision:** Rewrite DECISIONS.md §1/§3 "why" bullets to the corrected facts (the outline references textbook-only tables; the PDF has no table and no content figures; the correction is itself documented), and fix the ATTRIBUTION.md parenthetical ("references Table 1, which is in the textbook, not in the distributed PDF").

### F8 (1, accuracy) — I-24's "20 /Alt entries … are export junk" overcounts
Evidence: raw inventory shows 20 `/Alt` entries, of which ~17 are junk and 3 are meaningful descriptions.
**Revision:** "17 of the 20 /Alt entries are export junk; the remaining 3 are real descriptions." Same fix in any place the count is repeated.

### F9 (2, persona UX) — The conformance report and program materials are GitHub blob links, not site pages
Evidence: landing page §Scaling and §Repository documents; `docs/program/` is an empty directory; ATTRIBUTION.md/LICENSE-CODE reference it.
**Revision:** Either render `conformance-report.md`, `prioritization-model.md`, and `remediation-workflow.md` as pages under `docs/` (the faculty guide already proves the pattern), or remove the `docs/program/` references and keep the GitHub links deliberately. Also: link the live "before" snapshot (`before/`) from the landing page so reviewers can do a before/after click-through.

### F10 (1, coherence) — The priority formula is stated three ways
Evidence: §5.5.
**Revision:** One formula (the table's "(I+E)×E⁻¹" is the defensible one), numeric Effort scores 1–3 in the worked table so the ranking is checkable, and delete the contradictory sentence.

### F11 (2, learner/ID UX) — Quiz error suggestions name no section and link nowhere
Evidence: `docs/module/js/quiz.js:39–40`; feedback is textual and non-color-only (good), but "re-read the relevant lesson section" is unactionable.
**Revision:** Per-question `data-lesson-anchor` rendered as an actual link into `lesson.html#<section>` (e.g., Q on research methods → the methods section). This also strengthens the conformance report's 3.3.3 remark from "textual suggestion" to "suggestion with a direct link."

### F12 (2, process) — The repo's own link-integrity method produced false confidence
Evidence: `linkcheck-results/` contains one file (landing page only); the crawler skips images, prefix-escaping links, and fragments — precisely the three defect classes in F2/F3.
**Revision:** Run the checker across all pages; add fragment-target validation, `<img>` src checks, and an "resolves outside the deployment prefix" rule. Note the gap in `audit/methodology.md` so the fix is itself documented.

### F13 (1, meta) — No reviewer-facing form exists in `evaluation/human-protocol/`
Evidence: the folder contains the VoiceOver protocol, the AT-user invite, and the caption check; the only form is the AT-user result template.
**Revision:** Add a short reviewer-form template (method label, heuristic scores, findings table, can/cannot-show statement) so future review passes are comparable; this review improvised with the AT-user template, clearly labeled.

### Smaller notes
- `package.json` description: "CC BY-NC-SA 4.0" → "CC BY-NC-SA 3.0 US" (F7-class).
- README "Lighthouse … on all 8 pages" vs axe "on all 9 pages" is correct but reads as a contradiction; one clause explaining the demo-transcript page is axe-only would prevent the double-take.
- Conformance report 3.3.1/3.3.3 "Before" cells mix two statuses ("Not Applicable → Supports") — pick one per column.
- Conformance 2.1.1 "Before: Partially Supports" vs I-04's "cannot play/pause/seek": consider "Does Not Support" for the before state; 2.4.7 "Before: Supports" with "2 ambiguous stops" could be "Partially Supports."
- `executive-summary.md` "Automated tools caught only about a third of the issues" is a fair approximation of 13 axe violations vs 33 issues, but say "axe's rule set surfaced 13 of the 33 logged issues."

---

## 7. What is genuinely good

1. **The honesty architecture is the best this reviewer has seen in an agent-built portfolio repo.** Pending results are never filled in; the caption story (publisher text, machine timings, 71% alignment, pending WER) is disclosed identically at every altitude (build report → video page → conformance report → README); the demo video is labeled as automation in its own captions; the same-model limitation is in three places.
2. **The corrected-entries behavior (I-27/I-28) models good practice** — an audit that disproves its own stock claim and documents the correction is more credible than an audit with no corrections, and the replacement findings verify independently (this reviewer re-inspected the PDFs).
3. **The evidence chain mostly holds under adversarial sampling**: 6 of 8 sampled IDs verified end-to-end against raw exports and live pages (I-01, I-14, I-20, I-26, I-27, I-28), with I-24 holding modulo one count.
4. **External facts are real and correctly characterized** — all five cited sources (3Play, WebAIM, Equidox, Purdue, CSU Stanislaus) were fetched and support the claims as written, including the tricky April 20/April 26, 2027 extension dates and both Title II exceptions. No agent-time estimates anywhere.
5. **The remediated module is a genuinely reusable artifact** — the video page pattern (captions status + chapter buttons + text description + transcript) and the quiz pattern (fieldset/legend/labels/live region/no time limit) are things a real ID team could lift as-is.
6. **The site itself is clean**: 0 axe violations on all checked live URLs, 12/13 independent keyboard/functional checks pass, 320 px reflow passes, licensing structure is correct.

## 8. Verdict

The conceptual design, honesty framework, and most of the evidence chain are strong — this is close to the repo the spec asks for. What stands between it and "show this to a hiring manager tomorrow" is a cluster of mechanical defects that are entirely fixable in one pass: two factually wrong issue-log entries propagated into four documents (F1), a broken flagship page (F2/F3), a master tracker that doesn't parse and still carries a disproved claim (F4), and numbers that don't reconcile across five files (F5), plus one spec-level completeness gap in the conformance report (F6). Fix F1–F6 and re-run the link/consistency checks across all pages; everything else is polish.
