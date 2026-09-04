/* Explorable: lift = confidence / support(B), confidence fixed at 0.5,
   as support(B) varies. Crosses lift=1 exactly at support(B)=0.5. */
(function () {
  'use strict';

  var INK = '#0a1b33', MUTED = '#44536b', MIST = '#d9e2ef', ROYAL = '#1d4fd8', EMBER = '#ff8a00';
  var CONFIDENCE = 0.5;

  function lift(suppB) { return CONFIDENCE / suppB; }

  function mount(el) {
    var canvas = el.querySelector('canvas');
    var slider = el.querySelector('input[type="range"]');
    var readout = el.querySelector('[data-readout]');
    var ns = el.querySelector('.widget-noscript');
    if (ns) ns.remove();
    if (!canvas || !slider) return;

    var ctx = canvas.getContext('2d');
    var pad = { l: 46, r: 14, t: 14, b: 30 };
    var suppMin = 0.05, suppMax = 0.9, yMax = lift(suppMin) * 1.05;

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
      var suppB = (+slider.value) / 100;

      function px(s) { return pad.l + ((s - suppMin) / (suppMax - suppMin)) * plotW; }
      function py(v) { return pad.t + (1 - v / yMax) * plotH; }

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = MIST; ctx.lineWidth = 1;
      ctx.fillStyle = MUTED; ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      [2, 4, 6, 8, 10].forEach(function (v) {
        if (v > yMax) return;
        var y = py(v);
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.fillText(v + '×', pad.l - 8, y);
      });

      // independence line at lift=1
      ctx.strokeStyle = EMBER; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.5;
      var y1 = py(1);
      ctx.beginPath(); ctx.moveTo(pad.l, y1); ctx.lineTo(w - pad.r, y1); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = EMBER; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
      ctx.fillText('independence (lift = 1)', pad.l + 6, y1 - 3);

      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillStyle = MUTED;
      ctx.fillText('support(B)  →', pad.l + plotW / 2, h - pad.b + 10);

      ctx.strokeStyle = ROYAL; ctx.lineWidth = 2.25;
      ctx.beginPath();
      for (var i = 0; i <= 300; i++) {
        var s = suppMin + (suppMax - suppMin) * (i / 300);
        var x = px(s), y = py(Math.min(lift(s), yMax));
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      var mx = px(suppB), my = py(Math.min(lift(suppB), yMax));
      ctx.fillStyle = ROYAL;
      ctx.beginPath(); ctx.arc(mx, my, 4.5, 0, Math.PI * 2); ctx.fill();

      if (readout) {
        readout.textContent = 'support(B) = ' + suppB.toFixed(2) +
          '   lift = ' + lift(suppB).toFixed(2) + '×';
      }
    }

    slider.addEventListener('input', draw);
    window.addEventListener('resize', function () { window.requestAnimationFrame(draw); });
    draw();
  }

  (window.NoteWidgets = window.NoteWidgets || { registry: {}, register: function (n, m) { this.registry[n] = m; } })
    .register('basket-lift', mount);
})();
