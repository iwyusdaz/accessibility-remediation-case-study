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
      fb.style.display = "block";
      fb.setAttribute("data-state", correct ? "correct" : "incorrect");
      fb.innerHTML = correct
        ? '<span class="verdict">Correct.</span> Well done — see the lesson sections on this topic for the full reasoning.'
        : '<span class="verdict">Not quite.</span> You chose “' + chosen.nextElementSibling.textContent + '”. Re-read the relevant lesson section and try again — you can change your answer and re-check.';
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
