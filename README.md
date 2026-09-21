# Prajwal Kulkarni — portfolio

A static personal website for [kp-prajwal.github.io](https://kp-prajwal.github.io/), inspired by layered editorial navigation and built for GitHub Pages.

## Edit content

Work, projects, and personal links live in `site/content.mjs`. The design is in `site/style.css`, while `site/app.mjs` handles navigation, the animated background, and optional ambient sound.

Run `node scripts/build.mjs` after editing content to regenerate the HTML entry point for each route. GitHub Pages publishes the repository root on the existing `main` branch. The generated pages make direct project links work without a single-page fallback.

For a local preview, run `python3 -m http.server 8000` from the repository root, then open `http://localhost:8000/`.

The site keeps the previous Google site verification and analytics identifiers. The résumé PDF is generated from the September 2026 résumé supplied for this redesign.
