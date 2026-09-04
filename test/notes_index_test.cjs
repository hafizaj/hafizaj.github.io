'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const NotesIndex = require('../assets/js/notes-index.js');

test('matches selected subject, provenance, and format', function () {
  const note = { module: 'Retail Analytics', provenance: 'academic', interactive: true };
  assert.equal(NotesIndex.matches({
    module: 'Retail Analytics',
    provenance: 'academic',
    format: 'interactive'
  }, note), true);
  assert.equal(NotesIndex.matches({
    module: 'Energy Analytics',
    provenance: 'academic',
    format: 'interactive'
  }, note), false);
});

test('all values leave a note visible', function () {
  const note = { module: 'Retail Analytics', provenance: 'academic', interactive: false };
  assert.equal(NotesIndex.matches({
    module: 'all',
    provenance: 'all',
    format: 'all'
  }, note), true);
});

test('summary reports visible and total counts', function () {
  assert.equal(NotesIndex.summary(7, 20), 'Showing 7 of 20 notes');
});

test('filter button clicks prevent form submission', function () {
  const originalDocument = global.document;
  const button = {
    dataset: { filter: 'format' },
    setAttribute() {}
  };
  const peers = [
    button,
    { dataset: { filter: 'format' }, setAttribute() {} }
  ];
  let clickHandler;
  const form = {
    elements: { module: { value: 'all' } },
    querySelectorAll(selector) {
      if (selector === '[data-filter="format"]') return peers;
      return [];
    },
    addEventListener(type, handler) {
      if (type === 'click') clickHandler = handler;
    },
    querySelector() {
      return null;
    }
  };

  global.document = {
    querySelector(selector) {
      return selector === '[data-notes-filter]' ? form : null;
    },
    querySelectorAll(selector) {
      if (selector === '[data-note-row]') return [];
      return [];
    }
  };

  try {
    NotesIndex.init();
    let prevented = false;

    clickHandler({
      target: {
        closest(selector) {
          return selector === '[data-filter]' ? button : null;
        }
      },
      preventDefault() {
        prevented = true;
      }
    });

    assert.equal(prevented, true);
  } finally {
    global.document = originalDocument;
  }
});
