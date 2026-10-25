#!/usr/bin/env node
// Build docs/module/slides.html — the Lecture 1 slide deck as accessible HTML.
// Content transcribed from MIT9_00SCF11_lec01.pdf (MIT OCW 9.00SC, CC BY-NC-SA 3.0 US).
// Figure descriptions were written by inspecting each slide (rendered from the
// PDF); third-party images noted by the original as excluded from the CC license
// are described in text, not reproduced.
// Run: node scripts/build-slides.mjs

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

// Each slide: no, title, body (HTML), fig (optional: short alt + long description), note (speaker note text)
const S = [];
const add = (no, title, body, fig, note) => S.push({ no, title, body, fig, note });

add(1, "9.00. Intro to Psychology",
  "<p class=\"slide-sub\">Professor John Gabrieli</p>",
  null,
  "Title slide. Welcome to 9.00, Introduction to Psychology. I'm John Gabrieli, and this lecture introduces the scientific study of human nature.");

add(2, "Objective",
  "<p><em>Objective:</em> Scientific study of human nature/mind/behavior</p>",
  null,
  "The course objective in one line: a scientific study of human nature — mind and behavior.");

add(3, "Topics of the course",
  `<p><em>Objective:</em> Scientific study of human nature/mind/behavior</p>
   <ul>
     <li>brain</li>
     <li>perception</li>
     <li>cognition</li>
     <li>emotion</li>
     <li>personality</li>
     <li>development</li>
     <li>social interaction</li>
     <li>psychopathology</li>
   </ul>`,
  null,
  "The topics we will cover this semester: brain, perception, cognition, emotion, personality, development, social interaction, and psychopathology.");

add(4, "The human brain",
  "<p>Photograph of a human brain (lateral view), shown at true scale with a 5&nbsp;cm ruler.</p>",
  { alt: "Photograph of a human brain beside a 5 cm scale bar; label reads “Human, Homo sapiens”, specimen 69-314.",
    long: "The photograph shows a preserved human brain viewed from the side, with its characteristic folded cortex, cerebellum, and brain stem visible. A scale bar marked 5 cm emphasizes that the brain is a physical object of modest size. The image is credited “Reproduced (or adapted) with permission from http://www.brains.rad.msu.edu and http://brainmuseum.org, supported by the US National Science Foundation.” The third-party photograph is not reproduced here; see the credited brain museums for the original." },
  "We study a physical organ. Everything we will discuss — mind, behavior — is about this 3-pound structure. The image comes from the University of Wisconsin and Michigan State comparative brain collection.");

add(5, "A psychocentric view",
  `<p>Diagram of psychology at the center, surrounded by other disciplines of the social sciences, humanities, and natural sciences.</p>
   <p class="caption">After Peter Gray, “The Value of Psychology 101 in Liberal Arts Education: A Psychocentric Theory of the University.” <cite>Observer (APS)</cite>, October 2008.</p>`,
  { alt: "Hub-and-spoke diagram: Psychology at the center, ringed by the natural sciences (physics, chemistry, biology), the social sciences (anthropology, sociology, political science, economics), and the humanities (music, art, language, literature, philosophy, theology, math/logic).",
    long: "The diagram places Psychology in a hexagon at the center. Around it, three labeled clusters: Natural Sciences — Physics, Chemistry, Biology; Social Sciences — Anthropology, Sociology, Political Science, Economics; Humanities — Music, Art, Language, Literature, Philosophy, Theology, and Math (Logic). Lines connect Psychology to every discipline. The point: psychology connects to nearly every field of a liberal-arts education, and each field informs it." },
  "Peter Gray's 'psychocentric' view: psychology sits at the center of the university's map of knowledge. It draws on the natural sciences, contributes to the social sciences, and shares questions with the humanities.");

add(6, "How our minds make our worlds",
  `<p><em>Objective:</em> Scientific study of human nature/mind/behavior</p>
   <p>how our minds make our worlds</p>`,
  null,
  "The first theme of the lecture: how our minds make our worlds — what we see, what we hear, what we know.");

add(7, "What we see",
  `<p><em>Objective:</em> Scientific study of human nature/mind/behavior</p>
   <p>how our minds make our worlds — what we <em>see</em></p>`,
  null,
  "We begin with vision: what we see is constructed by the mind, as these illusions will show.");

