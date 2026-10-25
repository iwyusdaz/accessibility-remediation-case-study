# Human VoiceOver protocol — before/after screen-reader pass

**Who runs this:** a sighted or blind human comfortable with macOS VoiceOver
(Cmd+F5). Budget ~45–60 minutes. No automation is involved — this is the check
that Guidepup could not perform on macOS 27.

**Why before AND after:** the "before" session documents how the original
module reads; the "after" session verifies the remediation. Both sessions use
the same steps so the comparison is fair.

**Setup**
1. Open the local server: `python3 -m http.server 8900 --directory docs`.
   - Before: `http://127.0.0.1:8900/before/introduction/index.htm`
   - After: `http://127.0.0.1:8900/module/index.html` (+ lesson, slides,
     video, quiz)
2. Start VoiceOver: **Cmd+F5**. Web spot: VO = Control+Option.
3. Record the session (QuickTime screen recording) or take notes per step.
4. Suggested VO settings: navigate with VO+Right/Left; rotor with VO+U.

## Steps (run for each page)

### A. First impressions (30 seconds each)
1. Navigate by **VO+Right** from the top of the page. Write down the first 10
   things announced, in order. (Expected before: skip link, then ~60 nav links
   before content. Expected after: skip link, then header/nav/main landmarks.)

### B. Rotor: Headings (VO+U, then Left/Right to the Headings list)
2. List the headings in order. Note:
   - Is the page's own topic a heading?
   - Are levels logical (no skips)?
   - Before, the only h1 is "MIT OpenCourseWare" (the logo image) and the page
     topic "Introduction" is missing — confirm and record.
3. **After:** every module page should expose exactly one h1 matching the page
   topic, with a logical h2/h3 outline. Record any skips.

### C. Rotor: Links
4. In the links list, note any link you cannot understand out of context.
   (Before: 12 identically-named "Download from … MP4" links; "[K&R]"; 15
   "Expand Menu" links; 7 links to `#?w=535`.)

### D. Rotor: Landmarks / tables / form controls
5. Before: no landmarks exist (rotor shows none) — confirm.
6. After: header, navigation, main, footer should all be present; check the
   Further-study replacement — the lesson's Schools table (VO+U → Tables):
   does VO announce the caption and header cells (VO+Left/Right inside cells)?
7. Form controls (VO+U → Form Controls): before, the search field has no
   label — confirm. After (case study site): every field is labeled.

### E. Video page (after only)
8. On `module/video.html`, verify the player announces as a group with a
   chapter list of buttons; play with Space; check the captions track is
   offered (VO+Right over the player should mention the captions).
9. Open the transcript page: headings and timestamps should read cleanly.

### F. Quiz (after only)
10. On `module/quiz.html`, use VO to answer one question: the legend, options,
    and "Check answer" should be announced; after checking, confirm the
    feedback ("Correct." / "Not quite.") is announced automatically
    (live region). Record whether any feedback is color-only (it should not
    be — verdicts are text).

### G. Wrap-up
11. Note anything confusing, mispronounced, or announced out of order —
    including on the case study site itself.
12. Time the session; log results as `evaluation/human-protocol/results/voiceover-<date>.md`
    with: page, step, observation, verdict (pass / issue), and a quote for any
    problem. Open issues go into `audit/issue-log.csv` with `verified_by:
    "Human VoiceOver pass <date>"`.

## Reporting rules
- Quote the screen reader's actual announcements where relevant.
- Never generalize one session into "tested with users."
- If you are a daily VoiceOver user reviewing this repo, also fill in the
  AT-user review template (next file) — your perspective is the stronger
  evidence and should be credited explicitly (with your permission to quote).
