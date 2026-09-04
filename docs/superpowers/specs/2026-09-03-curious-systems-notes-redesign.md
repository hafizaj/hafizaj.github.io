# Curious Systems: Notes redesign

**Date:** 3 September 2026
**Status:** Design direction approved; written specification awaiting review
**Scope:** `/notes/`, note collection pages, individual note pages, and the
editorial quality of all published notes

This specification supersedes the visual, information-architecture, and
editorial decisions in `2026-08-26-notes-blog-design.md`. The earlier document
remains the record for the original collection architecture, academic-integrity
constraints, widget registry, and PDF pipeline unless this specification
explicitly changes them.

## Decision

Redesign Notes as **Curious Systems**, a combination of the two approved visual
directions:

- **Bold Systems Lab supplies the rules:** the existing HJ monogram, navigation,
  colour palette, typography, evidence-led voice, and technical credibility stay
  intact.
- **Curiosity Cabinet supplies the energy:** Notes gains stronger composition,
  overlapping module artwork, more visual collection identities, prominent
  interactive previews, and playful asymmetry.

This is not a separate publication brand. It is a more expressive register of
the existing portfolio brand.

The governing principle is:

> **Playful around the content. Calm where people read.**

## Goals

1. Make the Notes landing page feel like an authored body of work rather than a
   corporate index.
2. Make it obvious where a first-time reader should begin and how notes relate
   to one another.
3. Preserve the mathematical depth, interactive widgets, active recall, and
   academic-integrity safeguards already present.
4. Rewrite every published note so it is easier to follow without making every
   note follow the same visible template.
5. Make evidence verifiable. Important factual and platform claims must point to
   accessible primary or authoritative sources.
6. Remove the repetitive structures and stock phrasing that make the current
   corpus read as AI-generated.
7. Keep the implementation lightweight, semantic, accessible, and consistent
   with the existing Jekyll and Tailwind build.

## Non-goals

- No sitewide rebrand.
- No cream background, serif typeface, separate Notes logo, or new global
  navigation.
- No CMS, JavaScript framework, database, comments, authentication, or runtime
  search service.
- No publication of lecturer-authored material, assessment questions, course
  solutions, proprietary Microsoft material, or unsupported personal outcomes.
- No simplification that removes the derivations, assumptions, or limitations
  that make a technical note trustworthy.
- No arbitrary commitment that every note must contain a widget, callout, or
  fixed number of recall questions.

## Existing-system audit

The existing architecture is worth preserving:

- 20 published Markdown notes across 14 modules.
- Three collection pages: Azure AI Architecture, Retail Analytics, and Energy
  Analytics.
- Client-side KaTeX rendering.
- Generated table of contents.
- Native-details derivations and active-recall cards with local persistence.
- Seventeen lazily loaded interactive widgets.
- A shared note layout and print/PDF semantics.

The principal problems are editorial and navigational:

1. All 17 academic notes use a section titled **“The setup.”**
2. Those same notes largely repeat one key callout, one warning callout, one
   widget, and four recall questions in the same order. The components are useful
   individually, but the identical cadence makes the corpus feel generated.
3. The three professional field notes use a second, similarly repeated pattern.
4. Every note lists two or three references, but the corpus contains no source
   URLs. Readers cannot verify a claim without searching for the citation.
5. The index labels its second tier “Every other note” and omits the nine notes
   already represented by collection cards. This reduces page height but makes
   “browse all” behavior unclear.
6. The summaries are informative but often too long for scanning, especially
   when clamped to one line.
7. Widgets demonstrate the site’s strongest differentiator, but a visitor sees
   no interaction until opening an article.
8. Several academic-note dates were deliberately spaced within their teaching
   terms to create stable sort order. They are not publication dates and should
   not be presented to readers as if they were.

These findings are acceptance criteria for the redesign, not optional cleanup.

## Brand system

### What stays unchanged

Use the current tokens and type families:

| Role | Existing token |
|---|---|
| Ink | `#0A1B33` |
| Royal | `#1D4FD8` |
| Indigo | `#5B21B6` |
| Ember | `#FF8A00` |
| Midnight | `#042448` |
| Paper | `#F6F8FB` |
| Mist | `#D9E2EF` |
| Display | Bricolage Grotesque |
| Body | Instrument Sans |
| Utility | IBM Plex Mono |