add(8, "Müller-Lyer illusion",
  "",
  { alt: "Two horizontal lines of equal length. The upper line ends in outward-pointing arrowheads (like arrow tails) and appears longer; the lower line ends in inward-pointing arrowheads and appears shorter.",
    long: "The classic Müller-Lyer display: two horizontal lines stacked vertically. The upper line is bounded at both ends by arrowheads pointing outward (opening away from the line), which makes it look longer. The lower line is bounded by arrowheads pointing inward (toward the line), which makes it look shorter. Measured, the two lines are the same length — the arrows, not the lines, drive the impression." },
  "The two lines are exactly the same length. Your visual system constructs 'longer' and 'shorter' from context. (In the lecture, students vote on which line is longer before the reveal.)");

add(9, "Müller-Lyer illusion, comparison",
  "",
  { alt: "The Müller-Lyer lines overlaid for direct comparison, with the two arrow-fin lines aligned to show they are identical in length.",
    long: "The same two horizontal lines presented for direct comparison, aligned so the equal lengths are obvious once the arrowheads are ignored." },
  "Shown together, the illusion collapses: the lines are identical. Seeing is not believing — the mind constructs what we see.");

add(10, "Ebbinghaus illusion",
  "",
  { alt: "Ebbinghaus illusion: a center circle surrounded by five large circles appears smaller than an identical center circle surrounded by six small circles.",
    long: "Two arrangements of circles. On the left, a red center circle is surrounded by five large black circles. On the right, an identical red center circle is surrounded by six small black circles. Because of the surrounding context, the left center circle appears smaller than the right one, although the two center circles are the same size." },
  "The two red circles are identical. Surrounded by big circles it looks small; surrounded by small circles it looks big. Context warps size perception — 'Ebbinghaus' refers to the psychologist this display is named after.");

add(11, "Shepard's “Terror Subterra”",
  "",
  { alt: "Illustration: two human figures seen in a stone corridor. The figure in the foreground appears much larger than the figure in the distance, although the drawn figures are identical in size.",
    long: "A perspective drawing of a stone-walled corridor. One figure stands close to the viewer at the near end; an identical figure stands at the far end. Depth cues make the near figure appear far larger, yet the two silhouettes are the same size when measured. Source: Shepard, R. <cite>Mind Sights: Original Visual Illusions, Ambiguities, and Other Anomalies</cite>, W. H. Freeman & Co., 1990. This copyrighted image is excluded from the Creative Commons license and is described here rather than reproduced." },
  "Roger Shepard's 'Terror Subterra.' The two figures are drawn identical — depth cues make them look different. The original drawing is copyrighted (W. H. Freeman) and excluded from our Creative Commons license, so we describe it rather than copy it.");

add(12, "Checker-shadow illusion",
  "<p class=\"caption\">Checker-shadow illusion. Courtesy of Professor Edward H. Adelson. Used with permission.</p>",
  { alt: "A checkerboard in perspective with a green cylinder casting a shadow. Square A, outside the shadow, and square B, inside the shadow, appear different shades of gray but are identical.",
    long: "Edward Adelson's checker-shadow illusion: a checkerboard drawn in perspective with a green cylinder standing on it, casting a diagonal shadow. Two marked squares — A on the light region, B within the shadow — appear to be different shades of gray (A light, B dark), but they are physically identical; the visual system discounts the shadow. This image is used with Professor Adelson's permission; see the MIT Perceptual Science Group's 'Lightness Perception and Lightness Illusions' gallery." },
  "Adelson's checker-shadow: squares A and B are the same gray. Your visual system 'subtracts' the shadow automatically. We use this with Professor Adelson's permission.");

add(13, "Visual/optical illusions (list 1)",
  `<ul>
     <li>Criss-Cross Effect</li>
     <li>The Koffka Ring</li>
     <li>White's Illusion</li>
     <li>Simultaneous Contrast Effect</li>
   </ul>
   <p class="caption">From “Lightness Perception and Lightness Illusions,” MIT Perceptual Science Group.</p>`,
  null,
  "More lightness illusions demonstrated in the lecture, from the MIT Perceptual Science Group's gallery: criss-cross effect, Koffka ring, White's illusion, and simultaneous contrast.");

add(14, "Illusions cont'd",
  `<ul>
     <li>Shepard's Tables</li>
     <li>Stepping Feet</li>
     <li>Shading, Depth, and Faces</li>
   </ul>`,
  null,
  "And three more: Shepard's tables (two tabletops that look different but are identical parallelograms), the stepping-feet motion illusion, and shading-depth-face ambiguity.");

