# HJ Personal Brand Guidelines

**Brand:** Hafizuddin Jaafar - AI & Cloud Solution Architect
**Revision:** 3 · Effective 11 July 2026
**Scope:** hafizaj.github.io and all personal collateral (CV, slides, social banners)

---

## Brand overview

- The brand communicates one idea: **evidence over claims**. Every statement about
  capability is paired with a verifiable number, system, or outcome.
- The personality is a composite of the subject's real world: enterprise data
  architecture (precision, audit trails) and strategy games (probability, calculated
  aggression). Confident, quantified, never decorative.
- The system is designed to be **lightweight by rule**: no runtime CSS frameworks,
  no raster imagery except the portrait, icons injected by JavaScript on demand.

## Logo / wordmark

- **Primary mark:** the "HJ" monogram - two letters set in the display face inside a
  square with a 2px ink border. No gradients, no rounding beyond 4px.
- **Placement:** top-left of every page header, baseline-aligned with navigation.
- **Clearspace:** minimum 0.5× the square's width on all sides.
- **Variants:** Royal border on Paper/white (default, revision 3); white-on-midnight
  for dark bands. Never amber.
- **Forbidden:** stretching, gradients, drop shadows, use over photography.

## Colour palette (revision 3 - bold, saturated)

| Role | Name | Hex | Usage |
|---|---|---|---|
| Ink | Ink | `#0A1B33` | Headings, primary text |
| Primary | Royal | `#1D4FD8` | Links, one color-block family, key UI |
| Accent | Indigo | `#5B21B6` | Second color-block family, poker/probability register |
| Accent | Ember | `#FF8A00` | CTAs, single-stat highlights - never a full-section fill |
| Dark field | Midnight | `#042448` | Hero band, contact band, footer |
| Background | Paper | `#F6F8FB` | Page background - cool blue-white, never cream |
| Hairline | Mist | `#D9E2EF` | Borders, rules, dividers |
| Muted | Slate | `#44536B` | Secondary text |

**Rules**

- Every full-bleed color block is Royal or Indigo, never both stacked back to
  back - alternate with a Paper/white section between them.
- Ember never fills a full section background; it is a small-area accent only
  (buttons, single stat callouts, underlines).
- Dark bands are always Midnight (blue-black), never neutral black - the blue DNA
  must survive in the darks.
- Text on Midnight, Royal, or Indigo is white at 100% for headings, 75-85% for
  body - never Ink.
- Minimum contrast: WCAG AA (4.5:1 body, 3:1 large type). Ember is never used for
  body text on Paper (fails contrast); it may carry short labels on Midnight or
  fill a button with dark text.

## Typography

| Role | Face | Weights | Usage |
|---|---|---|---|
| Display | Bricolage Grotesque | 600, 700, 800 | Headlines, hero statement, section titles, the monogram |
| Body | Instrument Sans | 400, 500, 600 | Paragraphs, navigation, buttons |
| Utility | IBM Plex Mono | 400, 500 | Dates, metrics, tags, stat labels |

**Rules**

- Headlines are set tight (tracking −0.02em, leading ≤ 1.05) and sized by a clamp
  scale: h1 `clamp(2.75rem, 6.5vw, 5rem)`, h2 `clamp(1.6rem, 3vw, 2.25rem)`.
- Every number that carries evidence (hours saved, accuracy, counts) is set in the
  utility face for small metrics, or the display face at large sizes for the
  Impact Split's headline stat - numerals are data, and they should look bold.
- Eyebrows/labels: utility face, 0.7-0.72rem, uppercase, letter-spacing 0.14-0.18em,
  either a plain label or a solid `.label-pill` (no rotation, no tape).
- Never letter-space the body face. Never use the display face below 1rem.

## Signature device - the Impact Split

The one element the brand is remembered by. An asymmetric two-column, full-bleed
block (roughly 60/40, never 50/50):

