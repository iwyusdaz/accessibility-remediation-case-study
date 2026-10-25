# Faculty quick guide: 10 rules for accessible course materials

One page. Print it, pin it, forward it. Remediation doesn't scale if new
inaccessible content keeps arriving — prevention is the cheapest fix in the
whole program. (A web version lives at `docs/faculty-quick-guide.html`.)

*Lakeside State University — a fictional US public university preparing for ADA
Title II digital accessibility compliance. Companion to the remediation case
study.*

## The 10 rules

1. **Use real headings.** Apply Heading 1/2/3 styles — don't just make text
   big and bold. Screen reader users navigate by heading; a page without them
   is one long undifferentiated block.
2. **Write meaningful link text.** "Week 3 reading (PDF)" beats "click here."
   Screen readers offer a list of links out of context — every link should
   make sense alone.
3. **Add alt text — and know when to leave it empty.** Describe what the image
   *means* in the lesson ("Bar chart: students who slept 8 hours scored
   higher"), not "image of chart." Purely decorative images get *empty* alt
   (`alt=""`) so screen readers skip them.
4. **Don't rely on color alone.** "Correct answers are in green" fails for
   color-blind students and screen readers. Add a word, a symbol, or a label:
   "Correct answers are marked Correct."
5. **Use the built-in templates for slides.** PowerPoint/Slides layout
   placeholders carry structure that exported images lose. Avoid pasting text
   as screenshots; use the outline view to check that all slide text is real
   text.
6. **Caption your videos — and correct the captions.** Auto-captions are a
   draft (typically ~60–84% accurate). Correct speaker names, punctuation, and
   sound cues, or route media through the captioning service. Every required
   video needs accurate captions.
7. **Prefer HTML pages over PDFs.** HTML reflows on phones, works with screen
   readers, and is searchable. If you must use a PDF, start from a tagged,
   text-based source document — never a scan — and run the accessibility
   checker on it.
8. **Use simple tables with header rows.** Keep one idea per table, mark the
   header row (and use "Header Row" in Word/PowerPoint or `<th>` in HTML).
   Complex nested tables lose their meaning when read cell by cell.
9. **Check contrast.** Text should be dark-on-light or light-on-dark with real
   separation (aim for 4.5:1). Light gray on white and pastel-on-pastel fail.
   The checker in rule 10 flags this automatically.
10. **Run the built-in accessibility checker.** Word, PowerPoint, and Canvas
    all have one (Review → Check Accessibility). Fix everything it marks
    "Error"; "Tips" are worth reading too. It takes two minutes on a typical
    document.

## When you need help

- New course build or redesign: book the ID team — accessibility is cheapest
  at design time.
- Videos beyond 30 minutes, or more than an hour of video per course: media
  services routes them to captioning (human correction of a transcript, not
  from-scratch transcription).
- Scanned PDFs: don't remediate the scan — send it for HTML conversion; the
  result is better and reusable.
- A student reports a barrier: that becomes a priority-1 fix the same week,
  regardless of any model or schedule.

*Rule sources: WCAG 2.1 AA success criteria (headings 2.4.6, link purpose
2.4.4, non-text content 1.1.1, use of color 1.4.1, captions 1.2.2, reflow
1.4.10, contrast 1.4.3) applied to everyday authoring; caption-accuracy figure
from 3Play Media (accessed 2026-10-25).*
