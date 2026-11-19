# enigmeta

Personal blog built with Eleventy 3.

- Verify: `npm ci && npm run check` (builds, then fails on any local link or image that does not resolve).
- Branch policy: commit directly to `master` (base branch `master`).
- Deploy: none here; the host builds from the push to `master`.

## Design

The site is a HyperCard stack on a 1-bit Macintosh desktop. Keep it to two colours.

- One stylesheet, `assets/css/site.css`, with only `--ink` and `--paper`; every grey is a dither pattern. `media/css/` is the earlier design and is not loaded.
- Layouts are Nunjucks in `_includes/`: `base` is the menu bar and card window, `default` and `page` wrap content in `.prose`, `post` and `project` add a header.
- Every page is a card in one stack: home, projects, each project, writing, each post, about. The order is the `stack` collection in `.eleventy.js`; it drives "Card n of N", the arrows and the arrow keys.
- List thumbnails and the about portrait are Atkinson-dithered at build time (`lib/dither.js`, output in `_site/dither/`) and shown at exactly 2x. They carry `eleventy:ignore` so the image resizer skips them.
- Every other local `<img>` is resized to WebP by `@11ty/eleventy-img`, including those on the hand-built pages.
- `assets/js/`: `paint.js` is the paint tools, `ants.js` and `maze.js` the two project-derived behaviours.
- A project thumbnail dissolves from 1-bit to colour on hover: a Bayer mask on the colour image plus the `#dissolve` SVG filter in `base.njk`, driven by a stepped opacity transition.
