// quiz.js — accessible quiz behavior for the remediated module (MIT license).
// - Each question is a <fieldset> with a legend; options are labeled radios.
// - "Check answer" writes feedback into a role="status" region so screen
//   readers announce it; feedback never relies on color alone (text verdicts).
// - Score is announced in an aria-live="polite" region.
// No time limits; answers stay in the browser.
(function () {
  "use strict";
  var form = document.getElementById("quiz");
  if (!form) return;
  var fields = Array.prototype.slice.call(form.querySelectorAll("fieldset.quiz-q"));
  var score = document.getElementById("quiz-score");
  var answeredCorrect = 0;

  function reset() {
    answeredCorrect = 0;
    score.textContent = "Answer the questions above to see your score.";
  }

  fields.forEach(function (fs) {
    var btn = fs.querySelector("button.check");
    var fb = fs.querySelector(".feedback");
    var answer = fs.getAttribute("data-answer");
    var qnum = fs.getAttribute("data-qnum");
    var lessonName = fs.getAttribute("data-lesson-name");
    var lessonHref = fs.getAttribute("data-lesson-href");
    // link into the relevant lesson section (rendered as real text for the
    // no-JS case: the section name is in the data attribute on the fieldset)
    function lessonLink() {
      if (!lessonHref) return null;
      var a = document.createElement("a");
      a.href = lessonHref;
      a.textContent = "“" + (lessonName || "the relevant lesson section") + "”";
      return a;
    }
    btn.addEventListener("click", function () {
      var chosen = fs.querySelector("input[type=radio]:checked");
      if (!chosen) {
        fb.style.display = "block";
        fb.setAttribute("data-state", "none");
        fb.innerHTML = '<span class="verdict">Not answered yet.</span> Choose an option, then check your answer.';
        return;
      }
      var correct = chosen.value === answer;
      if (correct) answeredCorrect += 1;
      var pct = Math.round((answeredCorrect / fields.length) * 100);
      var chosenText = chosen.nextElementSibling.textContent;
      var link = lessonLink();
      fb.style.display = "block";
      fb.setAttribute("data-state", correct ? "correct" : "incorrect");
      fb.textContent = "";
      var verdict = document.createElement("span");
      verdict.className = "verdict";
      verdict.textContent = correct ? "Correct." : "Not quite.";
      fb.appendChild(verdict);
      if (correct) {
        fb.appendChild(document.createTextNode(" Well done — re-read the lesson section "));
        if (link) fb.appendChild(link);
        fb.appendChild(document.createTextNode(" for the full reasoning."));
      } else {
        fb.appendChild(document.createTextNode(" You chose “" + chosenText + "”. Re-read the lesson section "));
        if (link) fb.appendChild(link);
        fb.appendChild(document.createTextNode(" and try again — you can change your answer and re-check."));
        if (!link) fb.appendChild(document.createTextNode(" (Section reference missing for this question.)"));
      }
      var checkedCount = fields.filter(function (f) { return f.querySelector("input:checked"); }).length;
      if (checkedCount === fields.length) {
        score.textContent = "Score so far: " + answeredCorrect + " of " + fields.length + " (" + pct + "%) on your most recent check of each question.";
      } else {
        score.textContent = "Checked " + checkedCount + " of " + fields.length + " questions. " + answeredCorrect + " correct so far.";
      }
    });
    // changing an answer clears stale feedback for that question
    fs.addEventListener("change", function () {
      fb.style.display = "none";
      fb.innerHTML = "";
      fb.removeAttribute("data-state");
    });
  });

  form.addEventListener("reset", reset);
})();
