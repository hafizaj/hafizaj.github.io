(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.NotesIndex = api;
}(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  function matches(filters, note) {
    return (filters.module === 'all' || filters.module === note.module) &&
      (filters.provenance === 'all' || filters.provenance === note.provenance) &&
      (filters.format === 'all' ||
        (filters.format === 'interactive' ? note.interactive : !note.interactive));
  }

  function summary(visible, total) {
    return 'Showing ' + visible + ' of ' + total + ' notes';
  }

  function init() {
    var form = document.querySelector('[data-notes-filter]');
    if (!form) return;
    var rows = Array.prototype.slice.call(document.querySelectorAll('[data-note-row]'));
    var output = document.querySelector('[data-notes-count]');

    function readFilters() {
      var pressed = function (name) {
        var active = form.querySelector('[data-filter="' + name + '"][aria-pressed="true"]');
        return active ? active.value : 'all';
      };
      return {
        module: form.elements.module.value,
        provenance: pressed('provenance'),
        format: pressed('format')
      };
    }

    function apply() {
      var filters = readFilters();
      var visible = 0;
      rows.forEach(function (row) {
        var show = matches(filters, {
          module: row.dataset.module,
          provenance: row.dataset.provenance,
          interactive: row.dataset.interactive === 'true'
        });
        row.hidden = !show;
        if (show) visible += 1;
      });
      if (output) output.textContent = summary(visible, rows.length);
    }

    form.addEventListener('change', apply);
    form.addEventListener('click', function (event) {
      var button = event.target.closest('[data-filter]');
      if (!button) return;
      event.preventDefault();
      form.querySelectorAll('[data-filter="' + button.dataset.filter + '"]').forEach(function (peer) {
        peer.setAttribute('aria-pressed', String(peer === button));
      });
      apply();
    });
    apply();
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }

  return { matches: matches, summary: summary, init: init };
}));
