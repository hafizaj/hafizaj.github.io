/* Explorable: ridge coefficient paths for two strongly correlated predictors.
   Fixed, deterministic Gram matrix so every reader sees the same picture.

     X'X = [[100, 90], [90, 100]]   (two standardised predictors, r = 0.9)
     X'y = [80, 70]

   beta(lambda) = (X'X + lambda I)^-1 X'y, solved in closed form for 2x2. */
(function () {
  'use strict';

  var A = 100, B = 90, C = 100, D = 80, E = 70;
  var LAM_MAX = 500;

  var INK = '#0a1b33', MUTED = '#44536b', MIST = '#d9e2ef';
  var ROYAL = '#1d4fd8', INDIGO = '#5b21b6';

  function beta(lam) {
    var det = (A + lam) * (C + lam) - B * B;
    return [((C + lam) * D - B * E) / det, ((A + lam) * E - B * D) / det];
  }

  // Cubic slider response: fine control near lambda = 0, where the action is.
  function toLambda(s) { return Math.pow(s / 1000, 3) * LAM_MAX; }
  function toSlider(lam) { return Math.pow(lam / LAM_MAX, 1 / 3) * 1000; }

  function mount(el) {
    var canvas = el.querySelector('canvas');
    var slider = el.querySelector('input[type="range"]');
    var readout = el.querySelector('[data-readout]');
    var ns = el.querySelector('.widget-noscript');
    if (ns) ns.remove();
    if (!canvas || !slider) return;

    var ctx = canvas.getContext('2d');
    var pad = { l: 46, r: 14, t: 14, b: 30 };
    var yMin = -0.25, yMax = 1.0;

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
      var lam = toLambda(+slider.value);

      // x is the slider position, so paths are evenly spread rather than
      // crushed against the axis by the cubic mapping.
      function px(s) { return pad.l + (s / 1000) * plotW; }
      function py(v) { return pad.t + (1 - (v - yMin) / (yMax - yMin)) * plotH; }

      ctx.clearRect(0, 0, w, h);

      // grid + y labels
      ctx.strokeStyle = MIST; ctx.lineWidth = 1;
      ctx.fillStyle = MUTED; ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      [1.0, 0.75, 0.5, 0.25, 0, -0.25].forEach(function (v) {
        var y = py(v);
        ctx.globalAlpha = v === 0 ? 1 : 0.55;
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillText(v.toFixed(2), pad.l - 8, y);
      });

      // x axis label
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('penalty λ  →', pad.l + plotW / 2, h - pad.b + 10);

      // coefficient paths
      [[0, ROYAL], [1, INDIGO]].forEach(function (pair) {
        ctx.strokeStyle = pair[1]; ctx.lineWidth = 2.25;
        ctx.beginPath();
        for (var s = 0; s <= 1000; s += 5) {
          var b = beta(toLambda(s))[pair[0]];
          var x = px(s), y = py(b);
          if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // current lambda marker
      var sx = px(+slider.value);
      ctx.strokeStyle = INK; ctx.globalAlpha = 0.28; ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(sx, pad.t); ctx.lineTo(sx, pad.t + plotH); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;

      var b = beta(lam);
      [[b[0], ROYAL, 'β₁'], [b[1], INDIGO, 'β₂']].forEach(function (p) {
        var y = py(p[0]);
        ctx.fillStyle = p[1];
        ctx.beginPath(); ctx.arc(sx, y, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.font = '600 11px "IBM Plex Mono", monospace';
        ctx.textAlign = sx > pad.l + plotW - 60 ? 'right' : 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(p[2], sx + (sx > pad.l + plotW - 60 ? -9 : 9), y - 4);
      });

      if (readout) {
        readout.textContent = 'λ = ' + lam.toFixed(1) +
          '   β₁ = ' + b[0].toFixed(3) +
          '   β₂ = ' + b[1].toFixed(3) +
          '   gap = ' + Math.abs(b[0] - b[1]).toFixed(3);
      }
    }

    slider.value = toSlider(0);
    slider.addEventListener('input', draw);
    window.addEventListener('resize', function () { window.requestAnimationFrame(draw); });
    draw();
  }

  (window.NoteWidgets = window.NoteWidgets || { registry: {}, register: function (n, m) { this.registry[n] = m; } })
    .register('ridge-shrinkage', mount);
})();