add(15, "Memory for a picture",
  "<p>10 questions</p>",
  null,
  "Next demonstration: memory for a picture. Ten yes/no questions are coming.");

add(16, "Memory for a picture — Group A",
  "<p><strong>Group A:</strong> You are going to look briefly at a picture and then answer some questions about it. The picture is a rough sketch of a poster for a <em>trained seal</em> act. Do not dwell on the picture. Look at it only long enough to “take it all in” once. After that, you will answer <em>yes</em> or <em>no</em> to a series of questions.</p>",
  null,
  "Group A's instructions say the sketch is a poster for a trained seal act. The instruction itself is part of the experiment — it will shape what people remember.");

add(17, "Memory for a picture — Group B",
  "<p><strong>Group B:</strong> You are going to look briefly at a picture and then answer some questions about it. The picture is a rough sketch of a poster for a <em>costume ball</em>. Do not dwell on the picture. Look at it only long enough to “take it all in” once. After that, you will answer <em>yes</em> or <em>no</em> to a series of questions.</p>",
  null,
  "Group B gets the identical picture, described as a poster for a costume ball. Same image, different label — memory will differ.");

add(18, "The ambiguous picture",
  "",
  { alt: "Line drawing of two figures standing on a small stage under a fringed canopy, one seated and one standing, holding what could be either a seal's ball or a costume masque. Source: Weiten, Wayne. Psychology: Themes and Variations. Cengage Learning, 2010.",
    long: "A minimal line drawing: two ambiguous human figures on a small stage beneath a fringed canopy. The seated figure holds a round object that could be read as a seal balancing a ball or as a costume ball — the drawing supports both captions. The original slide credits: Source: Weiten, Wayne. <cite>Psychology: Themes and Variations</cite>. Cengage Learning, 2010. © Cengage Learning. All rights reserved. This content is excluded from the Creative Commons license; more information is available at the OCW terms page." },
  "This is the picture both groups saw. If you were told 'trained seal,' you probably remember a seal; if you were told 'costume ball,' you remember a ball. Memory is reconstructive — the label shaped what was stored. The image is Cengage-copyrighted and excluded from the CC license, so it is described rather than reproduced.");

add(19, "In the picture was there:",
  `<table class="data">
     <caption>Yes/No checklist for the picture-memory demonstration (as shown on the slide)</caption>
     <thead><tr><th scope="col">#</th><th scope="col">Question</th><th scope="col">Yes</th><th scope="col">No</th></tr></thead>
     <tbody>
       <tr><td>1.</td><td>An automobile?</td><td>____</td><td>____</td></tr>
       <tr><td>2.</td><td>A man?</td><td>____</td><td>____</td></tr>
       <tr><td>3.</td><td>A woman?</td><td>____</td><td>____</td></tr>
       <tr><td>4.</td><td>A child?</td><td>____</td><td>____</td></tr>
       <tr><td>5.</td><td>An animal?</td><td>____</td><td>____</td></tr>
       <tr><td>6.</td><td>A whip?</td><td>____</td><td>____</td></tr>
       <tr><td>7.</td><td>A sword?</td><td>____</td><td>____</td></tr>
       <tr><td>8.</td><td>A man’s hat?</td><td>____</td><td>____</td></tr>
       <tr><td>9.</td><td>A ball?</td><td>____</td><td>____</td></tr>
       <tr><td>10.</td><td>A fish?</td><td>____</td><td>____</td></tr>
     </tbody>
   </table>`,
  null,
  "The ten questions. 'A ball?' — seal group says yes; 'a sword?' — costume-ball group may say yes. The answers reveal how suggestion rewrote memory.");

add(20, "Memory for a picture — Group A (repeat)",
  "<p><strong>Group A:</strong> You are going to look briefly at a picture and then answer some questions about it. The picture is a rough sketch of a poster for a <em>trained seal</em> act. Do not dwell on the picture. Look at it only long enough to “take it all in” once. After that, you will answer <em>yes</em> or <em>no</em> to a series of questions.</p>",
  null,
  "Group A's slide, shown again for the classroom demonstration.");

