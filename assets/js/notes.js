/* Notes runtime: maths rendering, contents, active recall, explorable widgets.
   Everything here is progressive enhancement — a note is fully readable with
   JavaScript disabled, apart from the widgets, which declare their own
   fallback text.

   The module is wrapped so that the pure helpers (KaTeX options and the
   currency guard) can be required from Node by test/notes_math_test.cjs.
   Nothing touches the DOM until boot() runs, which the browser branch below
   calls synchronously so that window.NoteWidgets exists before any widget
   script executes. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.Notes = api;
    api.boot(root, root.document);
  }
}(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  /* ── Maths ─────────────────────────────────────────────────
     KaTeX auto-render treats a single dollar as an inline delimiter, so two
     currency amounts sitting in one text node would be rendered as maths with
     the prose between them swallowed. Two independent guards close that:

     1. ignoredClasses keeps auto-render out of the widget chrome entirely.
        Widget readouts print prices and are rewritten by widget scripts after
        this pass, so isolating their dollars by hand in markup was
        order-dependent; a class the renderer skips is not.
     2. currencySegments() finds a currency dollar anywhere else in the prose
        and wraps it in <span class="katex-ignore"> before auto-render runs, so
        it can never pair with a later one.

     Neither guard rewrites the maths the notes already contain: a run between
     two dollars is only treated as currency when it cannot be maths. */
  var IGNORED_CLASSES = ['katex-ignore', 'widget-readout', 'widget-title'];
  var IGNORED_TAGS = ['script', 'noscript', 'style', 'textarea', 'pre', 'code'];

  function katexOptions() {
    return {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false }
      ],
      ignoredTags: IGNORED_TAGS.slice(),
      ignoredClasses: IGNORED_CLASSES.slice(),
      throwOnError: false
    };
  }

  /* Characters the short inline maths in this collection is written from:
     ASCII letters, digits, whitespace, operators, brackets, punctuation and
     Greek. Currency is identified by positive evidence: non-maths punctuation,
     unbalanced brackets, or a compact $amount[-/,]$amount pair. */
  var MATH_CHARS = /^[\sA-Za-z0-9+\-*/=<>^_.,;:!?'"|()[\]{}\\%&~@#$\u00b0\u00b1\u00b5\u0370-\u03ff]*$/;
  var CURRENCY_AMOUNT = /^\d+(?:,\d{3})*(?:\.\d+)?(?:[kKmMbB])?/;
  var PAIRS = { ')': '(', ']': '[', '}': '{' };

  function bracketsBalanced(text) {
    var stack = [];
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      if (ch === '(' || ch === '[' || ch === '{') {
        stack.push(ch);
      } else if (PAIRS[ch]) {
        if (stack.pop() !== PAIRS[ch]) return false;
      }
    }
    return stack.length === 0;
  }

  /* Only ever asked about a run that begins immediately after a dollar followed
     by a digit, so the default has to be "this is maths" — $1/n$ and
     $0.9 \times 2$ are both real. It is rejected only on positive evidence. */
  function looksLikeMath(inner) {
    if (!inner.length) return false;
    if (inner.indexOf('\\') !== -1) return true;
    if (!MATH_CHARS.test(inner)) return false;
    if (!bracketsBalanced(inner)) return false;
    return !/\s$/.test(inner);
  }

  function isDigit(ch) {
    return ch >= '0' && ch <= '9';
  }

  function startsCompactCurrencyPair(text, dollarIndex) {
    var rest = text.slice(dollarIndex + 1);
    var amount = rest.match(CURRENCY_AMOUNT);
    if (!amount) return false;
    var separatorIndex = amount[0].length;
    var separator = rest.charAt(separatorIndex);
    return (separator === '-' || separator === '/' || separator === ',') &&
      rest.charAt(separatorIndex + 1) === '$' &&
      isDigit(rest.charAt(separatorIndex + 2));
  }

  /* Splits one text node's contents into runs, marking each dollar that would
     open a false maths span. Marked dollars get wrapped; everything else is
     returned verbatim, so text with no currency comes back as a single run.
     Dollars belonging to a $$ display delimiter are never considered currency. */
  function currencySegments(text) {
    var segments = [];
    var plain = '';
    var i = 0;

    while (i < text.length) {
      if (text.charAt(i) !== '$' || !isDigit(text.charAt(i + 1)) ||
          text.charAt(i - 1) === '$') {
        plain += text.charAt(i);
        i += 1;
        continue;
      }

      var close = text.indexOf('$', i + 1);
      if (close === -1 ||
          (!startsCompactCurrencyPair(text, i) &&
           looksLikeMath(text.slice(i + 1, close)))) {
        plain += text.charAt(i);
        i += 1;
        continue;
      }

      if (plain) segments.push({ text: plain, guard: false });
      plain = '';
      segments.push({ text: '$', guard: true });
      i += 1;
    }

    if (plain) segments.push({ text: plain, guard: false });
    return segments;
  }

  function skipNode(node) {
    var tag = node.nodeName ? node.nodeName.toLowerCase() : '';
    if (IGNORED_TAGS.indexOf(tag) !== -1) return true;
    var className = node.getAttribute ? node.getAttribute('class') : '';
    if (!className) return false;
    var classes = String(className).split(/\s+/);
    for (var i = 0; i < IGNORED_CLASSES.length; i++) {
      if (classes.indexOf(IGNORED_CLASSES[i]) !== -1) return true;
    }
    return false;
  }

  function isolateCurrency(root, doc) {
    if (!root || !doc) return 0;
    var isolated = 0;

    (function walk(node) {
      var child = node.firstChild;
      while (child) {
        var next = child.nextSibling;
        if (child.nodeType === 3) {
          var segments = currencySegments(child.nodeValue || '');
          if (segments.some(function (segment) { return segment.guard; })) {
            var fragment = doc.createDocumentFragment();
            segments.forEach(function (segment) {
              if (!segment.guard) {
                fragment.appendChild(doc.createTextNode(segment.text));
                return;
              }
              var span = doc.createElement('span');
              span.className = 'katex-ignore';
              span.appendChild(doc.createTextNode(segment.text));
              fragment.appendChild(span);
              isolated += 1;
            });
            node.replaceChild(fragment, child);
          }
        } else if (child.nodeType === 1 && !skipNode(child)) {
          walk(child);
        }
        child = next;
      }
    }(root));

    return isolated;
  }

  /* ── Browser runtime ───────────────────────────────────── */
  function boot(win, doc) {
    var body = null;

    function renderMath() {
      if (!body) return;
      isolateCurrency(body, doc);
      if (!win.renderMathInElement) return;
      win.renderMathInElement(body, katexOptions());
    }

    /* ── Table of contents ─────────────────────────────────── */
    function buildToc() {
      if (!body) return;
      var navs = doc.querySelectorAll('[data-note-toc]');
      if (!navs.length) return;
      var heads = body.querySelectorAll('h2, h3');
      if (!heads.length) {
        Array.prototype.forEach.call(navs, function (nav) {
          var surface = nav.closest('[data-note-toc-surface]');
          if (surface) surface.hidden = true;
        });
        return;
      }

      Array.prototype.forEach.call(heads, function (h, i) {
        if (!h.id) {
          h.id = (h.textContent || 'section').toLowerCase()
            .replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') || 'section-' + i;
        }
        Array.prototype.forEach.call(navs, function (nav) {
          var a = doc.createElement('a');
          a.href = '#' + h.id;
          a.textContent = h.textContent;
          a.className = 'block text-muted transition-colors hover:text-royal' +
            (h.tagName === 'H3' ? ' pl-3 text-[0.8rem]' : '');
          a.dataset.tocFor = h.id;
          nav.appendChild(a);
        });
      });

      if (!('IntersectionObserver' in win)) return;
      var links = doc.querySelectorAll('[data-note-toc] a[data-toc-for]');
      var seen = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          Array.prototype.forEach.call(links, function (l) {
            var on = l.dataset.tocFor === e.target.id;
            l.classList.toggle('text-royal', on);
            l.classList.toggle('font-semibold', on);
            l.classList.toggle('text-muted', !on);
            if (on) {
              l.setAttribute('aria-current', 'location');
            } else {
              l.removeAttribute('aria-current');
            }
          });
        });
      }, { rootMargin: '-80px 0px -70% 0px' });
      Array.prototype.forEach.call(heads, function (h) { seen.observe(h); });
    }

    /* ── Active recall ─────────────────────────────────────── */
    var storeKey = 'notes-recall:' + win.location.pathname;

    function readStore() {
      try { return JSON.parse(win.localStorage.getItem(storeKey) || '{}'); }
      catch (e) { return {}; }
    }
    function writeStore(data) {
      try { win.localStorage.setItem(storeKey, JSON.stringify(data)); } catch (e) { /* private mode */ }
    }

    function wireRecall() {
      if (!body) return;
      var cards = body.querySelectorAll('.reveal-recall');
      if (!cards.length) {
        var btn0 = doc.getElementById('recall-mode');
        if (btn0) btn0.parentElement.style.display = 'none';
        return;
      }
      var saved = readStore();

      Array.prototype.forEach.call(cards, function (card, i) {
        var id = card.dataset.recallId || 'card-' + i;
        card.dataset.recallId = id;

        var wrap = doc.createElement('div');
        wrap.className = 'recall-actions';

        var status = doc.createElement('span');
        status.className = 'recall-status';

        [['got', 'Got it'], ['again', 'Review again']].forEach(function (pair) {
          var b = doc.createElement('button');
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
        var btn = doc.getElementById('recall-mode');
        if (btn && got) btn.textContent = 'Test yourself · ' + got + '/' + cards.length;
      }
      paintSummary();

      var toggle = doc.getElementById('recall-mode');
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
    win.NoteWidgets = win.NoteWidgets || {};
    win.NoteWidgets.registry = win.NoteWidgets.registry || {};
    win.NoteWidgets.loading = win.NoteWidgets.loading || {};
    win.NoteWidgets.mountWithin = function (target) {
      if (!target) return;

      var widgets = [];
      if (target.matches && target.matches('[data-widget]')) widgets.push(target);
      if (target.querySelectorAll) {
        Array.prototype.push.apply(widgets, target.querySelectorAll('[data-widget]'));
      }
      if (!widgets.length) return;

      var wanted = {};
      Array.prototype.forEach.call(widgets, function (el) {
        if (el.dataset && el.dataset.widget) wanted[el.dataset.widget] = true;
      });

      Object.keys(wanted).forEach(function (name) {
        var mount = win.NoteWidgets.registry[name];
        if (mount) {
          Array.prototype.forEach.call(widgets, function (el) {
            if (el.dataset.widget !== name || el.hasAttribute('data-mounted')) return;
            el.setAttribute('data-mounted', 'true');
            try { mount(el); } catch (e) { console.error('widget ' + name, e); }
          });
          return;
        }
        if (win.NoteWidgets.loading[name]) return;
        win.NoteWidgets.loading[name] = true;
        var s = doc.createElement('script');
        s.src = '/assets/js/widgets/' + name + '.js';
        s.defer = true;
        s.onerror = function () {
          delete win.NoteWidgets.loading[name];
          console.warn('widget script missing: ' + name);
        };
        doc.head.appendChild(s);
      });
    };
    win.NoteWidgets.register = function (name, mount) {
      this.registry[name] = mount;
      if (this.loading) delete this.loading[name];
      this.mountWithin(doc);
    };

    function init() {
      body = doc.querySelector('[data-note-body]');
      renderMath();
      buildToc();
      wireRecall();
      win.NoteWidgets.mountWithin(doc);
    }

    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', function () { setTimeout(init, 0); });
    } else {
      setTimeout(init, 0);
    }
  }

  return {
    IGNORED_CLASSES: IGNORED_CLASSES,
    katexOptions: katexOptions,
    looksLikeMath: looksLikeMath,
    currencySegments: currencySegments,
    isolateCurrency: isolateCurrency,
    boot: boot
  };
}));
