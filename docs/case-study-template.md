# Case study template

Copy this into `_projects/<slug>.md` and fill it in. The sections after
"What I built" are the ones that separate an architect's write-up from a
project report — they are what a Cloud Solution Architect panel reads for.

Front matter fields: `group` must be one of `ai`, `data`, `automation` — it
decides which section of `/projects/` the card appears in. Numbers that also
appear elsewhere on the site belong in `_data/facts.yml`, not hardcoded here.

```yaml
---
title: ""
description: ""          # one sentence, shows on the card and in search results
category: ""             # e.g. "Fraud detection", "Agentic AI"
group: ""                # ai | data | automation
org: ""
date: YYYY-MM-DD
impact: ""               # the headline metric — a number wherever one exists
impact_label: ""         # what the number means, lowercase, no full stop
tech:
  - ""
---
```

## The problem

What was broken, who felt it, and what it cost. Name the constraint that made
it hard — regulated data, legacy source systems, a reporting deadline that
could not move.

## Constraints

The non-negotiables you designed around: data residency, confidentiality,
existing licences, team skill mix, budget, the systems you were not allowed to
replace. This section is where regulated-industry work earns its credibility —
it explains why the design looks the way it does, and why the code is not
public.

## Architecture

One diagram, then a short paragraph. Keep it in brand: Royal/Indigo strokes,
IBM Plex Mono labels, on a Paper or white ground. Export as SVG to
`assets/diagrams/<slug>.svg` and embed with descriptive alt text:

```html
<img src="/assets/diagrams/<slug>.svg"
     alt="Data flows from SAP into a Python ETL layer, then into ..."
     class="my-8 w-full rounded-xl border border-mist bg-white p-4">
```

## What I built

The components, in the order data moves through them. Name real services and
versions — "Azure Data Factory" beats "cloud pipelines". If a Microsoft service
was used, say which one; a vague claim is worse than no claim in an interview.

## Key decisions

Two or three, each in this shape:

- **Chose X over Y.** Because <the constraint that decided it>. The tradeoff
  was <what you gave up>, which was acceptable because <why>.

This is the highest-signal section on the page. An architect is hired for the
decisions, not the deliverables.

## Security and governance

Identity and access model, where sensitive data rests and who can reach it,
audit trail, and how the thing is monitored once it is running.

## Results

Quantified where possible, honest where not. Prefer "3,200+ hours a year"
over "significant savings"; if a number is an estimate, say so.

## What I would do differently

One or two paragraphs, written with hindsight. Naming the weakness in your own
design reads as seniority, not doubt — and it is the question you will be asked
about this project in every interview, so answer it first.