The HJ monogram, global header, global footer, focus treatment, and reduced-motion
rules remain shared with the rest of the portfolio.

### Notes-specific composition

Curious Systems adds a compositional vocabulary, not a second token system:

- Module marks may overlap their containers, use varied crops, and appear in
  circles or offset rounded rectangles.
- Midnight, Royal, Indigo, White, and Paper sections may alternate with thin Ink
  rules.
- Ember remains a small-area accent for labels, controls, and a single spotlight
  panel. It does not become a full-page background.
- Collection artwork may be rotated by at most six degrees. Text and controls
  remain level.
- Borders stay crisp. Shadows are reserved for genuinely layered artwork and
  hover elevation.
- No gradients, glass effects, stock illustration, emoji icons, faux handwriting,
  decorative browser chrome, or arbitrary floating shapes.

The result should feel composed by an editorial designer, not decorated by a UI
generator.

## Information architecture

### 1. Notes landing page

The landing page has five sections.

#### A. Curious Systems hero

A Midnight hero sits directly below the unchanged global navigation.

Left side:

- Existing “Technical notes” label in Ember.
- Headline: **“Open an idea. Move the pieces.”**
- A concise explanation of the reader contract: first-principles explanations,
  open derivations, and movable parameters.
- Primary link to the current featured note.
- Secondary link to the complete index.

Right side:

- A layered composition using three existing module marks.
- A small evidence stamp showing the actual subject and interaction counts.
- Decorative images are empty-alt because the same information is expressed in
  text.

The hero must not infer a false interaction count. Counts are derived from the
collection at build time.

#### B. Featured note

The privacy-budget note is explicitly marked `featured: true` for this release.
It is already one of the newest notes, has a strong question-led title, and
provides the interaction used in the next section.

The feature includes:

- Topic, reading time, difficulty, and provenance.
- A short title and one-sentence takeaway.
- One real visual or interaction preview.
- A link whose text states what opens.

Only one published note may be featured. A standard-library Ruby validation
script runs before the Jekyll build and exits non-zero unless exactly one
published note is featured.

#### C. Collections

The three existing deep subjects remain the first collection set. Each card uses
its module mark, a distinct approved colour treatment, note count, concise
description, and a clear “Start with …” recommendation.

Collection cards are entry points, not substitutes for the complete index. The
initial start notes are:

- Azure AI Architecture: “Before you build an agent, decide whether you should.”
- Retail Analytics: “Confidence lies about which products sell each other.”
- Energy Analytics: “A 100 MW plant rarely delivers 100 MW.”

#### D. Interaction spotlight

The landing page mounts the existing privacy-budget widget. Its single control
and visible linear trade-off are understandable without requiring the article’s
full derivation. It must answer a question before asking the reader to open the
full note.

The preview:

- Has a sentence explaining what to change.
- Has a useful no-JavaScript fallback.
- Links to the full note for the derivation and caveats.
- Reuses the existing widget module rather than duplicating its calculation.

#### E. Browse every note

Replace “Every other note” with **“Browse every note.”** All 20 notes appear,
including notes already represented by collection cards.

The initial view follows the unique `index_order` values curated in note front
matter. A native subject select narrows by module. Button groups narrow by
provenance (field notes or MSc notes) and format (interactive or reading-only).

Button filters use `aria-pressed`. All controls update a live result count,
preserve a useful unfiltered no-JavaScript list, and do not change URLs in v1.
Full-text search is deliberately excluded while the corpus remains small.

Each row displays only information useful for choosing:

- Topic.
- Title.
- One-sentence takeaway.
- Reading time, difficulty, provenance, and interaction indicator.

The current long summary is no longer clamped as a substitute for a takeaway.

### 2. Collection pages

Collection pages become short guided shelves:

- Strong colour header with offset module artwork.
- Plain-language description of the questions the collection answers.
- A designated “Start here” note.
- Remaining notes in a deliberate reading order, not merely reverse date order.
- Related subjects at the bottom when a genuine conceptual bridge exists.

Reading order is stored in the existing `note_hubs.yml`, where it can be reviewed
as an editorial decision. It is not inferred from dates. Entries use note slugs,
not titles or full URLs:

