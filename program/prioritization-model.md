# Prioritization model: remediating a course catalog at scale

**Context.** Lakeside State University — a fictional US public university
preparing for ADA Title II digital accessibility compliance — must bring ~300
online courses toward WCAG 2.1 AA conformance. The DOJ rule requires WCAG 2.1
Level AA for web content and mobile apps of state and local government entities
(including public universities); the compliance deadline for large covered
public entities, originally April 24, 2026, was extended on April 20, 2026 to
**April 26, 2027** (requirements unchanged). Sources verified 2026-10-25:
[Purdue Innovative Learning, "DOJ extends ADA Title II digital accessibility deadlines"](https://www.purdue.edu/innovativelearning/blog/2026/04/27/doj-extends-ada-title-ii-digital-accessibility-deadlines-what-instructors-should-do-now/)
and
[CSU Stanislaus, "Title II Rule: Digital Accessibility"](https://www.csustan.edu/access-for-all/about-access-all-and-ati/title-ii-rule-digital-accessibility)
(which also summarizes the archived-content and pre-existing-document exceptions).

One module was remediated in this repository as the pilot. This model is for
scaling the same process across the catalog.

---

## 1. The scoring model: Impact × Exposure × Effort

Each course gets three sub-scores (1–3 each) based on registrar and LMS data:

| Dimension | Question | Score 1 | Score 2 | Score 3 |
|---|---|---|---|---|
| **Impact** | Who is blocked, and how badly? | Elective, small enrollment | Mixed enrollment | Required course, gateway/large enrollment, or known accommodation requests |
| **Exposure** | How often is it touched? | Archive-only (rarely visited) | Login-only, term-time use | Public-facing pages or weekly high-traffic use |
| **Effort** | How much work per item? | Low: text-heavy HTML, no media | Medium: some PDFs, short videos | High: lecture-capture hours, scanned PDFs, many images |

**Priority score = (Impact + Exposure) × Effort multiplier.** Fix the highest
(I+E) with the lowest Effort multiplier first: quick wins for the most students.
Effort is a cost — we divide by it rather than add it, because capacity is the
binding constraint.

Media effort dominates. Benchmarks (cited below): one hour of video ≈ 4–5
hours of human caption correction; one complex PDF page ≈ up to 1 hour of
human remediation. So a course with 20 lecture hours and 200 scanned PDF pages
is a multi-hundred-hour project regardless of its Impact score — it needs
triage sequencing, not just enthusiasm.

## 2. Effort benchmarks (published, cited — not agent-measured)

These estimates are **human** work benchmarks from published sources, accessed
2026-10-25. AI-agent processing time was deliberately **not** used as a proxy.

| Task | Benchmark | Source |
|---|---|---|
| Human captioning (transcribe + timecode) | A trained transcriptionist takes ~**4–5 hours per hour** of audio/video; a first-timer 20–100 hours. Manual timecode setting adds 1–2 hours. | [3Play Media, "How Long Does It Take To Manually Caption Videos?" (updated Oct 28, 2021)](https://www.3playmedia.com/blog/long-take-manually-caption-videos) — quote verified by fetching the page 2026-10-25 |
| Editing existing (auto) captions | Still requires full human review; auto-caption accuracy is reported at ~60–84% (same source) | Same 3Play Media page |
| PDF accessibility remediation | Complex documents: ~**1 hour per page**; simple pure-text: ~5 min/page (practitioner consensus) | [WebAIM discussion list, "Average Time to Create an Accessible PDF" (2017)](https://webaim.org/discussion/mail_thread?thread=8492) — accessed 2026-10-25 |
| PDF remediation (vendor view) | Simple text PDF ~15–30 minutes; complex PDFs take far longer | [Equidox, "How Long Does It Take to Remediate a PDF?"](https://equidox.co/blog/how-long-does-it-take-to-remediate-a-pdf) — accessed 2026-10-25 |
| HTML slide/page conversion | No single published standard; use the pilot's measured time (see `report/before-after.md`) and re-estimate per course | Pilot data, this repository |
| Audio description | Industry pricing runs ~$12–75 per finished minute (script, voice, mix); text descriptions are a cheaper interim alternative | [Gotham Lab, audio description services](https://www.gothamlab.com/audio-description-scripts/) — accessed 2026-10-25; quality standard: [DCMP Description Key](https://dcmp.org/learn/descriptionkey) |

**Known limitation of this model:** no review by a person who uses assistive
technology daily has yet shaped the scoring rubric; severity weights (what
"blocks" a learner) reflect the WCAG-based audit in this repository. That
review is pending (see `evaluation/human-protocol/at-user-review-invite.md`).

## 3. Worked example: 10 Lakeside State courses

All courses below are **fictional**, invented to exercise the model. "Media
hours" uses the benchmarks above; LMS page counts are illustrative.

| Rank | Course (fictional) | Impact | Exposure | Effort drivers | Est. human effort | Priority (I+E)×E⁻¹ |
|---|---|---|---|---|---|---|
| 1 | BIOL-101 Intro Cell Biology (gateway, 1,400 students/yr) | 3 | 3 | 6 short videos (3.5 hr), 40 simple PDFs | ≈ 17.5 hr captions + ≈ 8 hr PDFs ≈ **26 hr** | 6 / low = **highest** |
| 2 | ENGL-115 First-Year Writing (required, 900/yr) | 3 | 2 | text-heavy HTML, 12 simple PDFs, 0 video | ≈ **4 hr** | 5 / very low |
| 3 | PSY-100 Intro Psychology (required, 1,100/yr) | 3 | 3 | 30 lecture hours, 54-page slide PDFs/unit, exam PDFs | ≈ **150+ hr** | 6 / very high → phase 2 with vendor captions |
| 4 | NURS-210 Pathophysiology (required, cohort lock) | 3 | 2 | 12 videos (9 hr), 25 complex PDFs (tables/images) | ≈ 45 hr + 25 hr ≈ **70 hr** | 5 / high |
| 5 | STAT-200 Elementary Statistics (required) | 2 | 3 | math notation — **out of scope for this playbook** (MathML specialist needed) | estimate deferred | flagged for specialist |
| 6 | HIST-140 US Since 1877 (elective, 300/yr) | 2 | 2 | 8 videos (6 hr), archived lecture pages | ≈ 30 hr | 4 / medium |
| 7 | ART-105 Art History Survey (elective) | 2 | 2 | image-dense; alt text + long descriptions for 400+ images | ≈ **35 hr** (alt text dominates) | 4 / medium |
| 8 | MGMT-305 Operations Management (required, 500/yr) | 3 | 2 | 20 scanned PDFs (legacy) → rebuild as HTML instead of remediating scans | ≈ **30 hr** rebuild | 5 / medium |
| 9 | CS-101 Intro Programming (elective, 200/yr) | 1 | 2 | code-heavy content (screen-reader programming is its own craft) | estimate deferred | flagged for specialist |
| 10 | ARCH-490 Historical Archives (archive-only) | 1 | 1 | 60 legacy PDFs, unchanged since 2019 | likely **exempt as archived content** | document & park |

## 4. Sequencing recommendation

1. **Fix-forward first (weeks 1–2):** new content is created accessibly.
   Publish the [faculty quick guide](faculty-quick-guide.md) and make the
   accessibility checker part of course-copy QA. This stops the meter.
2. **High-impact, low-effort live courses next (weeks 3–8):** ranks 1–2, 8 —
   each is days of work for hundreds of students per year.
3. **High-effort, high-impact courses (months 3–12):** ranks 3–4 — budget
   vendor captioning for the video hours (in-house at 4–5 hr/hr does not fit
   the timeline), convert scanned PDFs to HTML instead of tagging scans.
4. **Archive courses last:** verify the [archived-content exception](https://www.csustan.edu/access-for-all/about-access-all-and-ati/title-ii-rule-digital-accessibility)
   applies (created before the compliance date, unchanged, kept solely for
   reference/research/recordkeeping), document the exemption per item, and
   plan retirement. Rank 10 is parked, not scheduled.
5. **Flag specialists early:** math notation (STAT-200) and programming content
   (CS-101) need skills this playbook does not cover; schedule them with the
   right experts rather than guessing.

**Review cadence:** re-score every term; accommodation requests from the
disability services office override the model immediately.
