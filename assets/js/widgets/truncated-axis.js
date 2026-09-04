/* Explorable: a genuinely flat quarterly series (99-103, a 4% true range)
   redrawn as the y-axis floor is dragged up toward the data minimum. Real
   values never change — only how much of the chart height they're allowed
   to occupy. Numbers verified by hand: at floor=0 the visual gap between
   the smallest and largest bar matches the true ~4% range; each step up
   compresses the same 4-unit gap into a taller fraction of the chart. */
(function () {
  'use strict';

  var INK = '#0a1b33', MUTED = '#44536b', MIST = '#d9e2ef', ROYAL = '#1d4fd8', EMBER = '#c2410c';

  var LABELS = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'];
  var VALUES = [100, 101, 99, 103, 102];
  var DATA_MIN = Math.min.apply(null, VALUES);
  var DATA_MAX = Math.max.apply(null, VALUES);
  var FLOOR_MAX = DATA_MIN - 1;

  function mount(el) {
    var canvas = el.querySelector('canvas');
    var slider = el.querySelector('input[type="range"]');
    var readout = el.querySelector('[data-readout]');
    var ns = el.querySelector('.widget-noscript');
    if (ns) ns.remove();
    if (!canvas || !slider) return;

    slider.max = String(FLOOR_MAX);

    var ctx = canvas.getContext('2d');
    var pad = { l: 34, r: 14, t: 24, b: 26 };

    function size() {
      var w = canvas.parentElement.clientWidth || 560;
      var h = 240;
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
      var floor = +slider.value;
      var top = DATA_MAX + 1;

      function py(v) { return pad.t + (1 - (v - floor) / (top - floor)) * plotH; }

      ctx.clearRect(0, 0, w, h);

      // axis line at the floor
      ctx.strokeStyle = MUTED; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(pad.l, py(floor)); ctx.lineTo(w - pad.r, py(floor)); ctx.stroke();
      ctx.fillStyle = MUTED; ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(String(floor), pad.l - 6, py(floor));

      var n = VALUES.length;
      var slot = plotW / n;
      var barW = slot * 0.56;

      VALUES.forEach(function (v, i) {
        var cx = pad.l + slot * (i + 0.5);
        var yTop = py(v), yBase = py(floor);
        ctx.fillStyle = ROYAL;
        ctx.fillRect(cx - barW / 2, yTop, barW, yBase - yTop);

        ctx.fillStyle = INK; ctx.font = '600 11px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(String(v), cx, yTop - 4);

        ctx.fillStyle = MUTED; ctx.font = '10px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(LABELS[i], cx, h - pad.b + 6);
      });

      if (readout) {
        var hQ3 = VALUES[2] - floor, hQ4 = VALUES[3] - floor;
        var visualPct = (hQ4 / hQ3 - 1) * 100;
        var realPct = (VALUES[3] - VALUES[2]) / VALUES[2] * 100;
        readout.textContent = 'Axis starts at ' + floor + ' · Q3→Q4 real change +' +
          realPct.toFixed(1) + '% · looks like +' + visualPct.toFixed(0) + '%';
        readout.style.color = floor === 0 ? '' : (visualPct > 60 ? EMBER : '');
      }
    }

    slider.addEventListener('input', draw);
    window.addEventListener('resize', function () { window.requestAnimationFrame(draw); });
    draw();
  }

  (window.NoteWidgets = window.NoteWidgets || { registry: {}, register: function (n, m) { this.registry[n] = m; } })
    .register('truncated-axis', mount);
})();