```yaml
"Energy Analytics":
  url: "/notes/energy-analytics/"
  teaser: "Price formation, capacity, and storage economics in real electricity markets."
  start: "why-nameplate-capacity-overstates-what-a-plant-delivers"
  order:
    - "why-nameplate-capacity-overstates-what-a-plant-delivers"
    - "why-solar-can-collapse-the-electricity-price-to-zero"
    - "why-battery-arbitrage-needs-a-price-spread-not-just-a-gap"
```

Validation requires every published note belonging to a configured hub module to
appear exactly once in that hub’s order, and requires `start` to name one of
those notes.

### 3. Individual note pages

Article pages use more visual energy in the header and less in the reading body.

The header contains:

- Topic and provenance.
- Title.
- One-sentence takeaway.
- Reading time and difficulty.
- Honest publication and update dates, plus professional review date where
  applicable.
- Study or professional context as a separate provenance line.
- Prerequisites rewritten as “You only need …”.
- Offset module artwork on larger screens and a restrained banner crop on small
  screens.

The article body remains a comfortable single reading column. The existing
desktop contents/recall rail remains, but mobile receives a compact “On this
page” disclosure after the header.

At the end:

- A concise “What to remember” section written specifically for that note.
- Sources and further reading.
- The existing academic or professional provenance disclaimer.
- One relevant next note and a link back to the collection or full index.

## Editorial redesign of all notes

Every published note receives an individual editorial pass. This is a content
revision, not a global search-and-replace.

### Reader contract

Each note must let a technically curious reader answer these questions quickly:

1. What question is this note answering?
2. What is the answer in one sentence?
3. Why should I believe it?
4. What assumptions make it true?
5. Can I see or manipulate the mechanism?
6. Where does the explanation stop being reliable?
7. What should I read next?

### Required front matter

Add:

```yaml
takeaway: "One sentence that answers the title."
level: foundation | applied | advanced
featured: false
source_schema: 2
date: 2026-08-26
updated: 2026-09-03
reviewed_on: 2026-09-03 # required for every professional note
index_order: 1
```

Keep:

```yaml
title:
topic:
module:
reading_time:
summary:
prerequisites:
provenance:
style:
```

`summary` remains search/SEO copy. `takeaway` is shorter and exists to help a
reader decide whether to open the note. A takeaway is at most 140 characters and
a summary is at most 280 characters.

`date` records the first commit that introduced the note and remains the
Jekyll-compatible publication field rendered by existing templates. `updated`
records the date of a substantive content revision. The old synthetic
teaching-term dates are removed. If teaching context matters, it is expressed as
prose or a separate honest term label, never as a fabricated day-level
publication date.

`index_order` is a unique positive integer: lower values display first in the
curated complete index. It is not presented as chronology. New notes receive an
explicit position during editorial review rather than relying on same-day commit
timestamps.

`reviewed_on` is required for every professional note and is displayed beside
`updated`. The validator emits a visible warning when it is more than 180 days
old. A stale review date does not pretend that a platform claim is current.

### Flexible article shape

The following ideas must appear, but they do not require identical headings or
order:

- A concrete opening problem, observation, or decision.
- A plain-English answer before the full derivation.
- Definitions introduced when first needed.
- A worked example or platform scenario.
- Assumptions and failure modes.
- A note-specific closing takeaway.

Remove the universal **“The setup”** heading. Replace it with a heading specific
to the note’s actual example.

Components become optional:

- Use a key callout only when one idea genuinely deserves isolation.
- Use a warning callout only for a real misuse or boundary.
- Use two or three strong recall questions by default; add more only when each
  tests a distinct idea.
- Keep all 17 existing widgets in this release. Revise a widget’s caption,
  controls, or placement when needed, but do not remove it during the editorial
  pass.
- Do not force professional field notes to imitate the academic-note structure.

This preserves a shared reader contract without creating a visible content
template.

### Voice: recognisably human, not “AI-coded”

The editorial pass must remove:

- Repeated “X is not Y; it is Z” constructions.
- Repeated paragraph-ending verdicts such as “That is the point.”
- Unnecessary em dashes when a period or colon is clearer.
- Inflated certainty: “obviously,” “clearly,” “simply,” or “always” without
  support.
- Generic transitions such as “In practice” when the next sentence can name the
  situation directly.
