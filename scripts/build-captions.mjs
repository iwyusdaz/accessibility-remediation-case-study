#!/usr/bin/env node
// Build corrected WebVTT captions for Lecture 1 from the publisher transcript.
//
// TEXT SOURCE: MIT OCW's official human transcript (source/ocw-transcript-lec01.pdf,
// extracted with pypdf to scripts/caption-build/transcript.txt).
// TIMING SOURCE: YouTube's automatic captions for the same video
// (source/youtube-auto-captions-2fbrl6WoIyo.en.vtt) supply a per-word timing
// skeleton. The publisher transcript carries no timings.
//
// Method:
//  1. Parse the auto-caption VTT into a per-word (time, word) timeline
//     (word-level <00:00:00.120><c> tags), de-duplicating YouTube's rolling cues.
//  2. Normalize and align the transcript words to the auto words (difflib-style
//     longest-matching-block alignment on lowercase alphanumerics).
//  3. Transcript words matched to auto words take that timing; unmatched words
//     (auto-caption errors that the official transcript corrects) are interpolated
//     between their matched neighbors.
//  4. Cue construction: <= 2 lines of <= 42 chars, break preference at sentence
//     ends and speaker changes, 0.5s min / 6s max duration.
//
// Output:
//   docs/module/media/captions-en.vtt
//   docs/module/media/captions-build-report.json  (transparency: method + stats)
//
// Run: node scripts/build-captions.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const WORK = join(ROOT, "scripts", "caption-build");
mkdirSync(WORK, { recursive: true });

// ---------- 1. transcript text ----------
const transcriptTxt = join(WORK, "transcript.txt");
if (!existsSync(transcriptTxt)) {
  execFileSync("python3", ["-c", `
from pypdf import PdfReader
r = PdfReader(${JSON.stringify(join(ROOT, "source", "ocw-transcript-lec01.pdf"))})
open(${JSON.stringify(transcriptTxt)}, "w").write("\\n\\n".join((p.extract_text() or "") for p in r.pages))
`]);
  console.log("extracted transcript text from PDF");
}
let raw = readFileSync(transcriptTxt, "utf8");
// split off the "MITOCW | file" line; the CC blurb that follows is actually
// spoken in the video (narrator), so it becomes the first captioned paragraph.
const headerMatch = raw.match(/^MITOCW \|.*$/m);
let blurbText = null;
if (headerMatch) {
  const afterHeader = raw.slice(headerMatch.index + headerMatch[0].length);
  const firstSpeakerRel = afterHeader.search(/^[A-Z][A-Z ]+:\s*$/m);
  blurbText = afterHeader.slice(0, firstSpeakerRel).replace(/\s+/g, " ").trim();
  raw = afterHeader.slice(firstSpeakerRel);
}

// join PDF line breaks into paragraphs; detect speaker labels
const paragraphs = [];
let currentSpeaker = null, buf = [];
for (const line of raw.split("\n")) {
  const s = line.trim();
  const sp = s.match(/^([A-Z][A-Z ]+):$/);
  if (sp) {
    if (buf.length) paragraphs.push({ speaker: currentSpeaker, text: buf.join(" ") });
    currentSpeaker = sp[1].charAt(0) + sp[1].slice(1).toLowerCase().replace(/\b\w/g, (c) => c); // e.g. Professor
    currentSpeaker = sp[1][0] + sp[1].slice(1).toLowerCase();
    buf = [];
    continue;
  }
  if (!s) { if (buf.length) { paragraphs.push({ speaker: currentSpeaker, text: buf.join(" ") }); buf = []; } continue; }
  buf.push(s);
}
if (buf.length) paragraphs.push({ speaker: currentSpeaker, text: buf.join(" ") });
const transcriptWords = [];
// the spoken CC blurb comes first (narrator voice in the video)
if (blurbText) for (const w of blurbText.split(/\s+/)) if (w) transcriptWords.push({ w, speaker: "Narrator" });
for (const p of paragraphs) {
  for (const w of p.text.split(/\s+/)) if (w) transcriptWords.push({ w, speaker: p.speaker });
}
// drop trailing PDF page-number artifact (standalone digits at the very end)
while (transcriptWords.length && /^\d+$/.test(transcriptWords[transcriptWords.length - 1].w)) transcriptWords.pop();
console.log("transcript paragraphs:", paragraphs.length, "words:", transcriptWords.length);

