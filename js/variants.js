/* Clock variants for the Astral Express wallpaper.
 *
 * The page picks a variant through <body data-variant="...">:
 *   board -> Solari departure board   (Cinzel + Space Mono)
 *   sign  -> Illuminated station sign  (Jost + Cinzel)
 *   serif -> Serif numerals            (Cormorant Garamond + Montserrat Alternates)
 *
 * The video and audio setup is shared by all three.
 */

var enableAudio = true;
var audioVolume = 0.9;

var WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
var MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatTime(d, use24HourClock) {
  var hours = use24HourClock ? d.getHours() : d.getHours() % 12 || 12;
  return pad2(hours) + ':' + pad2(d.getMinutes());
}

function formatDate(d) {
  return WEEKDAYS[d.getDay()] + ' · ' + MONTHS[d.getMonth()] + ' ' + d.getDate();
}

/* Create and setup video background */
function initVideoBackground() {
  var video = document.getElementById('bg-video');

  if (!video) {
    console.warn('Video element not found');
    return;
  }

  // Ensure consistent playback behavior across WebView environments.
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;

  // Audio settings
  video.volume = Math.max(0, Math.min(1, audioVolume));
  video.muted = !enableAudio;

  video.onerror = function (e) {
    console.warn('Video failed to load:', e);
    document.body.style.backgroundColor = '#0b0b12';
  };

  function tryPlay(preferUnmuted) {
    if (typeof preferUnmuted === 'undefined') preferUnmuted = true;

    // Prefer unmuted playback when audio is enabled.
    if (enableAudio && preferUnmuted) {
      video.muted = false;
    }

    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function (error) {
        // If autoplay with audio is blocked, fall back to muted autoplay.
        console.warn('Video play failed:', error);

        if (enableAudio && !video.muted) {
          video.muted = true;
          video.play().then(function () {
            // Try to unmute after playback starts (often works in desktop WebViews).
            setTimeout(function () {
              video.muted = false;
            }, 1200);
          }).catch(function () {});
          return;
        }

        // Generic retry after a short delay.
        setTimeout(function () {
          video.play().catch(function () {});
        }, 500);
      });
    }
  }

  video.oncanplay = function () { tryPlay(true); };
  video.onloadeddata = function () { tryPlay(true); };

  video.load();
  tryPlay(true);
}

/* ---------- VARIANT A: departure board ---------- */
function initBoard() {
  var timeEl = document.getElementById('board-time');
  var dateEl = document.getElementById('board-date');

  function update() {
    var now = new Date();
    if (timeEl) {
      timeEl.textContent = formatTime(now, true);
      // Restart the flap animation on every change.
      timeEl.classList.remove('is-flipping');
      void timeEl.offsetWidth;
      timeEl.classList.add('is-flipping');
    }
    if (dateEl) dateEl.textContent = formatDate(now);
  }

  update();
  tickEveryMinute(update);
}

/* ---------- VARIANT B: illuminated sign ---------- */
function initSign() {
  var timeEl = document.getElementById('sign-time');
  var dateEl = document.getElementById('sign-date');

  function update() {
    var now = new Date();
    if (timeEl) timeEl.textContent = formatTime(now, true);
    if (dateEl) dateEl.textContent = formatDate(now);
  }

  update();
  tickEveryMinute(update);
}

/* ---------- VARIANT C: serif numerals ---------- */
function initSerif() {
  var timeEl = document.getElementById('serif-time');
  var dateEl = document.getElementById('serif-date');

  function update() {
    var now = new Date();
    if (timeEl) timeEl.textContent = formatTime(now, true);
    if (dateEl) dateEl.textContent = formatDate(now);
  }

  update();
  tickEveryMinute(update);
}

/* Run a callback on every minute boundary to keep CPU usage low. */
function tickEveryMinute(fn) {
  (function schedule() {
    var now = new Date();
    var msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    if (msUntilNextMinute < 0) msUntilNextMinute = 0;

    setTimeout(function () {
      fn();
      setInterval(fn, 60 * 1000);
    }, msUntilNextMinute + 20);
  })();
}

function init() {
  initVideoBackground();

  var variant = document.body.getAttribute('data-variant');
  if (variant === 'board') initBoard();
  else if (variant === 'sign') initSign();
  else if (variant === 'serif') initSerif();
}

window.addEventListener('DOMContentLoaded', init);
