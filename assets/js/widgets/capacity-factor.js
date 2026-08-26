/* Explorable: annual energy (linear in CF) and LCOE multiplier (1/CF) for a
   fixed 100 MW plant, as capacity factor varies. Two independent scales
   (MWh on the left, a dimensionless multiplier on the right) sharing the
   same horizontal axis — drawn with separate tick marks so the two are
   never implied to share one grid. See the note for the derivation. */
(function () {
  'use strict';

  var CAP = 100, HOURS = 8760;
  var INK = '#0a1b33', MUTED = '#44536b', MIST = '#d9e2ef', ROYAL = '#1d4fd8', INDIGO = '#5b21b6';

  function energy(cf) { return CAP * HOURS * cf; }
  function multiplier(cf) { return 1 / cf; }

  function mount(el) {
    var canvas = el.querySelector('canvas');
    var slider = el.querySelector('input[type="range"]');
    var readout = el.querySelector('[data-readout]');
    var ns = el.querySelector('.widget-noscript');
    if (ns) ns.remove();
    if (!canvas || !slider) return;

    var ctx = canvas.getContext('2d');
    var pad = { l: 58, r: 58, t: 14, b: 30 };
    var cfMin = 0.1, cfMax = 1.0;
    var energyMax = energy(cfMax) * 1.05;
    var multMax = multiplier(cfMin) * 1.05;

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
      var cf = (+slider.value) / 100;

      function px(v) { return pad.l + ((v - cfMin) / (cfMax - cfMin)) * plotW; }
      function pyE(v) { return pad.t + (1 - v / energyMax) * plotH; }
      function pyM(v) { return pad.t + (1 - v / multMax) * plotH; }

      ctx.clearRect(0, 0, w, h);

      // right-axis (multiplier) gridlines only, to avoid implying a shared scale
      ctx.strokeStyle = MIST; ctx.lineWidth = 1;
      [1, 4, 7, 10].forEach(function (v) {
        var y = pyM(v);
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
      });

      ctx.font = '10px "IBM Plex Mono", monospace'; ctx.textBaseline = 'middle';
      ctx.fillStyle = ROYAL; ctx.textAlign = 'right';
      [0, 400000, 800000].forEach(function (v) {
        ctx.fillText((v / 1000) + 'k', pad.l - 8, pyE(v));
      });
      ctx.fillStyle = INDIGO; ctx.textAlign = 'left';
      [1, 4, 7, 10].forEach(function (v) {
        ctx.fillText(v + '×', w - pad.r + 8, pyM(v));
      });

      ctx.fillStyle = MUTED; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('capacity factor  →', pad.l + plotW / 2, h - pad.b + 10);
      ctx.save();
      ctx.translate(14, pad.t + plotH / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = ROYAL; ctx.textBaseline = 'bottom'; ctx.fillText('annual MWh', 0, 0);
      ctx.restore();
      ctx.save();
      ctx.translate(w - 14, pad.t + plotH / 2); ctx.rotate(Math.PI / 2);
      ctx.fillStyle = INDIGO; ctx.textBaseline = 'bottom'; ctx.fillText('LCOE ×', 0, 0);
      ctx.restore();

      ctx.strokeStyle = ROYAL; ctx.lineWidth = 2.25;
      ctx.beginPath();
      for (var i = 0; i <= 200; i++) {
        var v = cfMin + (cfMax - cfMin) * (i / 200);
        var x = px(v), y = pyE(energy(v));
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.strokeStyle = INDIGO; ctx.lineWidth = 2.25;
      ctx.beginPath();
      for (var j = 0; j <= 200; j++) {
        var v2 = cfMin + (cfMax - cfMin) * (j / 200);
        var x2 = px(v2), y2 = pyM(multiplier(v2));
        if (j === 0) ctx.moveTo(x2, y2); else ctx.lineTo(x2, y2);
      }
      ctx.stroke();

      var mx = px(cf);
      ctx.fillStyle = ROYAL;
      ctx.beginPath(); ctx.arc(mx, pyE(energy(cf)), 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = INDIGO;
      ctx.beginPath(); ctx.arc(mx, pyM(multiplier(cf)), 4.5, 0, Math.PI * 2); ctx.fill();

      if (readout) {
        readout.textContent = 'CF = ' + Math.round(cf * 100) + '%   ' +
          'energy = ' + Math.round(energy(cf)).toLocaleString() + ' MWh/yr   ' +
          'LCOE × = ' + multiplier(cf).toFixed(2);
      }
    }

    slider.addEventListener('input', draw);
    window.addEventListener('resize', function () { window.requestAnimationFrame(draw); });
    draw();
  }

  (window.NoteWidgets = window.NoteWidgets || { registry: {}, register: function (n, m) { this.registry[n] = m; } })
    .register('capacity-factor', mount);
})();