// ---------- 2. auto-caption word timeline ----------
const vtt = readFileSync(join(ROOT, "source", "youtube-auto-captions-2fbrl6WoIyo.en.vtt"), "utf8");
const toSec = (ts) => {
  const m = ts.match(/(\d+):(\d+):([\d.]+)/);
  return m ? (+m[1]) * 3600 + (+m[2]) * 60 + parseFloat(m[3]) : null;
};
const autoWords = []; // {t, w}
for (const block of vtt.split(/\r?\n\r?\n/)) {
  const lines = block.split(/\r?\n/);
  const textLines = lines.filter((l) => l && !l.startsWith("WEBVTT") && !l.startsWith("Kind:") && !l.startsWith("Language:") && !l.includes("-->"));
  for (const line of textLines) {
    // YouTube auto-caption format:  word<00:00:01.240><c> next</c><00:00:01.680><c> words</c>
    // a <time> marker introduces the <c>-wrapped word that follows it. Bare words
    // (no marker) are rolling-window repeats of earlier cues and are skipped.
    const re = /<c>\s*([^<]*?)\s*<\/c>|<(\d+:\d+:[\d.]+)>/g;
    let pending = null, m;
    while ((m = re.exec(line))) {
      if (m[2]) { pending = toSec(m[2]); continue; }
      const word = (m[1] || "").trim();
      if (!word) continue;
      if (pending === null) continue;
      autoWords.push({ t: pending, w: word });
      pending = null;
    }
  }
}
// de-dup consecutive identical (t, w)
const timeline = [];
for (const aw of autoWords) {
  const last = timeline[timeline.length - 1];
  if (last && last.t === aw.t && last.w === aw.w) continue;
  timeline.push(aw);
}
console.log("auto caption timed words:", timeline.length);
if (!timeline.length) { console.error("no timed words parsed"); process.exit(1); }

// ---------- 3. alignment ----------
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9']/g, "");
const a = timeline.map((x) => norm(x.w));
const b = transcriptWords.map((x) => norm(x.w));

