/* Explorable: piecewise-linear optimal value z*(t) as Resource A's limit t
   varies, holding Resource B's limit at 24. Slope is the shadow price.

     z*(t) = 3t                  for 0 <= t <= 8   (only B binds)
             (9t + 48) / 5        for 8 <= t <= 48  (A and B both bind)
             96                   for t >= 48       (A no longer binds)

   Derived from the LP  max 4x+3y  s.t. 2x+y<=t, x+3y<=24, x,y>=0.
   See the note for the derivation and the cross-check against the KKT
   shadow prices (1.8 on the middle segment). */
(function () {
  'use strict';

  var INK = '#0a1b33', MUTED = '#44536b', MIST = '#d9e2ef', ROYAL = '#1d4fd8';

  function zStar(t) {
    if (t <= 8) return 3 * t;
    if (t <= 48) return (9 * t + 48) / 5;
    return 96;
  }
  function slopeAt(t) {
    if (t < 8) return 3;
    if (t < 48) return 1.8;
    return 0;
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
    var tMax = 60, zMax = 105;

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
      var t = +slider.value;

      function px(tv) { return pad.l + (tv / tMax) * plotW; }
      function py(v) { return pad.t + (1 - v / zMax) * plotH; }

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = MIST; ctx.lineWidth = 1;
      ctx.fillStyle = MUTED; ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      [0, 25, 50, 75, 100].forEach(function (v) {
        var y = py(v);
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.fillText(String(v), pad.l - 8, y);
      });

      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('Resource A limit (t)  →', pad.l + plotW / 2, h - pad.b + 10);

      // regime boundaries
      ctx.strokeStyle = MIST; ctx.setLineDash([3, 3]);
      [8, 48].forEach(function (b) {
        var x = px(b);
        ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + plotH); ctx.stroke();
      });
      ctx.setLineDash([]);

      ctx.strokeStyle = ROYAL; ctx.lineWidth = 2.25;
      ctx.beginPath();
      for (var tv = 0; tv <= tMax; tv += 0.5) {
        var x = px(tv), y = py(zStar(tv));
        if (tv === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      var mx = px(t), my = py(zStar(t));
      ctx.fillStyle = ROYAL;
      ctx.beginPath(); ctx.arc(mx, my, 4.5, 0, Math.PI * 2); ctx.fill();

      if (readout) {
        readout.textContent = 't = ' + t + '   z* = ' + zStar(t).toFixed(1) +
          '   shadow price = ' + slopeAt(t).toFixed(1);
      }
    }

    slider.addEventListener('input', draw);
    window.addEventListener('resize', function () { window.requestAnimationFrame(draw); });
    draw();
  }

  (window.NoteWidgets = window.NoteWidgets || { registry: {}, register: function (n, m) { this.registry[n] = m; } })
    .register('shadow-price', mount);
})();
