/* Explorable: merit-order supply stack (cumulative capacity vs marginal
   cost), with a solar slider reducing net demand from a fixed 6000 MW raw
   demand and a vertical line showing which tranche sets the clearing price.
   Boundary values verified against a brute-force script; see the note. */
(function () {
  'use strict';

  var STACK = [
    { name: 'Wind', cap: 2000, cost: 0 },
    { name: 'Nuclear', cap: 1000, cost: 10 },
    { name: 'Coal', cap: 1500, cost: 30 },
    { name: 'Gas CCGT', cap: 2000, cost: 50 },
    { name: 'Gas peaker', cap: 1000, cost: 120 }
  ];
  var TOTAL_CAP = STACK.reduce(function (s, g) { return s + g.cap; }, 0);
  var MAX_COST = STACK[STACK.length - 1].cost;
  var D_RAW = 6000;

  var INK = '#0a1b33', MUTED = '#44536b', MIST = '#d9e2ef', ROYAL = '#1d4fd8', EMBER = '#ff8a00';
  var BAR_COLORS = ['#1d4fd8', '#5b21b6', '#44536b', '#0a1b33', '#ff8a00'];

  function clearingPrice(demand) {
    var cum = 0;
    for (var i = 0; i < STACK.length; i++) {
      cum += STACK[i].cap;
      if (demand <= cum) return { price: STACK[i].cost, marginal: STACK[i].name };
    }
    return { price: MAX_COST, marginal: STACK[STACK.length - 1].name };
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
      var solar = +slider.value;
      var netDemand = D_RAW - solar;

      function px(cap) { return pad.l + (cap / TOTAL_CAP) * plotW; }
      function py(cost) { return pad.t + (1 - cost / (MAX_COST * 1.05)) * plotH; }

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = MIST; ctx.lineWidth = 1;
      ctx.fillStyle = MUTED; ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      [0, 30, 60, 90, 120].forEach(function (v) {
        var y = py(v);
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.fillText('$' + v, pad.l - 8, y);
      });
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('cumulative capacity (MW)  →', pad.l + plotW / 2, h - pad.b + 10);

      // stacked bars — zero-cost tranches (wind) get a minimum visible
      // height so they don't disappear into the price axis at $0.
      var MIN_BAR_H = 6;
      var cum = 0;
      STACK.forEach(function (g, i) {
        var x0 = px(cum), x1 = px(cum + g.cap);
        var yTop = Math.min(py(g.cost), py(0) - MIN_BAR_H), yBase = py(0);
        ctx.fillStyle = BAR_COLORS[i];
        ctx.fillRect(x0, yTop, x1 - x0, yBase - yTop);
        var barH = yBase - yTop;
        ctx.font = '600 10px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        if (x1 - x0 > 44 && barH >= 16) {
          ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle';
          ctx.fillText(g.name, (x0 + x1) / 2, (yTop + yBase) / 2);
        } else if (x1 - x0 > 44) {
          ctx.fillStyle = INK; ctx.textBaseline = 'bottom';
          ctx.fillText(g.name, (x0 + x1) / 2, yTop - 2);
        }
        cum += g.cap;
      });

      // net demand marker
      var dx = px(Math.max(0, Math.min(TOTAL_CAP, netDemand)));
      ctx.strokeStyle = INK; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(dx, pad.t); ctx.lineTo(dx, py(0)); ctx.stroke();
      ctx.fillStyle = INK; ctx.font = '600 10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText('net demand', dx, pad.t - 2);

      var result = clearingPrice(netDemand);
      if (readout) {
        readout.textContent = 'Solar = ' + solar + ' MW   net demand = ' + netDemand + ' MW' +
          '   marginal = ' + result.marginal + '   price = $' + result.price + '/MWh';
      }
    }

    slider.addEventListener('input', draw);
    window.addEventListener('resize', function () { window.requestAnimationFrame(draw); });
    draw();
  }

  (window.NoteWidgets = window.NoteWidgets || { registry: {}, register: function (n, m) { this.registry[n] = m; } })
    .register('merit-order-stack', mount);
})();
