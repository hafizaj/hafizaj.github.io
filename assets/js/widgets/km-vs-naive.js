/* Explorable: toggle between the correct Kaplan-Meier survival curve and a
   naive curve that treats every censored observation as an event. Both
   step functions are pre-computed constants, verified against a brute-force
   product-limit implementation before publishing — see the note. */
(function () {
  'use strict';

  var INK = '#0a1b33', MUTED = '#44536b', MIST = '#d9e2ef', ROYAL = '#1d4fd8', INDIGO = '#5b21b6';

  // Step function as [time, S(t) just after this time] pairs, starting
  // implicitly from (0, 1.0). Drawn as a right-continuous step curve.
  var KM = [[0, 1], [2, 0.875], [3, 0.75], [4, 0.625], [6, 0.46875], [8, 0.234375]];
  var NAIVE = [[0, 1], [2, 0.875], [3, 0.75], [4, 0.5], [6, 0.25], [8, 0.125], [9, 0]];

  function mount(el) {
    var canvas = el.querySelector('canvas');
    var group = el.querySelector('[data-toggle-group]');
    var buttons = group ? group.querySelectorAll('button[data-curve]') : [];
    var readout = el.querySelector('[data-readout]');
    var ns = el.querySelector('.widget-noscript');
    if (ns) ns.remove();
    if (!canvas || !buttons.length) return;

    var ctx = canvas.getContext('2d');
    var pad = { l: 46, r: 14, t: 14, b: 30 };
    var xMax = 9;
    var curve = 'km';

    function size() {
      var w = canvas.parentElement.clientWidth || 560;
      var h = 250;
      var dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: w, h: h };
    }

    function drawStep(points, color) {
      ctx.strokeStyle = color; ctx.lineWidth = 2.25;
      ctx.beginPath();
      for (var i = 0; i < points.length; i++) {
        var x = px(points[i][0]), y = py(points[i][1]);
        if (i === 0) { ctx.moveTo(x, y); continue; }
        var prevY = py(points[i - 1][1]);
        ctx.lineTo(x, prevY);
        ctx.lineTo(x, y);
      }
      var lastX = px(xMax), lastY = py(points[points.length - 1][1]);
      ctx.lineTo(lastX, lastY);
      ctx.stroke();
    }

    var plotW, plotH;
    function px(t) { return pad.l + (t / xMax) * plotW; }
    function py(v) { return pad.t + (1 - v) * plotH; }

    function draw() {
      var dim = size();
      var w = dim.w, h = dim.h;
      plotW = w - pad.l - pad.r; plotH = h - pad.t - pad.b;

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = MIST; ctx.lineWidth = 1;
      ctx.fillStyle = MUTED; ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      [0, 0.25, 0.5, 0.75, 1.0].forEach(function (v) {
        var y = py(v);
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.fillText(v.toFixed(2), pad.l - 8, y);
      });
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('months  →', pad.l + plotW / 2, h - pad.b + 10);

      if (curve === 'km') {
        drawStep(KM, ROYAL);
      } else {
        drawStep(NAIVE, INDIGO);
        ctx.globalAlpha = 0.35; drawStep(KM, ROYAL); ctx.globalAlpha = 1;
      }

      if (readout) {
        readout.textContent = curve === 'km'
          ? 'Correct: S(8) = 0.234, held to month 9'
          : 'Naive: S(9) = 0.000 (claims certainty the data doesn\'t support)';
      }
    }

    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener('click', function () {
        curve = btn.dataset.curve;
        Array.prototype.forEach.call(buttons, function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
        draw();
      });
    });

    window.addEventListener('resize', function () { window.requestAnimationFrame(draw); });
    draw();
  }

  (window.NoteWidgets = window.NoteWidgets || { registry: {}, register: function (n, m) { this.registry[n] = m; } })
    .register('km-vs-naive', mount);
})();
