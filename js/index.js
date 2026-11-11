var use24HourClock = true;
var enableAudio = true;
var audioVolume = 0.9;

var WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
var MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

var SVG_NS = 'http://www.w3.org/2000/svg';

// Reference instant for the hand phase. The CSS animations begin on the first
// paint after this script runs, so the hands can be off by a fraction of a
// frame — under a tenth of a degree on the minute hand.
var clockStart = Date.now();

function pad2(n) {
  return String(n).padStart(2, '0');
}

// Always negative, so the animation is already part-way through its cycle
// rather than waiting to start.
function negativeMod(n, m) {
  var r = n % m;
  if (r > 0) r -= m;
  return r;
}

function formatTime(d) {
  var hours = use24HourClock ? d.getHours() : d.getHours() % 12 || 12;
  return pad2(hours) + ':' + pad2(d.getMinutes());
}

function formatDate(d) {
  return WEEKDAYS[d.getDay()] + ' · ' + MONTHS[d.getMonth()] + ' ' + d.getDate();
}

/* Build the 60 tick marks: minor, five-hour marks, and four cardinals. */
function buildDialTicks() {
  var group = document.getElementById('dial-ticks');
  if (!group) return;

  for (var i = 0; i < 60; i++) {
    var angle = (i / 60) * Math.PI * 2 - Math.PI / 2; // 0 = 12 o'clock
    var cardinal = i % 15 === 0;
    var hour = i % 5 === 0;
    var outer = 88;
    var inner = cardinal ? 74 : (hour ? 78 : 83.5);

    var tick = document.createElementNS(SVG_NS, 'line');
    tick.setAttribute('x1', (100 + Math.cos(angle) * outer).toFixed(2));
    tick.setAttribute('y1', (100 + Math.sin(angle) * outer).toFixed(2));
    tick.setAttribute('x2', (100 + Math.cos(angle) * inner).toFixed(2));
    tick.setAttribute('y2', (100 + Math.sin(angle) * inner).toFixed(2));
    tick.setAttribute(
      'class',
      'dial__tick' + (cardinal ? ' dial__tick--cardinal' : (hour ? ' dial__tick--hour' : ''))
    );
    group.appendChild(tick);
  }
}

/*
 * Phase-lock the hands to the real clock.
 *
 * Each hand is a CSS animation of fixed length (3600s for the minute hand,
 * 43200s for the hour hand) with a negative animation-delay. A hand's position
 * within its cycle is (elapsed - X) where X is how far into the cycle the
 * current time already is — seconds into the hour for the minute hand,
 * seconds into the 12-hour cycle for the hour hand. Setting the delay to
 * (elapsed - X) therefore places both hands exactly where they belong, and
 * the animation carries them forward from there.
 */
function syncDial(now) {
  var dial = document.getElementById('dial');
  if (!dial) return;

  var seconds = now.getSeconds();
  var minutes = now.getMinutes();
  var hours = now.getHours() % 12;

  var elapsed = (now.getTime() - clockStart) / 1000;
  var intoHour = minutes * 60 + seconds;
  var intoCycle = hours * 3600 + minutes * 60 + seconds;

  dial.style.setProperty('--minute-delay', negativeMod(elapsed - intoHour, 3600).toFixed(3));
  dial.style.setProperty('--hour-delay', negativeMod(elapsed - intoCycle, 43200).toFixed(3));
}

function updateClock() {
  var now = new Date();
  var timeEl = document.getElementById('clock-time');
  var dateEl = document.getElementById('clock-date');

  if (timeEl) timeEl.textContent = formatTime(now);
  if (dateEl) dateEl.textContent = formatDate(now);

  syncDial(now);
}

// Create and setup video background
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

function init() {
  initVideoBackground();
  buildDialTicks();
  updateClock();

  // Sync updates to minute boundaries to keep CPU usage low.
  (function scheduleMinuteTicks() {
    var now = new Date();
    var msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    if (msUntilNextMinute < 0) msUntilNextMinute = 0;

    setTimeout(function () {
      updateClock();
      setInterval(updateClock, 60 * 1000);
    }, msUntilNextMinute + 20);
  })();
}

window.addEventListener('DOMContentLoaded', init);
