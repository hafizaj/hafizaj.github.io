/* Explorable: optimal margin % = 1/|eps| as elasticity magnitude varies,
   for the constant-elasticity inverse elasticity rule. See the note. */
(function () {
  'use strict';

  var INK = '#0a1b33', MUTED = '#44536b', MIST = '#d9e2ef', ROYAL = '#1d4fd8';
  var C = 10;

  function margin(mag) { return 1 / mag; }
  function optPrice(mag) { return C * mag / (mag - 1); }

  function mount(el) {
    var canvas = el.querySelector('canvas');
    var slider = el.querySelector('input[type="range"]');
    var readout = el.querySelector('[data-readout]');
    var ns = el.querySelector('.widget-noscript');
    if (ns) ns.remove();
    if (!canvas || !slider) return;

    var ctx = canvas.getContext('2d');
    var pad = { l: 50, r: 14, t: 14, b: 30 };
    var magMin = 1.2, magMax = 6.0;

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
      var mag = (+slider.value) / 100;

      function px(m) { return pad.l + ((m - magMin) / (magMax - magMin)) * plotW; }
      function py(v) { return pad.t + (1 - v) * plotH; }

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = MIST; ctx.lineWidth = 1;
      ctx.fillStyle = MUTED; ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      [0, 0.25, 0.5, 0.75, 1.0].forEach(function (v) {
        var y = py(v);
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.fillText(Math.round(v * 100) + '%', pad.l - 8, y);
      });
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('elasticity magnitude |ε|  →', pad.l + plotW / 2, h - pad.b + 10);

      ctx.strokeStyle = ROYAL; ctx.lineWidth = 2.25;
      ctx.beginPath();
      for (var i = 0; i <= 300; i++) {
        var m = magMin + (magMax - magMin) * (i / 300);
        var x = px(m), y = py(margin(m));
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      var mx = px(mag), my = py(margin(mag));
      ctx.fillStyle = ROYAL;
      ctx.beginPath(); ctx.arc(mx, my, 4.5, 0, Math.PI * 2); ctx.fill();

      if (readout) {
        readout.textContent = '|ε| = ' + mag.toFixed(2) +
          '   margin = ' + (margin(mag) * 100).toFixed(1) + '%' +
          '   P* = $' + optPrice(mag).toFixed(2) + ' (c=$10)';
      }
    }

    slider.addEventListener('input', draw);
    window.addEventListener('resize', function () { window.requestAnimationFrame(draw); });
    draw();
  }

  (window.NoteWidgets = window.NoteWidgets || { registry: {}, register: function (n, m) { this.registry[n] = m; } })
    .register('elasticity-markup', mount);
})();