add(21, "Ambiguous numeral",
  "",
  { alt: "The same glyph shown twice: read alone it looks like the number 13; read in the context of letters it looks like the letter B.",
    long: "Two renditions of an ambiguous glyph. Read by itself (or as a number), it is seen as “13”; the same shape in a letter context is read as “B”. The stroke pattern is identical — interpretation depends on context." },
  "Thirteen, or B? The same drawing is '13' among numbers and 'B' among letters. Perception uses context instantly and unconsciously.");

add(22, "A test of attention & counting!",
  "<p>HOW MANY TIMES DO THE PEOPLE IN THE WHITE SHIRTS PASS THE BASKETBALL?</p>",
  null,
  "The famous selective-attention task: count the passes made by the people in white shirts. Watch carefully.");

add(23, "A test of attention & counting! (video)",
  "<p>Watch video at <a href=\"https://www.youtube.com/watch?v=vJG698U2Mvo\">http://www.youtube.com/watch?v=vJG698U2Mvo</a></p>",
  null,
  "The 'gorillas in our midst' video (Simons & Chabris). Most viewers counting white-shirt passes never see the person in the gorilla suit walk through. Attention is selective — and we are blind to our own blindness.");

add(24, "What we hear",
  `<p><em>Objective:</em> Scientific study of human nature/mind/behavior</p>
   <p>how our minds make our worlds — what we <em>hear</em></p>`,
  null,
  "From seeing to hearing: what we hear is also constructed by the mind.");

add(25, "What is he saying? (McGurk demo)",
  `<p>McGurk Effect Demo — <a href="https://www.youtube.com/watch?v=aFPtc8BVdJk">http://www.youtube.com/watch?v=aFPtc8BVdJk</a></p>`,
  null,
  "The McGurk effect demonstration video. Listen to the syllable, then listen again while watching the lips.");

add(26, "What is he saying? (result)",
  `<ul>
     <li>Most adults (98%) think they hear <strong>“DA”</strong></li>
     <li>In reality, you
       <ul>
         <li><em>hear</em> the sound <strong>“BA”</strong></li>
         <li>see the lip movements <strong>“GA”</strong></li>
       </ul>
     </li>
   </ul>
   <p class="caption">H. McGurk &amp; J. MacDonald, <cite>Nature</cite>, 1976</p>`,
  null,
  "The audio says BA; the lips say GA; nearly everyone hears DA. Hearing itself fuses sight and sound — the McGurk & MacDonald effect (Nature, 1976).");

add(27, "What we know",
  `<p><em>Objective:</em> Scientific study of human nature/mind/behavior</p>
   <p>how our minds make our worlds — what we <em>know</em></p>`,
  null,
  "The third construction: what we know — how knowledge and belief shape judgment.");

add(28, "Which is farther east: San Diego or Reno?",
  "",
  null,
  "Vote! Most people say Reno is farther east. In fact San Diego, California, lies farther east than Reno, Nevada — mental maps are distorted by borders and coastlines.");

add(29, "Which is farther north: Philadelphia or Rome, Italy?",
  "",
  null,
  "Rome feels farther north because it is 'Europe.' Philadelphia is slightly farther north than Rome.");

add(30, "Which is farther north: Atlanta or Chicago?",
  "",
  null,
  "Chicago 'feels' northern, Atlanta southern — yet they are at nearly the same latitude; Chicago is actually slightly farther north... most people are surprised. Mental maps compress and stretch geography.");

add(31, "Which is farther north: Portland or Toronto?",
  "",
  null,
  "Most people say Toronto. Portland, Oregon, is farther north than Toronto.");

add(32, "Which is further west: Miami, Florida or Santiago, Chile?",
  "",
  null,
  "Miami sits far west of the US east coast image people hold — it is farther west than Santiago, Chile. Knowledge (here, mental maps) is constructed, not photographed reality.");

add(33, "What we learn and remember",
  `<p><em>Objective:</em> Scientific study of human nature/mind/behavior</p>
   <p>how our minds make our worlds — what we learn and remember</p>`,
  null,
  "Now: what we learn and remember — including the automatic habits of mind we barely notice.");

add(34, "Listen, then write",
  "<p>LISTEN TO THE WORDS, THEN WRITE DOWN THE WORDS YOU REMEMBER</p>",
  null,
  "A memory demonstration: I will read a list of words; write down as many as you remember. (In the lecture this segues into the 'one way not to do enter' false-memory demo.)");

