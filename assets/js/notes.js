/* Notes runtime: maths rendering, contents, active recall, explorable widgets.
   Everything here is progressive enhancement — a note is fully readable with
   JavaScript disabled, apart from the widgets, which declare their own
   fallback text. */
(function () {
  'use strict';

  var body = document.querySelector('[data-note-body]');
  if (!body) return;

  /* ── Maths ─────────────────────────────────────────────── */
  function renderMath() {
    if (!window.renderMathInElement) return;
    window.renderMathInElement(body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false }
      ],
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      throwOnError: false
    });
  }

  /* ── Table of contents ─────────────────────────────────── */
  function buildToc() {
    var nav = document.getElementById('note-toc');
    if (!nav) return;
    var heads = body.querySelectorAll('h2, h3');
    if (!heads.length) { nav.closest('aside').style.display = 'none'; return; }

    Array.prototype.forEach.call(heads, function (h, i) {
      if (!h.id) {
        h.id = (h.textContent || 'section').toLowerCase()
          .replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') || 'section-' + i;
      }
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.className = 'block text-muted transition-colors hover:text-royal' +
        (h.tagName === 'H3' ? ' pl-3 text-[0.8rem]' : '');
      a.dataset.tocFor = h.id;
      nav.appendChild(a);
    });

    if (!('IntersectionObserver' in window)) return;
    var links = nav.querySelectorAll('a');
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        Array.prototype.forEach.call(links, function (l) {
          var on = l.dataset.tocFor === e.target.id;
          l.classList.toggle('text-royal', on);
          l.classList.toggle('font-semibold', on);
          l.classList.toggle('text-muted', !on);
        });
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    Array.prototype.forEach.call(heads, function (h) { seen.observe(h); });
  }

  /* ── Active recall ─────────────────────────────────────── */
  var storeKey = 'notes-recall:' + window.location.pathname;

  function readStore() {
    try { return JSON.parse(localStorage.getItem(storeKey) || '{}'); }
    catch (e) { return {}; }
  }
  function writeStore(data) {
    try { localStorage.setItem(storeKey, JSON.stringify(data)); } catch (e) { /* private mode */ }
  }

  function wireRecall() {
    var cards = body.querySelectorAll('.reveal-recall');
    if (!cards.length) {
      var btn0 = document.getElementById('recall-mode');
      if (btn0) btn0.parentElement.style.display = 'none';
      return;
    }
    var saved = readStore();

    Array.prototype.forEach.call(cards, function (card, i) {
      var id = card.dataset.recallId || 'card-' + i;
      card.dataset.recallId = id;

      var wrap = document.createElement('div');
      wrap.className = 'recall-actions';

      var status = document.createElement('span');
      status.className = 'recall-status';

      [['got', 'Got it'], ['again', 'Review again']].forEach(function (pair) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'recall-btn';
        b.textContent = pair[1];
        b.setAttribute('aria-pressed', String(saved[id] === pair[0]));
        b.addEventListener('click', function () {
          var store = readStore();
          if (store[id] === pair[0]) { delete store[id]; } else { store[id] = pair[0]; }
          writeStore(store);
          Array.prototype.forEach.call(wrap.querySelectorAll('.recall-btn'), function (other, k) {
            other.setAttribute('aria-pressed', String(store[id] === (k === 0 ? 'got' : 'again')));
          });
          paintSummary();
        });
        wrap.appendChild(b);
      });

      wrap.appendChild(status);
      (card.querySelector('.reveal-body') || card).appendChild(wrap);
    });

    function paintSummary() {
      var store = readStore();
      var got = 0;
      Array.prototype.forEach.call(cards, function (c) {
        if (store[c.dataset.recallId] === 'got') got++;
      });
      var btn = document.getElementById('recall-mode');
      if (btn && got) btn.textContent = 'Test yourself · ' + got + '/' + cards.length;
    }
    paintSummary();

    var toggle = document.getElementById('recall-mode');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      var on = toggle.getAttribute('aria-pressed') !== 'true';
      toggle.setAttribute('aria-pressed', String(on));
      Array.prototype.forEach.call(body.querySelectorAll('.reveal'), function (d) {
        d.open = on ? false : d.open;
      });
      if (on) {
        var first = body.querySelector('.reveal-recall');
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* ── Explorable widgets ────────────────────────────────── */
  window.NoteWidgets = window.NoteWidgets || {
    registry: {},
    register: function (name, mount) {
      this.registry[name] = mount;
      var pending = document.querySelectorAll('[data-widget="' + name + '"]:not([data-mounted])');
      Array.prototype.forEach.call(pending, function (el) {
        el.setAttribute('data-mounted', 'true');
        try { mount(el); } catch (e) { console.error('widget ' + name, e); }
      });
    }
  };

  function loadWidgets() {
    var els = body.querySelectorAll('[data-widget]');
    var wanted = {};
    Array.prototype.forEach.call(els, function (el) { wanted[el.dataset.widget] = true; });
    Object.keys(wanted).forEach(function (name) {
      if (window.NoteWidgets.registry[name]) {
        window.NoteWidgets.register(name, window.NoteWidgets.registry[name]);
        return;
      }
      var s = document.createElement('script');
      s.src = '/assets/js/widgets/' + name + '.js';
      s.defer = true;
      s.onerror = function () { console.warn('widget script missing: ' + name); };
      document.head.appendChild(s);
    });
  }

  function init() {
    renderMath();
    buildToc();
    wireRecall();
    loadWidgets();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 0); });
  } else {
    setTimeout(init, 0);
  }
})();