- Symmetrical three-part lists written for rhythm rather than meaning.
- Identical openings, heading sequences, callout order, and recall counts.
- Claims that sound like personal field experience unless they are true and
  publishable.

The desired voice is direct, specific, and willing to state uncertainty. Sentence
length and paragraph rhythm should vary naturally. Examples should use concrete
numbers or named systems when those details improve understanding.

The pass must not “humanise” text by adding fake anecdotes, slang, filler, or
deliberate grammatical mistakes.

### Clarity rules

- Define a specialist term on first use.
- Introduce the question before the equation.
- Explain what each symbol means near its first equation.
- Follow a derivation with a plain-English interpretation.
- Give tables descriptive captions or preceding sentences.
- State units on controls, readouts, axes, and worked examples.
- Avoid unexplained acronyms. Professional notes expand product and protocol
  names on first use.
- Keep paragraphs focused on one claim.
- Preserve UK spelling already used by the site.

## Source and evidence model

### Source quality

Each factual, mathematical, or product-behavior claim must be supported by the
best available source:

1. Original paper, standard, or official product documentation.
2. Authoritative textbook or institutional report.
3. High-quality secondary explanation only when a primary source is inaccessible
   or unsuitable for the reader.

Blogs, product marketing, and unsourced summaries cannot be the sole support for
a technical claim.

Professional Microsoft notes prioritise current Microsoft Learn documentation
and relevant open standards. First-party product documentation is primary
evidence for product-behavior claims; product marketing cannot be its sole
support. The notes distinguish current product behavior from architectural
opinion and record the date on which documentation was reviewed.

### Structured source front matter

Replace prose-only source strings with:

```yaml
sources:
  - id: dwork-2006
    author: "Dwork, McSherry, Nissim & Smith"
    title: "Calibrating Noise to Sensitivity in Private Data Analysis"
    publication: "TCC 2006"
    year: 2006
    url: "https://doi.org/10.1007/11681878_14"
    supports: "The Laplace mechanism and sensitivity calibration."
```

Required fields are `id`, `title`, `url`, and `supports`. Author, organisation,
publication, and year are included where applicable.

IDs are stable, short, and unique within a note.

### Claim-level references

Non-obvious factual claims and formal definitions receive an inline source link
to the relevant entry. Authors use normal Markdown with a stable source anchor:

```markdown
Sequential composition adds the individual privacy losses
[1](#source-dwork-roth){:.source-ref}.
```

The visible number follows the source’s position in front matter, while the link
target uses the stable ID. The validator confirms that every reference target
exists and that its displayed number matches that source’s position. A claim may
cite more than one source.

The source section renders:

- Linked title.
- Author or organisation.
- Publication and year when available.
- A short “Used for” explanation from `supports`.
- External-link indication and accessible link text.

Links are verified during the editorial pass. A source that is inaccessible may
remain only when it is the canonical citation and enough bibliographic detail is
provided to locate it; at least one accessible source must support the reader’s
path through the same claim.

The reviewer follows each URL with a GET request equivalent to
`curl --location --fail --silent --show-error --output /dev/null <url>`, records
the resolved URL and access result in the ledger, and manually checks sources
whose hosts block automated clients. External availability is evidence recorded
during review, not a flaky deployment gate.

The PDF export reads the structured `sources` metadata, appends the same numbered
source list, and preserves native Markdown source links. This behavior is
implemented in the existing Pandoc/Lua path rather than through Liquid includes,
which Pandoc never evaluates.

### Mathematical and factual review

For each note:

1. Recalculate every worked numeric example independently.
2. Confirm notation is consistent from prose through widget.
3. Compare formal claims with the cited source.
4. Check that limitations do not overstate what the result proves.
5. Confirm widget defaults reproduce the numbers in the article.
6. For time-sensitive platform notes, compare the article with current official
   documentation and add `reviewed_on`.

No unsupported claim is preserved merely because it already exists.

Results are recorded in `docs/notes-review-ledger.yml`. Each note records:

- Reviewer and review date.
- Arithmetic and widget parity status.
- Each source ID, access date, accessibility status, and archive URL when used.
- Any canonical paywalled source and the accessible corroborating source.
- Unresolved author confirmations.

Unverifiable first-person field claims are converted to sourced, bounded
statements unless the author explicitly confirms that they are true and
publishable. Required confirmations remain visible in the ledger and block that
note’s completion.

