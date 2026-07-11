# Bold redesign (revision 3) — design spec

**Status:** Approved by user, ready for implementation planning
**Supersedes:** The "human layer" (revision 2) tape labels, handwritten Caveat
annotations, and photo-print tape-strip treatment. Real photography is kept
but reframed (see Photography below). The evidence-ledger component is
retired as the signature device in favor of the Impact Split (below); the
`.ledger`/`.ledger-row` CSS may be deleted once no page references it.

---

## 1. Positioning

Inspiration: the visual confidence of a classmate's Framer portfolio
(ankitakokkera19.framer.website) — saturated color blocking, bold rounded
type, playful-but-professional card layouts. We are **not** copying her
layout, her pastel palette, her sparkle/cloud iconography, or her card-grid
structure. We're taking the underlying principle — commit hard to color and
type, don't hedge — and expressing it through a different structural idea
(the split-screen / alternating color-block rhythm) and a different palette
(saturated blue + orange + indigo, not pastel).

The brand still communicates evidence over claims (every capability claim
carries a number or a named system), but the delivery is now confident and
saturated rather than restrained and hairline-ruled.

## 2. Color palette (revision 3)

| Role | Name | Hex | Usage |
|---|---|---|---|
| Ink | Ink | `#0A1B33` | Body text on light backgrounds |
| Primary | Royal | `#1D4FD8` | Primary UI, links, one color-block family (was `#00397B` — now more saturated) |
| Accent | Indigo | `#5B21B6` | Second color-block family, bold highlights, the Impact Split's color side alternates between Royal and Indigo |
| Accent | Ember | `#FF8A00` | CTAs, single-stat highlights, sparingly (was `#F7941E` — now brighter) |
| Dark | Midnight | `#042448` | Footer band only (no longer the hero background) |
| Background | Paper | `#F6F8FB` | Light section background |
| Hairline | Mist | `#D9E2EF` | Borders, dividers on light sections |
| Muted | Slate | `#44536B` | Secondary text on light backgrounds |

Rules:
- Every full-bleed color block is either Royal or Indigo, never both stacked back-to-back — alternate with a Paper/white section between them.
- Ember never fills a full section background; it is a small-area accent only (buttons, single stat callouts, underlines).
- Text on Royal or Indigo blocks is white at 100% for headings, 80% for body — never Ink.
- Minimum contrast WCAG AA holds for all pairings; Ember-on-white text is still forbidden (fails contrast), Ember only appears on Midnight/Royal/Indigo backgrounds or as a filled button with dark text.

## 3. Typography

| Role | Face | Weights | Usage |
|---|---|---|---|
| Display | Bricolage Grotesque | 600, 700, 800 | Headlines, hero statement, section titles — replaces Schibsted Grotesk |
| Body | Instrument Sans | 400, 500, 600 | Paragraphs, navigation, buttons (unchanged) |
| Utility | IBM Plex Mono | 400, 500 | Stat labels, dates, tags, captions (unchanged) |

Bricolage Grotesque is the "interesting font" — it has more character than a
neutral grotesk (subtle organic curves, distinct at large sizes) while
staying legible and professional at small ones. Caveat (handwriting face) is
retired; it belonged to the scrapbook aesthetic this revision replaces.

Scale: hero headline `clamp(2.75rem, 6vw, 5rem)`, weight 800, tracking
-0.02em, leading 1.05. Section titles `clamp(2rem, 4vw, 3rem)`, weight 700.

## 4. Signature device: The Impact Split

The one recurring, memorable layout module. An asymmetric two-column block
(60/40 split, never 50/50):

- **The color side** (Royal or Indigo, alternating each time the module
  repeats) contains one oversized statistic in white or Ember, set in the
  display face, plus a one-line mono-face label underneath.
- **The white side** contains 2-3 sentences of plain-language explanation —
  what the number means, why it matters.
- The color side switches left/right each time the module repeats, so the
  page doesn't feel monotonous.

Used exactly 3 times on the homepage: the hero, once mid-page (after Work),
and once in Experience. Not used on About/Poker/Chess — it's a homepage
signature, not a page template stamped everywhere.

## 5. Homepage layout

1. **Hero** — split-screen. Left: bold capability statement as h1 (e.g. "I
   build AI systems that scale — from fraud detection to risk platforms at
   central banks"), supporting one-line context, two CTAs (Email me / See
   the work). Right: portrait photo, simple rounded-corner treatment (no
   tape/print styling — see Photography), with a small floating stat chip
   overlapping the corner (Ember background, one number).
2. **Proof strip** — unchanged in spirit (logos of AstraZeneca, Central
   Bank of Malaysia, Imperial, UCLA) but restyled: white background, mono
   labels, no handwritten note.
3. **Work** — section title, then project cards on Paper background (cards
   keep white fill, Mist border, but each gets a 3px top border in Royal or
   Indigo, alternating).
4. **Impact Split #2** — one big stat (e.g. hours eliminated) with
   explanation, full-bleed Indigo or Royal.
5. **Experience** — Impact Split #3 for the lead role's headline metric,
   then the other two roles as a simple stacked list (mono date + bold
   title + one-line description) on Paper.
