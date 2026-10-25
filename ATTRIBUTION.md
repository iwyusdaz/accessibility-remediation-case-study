# Attribution and source material

This repository remediates a real, openly licensed course module. Everything
derived from third parties is credited here, as required by the source licenses.

## Primary source module

| | |
|---|---|
| **Course** | 9.00SC Introduction to Psychology, Fall 2011 — Unit 1: "Introduction" (first week) |
| **Author / instructor** | Prof. John Gabrieli, MIT Department of Brain and Cognitive Sciences |
| **Publisher** | MIT OpenCourseWare (OCW Scholar format) |
| **URL** | https://ocw.mit.edu/courses/9-00sc-introduction-to-psychology-fall-2011/ |
| **License** | CC BY-NC-SA 3.0 US — http://creativecommons.org/licenses/by-nc-sa/3.0/us/ |
| **How verified** | The retrieved course home page (`source/ocw-2011-snapshot/index.htm`) carries `rel="license"` pointing at the CC BY-NC-SA 3.0 US deed; confirmed on the live modern course pages as well. Retrieved **2026-10-25** via the Internet Archive (timestamps in `source/README.md`). |

Under CC BY-NC-SA 3.0 US this portfolio use (attribution given, non-commercial,
share-alike) is permitted. Redistributed originals are in `source/`; the
renderable "before" snapshot is in `docs/before/`.

## What was adapted, and how

| Material | Original | Changes made in this repo |
|---|---|---|
| Course pages (home, Unit 1, Exam 1) | 2011–2012 MIT OCW Scholar HTML | **None** in `source/`. The renderable copies in `docs/before/` differ only by local asset paths (disclosed in `source/README.md`). |
| Lecture 1 slides PDF | `MIT9_00SCF11_lec01.pdf` (54 pages) | Rebuilt as an accessible HTML slide deck at `docs/module/slides.html`: real text instead of image-heavy slides, alt text and long descriptions for figures, chart data as an HTML table, speaker notes as visible text. Content and order follow the original; wording unchanged except where plain-language notes below apply. |
| Study outline PDF (Kosslyn & Rosenberg ch. 1) | `MIT9_00SCF11_read_kr1.pdf` (10 pages, contains "Table 1: Schools of Psychological Thought") | Converted to semantic HTML at `docs/module/lesson.html`, including Table 1 as a proper HTML `<table>` with `<caption>`, `<th scope>`, and a linked long description. Wording follows the original PDF. |
| Exam 1 / practice exams | `MIT9_00SCF11_exam1_2010.pdf` + solutions | Five multiple-choice questions were selected (numbers 2, 4, 6, 9, 16 of the Spring 2010 practice exam) and rebuilt as an accessible quiz at `docs/module/quiz.html` (native form controls, `fieldset`/`legend`, labels, live-region feedback). Question and answer wording is the author's; distractor order preserved. |
| Lecture 1 video | ~50 min lecture, hosted by MIT OCW / Internet Archive (linked, not copied — size) | Not modified (the video file stays at the source; the license permits linking). The remediated `docs/module/video.html` links to it, provides the publisher transcript as accessible HTML, and ships a corrected WebVTT caption file derived from the publisher transcript (see below). |
| Lecture 1 transcript | Official MIT OCW transcript PDF (`ac10dd296d93afcc1e95591899ee46b9_2fbrl6WoIyo.pdf`, retrieved from the modern OCW video page, 2026-10-25) | Converted to HTML (`docs/module/transcript.html`) and to `docs/module/media/captions-en.vtt`. Transcript **text** is MIT's, unchanged. Caption **timings** do not exist in the publisher transcript: cue boundaries were aligned automatically against the timing skeleton of YouTube's automatic captions for the same video, then reviewed against the transcript; this method is described on the video page and in `audit/methodology.md`. A human accuracy check against the audio is still pending (see `evaluation/METHODS.md`). |
| "Further Study" table | HTML table on the Unit 1 page | Referenced in the audit; not reproduced in the remediation (resources are optional external links). |

## Other third-party material referenced

- **YouTube automatic captions** for `2fbrl6WoIyo` (Lecture 1): used only as a
  timing skeleton for caption alignment; their text is NOT redistributed as captions.
- Brain image in the lecture slides is credited in the original PDF
  ("Reproduced with permission from http://www.brains.rad.msu.edu and
  http://brainmuseum.org"); the remediated slide links the description instead of
  reproducing the image.
- Hermann Grid illusion image shown on the original Unit 1 page is public domain
  (per the original page's own caption).
- WCAG 2.1 / 2.2 (W3C) are cited by reference; no W3C text is reproduced beyond
  short criterion titles and permalinks.

## Licensing of this repository

- `LICENSE` (CC BY-NC-SA 3.0 US, matching the source) applies to the **learning
  content**: `source/`, `docs/before/`, the content within `docs/module/` pages
  (lesson text, slides, quiz items, captions, transcript), and `docs/assets/` media.
- `LICENSE-CODE` (MIT) applies to the **code**: `scripts/`, `docs/module/css/`,
  `docs/module/js/`, and the page structure/stylesheet of the case study site
  (`docs/index.html`, `docs/program/`, `docs/faculty-quick-guide.html`).
- The audit documentation (`audit/`, `report/`, `program/`, `evaluation/`) is
  original work for this case study, licensed CC BY-NC-SA 3.0 US to keep the whole
  content set under one ShareAlike-compatible license.