## Components and implementation boundaries

### Templates

- `notes/index.html`: new landing-page composition and complete browse index.
- `_layouts/note-hub.html`: guided collection shelf.
- `_layouts/note.html`: expressive article header, mobile contents disclosure,
  structured sources, and next-note navigation.
- `_includes/note-card.html`: concise browse row.
- `_includes/note-hub-card.html`: visual collection entry point.
- New includes should be introduced only for genuinely repeated semantic units,
  such as a source citation or featured-note panel.

During migration, the note layout supports both existing source strings and
structured source objects. A note opts into strict validation with
`source_schema: 2` only when its content and source objects are migrated together.
The compatibility branch is removed after all 20 notes reach schema 2.

### Styling

Notes-specific component classes live in `_tailwind/input.css` and compile into
the committed CSS through the existing `npm run css` command.

Use semantic class names for repeated components. One-off page composition may
continue using Tailwind utilities. Do not create a second stylesheet or runtime
theme.

### JavaScript

Keep vanilla JavaScript.

- Generalise the existing widget loader so the landing-page spotlight and article
  widgets use the same registry and implementation.
- Add a small index controller only for filters and result counts.
- Preserve readable content when JavaScript is disabled.
- Do not add a client-side framework or duplicate note metadata in JavaScript.

### Data

- Note front matter owns note metadata.
- `note_hubs.yml` owns collection descriptions, start note, and reading order.
- Existing module-mark lookup remains the source for artwork.
- Counts are derived at build time wherever Liquid can calculate them.
- `scripts/validate-notes.rb` uses Ruby’s standard libraries and validates note
  metadata, source references, feature count, index order, and hub completeness.
- The Pages workflow runs `ruby scripts/validate-notes.rb` immediately before
  `bundle exec jekyll build`.
- The implementation regenerates and commits `assets/css/tailwind.css` with
  `npm run css`; production continues to deploy the committed stylesheet.

## Responsive behavior

### Desktop

- Hero uses an asymmetric text/art split.
- Collection cards use varied artwork crops within a consistent grid.
- Article contents and recall controls remain in a sticky side rail.

### Tablet

- Hero artwork stays visible but reduces overlap.
- Collection cards may use two columns.
- Metadata wraps without separating labels from their values.

### Mobile

- Global navigation remains unchanged.
- Hero becomes one column; artwork becomes a bounded composition below the copy.
- No rotated asset may cause horizontal overflow.
- Collection cards stack.
- Filters wrap or use a labelled horizontal scroller with visible focus.
- “On this page” becomes a disclosure before the article body.
- Tables, code, and display maths scroll inside their own containers.

The mobile design is recomposed, not a scaled-down desktop screenshot.

## Accessibility

- Preserve a single page `h1` and logical heading order.
- Decorative module-mark instances use empty `alt`; meaningful instances have
  concise alt text.
- Filter state uses `aria-pressed` and an `aria-live="polite"` result count.
- Native `<details>` remains the disclosure primitive.
- All controls work by keyboard and show a visible focus indicator.
- Text meets WCAG AA contrast. Ember is not used for body text on Paper.
- Motion is limited to the existing entrance moment and short hover transitions.
- `prefers-reduced-motion` removes entrance and artwork movement.
- Touch targets are at least 44 by 44 CSS pixels.
- The full reading and source experience remains available without JavaScript.

## Performance

- No new JavaScript framework or runtime CSS.
- No new raster asset family is required; reuse the existing module marks.
- Load only the one widget used by the landing-page spotlight.
- Lazy-load below-the-fold module artwork.
- Keep the existing font families and weights.
- Avoid layout shift by declaring image dimensions or aspect ratios.
- Preserve a 150 KB compressed transfer budget for first-party HTML, CSS, and
  JavaScript on the Notes landing page, excluding fonts and existing image
  assets. Measure the production build using `curl --compressed` and file sizes
  for first-party resources.
- The live privacy-budget spotlight is part of this release. If the page exceeds
  the budget, reduce or defer unrelated presentation code; do not silently
  replace the approved interaction with a static image.

## Implementation sequence

1. Build dual-schema source rendering, source-reference styling, new article
   metadata, and the standard-library Ruby validator.
2. Migrate and review a two-note pilot: the privacy-budget academic note and
   “Before you build an agent” professional note.
