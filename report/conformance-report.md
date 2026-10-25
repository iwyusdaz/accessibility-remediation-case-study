# WCAG 2.1 AA conformance report — remediated module

> **This is not an official VPAT®/ACR.** It follows the *structure* of a VPAT
> table for the author's portfolio, is written by an instructional designer
> (with AI assistance, disclosed), and carries no certification. Statuses use
> the VPAT vocabulary honestly: Supports / Partially Supports / Does Not
> Support / Not Applicable.

| | |
|---|---|
| **Evaluated content** | The remediated module: `docs/module/` (index, lesson, slides, video, transcript, quiz) |
| **"Before" basis** | The original module as retrieved: `docs/before/` (2011–2012 MIT OCW pages + 6 PDFs) |
| **Standard** | WCAG 2.1 Level A + AA ([W3C](https://www.w3.org/TR/WCAG21/)); WCAG 2.2 items noted as best practice, labeled "exceeds requirement" |
| **Methods** | axe-core 4.11.1, Lighthouse 13.0.1, pa11y 9.0.0; scripted keyboard/reflow/contrast checks (Playwright 1.57.0); Label-in-Name check (2.5.3, Playwright); PDF tag-tree inspection (pypdf/pymupdf); DOM inspection. Full detail: `audit/methodology.md` |
| **Dates** | 2026-10-25 (2.5.1–2.5.4 rows and corrected 1.3.1/2.4.6 remarks: 2026-10-26 review round) |
| **Evaluator** | AI agent with scripted tools (labeled; see limitations). No human screen-reader pass yet; no daily-AT-user review yet. |

**Overall: Partially Supports WCAG 2.1 AA.**

The remaining gaps are specific and disclosed:

1. **1.2.2 / 1.2.5 (captions and audio description):** captions are shipped
   with text from the publisher's official transcript and machine-aligned
   timings; the speech-to-text word-error-rate check (`npm run eval:pending`)
   and the human timing spot-check are pending. Audio description is provided
   as text, not as a recorded track.
2. **No screen-reader session evidence** (Guidepup VoiceOver automation does
   not function on macOS 27; human protocol pending).
3. **No review by a daily assistive-technology user** (invitation template
   provided).

## Table 1 — Level A

| Criterion | Before | After | Remarks |
|---|---|---|---|
| 1.1.1 Non-text Content | Does Not Support | Supports | Before: slide figures with junk/missing alt (I-24, I-25), exam diagram with none (I-29), chart data visual-only (I-26). After: informative figures have alt + long descriptions (`<details>`); decorative images use empty alt; third-party images the publisher excludes from the license are described, not reproduced. |
| 1.2.1 Audio-only and Video-only (Prerecorded) | Not Applicable | Not Applicable | No audio-only or video-only content in the module. |
| 1.2.2 Captions (Prerecorded) | Does Not Support | **Partially Supports** | Before: no captions anywhere; player had no caption control (I-01). After: `<track kind="captions">` with text from the official publisher transcript. **Pending:** STT word-error-rate check + human timing spot-check. |
| 1.2.3 Audio Description or Media Alternative (Prerecorded) | Does Not Support | Partially Supports | Before: no transcript or alternative (I-03). After: full transcript page + chapter-by-chapter text description of the visuals. Pending human confirmation that the alternative is adequate in practice. |
| 1.3.1 Info and Relationships | Does Not Support | Supports | Before: two h1s on every page — the site-logo image h1 first, then the topic h1 buried after 15 sidebar h3s (I-10, I-11) — plus no landmarks (I-13) and 15 state-less menu toggles (I-15). After: landmarks, one content h1, logical heading order, real table markup, fieldset/legend quiz, `aria-current` nav state. |
| 1.3.2 Meaningful Sequence | Supports | Supports | Original HTML and tagged PDFs read in order; verified unchanged in remediation. |
| 1.3.3 Sensory Characteristics | Supports | Supports | No sensory-only instructions found in either version ("click the red button" pattern absent). |
| 1.4.1 Use of Color | Supports | Supports | Exam solutions mark answers with text ("Answer: D"), verified. Quiz feedback is textual, never color-only. |
| 1.4.2 Audio Control | Not Applicable | Not Applicable | No audio plays automatically. |
| 2.1.1 Keyboard | Does Not Support | Supports | Before: Flash-era player not keyboard operable at all (I-04) — the video function is unavailable without a pointer. After: native `<video>` controls, native buttons; scripted test confirms player + chapters + quiz operable (11/11 keyboard tests). |
| 2.1.2 No Keyboard Trap | Supports | Supports | Before: popup not dismissible with Escape and focus left behind (I-05, I-06) — pattern removed entirely. After: scripted tests find no traps. |
| 2.1.4 Character Key Shortcuts | Supports | Supports | No character-key shortcuts implemented. |
| 2.2.1 Timing Adjustable | Not Applicable | Not Applicable | Quiz has no time limit (stated on the page). |
| 2.2.2 Pause, Stop, Hide | Not Applicable | Not Applicable | No moving or auto-updating content. |
| 2.3.1 Three Flashes or Below Threshold | Supports | Supports | No flashing content. |
| 2.4.1 Bypass Blocks | Does Not Support | Supports | Before: skip link has `tabindex="-1"` and is unreachable (I-14). After: skip link is the first tab stop and moves focus to `<main tabindex="-1">`; landmarks provide additional bypass (scripted test passes). |
| 2.4.2 Page Titled | Supports | Supports | Before: descriptive but very long pipe titles (I-33). After: concise, descriptive titles. |
| 2.4.3 Focus Order | Partially Supports | Supports | Before: popup opened without moving focus (I-05). After: popup removed; linear order verified by scripted tab-through. |
| 2.4.4 Link Purpose (In Context) | Partially Supports | Supports | Before: 12 identically-named download links (I-07), `[K&R]`/`[Stangor]` (I-31), broken `hhttp://` (I-08). After: descriptive link text throughout. |
| 2.5.1 Pointer Gestures | Not Applicable | Not Applicable | No multipoint, path-based, or long-press gesture functionality in either version; all controls are single-pointer activation and keyboard operable. |
| 2.5.2 Pointer Cancellation | Supports | Supports | No down-event-only or dragging functionality; native buttons and links activate on pointer-up. |
| 2.5.3 Label in Name | Supports | Supports | Visible label text is contained in each control's accessible name. Scripted check (`scripts/check-label-in-name.mjs`, 2026-10-26) verified every labeled control on all 9 site pages: skip link ("Skip to main content"), nav links, quiz radio labels, "Check answer" buttons, video chapter buttons. |
| 2.5.4 Motion Actuation | Not Applicable | Not Applicable | No functionality is triggered by device motion or user motion. |
| 3.1.1 Language of Page | Supports | Supports | `lang="en"` on every page (before and after). |
| 3.2.1 On Focus | Supports | Supports | No focus-triggered context changes. |
| 3.2.2 On Input | Supports | Supports | No input-triggered context changes. |
| 3.3.1 Error Identification | Not Applicable | Supports | No error-prone forms before (search only). After: quiz identifies wrong answers in text. |
| 3.3.2 Labels or Instructions | Does Not Support | Supports | Before: search field unlabeled (I-16, critical) with value-as-placeholder (I-17). After: all controls labeled; quiz explains what to do. |
| 4.1.1 Parsing | Supports | Supports | axe parse checks clean on all remediated pages. |
| 4.1.2 Name, Role, Value | Does Not Support | Supports | Before: unlabeled inputs (I-16, I-18), iframes without titles (I-19), state-less toggles (I-15). After: native controls, labeled inputs, `aria-expanded` not needed (no disclosure widgets besides `<details>`), live regions for quiz status. |

## Table 2 — Level AA

| Criterion | Before | After | Remarks |
|---|---|---|---|
| 1.2.4 Captions (Live) | Not Applicable | Not Applicable | No live media. |
| 1.2.5 Audio Description (Prerecorded) | Does Not Support | **Partially Supports** | Before: none, though the lecture is inherently visual (I-02, critical). After: chapter-by-chapter extended **text** description + slide deck with figure descriptions. Recorded audio description is future work; honesty requires "Partially Supports". |
| 1.3.4 Orientation | Supports | Supports | Fluid layout works in both orientations; no orientation lock. |
| 1.3.5 Identify Input Purpose | Not Applicable | Not Applicable | No inputs collecting information about the user (search existed in the original but identifies no user information). |
| 1.4.3 Contrast (Minimum) | Partially Supports | Supports | Before: automated measurement flagged the white-on-white "OCW Scholar" image-replacement text (I-21, documented as robustness issue). After: palette measured — every text pair ≥ 4.5:1 (ratios in `docs/module/css/module.css`); scripted measurement reports 0 failures. |
| 1.4.4 Resize Text | Supports | Supports | Relative units; browser zoom verified. |
| 1.4.5 Images of Text | Partially Supports | Supports | Before: slide meaning largely carried by images. After: all text is real text; logo replaced with a text title. |
| 1.4.10 Reflow | Does Not Support | Supports | Before: 952 px document at 320 px viewport (I-20; screenshot evidence). After: no horizontal scrolling at 320 px on any page (scripted test); data tables scroll within their own container (permitted 2-D exception for data tables). |
| 1.4.11 Non-text Contrast (Minimum) | Partially Supports | Supports | After: UI borders 5.45:1, focus ring 5.50:1 (≥ 3:1 required); measured and documented. |
| 1.4.12 Text Spacing | Supports | Supports | Layout survives text-spacing overrides (relative units; verified visually at increased spacing). |
| 1.4.13 Content on Hover or Focus | Supports | Supports | No tooltips or hover-revealed content; the popup pattern (which lacked dismissibility, I-06) was removed. |
| 2.4.5 Multiple Ways | Partially Supports | Supports | Before: nav + broken/unlabeled site search. After: module nav, in-page menus, and the overview page's contents table provide multiple routes. |
| 2.4.6 Headings and Labels | Does Not Support | Supports | Before: duplicate logo-first h1 with the topic heading buried after 15 sidebar h3s, plus level skips (I-10, I-11, I-12). After: descriptive headings and labels throughout. |
| 2.4.7 Focus Visible | Partially Supports | Supports | Before: browser default outlines (mostly OK; 2 ambiguous stops). After: explicit 3px focus ring, 5.50:1, verified on every focusable element including the video player (focus-within). |
| 3.1.2 Language of Parts | Supports | Supports | No passages in other languages requiring marking. |
| 3.2.3 Consistent Navigation | Supports | Supports | Module nav repeated identically across pages (before and after). |
| 3.2.4 Consistent Identification | Supports | Supports | Icons/labels used consistently. |
| 3.3.3 Error Suggestion | Not Applicable | Supports | Quiz incorrect answers get a suggestion that links directly to the relevant lesson section (per-question anchor into `module/lesson.html`), not a generic "re-read the material" message. |
| 3.3.4 Error Prevention (Legal, Financial, Data) | Not Applicable | Not Applicable | No submissions of the covered kinds. |
| 4.1.3 Status Messages | Partially Supports | Supports | Quiz feedback and score use `role="status"` / `aria-live="polite"`; scripted test confirms the feedback region is populated. A human screen-reader pass is still pending, hence not "verified with AT". |

## WCAG 2.2 best practice (exceeds requirement — not part of WCAG 2.1 AA)

| Criterion | Status | Remarks |
|---|---|---|
| 2.4.11 Focus Not Obscured (Minimum) | Supports | Sticky-free layout; focused elements are not covered by fixed bars. |
| 2.5.8 Target Size (Minimum) | Supports | Buttons/links ≥ 24×24 px (`min-height` + padding; the original failed this at scale — I-22). Exceeds WCAG 2.1 AA. |

## Scope and honesty notes

- **Not an official VPAT.** No conformance certification is claimed; the site
  and README never say "WCAG certified."
- "Before" statuses describe the module as retrieved (November 2012
  Internet Archive captures of the 2011 MIT OCW Scholar pages).
- The original site search (a Google Appliance form) was audited as part of
  the page it sits on; it is not functional inside the offline snapshot.
- The case study site itself (`docs/index.html`, `docs/faculty-quick-guide.html`,
  `docs/module/*`, transcript pages) passes the same automated suite
  (0 axe violations, Lighthouse 100) and the same scripted checks — see
  `audit/automated-results/after/`.
