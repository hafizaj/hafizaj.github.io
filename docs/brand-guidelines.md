# HJ Personal Brand Guidelines

**Brand:** Hafizuddin Jaafar - AI & Cloud Solution Architect
**Revision:** 1 · Effective 11 July 2026
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
- **Variants:** ink-on-paper (default); white-on-midnight for dark bands. Never
  amber, never outlined in any other colour.
- **Forbidden:** stretching, recolouring, drop shadows, use over photography.

## Colour palette

| Role | Name | Hex | Usage |
|---|---|---|---|
| Ink | Ink | `#0A1B33` | Headings, primary text |
| Primary | Royal | `#00397B` | Links, section labels, focus rings, key UI |
| Dark field | Midnight | `#042448` | Hero band, contact band, footer |
| Accent | Amber | `#F7941E` | One job per screen: primary CTA, ledger markers, active states |
| Background | Paper | `#F6F8FB` | Page background - cool blue-white, never cream |
| Hairline | Mist | `#D9E2EF` | Borders, rules, dividers |
| Muted | Slate | `#44536B` | Secondary text |

**Rules**

- Amber is scarce by design: at most one amber CTA and the ledger markers per
  viewport. If everything is highlighted, nothing is.
- Dark bands are always Midnight (blue-black), never neutral black - the blue DNA
  must survive in the darks.
- Text on Midnight is white at 100% for headings, 72% for body. Text on Paper is
  Ink or Slate. Royal-on-Midnight is reserved for large decorative type only.
- Minimum contrast: WCAG AA (4.5:1 body, 3:1 large type). Amber is never used for
  body text on Paper (fails contrast); it may carry short labels on Midnight.

## Typography

| Role | Face | Weights | Usage |
|---|---|---|---|
| Display | Schibsted Grotesk | 500, 700 | Headlines, section titles, the monogram |
| Body | Instrument Sans | 400, 500, 600 | Paragraphs, navigation, buttons |
| Utility | IBM Plex Mono | 400, 500 | Eyebrows, dates, metrics, tags, ledger rows |

**Rules**

- Headlines are set tight (tracking −0.02em, leading ≤ 1.1) and sized by a clamp
  scale: h1 `clamp(2.4rem, 6vw, 4.2rem)`, h2 `clamp(1.6rem, 3vw, 2.25rem)`.
- Every number that carries evidence (hours saved, accuracy, counts) is set in the
  utility face - numerals are data, and they should look like data.
- Eyebrows/labels: utility face, 0.72rem, uppercase, letter-spacing 0.18em, Royal
  on Paper / Amber on Midnight.
- Never letter-space the body face. Never use the display face below 1rem.

## Signature device - the evidence ledger

The one element the brand is remembered by. A ledger is a stack of hairline-ruled
rows, each row: an amber `▸` marker, a mono metric, and a plain-language claim.

- Used in the hero (impact summary), experience entries (roles as ledger rows),
  and the contact band (availability row).
- Rows are separated by 1px Mist rules; metrics are right- or left-aligned
  consistently within one ledger, never mixed.
- The ledger is the only place amber repeats. Do not reuse the `▸` marker for
  decoration elsewhere.

## Layout system

- Content column: max-width 72rem (1152px), horizontal padding 1.5rem.
- Section rhythm: 6-7rem vertical padding desktop, 4rem mobile. Alternate Paper
  and White (`#FFFFFF`) fields; Midnight bands open and close the page.
- Cards: 1px Mist border, 12px radius, white fill, shadow only on hover. No
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
- **Photography:** one portrait, straightforward crop, 12px radius, 1px Mist
  border. No filters, no duotones, no browser-chrome mockup frames.
- No stock imagery, no decorative illustration, no emoji as UI icons.

## Motion

- One orchestrated moment: on load, the hero headline fades up and ledger rows
  stagger in (80ms apart). Everything else is micro: 150-200ms hover transitions
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
| Monogram | "HJ" in bordered square; ink or white only |
| Primary colour | Royal `#00397B` |
| Accent | Amber `#F7941E`, one CTA per viewport + ledger markers |
| Dark bands | Midnight `#042448`, never neutral black |
| Background | Paper `#F6F8FB`, never cream |
| Display face | Schibsted Grotesk 500/700 |
| Body face | Instrument Sans 400/500/600 |
| Utility face | IBM Plex Mono 400/500 - all evidential numerals |
| Signature | The evidence ledger (hairline rows, mono metrics, amber ▸) |
| Icons | JS-injected (Iconify), monochrome, no inline SVG |
| Motion | One hero entrance; 150-200ms hovers; reduced-motion respected |
| Voice | First person, quantified, sentence case |
