# Agent review — structured heuristic review of this repository

| | |
|---|---|
| **Method label** | **Agent heuristic review** (per the portfolio's labeling rules) |
| **Reviewer** | An AI agent performing a structured review pass against Nielsen's 10 heuristics and the accessibility baseline checklist |
| **Date** | 2026-10-25 |
| **Disclosed limitations** | (1) The reviewer may run on the same underlying model family as the authoring agent (same-model limitation); (2) this pass ran in the authoring session, so it is weaker than the fresh-context reviewer pass recommended by the standards — a fresh-context re-review is listed as follow-up work; (3) an API-based multi-model review panel (`MODEL_A/B/C`) was not run (pending keys). |
| **Evidence status** | Automated audits are objective tool output and are NOT affected by the same-model limitation. |

## Review scope

Repository structure, honesty/labeling, accessibility of the case study site
itself, and the evidence chain (claims → artifacts).

## Findings and what changed

| # | Finding (heuristic / rule) | Severity | Action taken |
|---|---|---|---|
| R1 | Landing page linked `evaluation/METHODS.html`, which did not exist (broken in-site link) | High | HTML mirror generated from `evaluation/METHODS.md`; linkcheck re-run clean |
| R2 | Speaker notes used `<aside>` inside `<main>` → axe `landmark-complementary-is-top-level` (54 nodes) | Medium | Changed to `<div class="speaker-note">`; axe clean |
| R3 | `<main id="main">` was not focusable → Enter on the skip link left focus on `<body>` (skip link ineffective despite being first tab stop) | High | Added `tabindex="-1"` to `<main>` on all pages; scripted test "skip link jumps to main" now passes |
| R4 | Landing page tables overflowed a 320 px viewport (414 px document) | High | Wrapped data tables in a horizontal-scroll container (data-table exception under 1.4.10); reflow check now passes |
| R5 | `<video>` fallback text measured dark-on-black (contrast artifact) and the video element showed no visible focus indicator for its shadow-DOM controls | Medium | Removed the inline fallback (always-visible direct links serve the same role); added `video:focus, video:focus-within` outline rule; re-measured: 0 failures |
| R6 | Radio-group keyboard interaction initially tested with Tab between options (would have "passed" a wrong page) | Low (test bug, not site bug) | Test corrected to arrow-key navigation — the page's native radio behavior was already correct |
| R7 | `ATTRIBUTION.md` cited the wrong practice-exam question numbers before the quiz was built | Medium | Corrected to questions 5, 6, 9, 23, 25 after extraction verified the answer key |
| R8 | Issue log initially contained a stock claim ("untagged PDF") that inspection disproved | High (honesty) | Corrected I-27/I-28 to the verified findings (textbook-reference gap; bullet-glyph tag noise); methodology documents the correction |
| R9 | Caption cue builder initially emitted linearly interpolated timings when alignment failed (would have been fabricated timings) | High (honesty) | Alignment fixed and validated (0 overlaps, ≤ 6.5 s cues); build report exposes method + stats |
| R10 | Demo video captions/transcript honestly labeled scripted automation — verified no phrase anywhere claims screen-reader testing or conformance certification | Pass | No change (confirmation) |
| R11 | `[Email]`/`[LinkedIn]` placeholders untouched; fictional university labeled on every page | Pass | No change (confirmation) |
| R12 | `.env.example` matches the portfolio standard exactly; pipeline exits 1 with no network calls on missing/placeholder keys; dry-run writes stubs labeled "DRY RUN – NOT REAL RESULTS" | Pass | Verified by execution |

## Follow-up recommendations

1. Fresh-context reviewer pass (different session/model) on the final state.
2. Run the human VoiceOver protocol and the AT-user review (templates ready).
3. When STT keys are added: `npm run eval:pending`, then update the
   conformance report's 1.2.2 row and the README evaluation status.
