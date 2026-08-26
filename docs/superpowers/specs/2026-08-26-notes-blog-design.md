# Design: `/notes/` — interactive technical notes

**Date:** 26 August 2026
**Status:** v1 implemented; expansion pending
**Decision:** Approach A — Markdown + client-side KaTeX inside the existing Jekyll collection system.

## Purpose

A place to publish short technical explainers on methods encountered during the
MSc Business Analytics at Imperial College London, framed as **technical
writing rather than coursework revision**, so it reinforces rather than dilutes
the Cloud Solution Architect positioning of the rest of the site.

Success looks like: twelve genuinely good pieces over a year that a hiring
manager would read to the end — not weekly coverage of thirteen modules.

## Copyright and academic integrity — binding constraints

The source folder (`Imperial/Class/`) contains three kinds of material. Only
one may ever be published.

| Material | Examples | Rule |
|---|---|---|
| Lecturer-authored | `Regression-Annotated-2026.pdf`, syllabi, lecture figures | **Never publish.** Imperial/lecturer copyright. Do not mirror, extract figures from, or paraphrase closely. |
| Assessment | `Assign2_2026.pdf`, `Solutions_Assign1_2026.pdf`, mock exam solutions | **Never publish, permanently.** Copyright infringement *and* facilitating academic misconduct for later cohorts. |
| Own writing | `AML_Plain_English_Companion.tex`, own derivations and explanations | Publishable. This is the blog. |

**Operating rule: write from understanding, not from the slide.** Restate
results in own words and own notation, cite the module for context, never
reproduce a lecturer's phrasing, figures, or problem sets. Mathematical facts
are not copyrightable; a particular expression of them is.

Every note carries a standing footer stating that no course material, problem
sets, or model solutions are reproduced. `_layouts/note.html` renders this
automatically — it is not per-note boilerplate that can be forgotten.

## Architecture

Notes are a Jekyll collection, built by GitHub Pages with no new toolchain.

```
_notes/*.md                  content, one file per note
_layouts/note.html           shell: KaTeX, TOC, recall toggle, footer
notes/index.html             the index
assets/js/notes.js           maths, contents, recall, widget loader
assets/js/widgets/<name>.js  one file per explorable figure
_tailwind/input.css          "Notes" section — components
docs/notes-preamble.tex      print half of the same design system
scripts/note-to-pdf.sh       Pandoc export
scripts/note-filter.lua      maps HTML components to LaTeX environments
```

### Why this and not the alternatives

- **LaTeX → HTML (LaTeXML / make4ht):** rejected. Generated markup fights
  Tailwind, `tcolorbox` translates poorly, GitHub Pages cannot run it, and
  interactivity would have to be injected into machine-generated HTML.
- **Quarto:** rejected for now. Genuinely well-suited, but it means two static
  site generators on one domain, an Actions pipeline, and a second CSS system
  fighting the brand. Revisit only if runnable code cells become a requirement.

### Binding constraint discovered

The site builds on **GitHub Pages' default Jekyll**, with no Actions workflow
and no custom plugins (which is why Tailwind is precompiled and committed).
Therefore maths renders **client-side** via KaTeX, and `_config.yml` sets
`math_engine: null` so kramdown leaves `$…$` and `$$…$$` as literal text for
auto-render to find.

## Authoring model

Notes are Markdown. Maths is real LaTeX. Components are HTML elements with
`markdown="1"` so their contents are still Markdown.

```markdown
<div class="callout callout-key" markdown="1">
<span class="callout-label">The one thing to hold on to</span>
Body text, with $\lambda$ maths inline.
</div>

<details class="reveal">
  <summary>Show the derivation<span class="reveal-tag">3 lines</span></summary>
  <div class="reveal-body" markdown="1">
  …
  </div>
</details>

<details class="reveal reveal-recall">
  <summary>Question the reader should try to answer<span class="reveal-tag">Recall</span></summary>
  <div class="reveal-body" markdown="1">The answer.</div>
</details>
```

Component vocabulary, deliberately small:

| Class | Purpose | LaTeX counterpart |
|---|---|---|
| `callout callout-key` | The one idea to retain | `keybox` |
| `callout callout-warn` | The trap or failure mode | `warnbox` |
| `callout callout-note` | Aside | `notebox` |
| `details.reveal` | Collapsible derivation | `derivation` |
| `details.reveal.reveal-recall` | Active-recall card | `recall` |
| `div.widget[data-widget]` | Explorable figure | `widgetstub` |

### Front matter

