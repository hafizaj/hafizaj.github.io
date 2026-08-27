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
  - ~~Network Analytics — centrality measures disagreeing on the same graph~~ published
  - ~~Logistics & Supply Chain Analytics — the √n law of pooled safety stock~~ published
  - ~~Data Management & Ethics — the privacy/utility tradeoff in differential privacy~~ published
  - ~~Healthcare & Medical Analytics — survival analysis / censored data~~ published
  - ~~Machine Learning (general) — bias-variance tradeoff, deliberately not
    duplicating the ridge note's regularisation angle~~ published
  - ~~Retail Analytics — price elasticity / market basket lift~~ published,
    plus a third Retail note bringing in a modern technique (uplift /
    incrementality modelling) per the user's request to "augment with
    novel techniques... but do not overcomplicate"
  - ~~Energy Analytics — merit order dispatch / the "duck curve"~~ published,
    plus two more Energy Analytics notes given full-module treatment:
    storage arbitrage economics, and capacity factor / LCOE scaling
  - ~~Data Wrangling and Visualization — a visual-perception principle
    (e.g. why truncated/non-zero axes distort trend judgement)~~ published
    as "Data Wrangling and Visualisation" (UK spelling, per the spelling
    table above)

Queue is now empty — 17 notes across 13 modules. The next note is
whatever the author next wants to write up, not a queue item.

## Known landmine: KaTeX auto-render + dollar amounts + Markdown bold

`renderMathInElement` scans each DOM **text node** independently for
`$...$` pairs — it does not see across element boundaries (e.g. a
`<strong>` tag splits one sentence into three separate text nodes). Two
distinct failure modes were found and fixed in the Retail Analytics batch:

1. **kramdown GFM table false-positive.** A prose paragraph with 4+ bare
   `|` characters (e.g. absolute-value notation written as `|ε|` twice in
   one paragraph) can be misparsed as a single-row Markdown table. Fix:
   never write bare `|x|` notation in prose outside a widget's raw-HTML
   region — use `\lvert x \rvert` inside `$...$` instead.
2. **Cross-node dollar-sign mispairing.** A bare, unbolded `$10` sitting in
   the *same* text node as a legitimate `$\lvert\varepsilon\rvert=5$` math
   span produces an odd count of `$` in that node, causing auto-render to
   pair the wrong ones and swallow the intervening prose as garbled
   "math" (KaTeX happily typesets plain English words as concatenated
   italic single-letter variables — no error is thrown, so this fails
   silently, not loudly).
   **The fix, and the rule for every future note:** always wrap a bare
   currency figure in Markdown bold, e.g. `**$10**` not `$10` — this
   isolates it inside its own `<strong>` text node so it can never
   contaminate an adjacent inline-math span's dollar count. Every
   shipped note follows this convention already; keep following it.

Verification method that caught both: render the built HTML, count
`<table>` tags against the intended count, and grep the rendered output
for the target math expression rather than trusting a screenshot alone —
the screenshot for the second bug still looked "mostly fine" at a glance
and needed the actual rendered-text diff to diagnose precisely.

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

## Visual mark system (added 26 Aug 2026)

Each note's `module` front-matter value and each project's `title` map to a
custom abstract mark — flat, solid-color line/shape art generated in Canva,
strictly in the site's own palette (no gradients, shadows, 3D, text, or
stock photography — this was chosen over raw stock imagery specifically to
hold the brand guideline's "no raster imagery except the portrait" rule in
spirit while still making the page feel less flat).

- `_data/module_marks.yml` — `module` string → mark slug (11 marks, one per
  Imperial module used across the notes).
- `_data/project_marks.yml` — `project.title` string → mark slug (4 marks,
  one per live `/work/` project).
- Assets live together in `assets/images/module-marks/*.png` (1100×1100
  source, cropped by CSS `aspect-ratio` per placement — 2:1 on index/card
  thumbnails, 3:1 on individual page header banners).
- Rendered on four surfaces: the notes index cards, individual note page
  headers (`_layouts/note.html`), the `/work/` project cards
  (`_includes/project-card.html`), and individual project page headers
  (`_layouts/project.html`) — all via the same `{% assign mark =
  site.data.X[key] %}{% if mark %}<img ...>{% endif %}` pattern, so a
  missing lookup entry just omits the image rather than breaking the page.
- Lookup tables avoid touching per-note/per-project front matter — new
  content only needs an entry added to the relevant data file, and a new
  mark generated to match, to pick up the treatment.

## Professional/editorial note track (added 26 Aug 2026)

Notes no longer come only from Imperial coursework. A second source now
exists: field notes from the author's day-to-day Microsoft role (Cloud
Solution Architect, AI Business Solutions) and its AB-100 study curriculum.
Two front-matter fields distinguish the track without a second layout:

- `provenance: professional` — swaps the note footer's attribution line
  ("Written from my own understanding while working through Microsoft's
  AB-100 curriculum and my role in AI Business Solutions... No proprietary
  Microsoft material is reproduced here") and the header's context line
  ("From my AB-100 study, Microsoft AI Business Solutions" instead of
  "Studied in {module}, Imperial College London").
- `style: editorial` — adds a byline ("By Hafizuddin Jaafar") and an
  `note-editorial` class on the prose body for a first-person, field-note
  register distinct from the derivation-led Imperial notes (pull quotes,
  info-card groupings instead of always leaning on the widget/reveal
  pattern).

First three: "Microsoft Foundry is one platform pretending to be three
products," "Before you build an agent, decide whether you should," and
"Copilot Studio didn't need a new protocol until agents had to talk to
each other" — module `"Azure AI Architecture"`, mark slug `azure`. Sourced
from real, cited Microsoft documentation (Copilot Studio docs, Microsoft
Cloud Blog), not invented — this is the professional counterpart to the
"never fabricate project internals" rule that governs the About/work
pages: field notes describe how the platform works and where design
sessions actually go sideways, not invented personal outcomes.

The notes-index intro copy ("Much of this comes out of my MSc...") was
updated to credit both sources once this track existed — a page that
frames itself as exclusively MSc-sourced while 3 of 20 notes come from
somewhere else is the same kind of staleness as the About/homepage hero
copy not mentioning the Microsoft role.

## De-templatized note voice (added 27 Aug 2026)

All 17 Imperial notes originally shared identical scaffolding: 16/17
titles started with "Why", every note had a callout box literally
labeled "The one thing to hold on to" and another "Where this bites",
11/17 used the section heading "A deliberately awkward [noun]" verbatim,
and most opened with the same "X is usually taught/explained as Y — but
that's incomplete" contrarian hook. Individually each note read fine;
back-to-back the template became louder than the content, and the user
flagged notes as "sounding too similar."

Fix was purely editorial — titles, opening hooks, section headings, and
callout labels rewritten per-note to be specific to that note's actual
content and to vary in rhetorical style (surprising-fact-first,
question-first, number-first, scenario-first), while every derivation,
verified number, and widget was left untouched. Piloted on 3 notes across
3 modules first (ridge/AML, centrality/Network Analytics, warehouse
pooling/Logistics) and confirmed with the user before the remaining 14
were done the same way. `## The setup` as the first section heading was
deliberately kept consistent across notes — it's neutral wayfinding text,
not a voice tic, and some structural consistency helps a reader navigate
a blog with many entries.