add(35, "Automaticity",
  `<ul>
     <li><strong>Power</strong></li>
     <li><strong>Peril</strong></li>
   </ul>`,
  null,
  "Automaticity: mental processes that run without deliberate control. The power: fast, effortless thinking. The peril: systematic errors we don't notice.");

add(36, "ONE WAY NOT DO ENTER",
  "",
  { alt: "A gray box containing the text “ONE WAY NOT DO ENTER”.",
    long: "A road-sign style demonstration: a gray rectangle with the words “ONE WAY NOT DO ENTER.” Read automatically, the phrase feels meaningful; read deliberately, it is ungrammatical. The demonstration appears again as a triangle version on the next slide." },
  "Read it quickly — it feels fine. Automatic reading glues the words together; only deliberate attention notices 'ONE WAY NOT DO ENTER' is word salad.");

add(37, "PARIS IN THE THE SPRING",
  "",
  { alt: "A gray triangle containing the text “PARIS IN THE THE SPRING”.",
    long: "A gray triangle containing the words “PARIS IN THE THE SPRING.” Most readers report 'Paris in the spring' — the duplicated “the” is invisible to automatic reading." },
  "'Paris in the the spring' — nearly everyone misses the doubled 'the.' Automaticity's peril in miniature.");

add(38, "How many F's?",
  "",
  null,
  "Count the F's in the next sentence — quickly!");

add(39, "The F-sentence",
  "<p>FINISHED FILES ARE THE RE-SULT OF YEARS OF SCIENTIF-IC STUDY COMBINED WITH THE EXPERIENCE OF MANY YEARS</p>",
  null,
  "“FINISHED FILES ARE THE RESULT OF YEARS OF SCIENTIFIC STUDY COMBINED WITH THE EXPERIENCE OF MANY YEARS.” There are six F's — most people find three, because the F in 'of' is pronounced like a V and automatic reading skips it.");

add(40, "Stroop effect — word set #1",
  "",
  { alt: "Word Set #1: color words (RED, GREEN, BLUE, YELLOW, PINK, ORANGE, WHITE, BROWN) printed in matching ink colors — the word “RED” in red ink, the word “GREEN” in green ink, and so on.",
    long: "A five-row grid of color words. In set #1 each word is printed in ink that matches its meaning: RED in red, GREEN in green, BLUE in blue, YELLOW in yellow, PINK in pink, ORANGE in orange, WHITE in white, BROWN in brown." },
  "Set #1: name the INK color of each word aloud, row by row. It's easy — the word and the color agree.");

add(41, "Stroop effect — word set #2",
  "",
  { alt: "Word Set #2: the same color words, but each printed in a mismatched ink color — for example the word “RED” printed in blue ink and the word “BLUE” printed in green ink.",
    long: "The same grid of color words, but now every word is printed in a conflicting ink: RED in blue, GREEN in blue, BLUE in green, YELLOW in pink, PINK in orange, ORANGE in blue, WHITE in blue, BROWN in red, and so on." },
  "Set #2: the same task, now the word and the ink conflict. Reading is so automatic that it fights color-naming — responses slow and error-prone. That conflict is the Stroop effect.");

add(42, "Birthday probability",
  `<p>There are 30 people in a group. You get the month and date of each person’s birthday. What is the approximate probability that two of the people will have the exact same birthday?</p>
   <ul>
     <li>a) 90%</li>
     <li>b) 70%</li>
     <li>c) 50%</li>
     <li>d) 30%</li>
     <li>e) 10%</li>
   </ul>`,
  null,
  "Vote: with 30 people, how likely is a shared birthday? Most say 10 or 30 percent. The answer is about 70%. Statistical intuition is systematically miscalibrated.");

add(43, "Cognitive & affective forecasting",
  `<p>COGNITIVE &amp; AFFECTIVE FORECASTING</p>
   <ul><li>think about your future</li></ul>`,
  null,
  "Affective forecasting: predicting how we will feel in the future. We are remarkably bad at it — and this has consequences for big decisions.");

add(44, "Affective forecasting",
  `<ul><li>think about your future</li></ul>
   <p><em>most people think about achieving &amp; succeeding rather than fumbling or failing</em></p>`,
  null,
  "Most people forecast achievement and success rather than fumbling or failing — an optimistic default.");

