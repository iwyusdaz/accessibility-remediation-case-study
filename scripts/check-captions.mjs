#!/usr/bin/env node
// Caption accuracy check (PENDING pipeline): word-error-rate of the shipped
// captions against a speech-to-text transcription of the video's audio.
//
// Rules this pipeline follows (per the portfolio's evaluation standards):
//  - Reads configuration from .env (never committed). If a value is missing or
//    still a placeholder -> clear message + exit(1) with ZERO network calls.
//  - --dry-run -> stub responses only, written to dry-run/ and labeled
//    "DRY RUN – NOT REAL RESULTS". Never used as results.
//  - One command: `npm run eval:pending` (or `npm run eval:dry-run`).
//
// STT slot (OpenAI-compatible transcription endpoint):
//   STT_BASE_URL      e.g. https://api.example.com/v1
//   STT_API_KEY       the key
//   STT_MODEL_NAME    e.g. some-whatever-asr-1
//
// Method (real run):
//  1. Probe the video source (archive.org MP4) for byte size; download a
//     bounded SAMPLE (default first 300 s, --sample-seconds to change) so a
//     full 50-min download is not required. Requires ffmpeg on PATH to extract
//     mono 16 kHz WAV audio from the MP4 sample.
//  2. POST the WAV to `${STT_BASE_URL}/audio/transcriptions`
//     (multipart form: file, model) — the OpenAI-compatible transcription
//     contract.
//  3. Score word error rate (WER) between STT output and the shipped captions
//     (docs/module/media/captions-en.vtt), restricted to the sampled window:
//     WER = (substitutions + deletions + insertions) / reference words,
//     computed with a banded Levenshtein alignment on normalized words.
//  4. Write evaluation/caption-wer-results.json and print a summary. The
//     result NEVER marks captions "fixed" on its own — the human protocol in
//     evaluation/human-protocol/caption-accuracy-check.md remains part of the
//     verdict.

import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const sampleIdx = args.indexOf("--sample-seconds");
const SAMPLE_SECONDS = sampleIdx >= 0 ? parseInt(args[sampleIdx + 1], 10) : 300;

// ---------- env ----------
let env = {};
if (existsSync(join(ROOT, ".env"))) {
  for (const line of readFileSync(join(ROOT, ".env"), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2];
  }
}
const PLACEHOLDER = /YOUR_.*_HERE/i;
const BASE_URL = env.STT_BASE_URL;
const API_KEY = env.STT_API_KEY;
const MODEL = env.STT_MODEL_NAME;
// ---------- helpers ----------
function fail(msg) { console.error("ERROR: " + msg); process.exit(1); }

function downloadSample(url, outPath, maxBytes) {
  // bounded download via curl: byte range, follow redirects
  const r = spawnSync("curl", ["-sL", "--max-time", "600", "-r", `0-${maxBytes - 1}`, "-o", outPath, url], { stdio: "inherit" });
  if (r.status !== 0) fail(`download failed (curl exit ${r.status})`);
  return statSync(outPath).size;
}

function extractWav(mp4Path, wavPath) {
  if (!spawnSync("ffmpeg", ["-version"]).status) {
    fail("ffmpeg is required on PATH to extract audio for the STT call (brew install ffmpeg).");
  }
  const r = spawnSync("ffmpeg", ["-y", "-i", mp4Path, "-t", String(SAMPLE_SECONDS), "-ac", "1", "-ar", "16000", wavPath], { stdio: "ignore" });
  if (r.status !== 0) fail("ffmpeg audio extraction failed");
}

