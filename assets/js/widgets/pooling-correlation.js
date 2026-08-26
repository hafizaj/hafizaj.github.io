/* Explorable: ratio of pooled to decoupled safety stock as demand
   correlation rho varies, for n=4 warehouses.

     ratio(rho) = sqrt( (1 + (n-1)*rho) / n )

   Domain: rho in [-1/(n-1), 1] = [-1/3, 1] for n=4, since variance must
   stay non-negative. See the note for the derivation. */
(function () {
  'use strict';

  var N = 4;
  var INK = '#0a1b33', MUTED = '#44536b', MIST = '#d9e2ef', ROYAL = '#1d4fd8';

  function ratio(rho) {
    var v = (1 + (N - 1) * rho) / N;
    return Math.sqrt(Math.max(0, v));
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
    var rhoMin = -1 / 3, rhoMax = 1;

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
      var f = (+slider.value) / 1000;
      var rho = rhoMin + f * (rhoMax - rhoMin);

      function px(rv) { return pad.l + ((rv - rhoMin) / (rhoMax - rhoMin)) * plotW; }
      function py(v) { return pad.t + (1 - v) * plotH; }

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
      ctx.fillText('correlation ρ  →', pad.l + plotW / 2, h - pad.b + 10);

      ctx.strokeStyle = ROYAL; ctx.lineWidth = 2.25;
      ctx.beginPath();
      for (var i = 0; i <= 500; i++) {
        var rv = rhoMin + (rhoMax - rhoMin) * (i / 500);
        var x = px(rv), y = py(ratio(rv));
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      var mx = px(rho), my = py(ratio(rho));
      ctx.fillStyle = ROYAL;
      ctx.beginPath(); ctx.arc(mx, my, 4.5, 0, Math.PI * 2); ctx.fill();

      if (readout) {
        var r = ratio(rho);
        readout.textContent = 'ρ = ' + rho.toFixed(2) +
          '   ratio = ' + r.toFixed(3) +
          '   reduction = ' + ((1 - r) * 100).toFixed(0) + '%';
      }
    }

    slider.addEventListener('input', draw);
    window.addEventListener('resize', function () { window.requestAnimationFrame(draw); });
    draw();
  }

  (window.NoteWidgets = window.NoteWidgets || { registry: {}, register: function (n, m) { this.registry[n] = m; } })
    .register('pooling-correlation', mount);
})();