3. After the pilot gate, build the landing page, widget spotlight, browse
   controls, and collection-page composition against the final metadata contract.
4. Migrate notes in coherent editorial batches of three to five: remaining
   professional notes; modelling and statistics; operations and energy; retail
   and causal decision-making. A batch includes metadata, sources, prose,
   arithmetic, widgets, and review-ledger entries.
5. Remove the old source-schema compatibility branch after all 20 notes pass.
6. Apply final responsive and accessibility behavior.
7. Regenerate and commit the compiled Tailwind stylesheet.
8. Wire validation into the Pages workflow, build Jekyll, and run content,
   interaction, PDF, performance, and visual checks.

All 20 existing notes are in scope for this release. New notes, full-text search,
comments, and additional widget types are not.

## Review gates during implementation

The user asked for review as work progresses. Implementation therefore uses four
explicit gates:

### Gate 1: Metadata and source model

- Review one migrated academic note and one professional note.
- Confirm citation markup, source quality, takeaway length, and difficulty labels
  before migrating the remaining notes.

### Gate 2: Editorial batches

- Review each three-to-five-note batch for repeated scaffolding and unsupported
  claims before starting the next batch.
- Update the review ledger with arithmetic, source, widget, and clarity checks.
- Do not proceed with a note that has an unresolved factual question.

### Gate 3: UI implementation

- Review the landing page, one hub, one mathematical article, and one field note
  at desktop and mobile widths.
- Compare against the approved Curious Systems direction and current portfolio
  shell.

### Gate 4: Final verification

- Run the full site build.
- Test filters, widget mounting, KaTeX, contents navigation, recall persistence,
  mail links, and no-JavaScript fallbacks.
- Check internal links and every external source URL.
- Export the migrated pilot academic note to PDF and confirm claim references and
  structured sources appear correctly.
- Run an independent code and content review of the final diff.
- Resolve high-confidence findings before completion.

## Validation

Minimum automated or scripted checks:

- `npm run css`
- `bundle exec jekyll build`
- `ruby scripts/validate-notes.rb`
- Every published note has parseable `date` and `updated` values, a unique
  positive `index_order`, `takeaway`, `level`, `source_schema: 2`, and at least
  two sources.
- Every structured source has a non-empty `id`, `title`, `url`, and `supports`.
- Every inline source reference resolves to a source ID on the same page.
- Exactly one published note is featured.
- Every professional note has a parseable `reviewed_on`; dates older than 180
  days emit a validation warning.
- No published academic note retains the generic `## The setup` heading.
- No two published notes share the same ordered `h2` heading sequence. The
  validator reports any exact `h2` reused across more than three notes for
  editorial review.
- Every hub start slug exists, and every note belonging to a configured hub
  appears exactly once in its order.
- Built pages contain no broken internal Notes links.
- KaTeX still renders representative inline and display equations.
- Wide maths, tables, and code do not cause document-level horizontal overflow.
- The landing-page widget and the same widget inside its note produce matching
  readouts for the same input.
- The production PDF for the pilot academic note contains its numbered source
  references and source list.

Manual browser checks:

- Landing page at narrow mobile, tablet, laptop, and wide desktop widths.
- Keyboard-only traversal of navigation, filters, disclosures, recall controls,
  widget controls, citations, and next-note links.
- Reduced-motion behavior.
- No-JavaScript readability.
- One screen-reader-oriented pass over landmark and heading structure.

## Acceptance criteria

The redesign is complete when:

1. The global portfolio remains recognisably the existing HJ website.
2. Notes has the approved Curious Systems energy without a separate brand.
3. A new reader can identify a starting note and reach all 20 notes without
   understanding the module structure.
4. Every note answers its title early, defines required terminology, and states
   assumptions and limitations.
5. The 17 academic notes no longer share a visible template or universal “The
   setup” heading; no two notes have the same ordered section-heading sequence.
6. Source links are accessible, claim-level references resolve, and professional
   notes have a review date.
7. Widgets, recall, contents navigation, KaTeX, and progressive enhancement still
   work.
8. Desktop and mobile pages match the approved art direction and have no
   horizontal overflow.
9. The site builds successfully, each review-ledger entry is complete, and
   independent review finds no unresolved high-confidence defects or unsupported
   claims.