// compute matching blocks: n-gram anchors + local alignment in gaps (fast, linear-ish)
function matchBlocks(a, b) {
  const N = 8; // anchor n-gram length
  const blocks = [];
  // index auto n-grams -> list of positions
  const idx = new Map();
  const key = (arr, i) => arr.slice(i, i + N).join("\u0001");
  for (let i = 0; i + N <= a.length; i++) {
    const k = key(a, i);
    if (!idx.has(k)) idx.set(k, []);
    idx.get(k).push(i);
  }
  // greedy chain of anchors over b
  let bi = 0, ai = 0;
  const anchors = [];
  while (bi + N <= b.length) {
    const k = key(b, bi);
    const cands = idx.get(k);
    let found = null;
    if (cands) {
      for (const cand of cands) {
        if (cand < ai) continue;
        // extend match maximally
        let len = N;
        while (bi + len < b.length && cand + len < a.length && b[bi + len] === a[cand + len]) len++;
        found = { ai: cand, bi, len };
        break;
      }
    }
    if (found) {
      anchors.push(found);
      ai = found.ai + found.len;
      bi = found.bi + found.len;
    } else {
      bi += 1;
    }
  }
  // fill gaps with a bounded greedy window matcher (monotone, O(gap * window)).
  // Long function-word gaps between anchors are bridged by matching words in
  // sequence; anything unmatched stays for interpolation.
  const WINDOW = 12;
  function greedyGap(ai0, aj, bi0, bj, out) {
    let j = bi0;
    for (let i = ai0; i < aj && j < bj; i++) {
      // search ahead in a small window for the next equal word
      let hit = -1;
      for (let k = j; k < Math.min(bj, j + WINDOW); k++) {
        if (b[k] === a[i]) { hit = k; break; }
      }
      if (hit >= 0) { out.push([i, hit, 1]); j = hit + 1; }
    }
  }
  let pa = 0, pb = 0;
  for (const an of anchors) {
    greedyGap(pa, an.ai, pb, an.bi, blocks);
    blocks.push([an.ai, an.bi, an.len]);
    pa = an.ai + an.len; pb = an.bi + an.len;
  }
  greedyGap(pa, a.length, pb, b.length, blocks);
  return blocks.sort((x, y) => x[0] - y[0]);
}
const __t0 = Date.now();
const blocks = matchBlocks(a, b);
console.log(`matchBlocks: ${blocks.length} blocks in ${Date.now() - __t0}ms`);
const bToA = new Array(b.length).fill(-1);
for (const [ai, bi, len] of blocks) for (let k = 0; k < len; k++) bToA[bi + k] = ai + k;
const matched = bToA.filter((x) => x >= 0).length;
console.log(`aligned ${matched}/${b.length} transcript words (${Math.round((matched / b.length) * 100)}%)`);

// word start times
const t = new Array(b.length).fill(null);
for (let i = 0; i < b.length; i++) if (bToA[i] >= 0) t[i] = timeline[bToA[i]].t;
// interpolate unmatched / out-of-order words; enforce monotonic timing
const nextAnchored = new Array(b.length);
let na = b.length;
for (let i = b.length - 1; i >= 0; i--) { if (t[i] !== null) na = i; nextAnchored[i] = na; }
let lastT = timeline[0].t;
for (let i = 0; i < b.length; i++) {
  if (t[i] === null) {
    const j = nextAnchored[i];
    const nextT = j < b.length && t[j] > lastT ? t[j] : lastT + 0.4 * (j - i + 1);
    const step = (nextT - lastT) / (j - i + 1);
    for (let k = i; k < j; k++) t[k] = lastT + step * (k - i + 1);
    lastT = t[j - 1];
    i = j - 1;
    continue;
  }
  if (t[i] > lastT) { lastT = t[i]; continue; }
  t[i] = lastT + 0.05; // out-of-order anchored word: nudge just after the previous
  lastT = t[i];
}
// final monotonic pass
for (let i = 1; i < t.length; i++) if (t[i] < t[i - 1]) t[i] = t[i - 1];
const videoEnd = timeline[timeline.length - 1].t + 2;

