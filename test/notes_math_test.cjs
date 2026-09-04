/* Regression guard for the KaTeX single-dollar hazard.

   KaTeX auto-render treats a lone "$" as an inline maths delimiter, so a price
   written in prose can pair with a later dollar and swallow the sentence
   between them. assets/js/notes.js closes that two ways: widget chrome is in
   ignoredClasses, and prose currency is wrapped in <span class="katex-ignore">
   before rendering. These tests hold both in place, and sweep the committed
   corpus so that neither a new unguarded price nor a guard that starts eating
   real maths can land unnoticed. */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const notes = require('../assets/js/notes.js');
const NOTES_DIR = path.join(__dirname, '..', '_notes');

function noteFiles() {
  return fs.readdirSync(NOTES_DIR).filter((name) => name.endsWith('.md')).sort();
}

function isolatedRuns(text) {
  return notes.currencySegments(text).filter((segment) => segment.guard);
}

test('KaTeX options keep auto-render out of widget chrome', () => {
  const options = notes.katexOptions();
  assert.ok(options.ignoredClasses.includes('katex-ignore'));
  assert.ok(options.ignoredClasses.includes('widget-readout'));
  assert.ok(options.ignoredTags.includes('code'));
  assert.deepStrictEqual(options.delimiters[2], { left: '$', right: '$', display: false });
});

test('currency pairs are isolated, real maths is not', () => {
  const currency = [
    'e.g. $50 \u2192 $58.82',
    'P* = $16.67 (c=$10)',
    'a floor of $90 and a ceiling of $110 in the same sentence',
    'it cost $1,250 \u2014 $250 more than planned',
    'costs $50-$60 per unit',
    'budget $50/$60 split',
    'from $1.5m-$2m',
    'quoted as $50,$60'
  ];
  currency.forEach((sample) => {
    assert.strictEqual(isolatedRuns(sample).length >= 1, true, `expected isolation in: ${sample}`);
  });

  const maths = [
    'it falls like $1/n$ and no faster',
    'split as $110 - 90s$ easy and the mirror image',
    'the sum is $0.90 \\times \\frac{200}{220} + 0.20 \\times \\frac{20}{220} = 0.8364$',
    'at $0.85$ the multiple is 1.1765',
    'a price of $50/MWh with no closing delimiter at all',
    'points sit at $x = 2.5, 7.5, \\dots, 37.5$',
    '$$1 + 2 $$'
  ];
  maths.forEach((sample) => {
    assert.deepStrictEqual(isolatedRuns(sample), [], `unexpected isolation in: ${sample}`);
  });
});

test('segments reassemble to the original text', () => {
  const sample = 'buy at $50 and sell at $58.82, or hold $1/n$ of the book';
  const joined = notes.currencySegments(sample).map((segment) => segment.text).join('');
  assert.strictEqual(joined, sample);
});

test('committed notes contain no unguarded prose currency', () => {
  const offenders = [];
  noteFiles().forEach((name) => {
    const lines = fs.readFileSync(path.join(NOTES_DIR, name), 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      if (isolatedRuns(line).length) offenders.push(`${name}:${index + 1}: ${line.trim()}`);
    });
  });
  assert.deepStrictEqual(offenders, [], `write currency as USD/GBP/EUR, or wrap it:\n${offenders.join('\n')}`);
});

/* kramdown reads an underscore that follows a non-word character and precedes
   another non-word, non-space character as an emphasis marker, so two of them in
   one paragraph become <em> and destroy the inline maths between them — which is
   exactly what "}_{" does in a subscript. ("}_1" is safe: kramdown will not close
   emphasis before an alphanumeric.) The fix is to keep at most one such
   underscore per paragraph, not to escape it: "\_" satisfies kramdown but
   survives verbatim into Pandoc's LaTeX output, where it prints a literal
   underscore instead of a subscript. Single-line display blocks are exempt;
   kramdown leaves a standalone $$...$$ span alone. */
test('inline maths keeps at most one emphasis-capable underscore per line', () => {
  const offenders = [];
  noteFiles().forEach((name) => {
    const lines = fs.readFileSync(path.join(NOTES_DIR, name), 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      const inline = line.replace(/\$\$[\s\S]*?\$\$/g, '');
      const candidates = inline.match(/(?:^|[^\w\\])_(?![\w\s])/g) || [];
      if (candidates.length > 1) offenders.push(`${name}:${index + 1} (${candidates.length})`);
    });
  });
  assert.deepStrictEqual(offenders, [], `kramdown will pair these into <em>: ${offenders.join(', ')}`);
});

test('no note escapes an underscore inside inline maths', () => {
  const offenders = [];
  noteFiles().forEach((name) => {
    const lines = fs.readFileSync(path.join(NOTES_DIR, name), 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      if (/\$[^$\n]*\\_/.test(line)) offenders.push(`${name}:${index + 1}`);
    });
  });
  assert.deepStrictEqual(offenders, [], `"\\_" breaks the Pandoc PDF export: ${offenders.join(', ')}`);
});
