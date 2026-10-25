# Executive summary — accessibility remediation pilot

**For:** Dean/Director, Lakeside State University *(fictional US public
university preparing for ADA Title II digital accessibility compliance)*
**Date:** 2026-10-25 · **Prepared by:** the accessibility remediation pilot team

## What we did

Audited one real course module — Unit 1 of *9.00SC Introduction to Psychology*
(MIT OpenCourseWare, CC BY-NC-SA) — against **WCAG 2.1 AA** with automated
tools (axe, Lighthouse, pa11y) and scripted manual checks (keyboard, reflow,
measured contrast, PDF structure), logged **33 issues**, rebuilt every content
type as accessible HTML, and re-verified: **0 axe violations and Lighthouse
100 on all remediated pages**; scripted keyboard tasks pass 11/11; all pages
reflow at 320 px. Full evidence: `audit/`, `report/before-after.md`.

## What we found (typical of the catalog)

- **Blocking problems were media and structure, not styling.** The lecture
  video had no captions and no transcript; the slide deck carried its meaning
  in images with junk alt text; the exam's brain diagram had no text
  alternative. These block learners outright.
- **Navigation was hostile to keyboard and screen-reader users:** no
  landmarks, the logo as the only top-level heading, an unreachable skip link,
  an unlabeled search field.
- **Layout failed 400% zoom** (fixed 950 px width), and 24–35 touch targets
  per page were undersized.
- Automated tools caught only about a third of the issues — most required
  judgment (captions, heading meaning, link purpose, PDF structure).

## Effort at scale (benchmarks, cited — see prioritization model)

| Content type | Published human benchmark |
|---|---|
| Video caption correction | 4–5 hours per video hour (3Play Media, verified 2026-10-25) |
| Complex PDF remediation | Up to ~1 hour per page (WebAIM; Equidox: 15–30 min for simple PDFs) |
| HTML rebuild of slides/pages | No published standard; measured per pilot and re-estimated |

A typical lecture course (30 video hours + 100 PDF pages) therefore represents
150–200+ hours of human work. **Recommendation: fix-forward first** (new
content born accessible via the faculty quick guide), **then high-impact live
courses**, **vendor captioning for video-heavy courses**, and **document the
archived-content exception** for legacy material instead of remediating it.
The deadline for large public entities is **April 26, 2027** (extended from
April 24, 2026 on April 20, 2026; requirements unchanged — sources verified
2026-10-25).

## What this pilot can and cannot claim

- **Can:** show issues found and fixed with reproducible evidence; a verified
  keyboard/reflow/contrast-clean rebuild; a reasoned, benchmark-based scaling
  model.
- **Cannot (yet):** claim full conformance (this is explicitly **not an
  official VPAT**); claim screen-reader-tested quality (no human VoiceOver
  pass yet — Guidepup automation is broken on macOS 27; protocol ready);
  claim review by a daily assistive-technology user (strongest missing
  evidence — paid-review template ready); claim verified caption accuracy
  (text is the publisher's official transcript; STT check and human timing
  spot-check are pending and clearly labeled).

## The one-paragraph ask

Fund the program in this order: (1) prevention — publish the faculty quick
guide and wire the accessibility checker into course-copy QA this term;
(2) two remediation cycles for the highest-impact live courses this year;
(3) vendor captioning budget for lecture-capture courses; (4) a small retainer
for paid AT-user reviews — they find what tools cannot.
