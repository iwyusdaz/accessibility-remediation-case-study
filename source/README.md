# source/ — Original course module, unchanged

This folder holds the original course module as retrieved, **without modification**
(except where noted below). It is the "ground truth" the audit was run against.

## What the module is

| Field | Value |
|---|---|
| Course | **9.00SC Introduction to Psychology, Fall 2011** — Unit 1: "Introduction" (first week of the course) |
| Author / instructor | Prof. John Gabrieli, MIT Department of Brain and Cognitive Sciences |
| Publisher | MIT OpenCourseWare (OCW Scholar format) |
| Source site | https://ocw.mit.edu/courses/9-00sc-introduction-to-psychology-fall-2011/ |
| License | **Creative Commons Attribution-NonCommercial-ShareAlike 3.0 US** (CC BY-NC-SA 3.0 US) |
| License verification | `rel="license"` link on the retrieved course home page points to http://creativecommons.org/licenses/by-nc-sa/3.0/us/ (verified 2026-10-25; see `../ATTRIBUTION.md`) |
| Retrieval date | **2026-10-25**, via the Internet Archive (Wayback Machine) raw `id_` captures |

The MIT OpenCourseWare site was redesigned after 2020; the 2011-era pages that
constitute this module are preserved only in the Internet Archive. The captures
used are listed below. Screenshots of the live modern course pages (including the
lecture video page with the publisher transcript) are in `../audit/automated-results/`.

## Files in this folder

```
ocw-2011-snapshot/
├── index.htm                  Course home page
├── introduction/index.htm     Unit 1 "Introduction" session page (the module home)
├── exam-1/index.htm           Exam 1 page (practice exams used as the module's quiz)
├── introduction/MIT9_00SCF11_lec01.pdf      Lecture 1 slides (54-page PDF)
├── introduction/MIT9_00SCF11_read_kr1.pdf   Study outline, Kosslyn & Rosenberg ch. 1 (PDF, contains Table 1)
├── exam-1/MIT9_00SCF11_exam1.pdf            Exam 1 questions (12 pages)
├── exam-1/MIT9_00SCF11_exam1_sol.pdf        Exam 1 solutions
├── exam-1/MIT9_00SCF11_exam1_2010.pdf       Practice exam 1, Spring 2010 (21 pages)
├── exam-1/MIT9_00SCF11_exam1_2010sol.pdf    Practice exam 1, Spring 2010 — solutions
├── styles/ scripts/ images/ courses/       Page assets (CSS, JS, images)
```

The lecture video itself is **not** copied into this repository: it is a ~50-minute
lecture (much larger than the 50 MB repo limit), and the license permits linking.
It is available at the publisher's page:
https://ocw.mit.edu/courses/9-00sc-introduction-to-psychology-fall-2011/resources/lecture-1-introduction/
(direct MP4: `http://www.archive.org/download/MIT9.00SCF11/MIT9_00SCF11_lec01_300k.mp4`).
The publisher's official transcript PDF was retrieved separately for the caption
remediation (see `../ATTRIBUTION.md` and `docs/module/media/`).

## Exact captures used (Internet Archive Wayback Machine)

| Page | Original URL | Wayback timestamp |
|---|---|---|
| Course home | `http://ocw.mit.edu/courses/brain-and-cognitive-sciences/9-00sc-introduction-to-psychology-fall-2011/index.htm` | 20121126233138 |
| Unit 1 page | `http://ocw.mit.edu/courses/brain-and-cognitive-sciences/9-00sc-introduction-to-psychology-fall-2011/introduction/` | 20121110125628 |
| Exam 1 page | `http://ocw.mit.edu/courses/brain-and-cognitive-sciences/9-00sc-introduction-to-psychology-fall-2011/exam-1` | 20121120090330 |
| PDFs and assets | Same paths under `ocw.mit.edu` | nearest 2012-era capture (`/web/2012id_/`) |

Reproduce the snapshot with `node scripts/snapshot-source.mjs` (fetches the same
raw captures).

## Modifications (disclosure)

- `source/ocw-2011-snapshot/*.htm`: **verbatim** HTML as captured — no changes.
- `docs/before/` contains the same HTML with **one mechanical change**: absolute
  `ocw.mit.edu` asset URLs are rewritten to relative local paths so the pages render
  offline, and links to pages outside the snapshotted module point to the Internet
  Archive instead of being dead. No markup, content, or styling was altered.
- Analytics beacons (`statse.webtrendslive.com`, Google services) are neutralized in
  the renderable copy (replaced with a local transparent image) so the snapshot makes
  no third-party calls. This does not change rendered content or layout.
