# Site Overhaul — Design Spec

**Date:** 2026-07-11
**Goal:** Recruiter-focused redesign of hafizaj.github.io. Amazing, easy to
navigate, very lightweight. Informed by why zachjordan.io works (flat anchored
navigation, real work first, personality included, zero friction to contact) —
not by its visual style.

## Requirements (from the brief)

1. Complete visual overhaul; easy to navigate; catches recruiters' eyes.
2. New personal brand guideline modeled on the structure of the AGSB corporate
   brand book in `__reference_files/` → delivered at `docs/brand-guidelines.md`.
3. Tailwind CSS — **precompiled at build time**, not the runtime CDN script
   (the CDN compiler is ~110KB of JS and re-compiles on every visit; replacing
   it is the single biggest performance win).
4. All icons/logos injected by JavaScript (Iconify web component), no inline SVG.
5. Very lightweight: compiled CSS committed to the repo (GitHub Pages only runs
   Jekyll), vanilla JS, no frameworks, minimal font weights.

## Approaches considered

- **A. Restyle in place** — keep both the Tailwind CDN and the parallel custom
  CSS system. Rejected: two competing design systems is the current problem.
- **B. Tailwind v4 precompiled + thin custom layer (chosen)** — one source of
  truth in `_tailwind/input.css` (`@theme` tokens from the brand guideline),
  compiled with `npx @tailwindcss/cli` to `assets/css/tailwind.css`, committed.
  Custom CSS only for the few things utilities can't express (ledger device,
  entrance animation).
- **C. Drop Jekyll for a JS framework** — rejected: heavier, unnecessary, and
  GitHub Pages serves Jekyll natively.

## Architecture

- Jekyll stays. One layout (`_layouts/default.html`); the duplicate
  `about.html` layout and `nav-about`/`footer-about` includes are deleted.
- `_config.yml` nav: Work (/#work), About (/about/), Poker (/poker/),
  Chess (/chess/) + persistent "Email me" CTA.
- Build script: `package.json` with `npm run css` (Tailwind CLI, minified
  output). Compiled CSS committed; a README note explains the workflow.

## Pages

- **Home (single recruiter path):** Midnight hero (thesis headline, plain-language
  intro, photo, evidence ledger of 3 impact rows, amber CTA) → proof strip
  (AstraZeneca · Central Bank of Malaysia · Imperial · UCLA, text not logos) →
  Work (4 real case cards) → Experience (roles as ledger rows, link to About) →
  Skills (capability clusters, JS icons) → Beyond work (poker + chess cards,
  equity-calculator callout) → Contact band (email, LinkedIn, GitHub).
- **About:** full CV — kept, restyled with the same tokens; expandable cards
  replaced with always-visible content (recruiters scan, they don't click).
- **Projects:** the template content in `_projects/` (one fictional churn study
  with a placeholder GitHub link, two empty files) is replaced with four real
  case studies taken from the CV bullets: expense-fraud detection ML, Costa Rica
  tax classification model, BNM risk intelligence platform, cash-flow
  forecasting engine. `github`/`demo` fields left empty (internal work).
- **Chess:** rebuilt on the new system (it was nearly unstyled).
- **Poker + equity calculator:** self-contained `<style>` blocks — kept working
  inside the new shell; shell-level classes they don't use are removed.

## Brand tokens

See `docs/brand-guidelines.md`. Palette: Ink #0A1B33, Royal #00397B, Midnight
#042448, Amber #F7941E, Paper #F6F8FB, Mist #D9E2EF, Slate #44536B. Type:
Schibsted Grotesk (display), Instrument Sans (body), IBM Plex Mono (utility).
Signature device: the evidence ledger.

## Error handling / quality floor

- Responsive to 360px; mobile nav is a simple disclosure panel.
- Visible keyboard focus (Royal ring); `prefers-reduced-motion` honored.
- Icons degrade gracefully: layout must not depend on icon dimensions.
- SEO: jekyll-seo-tag retained; per-page descriptions kept.

## Testing

- `bundle exec jekyll build` must pass; every page inspected in `_site/`.
- Grep the built output for `cdn.tailwindcss.com` (must be gone) and inline
  `<svg` in shell templates (must be gone).
- Page-weight check on built HTML + CSS + JS (budget: <150KB excl. portrait).
