# Status

Updated: 2026-10-25

## Done
- Source module selected, license verified (CC BY-NC-SA 3.0 US), snapshot
  retrieved from Internet Archive into `source/` + renderable copy in `docs/before/`
- Automated audits of the original (axe-core 4.11.1, Lighthouse 13.0.1, pa11y 9.0.0)
  saved in `audit/automated-results/`
- Scripted manual pass of the original (keyboard, focus, 320 px / 400 % reflow,
  contrast measurements) in `audit/manual-testing-notes.md` + `audit/manual-evidence/`
- Issue log (≥25 issues) in `audit/issue-log.csv` / `audit/issue-log.md`
- Remediated module in `docs/module/` (lesson, slides, video + captions +
  transcript, quiz) passing scripted keyboard/reflow/contrast/axe checks
- Reports: `report/conformance-report.md`, `report/before-after.md`,
  `report/executive-summary.md`
- Program materials: `program/prioritization-model.md`,
  `program/remediation-workflow.md`, `program/faculty-quick-guide.md`
- Pending pipeline: `npm run eval:pending` (caption WER via STT) with
  `--dry-run` support; dry run verified
- Demo video (scripted keyboard navigation, captioned) in `docs/assets/`
- Evaluation methods + human protocols in `evaluation/`
- Published on GitHub Pages

## Pending (requires human action or API keys)
- **Caption accuracy (STT word-error-rate):** `npm run eval:pending` after adding
  STT keys to `.env` (see `.env.example`). Until then the conformance report
  lists caption accuracy as pending; captions' text comes from the publisher's
  official transcript.
- **VoiceOver manual pass:** Guidepup automation does not work on macOS 27;
  a human must run `evaluation/human-protocol/voiceover-protocol.md` (before/after
  rotor checks) — conformance report marks screen-reader results accordingly.
- **Daily AT user review:** invitation template in
  `evaluation/human-protocol/at-user-review-invite.md`; strongest missing evidence.
- **Caption timing spot-check:** human review of `.vtt` timing comfort
  (`evaluation/human-protocol/caption-accuracy-check.md`).

## Known limitations (disclosed, not fixable here)
- No review by a person who uses assistive technology daily.
- No VoiceOver automation evidence; aria snapshots + keyboard scripts are not
  screen-reader testing.
- "Lakeside State University" is fictional; the audited module is real.
- Not an official VPAT; no conformance certification is claimed.