add(45, "Affective forecasting (tenure & lottery)",
  `<ul>
     <li>if I don’t get tenure, I will be sad… if I do get tenure I will be happy
       <ul><li><em>two years later</em> - <em>no difference</em></li></ul></li>
     <li>if I win the lottery, I will be happy!
       <ul><li><em>a year or two later</em>, <em>no difference</em></li></ul></li>
   </ul>`,
  null,
  "Classic findings: assistant professors are sure tenure decides their happiness — two years later, tenured and denied are indistinguishable. Lottery winners return to baseline happiness within a year or two. We overestimate how long events will move us.");

add(46, "Affective forecasting (accident)",
  `<ul>
     <li>if I don’t get tenure, I will be sad… if I do get tenure I will be happy
       <ul><li><em>two years later</em> - <em>no difference</em></li></ul></li>
     <li>if I win the lottery, I will be happy!
       <ul><li><em>a year or two later</em>, <em>no difference</em></li></ul></li>
     <li>accident leading to quadriplegia or paraplegia - return to typical ratings in 3 months</li>
   </ul>`,
  null,
  "And the hardest example: people who became quadriplegic or paraplegic return to typical happiness ratings within about three months. The forecasting machine in the head systematically mispredicts.");

add(47, "Mispredicting responses to racism",
  `<p>Mispredicting Affective and Behavioral Response to Racism — Kawakami et al., <cite>Science</cite>, 2009</p>
   <ul>
     <li>Racism is condemned</li>
     <li>Blatant racism still occurs
       <ul><li>33% of whites report hearing anti-black slurs in workplace</li></ul></li>
   </ul>`,
  null,
  "Kawakami and colleagues (Science, 2009) asked: do people know how they — and others — respond to racism? Racism is condemned in principle; a third of white respondents report hearing anti-Black slurs in the workplace.");

add(48, "Forecaster vs. experiencer design",
  `<ul>
     <li>two groups - “forecaster” or “experiencer”</li>
     <li>you enter room - see a black male &amp; a white male - black male leaves room to get cell phone, gently bumps white male knee
       <ul>
         <li>control - nothing else</li>
         <li>moderate slur “Typical, I hate it when black people do that”</li>
         <li>extreme slur …. “clumsy N word”</li>
       </ul></li>
     <li>black male returns, experimenter gives survey on current feelings, asks you to pick a partner for anagram task</li>
   </ul>`,
  null,
  "The design: two groups — 'forecasters' imagine the scenario; 'experiencers' live it. The black male confederate leaves, then bumps the white male's knee — with no comment, a moderate slur, or an extreme slur. Then: rate your feelings, and choose a partner for the anagram task.");

add(49, "Forecasters predict outrage",
  `<ul>
     <li>two groups - “forecaster” or “experiencer”</li>
     <li>control - nothing else</li>
     <li>moderate slur “Typical, I hate it when black people do that”</li>
     <li>extreme slur …. “clumsy N word”</li>
     <li>black male returns, experimenter gives survey on current feelings, asks you to pick a partner for anagram task</li>
   </ul>`,
  null,
  "Forecasters predict they would be outraged by the slurs and would avoid the slur-saying partner. What did the experiencers actually do? The next two slides show the gap.");

add(50, "A gap between attitudes & actions (distress)",
  `<p>Graph shows experiencer reports consistently lower distress than forecaster.</p>`,
  { alt: "Bar chart: predicted (forecaster) vs reported (experiencer) negative emotional distress. Forecaster distress is higher than experiencer distress in every condition.",
    long: "Bar chart, “Negative Emotional Distress” (0–9 scale, bars with error bars), three conditions on the x-axis. Forecaster (predicted) versus Experiencer (reported): No Comment — forecaster about 4.5, experiencer about 3.1; Moderate Racist Comment — forecaster about 7.4, experiencer about 3.8; Extreme Racist Comment — forecaster about 7.0, experiencer about 3.8. People who imagine the event predict more distress than people who actually experience it report. Image by MIT OpenCourseWare; see Kawakami, K., et al. “Mispredicting Affective and Behavioral Responses to Racism.” Science 323, no. 5911 (2009): 276–8.",
    table: "distress" },
  "Forecasters predicted high distress, especially after the slurs. Experiencers reported much less distress in every condition — affective misprediction again, now about moral events.");

