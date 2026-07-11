# hafizaj.github.io

Personal portfolio — Jekyll + precompiled Tailwind CSS, served by GitHub Pages.

## Editing styles

Styles are compiled locally and **committed** (GitHub Pages only runs Jekyll):

```sh
npm install        # once
npm run css        # compile _tailwind/input.css → assets/css/tailwind.css
npm run css:watch  # or watch during development
```

Design tokens and rules live in `docs/brand-guidelines.md`.

## Local preview

```sh
bundle exec jekyll serve
```