6. **Toolkit** — four columns, unchanged content, restyled with a colored
   left border per column (rotating Royal/Indigo/Ember/Slate) instead of
   the plain border-l-2 Royal used now.
7. **Finance domain** — same ledger-of-facts content, restructured as a
   simple two-column list (mono label + description) since the ledger
   component is retired; keep the content, drop the `▸` marker styling.
8. **Beyond work** (poker/chess teaser cards) — same two cards, restyled
   with the new border/color system, hiking photo kept as a simple rounded
   image (no tape/print).
9. **Contact** — Midnight band (this is the one place Midnight survives
   outside the footer, since it bookends the page), Ember CTA.

## 6. Photography treatment (replaces photo-print/tape)

Real photos (`pic_raya.jpg`, `pic_hiking.jpg`) are kept — they're a genuine
differentiator — but restyled to match the bold system instead of the
scrapbook system:

- Simple rounded corners (16px), no white print border, no tape strip, no
  handwritten caption.
- A thin 3px accent border in Royal or Indigo (alternating by page/section).
- Optional small caption in mono face (not handwriting) if context is
  needed, e.g. "Open to senior AI, data & architecture roles" stays as
  plain mono text beneath, as it does today.

## 7. Component treatment

- **Cards:** white fill, Mist border, 12px radius, colored top border (3px,
  alternating Royal/Indigo) as the primary "bold" signal. Shadow on hover
  only, as before.
- **Buttons:** primary CTA is Ember fill with Midnight/Ink text, bold,
  rounded 8px. Secondary CTA is outlined (Royal or white border depending
  on background), no fill.
- **Nav/footer:** unchanged structurally; the HJ monogram border can pick up
  Royal instead of plain Ink for a small bold touch.

## 8. Content accuracy fixes

**Chess page:**
- Correct the rating to **1200 Elo on Chess.com** everywhere it appears
  (`_data/chess.yml` and any hardcoded copy in `chess/index.html`). No
  other rating claims (Lichess, club ratings) unless verified — remove if
  unverifiable.
- Keep the strategic-thinking-parallels-to-data-work narrative; just make
  sure no copy overstates skill level.

**Poker page — full reframe away from gambling:**
- Remove all references to stakes, money, gambling, bankroll, "NL200",
  win-rate in bb/100, hands played as a poker-specific metric, and casino
  framing.
- **Decision: remove the playable heads-up betting game entirely**
  (`poker/index.html`'s `pk-*` table/game and its blinds/pot/raise
  mechanics). It's structurally a wagering game — blinds, pots, stack
  sizes, all-ins — and there's no honest reframe that keeps it playable
  without keeping the betting. It's cut, not reworked.
- **Decision: keep the equity calculator, recopy it.** It has no stakes or
  money in its mechanics — it answers "given these cards, what's the win
  probability" — so it already fits the probability framing structurally.
  Rewrite its copy only: "equity" → "win probability", "opponent" language
  softened, headline framing shifts to Monte Carlo simulation and outs
  analysis as applied probability, with an explicit line connecting it to
  the same estimation-under-uncertainty thinking used in ML and forecasting.
- **Decision: replace `_data/poker.yml` stats with facts already present in
  today's content, reframed** — e.g. years of deliberate study, solver
  hours, hands analyzed for pattern/study purposes — pulled from the
  existing intro/stats/philosophy/study_approach fields rather than
  invented. If a currently-listed fact only makes sense in a stakes
  context (e.g. a bb/100 win rate), drop it rather than inventing a
  replacement number.

## 9. Technical notes

- New Google Fonts import: Bricolage Grotesque (weights 600/700/800),
  replacing Schibsted Grotesk in the `<link>` tag. Drop Caveat.
- `_tailwind/input.css`: update `--font-display` to Bricolage Grotesque;
  add `--color-indigo: #5B21B6`; update `--color-royal` to `#1D4FD8` and
  `--color-ember` to `#FF8A00`; remove `.tape`, `.tape--*`, `.photo-print`,
  `.tape-strip`, `.hand`, `.font-hand` rules once no page references them;
  keep `.grain` (still useful on the Midnight contact/footer band); replace
  `.ledger`/`.ledger-row` usage across all pages before deleting the CSS.
- Rebuild `assets/css/tailwind.css` via `npm run css` after token changes.
- Files touched: `_layouts/default.html` (font link), `_tailwind/input.css`
  (tokens/components), `index.html`, `about/index.html`, `chess/index.html`,
  `poker/index.html`, `poker/equity-calculator.html`, `_data/chess.yml`,
  `_data/poker.yml`, `docs/brand-guidelines.md` (bump to revision 3).
- Project cards (`_includes/project-card.html`) get the alternating
  top-border treatment; no content changes needed there.

## 10. Out of scope for this spec

- No changes to the underlying poker game math/engine beyond what's needed
  to remove gambling framing — if the interactive element is kept in some
  form, its correctness (already validated in a prior session) is not
  being re-verified here.
- No changes to `_projects/*.md` case study content.
- No new pages.