add(51, "A gap between attitudes & actions (partner choice)",
  `<p>Graph shows experiencer chooses white partners more often when following racist comments.</p>`,
  { alt: "Bar chart: percentage of white partners chosen, forecaster-predicted vs experiencer-actual, by condition.",
    long: "Bar chart, “Percentage of White Partners Chosen” (0–100), three conditions. Forecaster (predicted) versus Experiencer (actual): No Comment — forecaster about 68%, experiencer about 53%; Moderate Racist Comment — forecaster about 10%, experiencer about 66%; Extreme Racist Comment — forecaster about 24%, experiencer about 62%. People who imagined the event predicted they would strongly avoid the slur-saying partner; people who experienced it chose the white partner at similar rates across conditions. Image by MIT OpenCourseWare; see Kawakami, K., et al. “Mispredicting Affective and Behavioral Responses to Racism.” Science 323, no. 5911 (2009): 276–8.",
    table: "partners" },
  "And the actions: forecasters predicted they would refuse the racist partner; experiencers actually chose the white partner at nearly the same rate in every condition. Attitudes and actions diverge — the gap this lecture ends on.");

add(52, "What the course covers",
  `<p><em>Objective:</em> Scientific study of human nature/mind/behavior</p>
   <p>how our minds make our worlds</p>
   <ul>
     <li>what we <em>see &amp; hear</em></li>
     <li>what we <em>remember</em></li>
     <li>what we <em>know</em></li>
     <li>how we <em>think</em></li>
     <li>how we <em>feel</em></li>
     <li>how we <em>act</em></li>
   </ul>`,
  null,
  "The course map: how our minds make our worlds — what we see and hear, what we remember, what we know, how we think, how we feel, and how we act.");

add(53, "Closing",
  "<p><em>Objective:</em> Scientific study of human nature/mind/behavior</p>",
  null,
  "Closing slide. This lecture introduced the themes of the whole course; the next unit begins with the brain.");

add(54, "MIT OpenCourseWare",
  `<p>MIT OpenCourseWare — <a href="https://ocw.mit.edu" rel="noopener">http://ocw.mit.edu</a></p>
   <p>9.00SC Introduction to Psychology, Fall 2011</p>
   <p>For information about citing these materials or our Terms of Use, visit:
   <a href="https://ocw.mit.edu/terms" rel="noopener">http://ocw.mit.edu/terms</a>.</p>`,
  null,
  "Publisher slide: MIT OpenCourseWare citation and terms of use.");

// ---------- chart data tables (for slides 51 & 52) ----------
const CHART_TABLES = `
<div class="table-scroll">
<table class="data" id="chart-distress">
<caption>Chart data (approximate values read from the slide's bar chart): Negative emotional distress by condition, forecaster (predicted) vs. experiencer (reported). Kawakami et al., <cite>Science</cite> 323 (2009), as shown in the MIT OCW lecture slides.</caption>
<thead><tr><th scope="col">Condition</th><th scope="col">Forecaster (predicted)</th><th scope="col">Experiencer (reported)</th></tr></thead>
<tbody>
<tr><th scope="row">No comment</th><td>≈ 4.5</td><td>≈ 3.1</td></tr>
<tr><th scope="row">Moderate racist comment</th><td>≈ 7.4</td><td>≈ 3.8</td></tr>
<tr><th scope="row">Extreme racist comment</th><td>≈ 7.0</td><td>≈ 3.8</td></tr>
</tbody>
</table>
</div>
<div class="table-scroll">
<table class="data" id="chart-partners">
<caption>Chart data (approximate values read from the slide's bar chart): Percentage of white partners chosen, forecaster (predicted) vs. experiencer (actual). Kawakami et al., <cite>Science</cite> 323 (2009), as shown in the MIT OCW lecture slides.</caption>
<thead><tr><th scope="col">Condition</th><th scope="col">Forecaster (predicted)</th><th scope="col">Experiencer (actual)</th></tr></thead>
<tbody>
<tr><th scope="row">No comment</th><td>≈ 68%</td><td>≈ 53%</td></tr>
<tr><th scope="row">Moderate racist comment</th><td>≈ 10%</td><td>≈ 66%</td></tr>
<tr><th scope="row">Extreme racist comment</th><td>≈ 24%</td><td>≈ 62%</td></tr>
</tbody>
</table>
</div>`;

