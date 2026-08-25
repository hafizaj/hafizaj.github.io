/* Explorable: two-asset risk-return frontier as correlation rho varies.

     Asset 1: mu=8%, sigma=10%.  Asset 2: mu=14%, sigma=20%.
     mu_p(w)    = w*mu1 + (1-w)*mu2
     sigma_p(w) = sqrt( w^2 s1^2 + (1-w)^2 s2^2 + 2 w(1-w) rho s1 s2 )

   Endpoints (w=0, w=1) are fixed regardless of rho; only the interior bows.
   Minimum-variance weight: w* = (s2^2 - rho*s1*s2) / (s1^2 + s2^2 - 2 rho s1 s2),
   clamped to [0,1] since short-selling is excluded. See the note. */
(function () {
  'use strict';

  var MU1 = 8, S1 = 10, MU2 = 14, S2 = 20;
  var INK = '#0a1b33', MUTED = '#44536b', MIST = '#d9e2ef', ROYAL = '#1d4fd8', EMBER = '#ff8a00';

  function sigmaP(w, rho) {
    var v = w * w * S1 * S1 + (1 - w) * (1 - w) * S2 * S2 + 2 * w * (1 - w) * rho * S1 * S2;
    return Math.sqrt(Math.max(0, v));
  }
  function muP(w) { return w * MU1 + (1 - w) * MU2; }

  function minVarWeight(rho) {
    var denom = S1 * S1 + S2 * S2 - 2 * rho * S1 * S2;
    if (Math.abs(denom) < 1e-9) return 0.5;
    var w = (S2 * S2 - rho * S1 * S2) / denom;
    return Math.max(0, Math.min(1, w));
  }

  function mount(el) {
    var canvas = el.querySelector('canvas');
    var slider = el.querySelector('input[type="range"]');
    var readout = el.querySelector('[data-readout]');
    var ns = el.querySelector('.widget-noscript');
    if (ns) ns.remove();
    if (!canvas || !slider) return;

    var ctx = canvas.getContext('2d');
    var pad = { l: 46, r: 14, t: 14, b: 30 };
    var xMax = 22, yMin = 7, yMax = 15;

    function size() {
      var w = canvas.parentElement.clientWidth || 560;
      var h = 260;
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
      var rho = (+slider.value) / 1000;

      function px(sv) { return pad.l + (sv / xMax) * plotW; }
      function py(mv) { return pad.t + (1 - (mv - yMin) / (yMax - yMin)) * plotH; }

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = MIST; ctx.lineWidth = 1;
      ctx.fillStyle = MUTED; ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      [7, 9, 11, 13, 15].forEach(function (v) {
        var y = py(v);
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.fillText(v + '%', pad.l - 8, y);
      });
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('risk σ  →', pad.l + plotW / 2, h - pad.b + 10);

      // frontier curve
      ctx.strokeStyle = ROYAL; ctx.lineWidth = 2.25;
      ctx.beginPath();
      for (var i = 0; i <= 200; i++) {
        var wt = i / 200;
        var x = px(sigmaP(wt, rho)), y = py(muP(wt));
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // asset endpoints
      [[1, 'Asset 1'], [0, 'Asset 2']].forEach(function (p) {
        var x = px(sigmaP(p[0], rho)), y = py(muP(p[0]));
        ctx.fillStyle = INK;
        ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.font = '10px "IBM Plex Mono", monospace';
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText(p[1], x + 7, y - 3);
      });

      // minimum-variance point
      var wStar = minVarWeight(rho);
      var mx = px(sigmaP(wStar, rho)), my = py(muP(wStar));
      ctx.fillStyle = EMBER;
      ctx.beginPath(); ctx.arc(mx, my, 5, 0, Math.PI * 2); ctx.fill();

      if (readout) {
        readout.textContent = 'ρ = ' + rho.toFixed(2) +
          '   min risk = ' + sigmaP(wStar, rho).toFixed(2) + '%' +
          '   at w = ' + wStar.toFixed(2);
      }
    }

    slider.addEventListener('input', draw);
    window.addEventListener('resize', function () { window.requestAnimationFrame(draw); });
    draw();
  }

  (window.NoteWidgets = window.NoteWidgets || { registry: {}, register: function (n, m) { this.registry[n] = m; } })
    .register('efficient-frontier', mount);
})();
