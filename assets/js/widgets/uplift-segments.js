/* Explorable: toggle between four customer segments, showing control vs
   treated purchase rate and the resulting incremental purchase count.
   Values verified by hand and with node -e; see the note. */
(function () {
  'use strict';

  var INK = '#0a1b33', MUTED = '#44536b', MIST = '#d9e2ef', ROYAL = '#1d4fd8', INDIGO = '#5b21b6', EMBER = '#ff8a00';

  var SEGMENTS = {
    sure: { label: 'Sure things', n: 300, control: 0.80, treated: 0.82 },
    lost: { label: 'Lost causes', n: 300, control: 0.05, treated: 0.06 },
    persuadable: { label: 'Persuadables', n: 300, control: 0.10, treated: 0.45 },
    sleeping: { label: 'Sleeping dogs', n: 100, control: 0.60, treated: 0.40 }
  };

  function mount(el) {
    var canvas = el.querySelector('canvas');
    var group = el.querySelector('[data-toggle-group]');
    var buttons = group ? group.querySelectorAll('button[data-segment]') : [];
    var readout = el.querySelector('[data-readout]');
    var ns = el.querySelector('.widget-noscript');
    if (ns) ns.remove();
    if (!canvas || !buttons.length) return;

    var ctx = canvas.getContext('2d');
    var pad = { l: 46, r: 14, t: 14, b: 30 };
    var current = 'sure';

    function size() {
      var w = canvas.parentElement.clientWidth || 560;
      var h = 220;
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
      var seg = SEGMENTS[current];

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

      var barW = 90, gap = 60;
      var x0 = pad.l + plotW / 2 - barW - gap / 2;
      var x1 = pad.l + plotW / 2 + gap / 2;

      [['Control', seg.control, x0, MIST, INK], ['Treated', seg.treated, x1, seg.treated >= seg.control ? ROYAL : EMBER, '#fff']]
        .forEach(function (b) {
          var label = b[0], v = b[1], x = b[2], color = b[3], textColor = b[4];
          var yTop = py(v), yBase = py(0);
          ctx.fillStyle = color;
          ctx.fillRect(x, yTop, barW, yBase - yTop);
          ctx.strokeStyle = MUTED; ctx.lineWidth = 1;
          ctx.strokeRect(x, yTop, barW, yBase - yTop);
          ctx.font = '600 11px "IBM Plex Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = textColor; ctx.textBaseline = 'top';
          ctx.fillText((v * 100).toFixed(0) + '%', x + barW / 2, yTop + 6);
          ctx.fillStyle = INK; ctx.font = '10px "IBM Plex Mono", monospace'; ctx.textBaseline = 'top';
          ctx.fillText(label, x + barW / 2, py(0) + 8);
        });

      var uplift = seg.treated - seg.control;
      var incremental = seg.n * uplift;

      if (readout) {
        readout.textContent = seg.label + ': uplift ' + (uplift >= 0 ? '+' : '') +
          (uplift * 100).toFixed(0) + 'pp   incremental purchases = ' +
          incremental.toFixed(1) + ' (of ' + seg.n + ' customers)';
      }
    }

    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener('click', function () {
        current = btn.dataset.segment;
        Array.prototype.forEach.call(buttons, function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
        draw();
      });
    });

    window.addEventListener('resize', function () { window.requestAnimationFrame(draw); });
    draw();
  }

  (window.NoteWidgets = window.NoteWidgets || { registry: {}, register: function (n, m) { this.registry[n] = m; } })
    .register('uplift-segments', mount);
})();
