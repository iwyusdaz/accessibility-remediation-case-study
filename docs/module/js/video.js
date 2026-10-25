// video.js — chapter seek buttons for the video page (progressive enhancement).
// If the <video> element is present and functional, a chapter button seeks and
// plays from the chapter start. Keyboard operable (native <button>).
(function () {
  "use strict";
  var video = document.querySelector(".video-frame video");
  var buttons = document.querySelectorAll("#chapter-list button[data-start]");
  if (!video) {
    buttons.forEach(function (b) { b.disabled = true; });
    return;
  }
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var start = parseFloat(b.getAttribute("data-start")) || 0;
      try {
        video.currentTime = start;
        var p = video.play();
        if (p && p.catch) p.catch(function () { /* autoplay blocked: seek only */ });
      } catch (e) { /* player unavailable */ }
    });
  });
})();