- The color side (Royal or Indigo, alternating each time it repeats) carries one
  oversized statistic in the display face plus a short mono label.
- The plain side carries 2-3 sentences of explanation: what the number means and
  why it matters.
- Which side holds the color block alternates left/right each time the module
  repeats, so the rhythm doesn't feel monotonous. Used a small number of times
  per page (homepage: after Work, in Experience, in Finance domain) - it's a
  moment, not a template stamped everywhere.

## Photography

Real photographs (never stock) presented plainly: rounded corners (16px), a
4px accent border in Royal, Indigo, or Ember depending on context, no print
border, no tape, no handwritten caption. A short mono caption may sit beneath
if context is needed.

Dark bands (hero, contact) carry a faint film grain (opacity under 0.06) for
texture.

## Layout system

- Content column: max-width 72rem (1152px), horizontal padding 1.5rem.
- Section rhythm: 6-7rem vertical padding desktop, 4rem mobile. Alternate Paper
  and White (`#FFFFFF`) fields; Midnight bands open and close the page.
- Cards: Mist border with a 4px top accent border (Royal, Indigo, or Ember,
  rotated across a set), 12px radius, white fill, shadow only on hover. No
  glassmorphism, no backdrop blur.
- The page reads as a single recruiter path: thesis → proof → work → history →
  capabilities → person → contact. Navigation is flat anchors; nothing is more
  than one click away.

## Iconography and imagery

- **Icons are injected by JavaScript** (Iconify web component), never inline SVG
  markup and never icon fonts. Brand logos (GitHub, LinkedIn) use their official
  simple-icons glyphs, monochrome, inheriting text colour.
- Icon sizes: 1em inline, 20px in lists, 22px in navigation. One style family per
  page - no mixing filled and outlined sets.
- No filters, no duotones, no browser-chrome mockup frames. See Photography above.
- No stock imagery, no decorative illustration, no emoji as UI icons.

## Motion

- One orchestrated moment: on load, the hero headline and photo fade/rise in
  staggered (80ms apart). Everything else is micro: 150-200ms hover transitions
  on cards and links.
- `prefers-reduced-motion: reduce` disables all entrance animation.
- Nothing moves on scroll except the browser.

## Writing style

- **Voice:** direct, quantified, first person. "I built X; it saved Y hours" -
  never "passionate about leveraging synergies."
- Every capability claim carries a number or a named system. If it can't, cut it.
- Buttons say exactly what happens: "Email me", "See the work", "Read the case
  study". No "Submit", no "Learn more".
- Sentence case everywhere except eyebrows (uppercase by CSS, not by typing).
- Personality is allowed and encouraged in the "Beyond work" register (poker,
  chess) - same precision, lighter subject.

## Performance rules (part of the brand)

- CSS is compiled at build time (Tailwind CLI) and committed; the runtime CDN
  compiler is forbidden.
- Total page weight budget (excluding the portrait): under 150KB transferred.
- Fonts: three families, max five weight files total, `display=swap`.
- No JavaScript frameworks. Vanilla JS only, one file, deferred.

## Quick reference

| Topic | Rule |
|---|---|
| Monogram | "HJ" in bordered square; Royal or white border |
| Primary colour | Royal `#1D4FD8` |
| Secondary colour | Indigo `#5B21B6` |
| Accent | Ember `#FF8A00`, CTAs and single-stat highlights only |
| Dark bands | Midnight `#042448`, never neutral black |
| Background | Paper `#F6F8FB`, never cream |
| Display face | Bricolage Grotesque 600/700/800 |
| Body face | Instrument Sans 400/500/600 |
| Utility face | IBM Plex Mono 400/500 - all evidential numerals |
| Signature | The Impact Split (color-block stat + plain-side explanation, 60/40) |
| Icons | JS-injected (Iconify), monochrome, no inline SVG |
| Motion | One hero entrance; 150-200ms hovers; reduced-motion respected |
| Voice | First person, quantified, sentence case |