let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lecture 1 slides — Unit 1 | Accessibility Remediation Case Study</title>
<link rel="stylesheet" href="css/module.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header">
  <div class="wrap">
    <p class="site-kicker">Unit 1 · Introduction to Psychology — remediated module</p>
    <p class="site-title"><a href="index.html">Introduction to Psychology — Unit 1: Introduction</a></p>
    <nav class="site-nav" aria-label="Module pages">
      <ul>
        <li><a href="index.html">Overview</a></li>
        <li><a href="lesson.html">Lesson</a></li>
        <li><a href="slides.html" aria-current="page">Lecture slides</a></li>
        <li><a href="video.html">Video</a></li>
        <li><a href="transcript.html">Transcript</a></li>
        <li><a href="quiz.html">Quiz</a></li>
        <li><a href="../index.html">Case study home</a></li>
      </ul>
    </nav>
  </div>
</header>
<main id="main" tabindex="-1">
<div class="wrap">

<h1>Lecture 1 slides: “Introduction”</h1>
<p class="lede">The original lecture deck (a 54-page PDF of PowerPoint slides) is
rebuilt here as accessible HTML: one section per slide, real text instead of
images of text, descriptions in place of figures, and speaker notes as visible
text.</p>

<div class="note">
<p><strong>Why HTML instead of the PDF?</strong> The original PDF carries most of
its meaning in slide images, several with meaningless export alt text (filenames
like “scan569.jpg” or placeholder “Text Box:” labels). HTML reflows at any zoom,
works with screen readers without PDF reader mode, is searchable, and can be
edited by faculty. The original PDF remains available at
<a href="before/slides-original.pdf">…/before/slides-original.pdf</a> for
comparison. Figure descriptions were written from inspection of the slides;
images that the publisher marks as excluded from the Creative Commons license
are <em>described, not reproduced</em>.</p>
</div>

<p class="skip-inline"><a href="#slide-1">Jump to slide 1</a> ·
<a href="#chart-tables">Chart data tables</a></p>

<h2 class="sr-only">Slides</h2>
<div id="slides">
`;

for (const s of S) {
  html += `<section class="slide" id="slide-${s.no}" aria-labelledby="slide-${s.no}-title">\n`;
  html += `  <p class="slide-no">Slide ${s.no} of ${S.length}</p>\n`;
  html += `  <h3 id="slide-${s.no}-title">${s.title}</h3>\n`;
  if (s.body && s.body.trim()) html += `  ${s.body}\n`;
  if (s.fig) {
    html += `  <figure>\n    <figcaption class="caption">${s.fig.alt}</figcaption>\n`;
    if (s.fig.long) html += `    <details>\n      <summary>Long description of the visual</summary>\n      <p>${s.fig.long}</p>\n    </details>\n`;
    html += `  </figure>\n`;
  }
  if (s.note) html += `  <div class="speaker-note">\n    <h4>Speaker note</h4>\n    <p>${s.note}</p>\n  </div>\n`;
  html += `</section>\n`;
}

html += `
</div>

<h2 id="chart-tables">Chart data tables</h2>
<p>Slides 51 and 52 present the Kawakami et al. findings as bar charts. The
original chart images have embedded alt text in the PDF, but the numbers are
only available visually. The tables below give the approximate values read from
the charts.</p>
${CHART_TABLES}

<h2>Source</h2>
<p>Transcribed and adapted from <cite>Lecture 1: Introduction</cite> slides
(<code>MIT9_00SCF11_lec01.pdf</code>), 9.00SC Introduction to Psychology, Fall
2011, Prof. John Gabrieli, MIT OpenCourseWare, CC BY-NC-SA 3.0 US. Speaker notes
were written for this remediation to make each slide’s role in the lecture
explicit; they are marked as notes, not as the lecturer’s words. The lecturer’s
own words are in the <a href="transcript.html">transcript</a>.</p>

</div>
</main>
<footer class="site-footer">
  <div class="wrap">
    <p>Remediated module for the case study “Accessibility remediation of a real
    course module.” Content adapted from <em>9.00SC Introduction to Psychology,
    Fall 2011</em> (Unit&nbsp;1) by Prof. John Gabrieli, MIT OpenCourseWare,
    licensed CC BY-NC-SA 3.0 US; this adaptation is licensed alike (see
    <a href="../index.html#attribution">attribution</a>).
    “Lakeside State University” is a fictional US public university preparing for
    ADA Title II digital accessibility compliance.</p>
  </div>
</footer>
</body>
</html>
`;

const out = join(ROOT, "docs", "module", "slides.html");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`wrote ${out} with ${S.length} slides`);