```yaml
title:          # the idea, never "Week 4"
topic:          # eyebrow, e.g. "Regularisation"
module:         # Imperial module, for context and honesty
date:
reading_time:   # minutes
summary:        # one sentence, used on the index and in search results
prerequisites:  # what the reader must already know
sources:        # textbook pointers, HTML allowed
draft: true     # omit from the index
```

## Interactivity

Three kinds, all client-side, no backend, no Pyodide.

1. **Explorable maths.** A `div.widget[data-widget="name"]` containing a
   `<canvas>`, controls, and a `.widget-noscript` fallback paragraph that the
   widget removes on mount. `notes.js` lazily loads
   `/assets/js/widgets/<name>.js`, which self-registers via
   `window.NoteWidgets.register(name, mountFn)`. Only posts that use a widget
   pay for its script.
2. **Progressive disclosure.** Native `<details>` — no JavaScript needed,
   accessible by default, and it prints.
3. **Active recall.** Recall cards get *Got it* / *Review again* buttons,
   persisted to `localStorage` under `notes-recall:<pathname>`. A **Test
   yourself** control in the sidebar collapses every answer. All reads and
   writes are wrapped in `try/catch` for private-browsing mode.

The table of contents is generated from `h2`/`h3` at runtime, with an
`IntersectionObserver` marking the active section.

## PDF export

`scripts/note-to-pdf.sh <note.md>` runs Pandoc with
`docs/notes-preamble.tex` and `scripts/note-filter.lua`, producing a PDF whose
callouts, derivations, and recall cards use the same visual semantics as the
web page. Widgets become a labelled stub pointing at the live URL rather than
a silent gap.

**Not yet verified end to end** — pandoc and LaTeX are not installed on this
machine, so the filter is written but unexercised. First run will likely need
small fixes. Output goes to `_pdf/`, which is gitignored.

## Class-name review (`Imperial/Class/`)

Not acted on — these are the user's own files. Recommendations only, worth
settling before any of it becomes a URL slug or a public module reference.

| Issue | Detail | Suggested fix |
|---|---|---|
| Duplicate | `Causal Modelling` (50 files) and `Causal Modelling in BA` (empty) | Delete the empty one |
| Empty | `Text Analysis for Business` has no files | Remove or populate |
| Likely typo | `Logistic & Supply Chain Analytics` | `Logistics & Supply Chain Analytics` |
| Inconsistent connector | `&` in four names, `and` in two | Pick one — `&` reads better in folder listings |
| Mixed US/UK spelling | `Optimization`, `Visualization` beside `Modelling` | Imperial is UK: `Optimisation`, `Visualisation` |
| Repo hygiene | `Financial Analytics` holds 18,190 files — a Python venv | Add `.gitignore` before this folder goes near git |
| Site mismatch | About page lists 4 modules; 13 have real content | Update `about/index.html` |

## Content strategy

- **Title by the idea, not the course.** "Why ridge shrinks correlated
  predictors together", never "AML Week 4".
- **One concept per note.** If it needs two widgets it is probably two notes.
- **Every note states its assumptions**, shows the derivation rather than
  asserting the result, and ends with the failure modes.
- **Cadence over coverage.** One good note a month beats thirteen modules of
  lecture summaries, and is the only cadence that survives a full-time job.
- **Candidate queue**, ordered by seniority signal — struck through as
  published:
  - ~~Advanced Machine Learning — regularisation (ridge shrinkage)~~ published
  - ~~Causal Modelling — confounding / Simpson's paradox~~ published
  - ~~Optimisation & Decision Models — LP shadow prices~~ published
  - ~~Financial Analytics — portfolio correlation~~ published
  - ~~Deep Learning & Neural Networks — vanishing gradients~~ published
  - Network Analytics — centrality measures disagreeing on the same graph
  - Logistics & Supply Chain Analytics — the √n law of pooled safety stock
  - Data Management & Ethics — the privacy/utility tradeoff in differential privacy
  - Healthcare & Medical Analytics — survival analysis / censored data
  - Machine Learning (general) — bias-variance tradeoff, deliberately not
    duplicating the ridge note's regularisation angle

## v1 scope, and what is deliberately out

**In:** collection and layout, KaTeX, TOC, three component families, one
explorable widget, recall persistence, index page, nav entry, PDF export
scaffolding, one worked note.

**Out, on purpose:** runnable code cells (rejected — Pyodide weight and WebR
immaturity), search, tags/taxonomy, RSS, comments, dark mode. Add them when a
real need appears, not before.

## Follow-ups

1. Verify the Pandoc path once pandoc and LaTeX are installed.
2. Rewrite or replace the seed note — it demonstrates every component and the
   mathematics is verified, but the voice should be the author's.
3. Reconcile the About page's module list with reality.
4. Widen the widget library only as notes demand it; resist building a
   framework before there are three real cases.
