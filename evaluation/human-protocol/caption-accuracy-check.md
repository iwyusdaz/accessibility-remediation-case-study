# Human caption-accuracy check protocol

**Target:** `docs/module/media/captions-en.vtt` for Lecture 1 (~50 min).
**Who:** any human with headphones; ~30 minutes with sampling (full pass ~1
hour). **Status:** pending — this is the human complement to the pending
machine STT check (`npm run eval:pending`).

**Context you should know before starting**
- Caption **text** comes from MIT OpenCourseWare's official human transcript
  for this lecture (publisher-provided), so the words are expected to be
  accurate; what needs checking is the **timing** (machine-aligned) and any
  residual mismatches (e.g., professor said something after the transcript
  was made, or laughter/sounds the transcript skipped).
- This protocol checks *human-perceived* accuracy and comfort. The machine
  WER check (speech-to-text vs. captions) is a separate, pending method —
  neither one alone "proves" the captions; run both.

## Sampling plan

1. Pick 6 checkpoints spread over the video: the start (0:00–1:30), one point
   in each chapter (0:27–4:53, 4:53–20:09, 20:09–29:58, 29:58–37:09,
   37:09–49:30), and the final two minutes.
2. At each checkpoint, play **90 seconds** with captions on.

## What to record per checkpoint

| Check | Question |
|---|---|
| Sync | Do captions appear with the words (±1 second)? Drift growing over the session? |
| Text | Any word on screen that the speaker did not say? |
| Missing | Any spoken sentence with no caption? |
| Speaker labels | Do PROFESSOR/AUDIENCE labels match who is speaking? |
| Comfort | Can you finish reading each cue before it disappears? |
| Sounds | Are meaningful non-speech sounds (laughter, applause) absent? Note where captions would benefit from a "[laughter]" cue — currently omitted because the publisher transcript omits them. |

## Verdict rules

- Any **sync drift > 2 seconds** that grows over the session: timing
  alignment needs rework — mark the captions "timing needs fix" in the
  conformance report; do not mark caption timing "verified."
- **Word mismatches against the audio** (transcript vs. what is said): list
  them with timestamps; they are re-exported captions, so corrections go into
  `scripts/build-captions.mjs` (or a documented override file), then rebuild.
- If everything reads clean at all six checkpoints: record
  `PASS (sampled, 6 × 90s)` with date and reviewer in
  `evaluation/human-protocol/results/captions-<date>.md`. Note explicitly that
  this is a sampled human check, not a full-review certification.

## Machine check (companion, pending API key)

`npm run eval:pending` runs `scripts/check-captions.mjs`: it sends the video's
audio (or a sampled segment) to the configured speech-to-text endpoint and
computes a word-error-rate between STT output and the shipped captions. Results
land in `evaluation/caption-wer-results.json`. Until it runs, the conformance
report's caption row stays at "Partially Supports (accuracy check pending)."
