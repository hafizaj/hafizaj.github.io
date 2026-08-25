/* Explorable: relative gradient magnitude m^L against depth L, for an
   adjustable per-layer multiplier m. Illustrates why a per-layer multiplier
   reliably below one (sigmoid, capped at 0.25) collapses exponentially with
   depth, while one near one (ReLU, well-initialised) does not. See the note. */
(function () {
  'use strict';

  var INK = '#0a1b33', MUTED = '#44536b', MIST = '#d9e2ef', ROYAL = '#1d4fd8';
  var LMAX = 40;

  function mount(el) {
    var canvas = el.querySelector('canvas');
    var slider = el.querySelector('input[type="range"]');
    var readout = el.querySelector('[data-readout]');
    var ns = el.querySelector('.widget-noscript');
    if (ns) ns.remove();
    if (!canvas || !slider) return;

    var ctx = canvas.getContext('2d');
    var pad = { l: 46, r: 14, t: 14, b: 30 };

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
      var m = (+slider.value) / 100;

      function px(L) { return pad.l + (L / LMAX) * plotW; }
      function py(v) { return pad.t + (1 - v) * plotH; }

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = MIST; ctx.lineWidth = 1;
      ctx.fillStyle = MUTED; ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      [1.0, 0.75, 0.5, 0.25, 0].forEach(function (v) {
        var y = py(v);
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.fillText(v.toFixed(2), pad.l - 8, y);
      });
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('depth L  →', pad.l + plotW / 2, h - pad.b + 10);

      ctx.strokeStyle = ROYAL; ctx.lineWidth = 2.25;
      ctx.beginPath();
      for (var L = 0; L <= LMAX; L += 0.25) {
        var v = Math.pow(m, L);
        var x = px(L), y = py(v);
        if (L === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      var markL = 10;
      var mx = px(markL), my = py(Math.pow(m, markL));
      ctx.fillStyle = ROYAL;
      ctx.beginPath(); ctx.arc(mx, my, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = INK; ctx.globalAlpha = 0.25; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(mx, pad.t); ctx.lineTo(mx, pad.t + plotH); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;

      if (readout) {
        var at10 = Math.pow(m, markL);
        readout.textContent = 'm = ' + m.toFixed(2) +
          '   at L=10: ' + (at10 < 0.001 ? at10.toExponential(1) : (at10 * 100).toFixed(1) + '%');
      }
    }

    slider.addEventListener('input', draw);
    window.addEventListener('resize', function () { window.requestAnimationFrame(draw); });
    draw();
  }

  (window.NoteWidgets = window.NoteWidgets || { registry: {}, register: function (n, m) { this.registry[n] = m; } })
    .register('vanishing-gradient', mount);
})();
