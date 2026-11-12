---
version: 1
slug: "frontend-src-app-reader"
primary_target: "frontend/src/app/reader"
related_targets: ["frontend/src/app/discover","frontend/src/app/tutor","frontend/src/app"]
---

# Reader, Discover and Tutor: visual redesign

Scope: replace the visual world of `/`, `/reader`, `/discover` and `/tutor`. Screen structure, logic and backend contracts stay. Mode: Read (Reader), Operate (Discover, Tutor).

## Direction contract

THESIS: Every text shows how much of it *you* will understand. The forecast is the only colored thing on the page. Refuses the JLPT-badge-on-a-card arrangement and the warm "Japan app" palette.

OWN-WORLD: White ground, ink #1b1547 (never pure black), muted #4b5165, violet #6b5ce7 as the only interactive accent, 1px hairlines #e6e7ee. Figtree 400/500 for UI; Zen Kaku Gothic New for Japanese. Color is spent only on the forecast: a large tabular percentage over an uncertainty band in a teal #7fd8d0 → lilac #c9b8f0 → violet #5b4fd6 gradient. No nested cards. Panels only at 12px radius, 1px hairline. Word state is read from underline style plus a glyph, never from hue alone.

STORY: The learner opens a passage, sees "78% · likely 66–88%" kept apart from "Text level N4", reads in a calm column, taps a word, and the panel explains it.

FIRST VIEWPORT: A sticky 72px bar (mark, nav, one filled violet action). Below it, the title on the left with the English title beneath it, and the forecast block on the right. The reading column is about 36 Japanese characters wide, flanked by a muted margin note and the word panel.

FORM: Civic bureau prospectus, ribbon removed; the uncertainty band takes its job. Chosen card from the bolder re-roll. seed:eda75f43242267db

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
