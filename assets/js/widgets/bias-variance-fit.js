/* Explorable: polynomial regression of increasing degree fit to a fixed,
   noisy training set, evaluated against a fixed, separate test set. Degree
   is the reader's slider. True relationship, training points, test points,
   and noise are all fixed constants — verified offline (see the note) to
   produce a genuine U-shaped test-MSE curve bottoming out at degree 2,
   which happens to be the true polynomial order. */
(function () {
  'use strict';

  var INK = '#0a1b33', MUTED = '#44536b', MIST = '#d9e2ef';
  var ROYAL = '#1d4fd8', INDIGO = '#5b21b6', EMBER = '#c2410c';

  function fTrue(x) { return 20 + 1.4 * x - 0.03 * x * x; }

  var X_TRAIN = [0, 5, 10, 15, 20, 25, 30, 35, 40];
  var NOISE_TRAIN = [-1.8, 2.1, -0.9, 1.6, -2.3, 0.7, -1.4, 2.5, -1.1];
  var Y_TRAIN = X_TRAIN.map(function (x, i) { return fTrue(x) + NOISE_TRAIN[i]; });

  var X_TEST = [2.5, 7.5, 12.5, 17.5, 22.5, 27.5, 32.5, 37.5];
  var NOISE_TEST = [1.2, -1.5, 0.8, -2.0, 1.7, -0.6, 2.2, -1.3];
  var Y_TEST = X_TEST.map(function (x, i) { return fTrue(x) + NOISE_TEST[i]; });

  function solve(A, b) {
    var n = A.length;
    var M = A.map(function (row, i) { return row.concat([b[i]]); });
    for (var col = 0; col < n; col++) {
      var pivot = col;
      for (var r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
      var tmp = M[col]; M[col] = M[pivot]; M[pivot] = tmp;
      var pv = M[col][col];
      for (var c = col; c <= n; c++) M[col][c] /= pv;
      for (var r2 = 0; r2 < n; r2++) {
        if (r2 === col) continue;
        var factor = M[r2][col];
        for (var c2 = col; c2 <= n; c2++) M[r2][c2] -= factor * M[col][c2];
      }
    }
    return M.map(function (row) { return row[n]; });
  }
  function vandermonde(xs, degree) {
    return xs.map(function (x) {
      var row = [];
      for (var p = 0; p <= degree; p++) row.push(Math.pow(x, p));
      return row;
    });
  }
  function transpose(A) { return A[0].map(function (_, c) { return A.map(function (row) { return row[c]; }); }); }
  function matmul(A, B) {
    return A.map(function (row) {
      return B[0].map(function (_, c) {
        return row.reduce(function (sum, v, k) { return sum + v * B[k][c]; }, 0);
      });
    });
  }
  function matvec(A, v) { return A.map(function (row) { return row.reduce(function (s, x, i) { return s + x * v[i]; }, 0); }); }

  function fitBeta(degree) {
    var X = vandermonde(X_TRAIN, degree);
    var Xt = transpose(X);
    return solve(matmul(Xt, X), matvec(Xt, Y_TRAIN));
  }
  function evalPoly(beta, x) {
    var y = 0;
    for (var p = 0; p < beta.length; p++) y += beta[p] * Math.pow(x, p);
    return y;
  }
  function mse(beta, xs, ys) {
    var s = 0;
    for (var i = 0; i < xs.length; i++) { var d = evalPoly(beta, xs[i]) - ys[i]; s += d * d; }
    return s / xs.length;
  }

  function labelFor(d) {
    if (d === 1) return 'Underfitting — high bias';
    if (d === 2) return 'Best fit — matches the true curve';
    if (d <= 4) return 'Starting to overfit';
    return 'Overfitting — high variance';
  }

  function mount(el) {
    var canvas = el.querySelector('canvas');
    var slider = el.querySelector('input[type="range"]');
    var readout = el.querySelector('[data-readout]');
    var ns = el.querySelector('.widget-noscript');
    if (ns) ns.remove();
    if (!canvas || !slider) return;

    var ctx = canvas.getContext('2d');
    var pad = { l: 40, r: 14, t: 14, b: 30 };
    var xMin = 0, xMax = 40, yMin = 14, yMax = 40;

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
      var degree = +slider.value;

      function px(x) { return pad.l + ((x - xMin) / (xMax - xMin)) * plotW; }
      function py(y) { return pad.t + (1 - (y - yMin) / (yMax - yMin)) * plotH; }

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = MIST; ctx.lineWidth = 1;
      ctx.fillStyle = MUTED; ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      [40, 30, 20].forEach(function (v) {
        var y = py(v);
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        ctx.fillText(v, pad.l - 8, y);
      });
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('discount %  →', pad.l + plotW / 2, h - pad.b + 10);

      // true relationship (dashed reference — synthetic, so we can show it)
      ctx.strokeStyle = MUTED; ctx.globalAlpha = 0.6; ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (var xr = xMin; xr <= xMax; xr += 1) {
        var yr = py(fTrue(xr));
        if (xr === xMin) ctx.moveTo(px(xr), yr); else ctx.lineTo(px(xr), yr);
      }
      ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;

      // fitted curve
      var beta = fitBeta(degree);
      ctx.strokeStyle = ROYAL; ctx.lineWidth = 2.25;
      ctx.beginPath();
      for (var x = xMin; x <= xMax; x += 0.5) {
        var y = py(evalPoly(beta, x));
        if (x === xMin) ctx.moveTo(px(x), y); else ctx.lineTo(px(x), y);
      }
      ctx.stroke();

      // training points
      X_TRAIN.forEach(function (x, i) {
        ctx.fillStyle = ROYAL;
        ctx.beginPath(); ctx.arc(px(x), py(Y_TRAIN[i]), 4, 0, Math.PI * 2); ctx.fill();
      });
      // test points (hollow diamonds)
      X_TEST.forEach(function (x, i) {
        var cx = px(x), cy = py(Y_TEST[i]), s = 5;
        ctx.strokeStyle = INDIGO; ctx.lineWidth = 2; ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(cx, cy - s); ctx.lineTo(cx + s, cy); ctx.lineTo(cx, cy + s); ctx.lineTo(cx - s, cy);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      });

      if (readout) {
        var trainMSE = mse(beta, X_TRAIN, Y_TRAIN);
        var testMSE = mse(beta, X_TEST, Y_TEST);
        readout.textContent = 'Degree ' + degree + ' · train MSE ' + trainMSE.toFixed(2) +
          ' · test MSE ' + testMSE.toFixed(2) + ' — ' + labelFor(degree);
        readout.style.color = degree === 2 ? '#0f7a4a' : (degree >= 5 ? EMBER : '');
      }
    }

    slider.addEventListener('input', draw);
    window.addEventListener('resize', function () { window.requestAnimationFrame(draw); });
    draw();
  }

  (window.NoteWidgets = window.NoteWidgets || { registry: {}, register: function (n, m) { this.registry[n] = m; } })
    .register('bias-variance-fit', mount);
})();