async function transcribe(wavPath) {
  const wav = readFileSync(wavPath);
  const form = new FormData();
  form.append("file", new Blob([wav], { type: "audio/wav" }), "sample.wav");
  form.append("model", MODEL);
  const res = await fetch(`${BASE_URL.replace(/\/$/, "")}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}` },
    body: form
  });
  if (!res.ok) fail(`STT endpoint returned ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  return data.text || data.transcript || "";
}

// ---------- caption parsing + WER ----------
function parseVtt(vtt) {
  const cues = [];
  const blocks = vtt.split(/\r?\n\r?\n/);
  for (const b of blocks) {
    const m = b.match(/(\d{2}):(\d{2}):([\d.]+) --> (\d{2}):(\d{2}):([\d.]+)\r?\n((?:.|\r?\n)+)/);
    if (!m) continue;
    const start = (+m[1]) * 3600 + (+m[2]) * 60 + parseFloat(m[3]);
    const text = m[7].replace(/^[A-Z]+:\s*/gm, "").replace(/\s+/g, " ").trim();
    cues.push({ start, text });
  }
  return cues;
}
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
const words = (s) => norm(s).split(" ").filter(Boolean);

function wer(reference, hypothesis) {
  // banded Levenshtein at word level
  const n = reference.length, m = hypothesis.length;
  const BAND = Math.max(50, Math.floor(Math.abs(n - m)) + 50);
  const INF = 1e9;
  const d = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(INF));
  for (let i = 0; i <= n; i++) d[i][0] = i;
  for (let j = 0; j <= m; j++) d[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = Math.max(1, i - BAND); j <= Math.min(m, i + BAND); j++) {
      const cost = reference[i - 1] === hypothesis[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
    }
  }
  const dist = d[n][m];
  const sub = dist === INF ? NaN : dist;
  return { distance: dist, wer: dist / Math.max(1, n), refWords: n, hypWords: m };
}

const missing = [
  ["STT_BASE_URL", BASE_URL], ["STT_API_KEY", API_KEY], ["STT_MODEL_NAME", MODEL]
].filter(([, v]) => !v || PLACEHOLDER.test(v));

if (missing.length && !DRY) {
  console.error(`PENDING: requires API key — missing or placeholder in .env: ${missing.map(([k]) => k).join(", ")}`);
  console.error("Copy .env.example to .env and fill in the STT_* values, then run `npm run eval:pending` again. No network calls were made.");
  process.exit(1);
}

// ---------- dry run ----------
if (DRY) {
  const outDir = join(ROOT, "dry-run");
  mkdirSync(outDir, { recursive: true });
  const stub = {
    label: "DRY RUN – NOT REAL RESULTS",
    generatedAt: "2026-10-25",
    note: "Stub output for pipeline testing only. No network calls were made. Do not cite these numbers.",
    config: { base_url_present: true, api_key_present: true, model: "(dry-run stub)", sample_seconds: SAMPLE_SECONDS },
    sttTranscriptStub: "[DRY RUN – NOT REAL RESULTS] good afternoon congratulations for braving it through what's now become a weekly snow disaster",
    wer: { distance: 3, wer: 0.05, refWords: 60, hypWords: 58, stub: true }
  };
  writeFileSync(join(outDir, "caption-wer-results.json"), JSON.stringify(stub, null, 2));
  console.log("DRY RUN – NOT REAL RESULTS");
  console.log(`Stub WER written to dry-run/caption-wer-results.json (no network calls). Pipeline code path OK.`);
  process.exit(0);
}

// ---------- real run ----------
const VIDEO_URL = "https://archive.org/download/MIT9.00SCF11/MIT9_00SCF11_lec01_300k.mp4";
const VTT = join(ROOT, "docs", "module", "media", "captions-en.vtt");
const work = join(ROOT, "scripts", "stt-work");
mkdirSync(work, { recursive: true });

console.log(`Downloading a ${SAMPLE_SECONDS}s sample of the video (bounded byte-range)...`);
const maxBytes = Math.ceil((SAMPLE_SECONDS + 30) * (300 * 1024 / 8)) + 1_000_000; // 300 kbps + slack
const mp4 = join(work, "sample.mp4");
downloadSample(VIDEO_URL, mp4, maxBytes);
console.log(`sample bytes: ${statSync(mp4).size}`);

const wav = join(work, "sample.wav");
extractWav(mp4, wav);
console.log("Requesting transcription from the configured STT endpoint...");
const sttText = await transcribe(wav);

const cues = parseVtt(readFileSync(VTT, "utf8"));
const refWords = cues.filter((c) => c.start < SAMPLE_SECONDS).map((c) => c.text).join(" ");
const score = wer(words(refWords), words(sttText));

const result = {
  generatedAt: new Date().toISOString(),
  method: "STT (OpenAI-compatible /audio/transcriptions) on a bounded audio sample vs. shipped captions; word-level Levenshtein WER.",
  video: { url: VIDEO_URL, sampleSeconds: SAMPLE_SECONDS, sampleBytes: statSync(mp4).size },
  captions: "docs/module/media/captions-en.vtt (text from MIT OCW official transcript; timings machine-aligned)",
  sttModel: MODEL,
  sttTranscriptExcerpt: sttText.slice(0, 500),
  wer: score,
  interpretation: "WER quantifies caption-text vs. speech agreement on the sampled window. It complements (does not replace) the human protocol in evaluation/human-protocol/caption-accuracy-check.md. A good WER alone does not mark captions 'fixed'."
};
writeFileSync(join(ROOT, "evaluation", "caption-wer-results.json"), JSON.stringify(result, null, 2));
console.log(`WER: ${(score.wer * 100).toFixed(1)}% (${score.distance} errors / ${score.refWords} reference words)`);
console.log("Results written to evaluation/caption-wer-results.json");
console.log("Reminder: run the human caption check (evaluation/human-protocol/caption-accuracy-check.md) as well.");
