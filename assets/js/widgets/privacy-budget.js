/* Explorable: per-query Laplace noise standard deviation as the number of
   planned queries k grows, for a fixed total privacy budget eps_total=1
   and sensitivity delta=1.

     noiseStd(k) = sqrt(2) * delta * k / eps_total

   See the note for the composition-theorem derivation. */
(function () {
  'use strict';

  var EPS_TOTAL = 1, DELTA = 1, KMAX = 50;
  var INK = '#0a1b33', MUTED = '#44536b', MIST = '#d9e2ef', ROYAL = '#1d4fd8';

  function noiseStd(k) { return Math.sqrt(2) * DELTA * k / EPS_TOTAL; }

  function mount(el) {
    var canvas = el.querySelector('canvas');
    var slider = el.querySelector('input[type="range"]');
    var readout = el.querySelector('[data-readout]');
    var ns = el.querySelector('.widget-noscript');
    if (ns) ns.remove();
    if (!canvas || !slider) return;

    var ctx = canvas.getContext('2d');
    var pad = { l: 50, r: 14, t: 14, b: 30 };
    var yMax = noiseStd(KMAX) * 1.05;

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
      var k = +slider.value;

      function px(kv) { return pad.l + (kv / KMAX) * plotW; }
      function py(v) { return pad.t + (1 - v / yMax) * plotH; }

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = MIST; ctx.lineWidth = 1;
      ctx.fillStyle = MUTED; ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      [0, 20, 40, 60].forEach(function (v) {
        if (v > yMax) return;
        var y = py(v);
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.fillText(String(v), pad.l - 8, y);
      });

      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('queries planned (k)  →', pad.l + plotW / 2, h - pad.b + 10);

      ctx.strokeStyle = ROYAL; ctx.lineWidth = 2.25;
      ctx.beginPath();
      for (var kv = 1; kv <= KMAX; kv += 0.5) {
        var x = px(kv), y = py(noiseStd(kv));
        if (kv === 1) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      var mx = px(k), my = py(noiseStd(k));
      ctx.fillStyle = ROYAL;
      ctx.beginPath(); ctx.arc(mx, my, 4.5, 0, Math.PI * 2); ctx.fill();

      if (readout) {
        readout.textContent = 'k = ' + k + '   per-query ε = ' + (EPS_TOTAL / k).toFixed(3) +
          '   noise std = ' + noiseStd(k).toFixed(2);
      }
    }

    slider.addEventListener('input', draw);
    window.addEventListener('resize', function () { window.requestAnimationFrame(draw); });
    draw();
  }

  (window.NoteWidgets = window.NoteWidgets || { registry: {}, register: function (n, m) { this.registry[n] = m; } })
    .register('privacy-budget', mount);
})();
