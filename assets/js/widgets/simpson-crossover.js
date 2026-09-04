/* Explorable: overall recovery rate for two treatments as allocation skew
   between an easy and a hard subgroup increases, crossing over near s=0.087.

     Overall_A(s) = (132 - 63s) / 220
     Overall_B(s) = (121 + 63s) / 220

   Derived from fixed within-group rates (95%/90% easy, 25%/20% hard) and a
   linear interpolation of group sizes between a balanced 110/110 split at
   s=0 and the fully skewed 20/200 split at s=1. See the note for the
   derivation. */
(function () {
  'use strict';

  var INK = '#0a1b33', MUTED = '#44536b', MIST = '#d9e2ef';
  var ROYAL = '#1d4fd8', INDIGO = '#5b21b6';

  function overallA(s) { return (132 - 63 * s) / 220; }
  function overallB(s) { return (121 + 63 * s) / 220; }

  function mount(el) {
    var canvas = el.querySelector('canvas');
    var slider = el.querySelector('input[type="range"]');
    var readout = el.querySelector('[data-readout]');
    var ns = el.querySelector('.widget-noscript');
    if (ns) ns.remove();
    if (!canvas || !slider) return;

    var ctx = canvas.getContext('2d');
    var pad = { l: 46, r: 14, t: 14, b: 30 };
    var yMin = 0, yMax = 1.0;

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

    function draw() {
      var dim = size();
      var w = dim.w, h = dim.h;
      var plotW = w - pad.l - pad.r, plotH = h - pad.t - pad.b;
      var s = (+slider.value) / 1000;

      function px(sv) { return pad.l + sv * plotW; }
      function py(v) { return pad.t + (1 - (v - yMin) / (yMax - yMin)) * plotH; }

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = MIST; ctx.lineWidth = 1;
      ctx.fillStyle = MUTED; ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      [1.0, 0.8, 0.6, 0.4, 0.2, 0].forEach(function (v) {
        var y = py(v);
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.fillText(Math.round(v * 100) + '%', pad.l - 8, y);
      });

      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('allocation skew s  →', pad.l + plotW / 2, h - pad.b + 10);

      [[overallA, ROYAL, 'A'], [overallB, INDIGO, 'B']].forEach(function (pair) {
        ctx.strokeStyle = pair[1]; ctx.lineWidth = 2.25;
        ctx.beginPath();
        for (var i = 0; i <= 1000; i += 5) {
          var sv = i / 1000;
          var x = px(sv), y = py(pair[0](sv));
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // crossover marker
      var sCross = 11 / 126;
      var xCross = px(sCross), yCross = py(overallA(sCross));
      ctx.strokeStyle = INK; ctx.globalAlpha = 0.28; ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(xCross, pad.t); ctx.lineTo(xCross, pad.t + plotH); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;

      var sx = px(s);
      [[overallA(s), ROYAL, 'A'], [overallB(s), INDIGO, 'B']].forEach(function (p) {
        var y = py(p[0]);
        ctx.fillStyle = p[1];
        ctx.beginPath(); ctx.arc(sx, y, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.font = '600 11px "IBM Plex Mono", monospace';
        ctx.textAlign = sx > pad.l + plotW - 60 ? 'right' : 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(p[2], sx + (sx > pad.l + plotW - 60 ? -9 : 9), y - 4);
      });

      if (readout) {
        readout.textContent = 's = ' + s.toFixed(3) +
          '   A = ' + (overallA(s) * 100).toFixed(1) + '%' +
          '   B = ' + (overallB(s) * 100).toFixed(1) + '%';
      }
    }

    slider.addEventListener('input', draw);
    window.addEventListener('resize', function () { window.requestAnimationFrame(draw); });
    draw();
  }

  (window.NoteWidgets = window.NoteWidgets || { registry: {}, register: function (n, m) { this.registry[n] = m; } })
    .register('simpson-crossover', mount);
})();
