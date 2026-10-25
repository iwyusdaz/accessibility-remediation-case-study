# Evaluation methods

This document records every evaluation method used on this repository, who or
what performed it, when, and what each method can and cannot show. Per the
portfolio's evidence rules, every evaluation is **labeled by method**; pending
results are never filled in.

## Methods used (complete)

| # | Method | Performed by | Date | Artifacts | Can show | Cannot show |
|---|---|---|---|---|---|---|
| 1 | Automated WCAG audit (axe-core 4.11.1, WCAG 2.1 A/AA + best practice) | Agent (scripted tool: `tooling/audit-axe.mjs`) | 2026-10-25 (before) / 2026-10-25 (after) | `audit/automated-results/before/`, `after/` | Rule-detectable violations on rendered pages | Judgment issues: alt quality, captions accuracy, reading-order meaning |
| 2 | Automated audit (Lighthouse 13.0.1, accessibility category) | Agent (scripted tool) | 2026-10-25 | `audit/automated-results/…/lighthouse-*.json` | Scores + failed audits incl. target-size | Same as above; scores are not conformance |
| 3 | Automated audit (pa11y 9.0.0, WCAG2AA) | Agent (scripted tool) | 2026-10-25 | `audit/automated-results/…/pa11y-*.json` | Second-engine corroboration (broken anchors, labels, frame titles) | Same as above |
| 4 | Scripted keyboard pass (tab-through, focus visibility, trap detection) | Agent (Playwright, `scripts/manual-pass.mjs`) | 2026-10-25 | `audit/manual-evidence/*/manual-pass-results.json` | Tab order, reachability, focus indicators, traps | What a screen reader announces; real AT-user experience |
| 5 | Scripted reflow check (320 px = 400% of 1280) | Agent (Playwright) | 2026-10-25 | same + `*-320px.png` | Document-level horizontal scroll | Visual comfort; every possible breakpoint |
| 6 | Measured color contrast (WCAG luminance formula on rendered colors) | Agent (Playwright + script) | 2026-10-25 | same, `contrast` field | Ratio failures against first opaque background | Contrast over background *images* (flagged and manually inspected instead) |
| 7 | PDF structure inspection (pypdf: tag tree, alt entries, text density) | Agent | 2026-10-25 | `audit/manual-testing-notes.md` | Tagged status, figure/table structure, alt quality | How a PDF screen-reader session actually reads the file |
| 8 | Media availability check (captions/transcript/player inventory) | Agent | 2026-10-25 | issue log I-01–I-09 | What the module provides for deaf/blind users | Caption *accuracy* (separate method, pending) |
| 9 | Scripted keyboard task tests (skip link, quiz completion, video chapters) | Agent (`scripts/test-keyboard.mjs`) | 2026-10-25 | `audit/manual-evidence/after/keyboard-tests.json` | End-to-end tasks work keyboard-only | Screen-reader announcements beyond live-region wiring |
| 10 | Caption build (text: publisher transcript; timings: machine alignment) | Agent (`scripts/build-captions.mjs`) | 2026-10-25 | `docs/module/media/captions-build-report.json` | Transparent, reproducible caption derivation | Accuracy vs. the audio (method 11) |
| 11 | **Caption accuracy vs. audio (STT word-error-rate)** | **PENDING: requires API key** (`npm run eval:pending`) | — | will write `evaluation/caption-wer-results.json` + `dry-run/` stubs | Measured caption WER once run | — |
| 12 | Agent heuristic review of the case study site (fresh-context reviewer sub-agent; may share the author's underlying model — disclosed limitation) | Reviewer agent (separate context) | 2026-10-25 (authoring session) / 2026-10-26 (fresh-context round) | review notes in `evaluation/agent-review.md` | Consistency, honesty, accessibility-baseline gaps | Independent human judgment |
| 13 | Human VoiceOver pass (rotor tests before/after) | **PENDING human** — protocol in `evaluation/human-protocol/voiceover-protocol.md` | — | — | Real screen-reader behavior | — |
| 14 | Daily AT-user review | **PENDING human** — invitation: `evaluation/human-protocol/at-user-review-invite.md` | — | — | The strongest available evidence | — |
| 15 | Caption timing spot-check | **PENDING human** — `evaluation/human-protocol/caption-accuracy-check.md` | — | — | Comfortable caption timing | — |
| 16 | Label in Name check (WCAG 2.5.3: visible label contained in accessible name) | Agent (`scripts/check-label-in-name.mjs`) | 2026-10-26 | `audit/manual-evidence/after/label-in-name.json` | Every labeled control on all 9 site pages (207 controls, 0 violations) | Screen-reader pronunciation quirks |
| 17 | Whole-site link/image/fragment check (every published page; prefix-escape rule; `docs/before/` excluded by default) | Agent (`scripts/check-links.mjs`) | 2026-10-26 | `linkcheck-results/` (local + live runs) | Broken hrefs/srcs, links escaping the deployment root, dead fragment targets | External-link availability (external URLs are skipped) |
| 18 | Markdown report/program documents rendered as deployed site pages | Agent (`scripts/render-doc-pages.mjs`) | 2026-10-26 | `docs/report/conformance-report.html`, `docs/report/prioritization-model.html`, `docs/program/remediation-workflow.html` | Styled, deployed versions of the Markdown sources (axe-clean) | Direct edits to the HTML (edit the `.md`, then re-render) |

## What was deliberately NOT done

- **No simulated disabled users.** Accessibility evidence comes from real
  tools, standards-based checks, and (pending) human AT sessions — never from
  AI personas pretending to be disabled users.
- **No fake pending results.** Rows 11, 13, 14, 15 stay empty until their keys
  or human passes exist.
- **No local/open-source speech-to-text models.** The STT slot is an
  OpenAI-compatible API configured in `.env` (see `.env.example`).
- **No AI-agent processing time as an effort estimate.** The prioritization
  model cites published human benchmarks.

## Reviewer-agent note (labeling)

The "Agent review" of this site was performed by a reviewer agent in a fresh
context. It may run on the same underlying model family as the authoring
agent; this same-model limitation is disclosed, and an API-based multi-model
review panel remains possible later (`MODEL_A/B/C` slots in `.env.example`).

## Reproduce

```
npm run serve            # python3 -m http.server 8900 --directory docs
node scripts/manual-pass.mjs before <before-urls...>
node scripts/manual-pass.mjs after  <module-urls...>
node scripts/test-keyboard.mjs
node scripts/check-label-in-name.mjs
node scripts/check-links.mjs docs          # local: every page under docs/
node scripts/check-links.mjs <live-url>    # deployed site
node scripts/render-doc-pages.mjs          # re-render docs/report + docs/program
npm run eval:dry-run     # pipeline stub test, no network
npm run eval:pending     # real STT run, requires .env keys
```