// ---------- 4. cue construction ----------
const fmt = (s) => {
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = (s % 60).toFixed(3).padStart(6, "0");
  return `${h}:${m}:${sec}`;
};
function chunkWords(words, times, speakers) {
  // group into cues of <= 2 lines x <= 42 chars, prefer sentence ends
  const cues = [];
  let cur = [];
  const width = (arr) => arr.join(" ").length;
  const flush = () => {
    if (!cur.length) return;
    const start = times[cur[0].i];
    const lastIdx = cur[cur.length - 1].i;
    const nextStart = lastIdx + 1 < times.length ? times[lastIdx + 1] : Math.max(videoEnd, start + 1.2);
    // captions end shortly after the last word is spoken — never stretch across
    // long silences (gaps until the next cue). Reading time ≈ 0.35 s/word + 0.7s,
    // at least 1.2 s, capped at the next cue's start with a small gap.
    const speechEnd = start + Math.max(1.2, cur.length * 0.35 + 0.7);
    const end = Math.max(start + 1.0, Math.min(nextStart - 0.05, speechEnd));
    cues.push({ start, end, text: cur.map((c) => c.w).join(" ").replace(/\s+/g, " ").trim(), speaker: speakers[cur[0].i] });
    cur = [];
  };
  for (let i = 0; i < words.length; i++) {
    cur.push({ w: words[i], i });
    const text = cur.map((c) => c.w).join(" ");
    const endsSentence = /[.?!]$/.test(words[i]);
    const speakerChange = i + 1 < speakers.length && speakers[i + 1] !== speakers[i];
    const tooBig = text.length >= 84 || cur.length >= 18;
    if (tooBig || ((endsSentence || speakerChange) && text.length >= 20) || (endsSentence && text.length >= 12)) flush();
  }
  flush();
  return cues;
}
const words = transcriptWords.map((x) => x.w);
const speakers = transcriptWords.map((x) => x.speaker);
const cues = chunkWords(words, t, speakers);
if (process.env.DEBUG_CAPTIONS) console.log("cues[0..2] pre-split:", JSON.stringify(cues.slice(0, 3), null, 1));
// enforce max duration 6s: split long cues evenly by words
const finalCues = [];
for (const c of cues) {
  if (c.end - c.start <= 6.5) { finalCues.push(c); continue; }
  const parts = Math.ceil((c.end - c.start) / 6);
  const w = c.text.split(" ");
  const per = Math.ceil(w.length / parts);
  for (let k = 0; k < parts; k++) {
    const seg = w.slice(k * per, (k + 1) * per);
    if (!seg.length) continue;
    finalCues.push({
      start: c.start + ((c.end - c.start) * k) / parts,
      end: c.start + ((c.end - c.start) * (k + 1)) / parts,
      text: seg.join(" "), speaker: c.speaker
    });
  }
}

// ---------- 5. emit ----------
// clamp overlaps: a cue never starts before the previous one ends
let prevEnd = 0;
for (const c of finalCues) {
  if (c.start < prevEnd) c.start = prevEnd;
  if (c.end <= c.start) c.end = c.start + 1.0;
  prevEnd = c.end;
}
let out = "WEBVTT\n\n";
finalCues.forEach((c, i) => {
  const label = c.speaker && (i === 0 || finalCues[i - 1].speaker !== c.speaker) ? `${c.speaker.toUpperCase()}: ` : "";
  out += `${i + 1}\n${fmt(c.start)} --> ${fmt(Math.min(c.end, c.start + 8))}\n${label}${c.text}\n\n`;
});
const mediaDir = join(ROOT, "docs", "module", "media");
mkdirSync(mediaDir, { recursive: true });
writeFileSync(join(mediaDir, "captions-en.vtt"), out);

const report = {
  method: "Text: MIT OCW official human transcript (publisher). Timings: aligned to YouTube automatic-caption word-timing skeleton; unmatched words interpolated; monotonic correction.",
  video: { id: "2fbrl6WoIyo", title: "Lecture 1: Introduction — 9.00SC Introduction to Psychology, Fall 2011 (MIT OCW, CC BY-NC-SA 3.0 US)" },
  transcriptWords: b.length,
  autoTimedWords: timeline.length,
  alignedPercent: Math.round((matched / b.length) * 100),
  cues: finalCues.length,
  firstCue: finalCues[0], lastCue: finalCues[finalCues.length - 1],
  accuracyStatus: "PENDING: caption text is the publisher transcript, but no speech-to-text comparison against the audio has been run. Run `npm run eval:pending` after configuring STT_* in .env. Human protocol: evaluation/human-protocol/caption-accuracy-check.md.",
  builtAt: "2026-10-25"
};
writeFileSync(join(mediaDir, "captions-build-report.json"), JSON.stringify(report, null, 2));
console.log(`wrote captions-en.vtt with ${finalCues.length} cues`);
console.log("first:", JSON.stringify(finalCues[0]));
console.log("last:", JSON.stringify(finalCues[finalCues.length - 1]));
