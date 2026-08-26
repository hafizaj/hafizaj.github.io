/* Explorable: fixed 7-node graph (two triangles joined by a bridge),
   sized by whichever centrality measure is toggled on. Values verified by
   brute-force shortest-path enumeration; see the note for the derivation. */
(function () {
  'use strict';

  var INK = '#0a1b33', MUTED = '#44536b', MIST = '#d9e2ef', ROYAL = '#1d4fd8', INDIGO = '#5b21b6';

  var NODES = {
    A: { x: 90, y: 70 }, B: { x: 90, y: 190 }, C: { x: 200, y: 130 },
    D: { x: 300, y: 130 },
    E: { x: 400, y: 130 }, F: { x: 510, y: 70 }, G: { x: 510, y: 190 }
  };
  var EDGES = [['A', 'B'], ['A', 'C'], ['B', 'C'], ['C', 'D'], ['D', 'E'], ['E', 'F'], ['E', 'G'], ['F', 'G']];
  var DEGREE = { A: 2, B: 2, C: 3, D: 2, E: 3, F: 2, G: 2 };
  var BETWEENNESS = { A: 0, B: 0, C: 8, D: 9, E: 8, F: 0, G: 0 };

  function mount(el) {
    var canvas = el.querySelector('canvas');
    var group = el.querySelector('[data-toggle-group]');
    var buttons = group ? group.querySelectorAll('button[data-measure]') : [];
    var readout = el.querySelector('[data-readout]');
    var ns = el.querySelector('.widget-noscript');
    if (ns) ns.remove();
    if (!canvas || !buttons.length) return;

    var ctx = canvas.getContext('2d');
    var measure = 'degree';
    var srcW = 600, srcH = 260;

    function size() {
      var w = canvas.parentElement.clientWidth || 560;
      var scale = w / srcW;
      var h = srcH * scale;
      var dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    }

    function values() { return measure === 'degree' ? DEGREE : BETWEENNESS; }

    function radius(v, maxV) {
      var minR = 11, maxR = 27;
      return minR + (maxR - minR) * (v / maxV);
    }

    function draw() {
      size();
      ctx.clearRect(0, 0, srcW, srcH);

      ctx.strokeStyle = MIST; ctx.lineWidth = 2;
      EDGES.forEach(function (e) {
        var a = NODES[e[0]], b = NODES[e[1]];
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });

      var vals = values();
      var maxV = Math.max.apply(null, Object.keys(vals).map(function (k) { return vals[k]; }));
      var leaderColor = measure === 'degree' ? ROYAL : INDIGO;

      Object.keys(NODES).forEach(function (name) {
        var p = NODES[name], v = vals[name];
        var r = radius(v, maxV);
        var isLeader = v === maxV;
        ctx.fillStyle = isLeader ? leaderColor : '#fff';
        ctx.strokeStyle = isLeader ? leaderColor : MUTED;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        ctx.font = '600 12px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = isLeader ? '#fff' : INK;
        ctx.fillText(name, p.x, p.y - 4);
        ctx.font = '10px "IBM Plex Mono", monospace';
        ctx.fillText(String(v), p.x, p.y + 9);
      });

      if (readout) {
        var leaders = Object.keys(vals).filter(function (k) { return vals[k] === maxV; });
        var label = measure === 'degree' ? 'Degree' : 'Betweenness';
        readout.textContent = label + ': ' + leaders.join(', ') +
          (leaders.length > 1 ? ' tied at ' : ' leads at ') + maxV;
      }
    }

    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener('click', function () {
        measure = btn.dataset.measure;
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
    .register('centrality-toggle', mount);
})();
