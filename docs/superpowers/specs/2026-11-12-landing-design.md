# Ippo landing page — design

Date: 2026-11-12 · Status: draft for approval

## Intent

Ippo needs a public front door. Today `/` redirects to `/reader`, so anyone who hears about
Ippo lands inside a fixture-backed app with no explanation. The landing page explains what Ippo
is to Japanese learners and collects one thing: their email for the waitlist.

The pitch rests on the comprehensible-input tradition (Krashen's input hypothesis, "i+1") that
the immersion community already practises. The bottleneck in that method is finding material
one step above your level; Ippo measures that step for every text. The name carries the same
idea: 一歩, "one step".

## Audience

Japanese learners first, roughly N5–N3, who already know or are open to immersion learning.
They are skeptical of language-app marketing. Recruiters and engineers are not the target; the
page should simply not embarrass the project in front of them.

## Goals

- One call to action, everywhere on the page: join the waitlist (email field + button).
- Make the differentiator tangible above the fold: a live demo where the visitor taps words,
  marks them, and watches the comprehension forecast change.
- Explain the method (i+1) in a few lines and position Ippo as the tool that measures it.
- Show the three problems Ippo removes, each with a real product snippet.
- Be honest about what exists today and what is coming.
- Bilingual: English at `/`, Spanish at `/es`.

## Non-goals

- No sign-in, no "download the extension" button, no pricing.
- No blog, docs, or changelog.
- No waitlist storage in this work (see Constraints).
- No new logo; the wordmark stays the plain text "Ippo" until the logo work (deferred).

## Anti-goals (failure even if it works)

- Promising fluency or outcomes ("fluent in N months"). Promise the method, measured.
- Invented users, testimonials, usage metrics or learner data.
- Naming other products (Refold, MIA, Migaku, etc.). Say "the immersion community".
- Mascots, illustrations, icon grids, saturated colour, hype tone.
- A demo that looks like a marketing toy instead of a piece of the real reader.

## Decided by Pedro

- Single CTA: waitlist. Learners first.
- English at `/`, Spanish at `/es`, with `hreflang` alternates and a language switcher
  (EN · ES) in the header. Spanish is neutral, using "tú".
- Built inside the existing Next.js app as a `(marketing)` route group serving `/`; the
  current redirect from `/` to `/reader` goes away.
- Visual direction: the existing "Civic Prospectus" design system (`DESIGN.md`, tokens in
  `frontend/src/app/globals.css`): white ground, ink `#1b1547`, violet `#6b5ce7` as the only
  accent, 1px hairlines, Figtree + Zen Kaku Gothic New at weights 400/500, dark mode on indigo.
  Migaku-level polish without the saturation.
- Hero layout: split. Pitch, eyebrow `一歩 · one step`, headline, lede and waitlist form on the
  left; the live demo on the right (mockup: `.superpowers/brainstorm/*/content/hero-v2.html`).
- Positioning: method over promise. Reference "the immersion community", not product names.
  Krashen may be named (public theory).
- Footer says "open source (AGPL)" with a link to the repository.
- Waitlist storage is deferred ("this is backend, later").

## Page structure

Reference mockup: `.superpowers/brainstorm/*/content/page-structure.html`. Copy below is
draft English; final EN and ES copy is written during the build and reviewed by Pedro.

1. **Header.** Text wordmark "Ippo", language switcher `EN · ES`. The app's nav, theme toggle
   and "Continue reading" button do not appear.
2. **Hero.** Eyebrow `一歩 · one step`. Headline (draft): "Read Japanese at the edge of what
   you know." Lede (draft): "Ippo forecasts how much of every text you'll understand, so each
   thing you read is one step past your level." Email field + "Join the waitlist". Fine print:
   "One email when it opens. Nothing else."
   Right side: **live demo**.
   - A short real Japanese passage (N4-ish). Words use the reader's existing `WordState`
     and `wordMark` styles from `features/reader` (known: no mark, learning: dotted accent
     underline). The mockup's "new" state and its dashed mark are dropped; the real reader
     wins over the mockup. The reader's types are not changed for the landing.
   - Tapping a word opens a popup with the word, its reading, a gloss, and two buttons:
     "I know it" and "Learning".
   - Changing a state immediately recomputes "You'll understand about N%" and its bar.
   - Legend: the reader's `WordLegend` (or the same marks, limited to known and learning).
   - The percentage is a client-side illustration (known = 1, learning = 0 over content
     words), not the real learner model. The passage starts with enough learning words that
     the number visibly moves.
3. **The method.** Label "The method". Heading (draft): "The immersion community already knows
   how fluency happens." Two or three sentences on i+1: too easy teaches nothing, too hard
   teaches nothing, the hard part is finding the next step, Ippo measures it.
   A horizontal scale "Too easy · Your next step · Too hard" with three example texts pinned on
   it (e.g. NHK Easy, よつばと!, a Murakami novel) and their percentages, captioned
   "Example: a learner around N4". These values are illustrative and labelled as such.
4. **How Ippo helps.** Heading (draft): "Less hunting, more reading." Three columns, each a real
   product snippet (no icons) plus a heading and one sentence. Snippets are live, static
   (non-interactive) renders of the real feature components fed by fixtures,
   not screenshots, so they follow dark mode for free. Snippets render in the page's language: the shared components take optional labels (English by default) and the landing passes localized labels and fixture data. The Chrome column shows
   the reader's word popup over a plain simulated web page, since the extension's popup has no
   in-app component. If a component needs `ReaderSettingsProvider`, the marketing layout
   provides it too.
   - Find what to read — Discover, ranked by personal comprehension, not a JLPT label.
   - Understand without leaving the page — the reader popup, in Ippo and on any site with
     Ippo for Chrome.
   - Get unstuck — the level-aware tutor, for a word, grammar point or sentence.
5. **Where it stands.** Heading (draft): "Honest about what exists." Two lists:
   - Working today (preview): Reader with forecasts, Discover, level-aware tutor,
     Ippo for Chrome.
   - Coming next: spaced repetition, mining queue, progress, your learner model synced.
6. **Closing CTA.** Heading (draft): "Take the first step." Fine print + the same form.
7. **Footer.** "Ippo · open source (AGPL)" linking to `github.com/CayllahuaPedro/ippo`,
   language switcher.

## Behaviour

- **Waitlist form.** Client-side email validation. Submission goes through one seam,
  `joinWaitlist(email, locale)`, with a stub implementation for now. The stub must not pretend
  to store anything: in development it resolves and logs, and the UI shows a success state.
  In a production build the stub rejects, and the form shows "The waitlist isn't open yet."
  instead of success, so no visitor is ever told they signed up when nothing was stored.
  Nothing deploys on merge today (there is no deployment yet), so removing the `/` → `/reader`
  redirect has no public effect. The real implementation is a deferred backend decision
  (own Postgres on the VPS vs. a third-party list).
- **Language.** Each locale is a separate route with fully static content, its own
  `<html lang>`, title, description and `hreflang` alternates (`en`, `es`, `x-default` → `/`).
  The switcher links to the same section in the other locale.
- **Responsive.** Below the hero breakpoint the demo stacks under the form; the method scale and
  the three columns stack vertically. 16px side gutter on phones, no horizontal scroll.
- **Dark mode.** Follows the existing theme tokens and boot script.
- **Accessibility.** WCAG AA contrast, body text ≥ 14px, demo words are keyboard-reachable
  buttons, the popup is dismissable with Escape and returns focus, the percentage change is
  announced politely.

## Constraints

- Next.js 15.5, React 19, Tailwind v4, tokens in `globals.css`. No new runtime dependencies
  unless clearly justified.
- Feature boundaries under `frontend/src/features/` are enforced by dependency-cruiser; new
  code lives in a feature (e.g. `features/marketing` / `features/waitlist`) and respects them.
- The root layout currently wraps everything in `AppShell`. The app routes (`/reader`,
  `/discover`, `/tutor`) keep `AppShell`; the landing must not render it.
- Project conventions: hooks live in `.ts` files (never `.tsx`); no template literals in
  conditional Tailwind classes (use `cn`); no redundant comments; conventional commits.
- Strict TDD is enabled for this repo: model logic (forecast calculation, email validation,
  locale content lookup) gets tests first.
- `npm run check` (typecheck, dependency-cruiser, tests) and `npm run build` must pass.

## Left to the builder

- Route-group mechanics (e.g. `(app)` and `(marketing)` groups with separate layouts, and how
  `/es` and `<html lang>` are produced).
- Whether the demo reuses `features/reader` components directly or a slimmed copy, as long as
  it looks and behaves like the real reader.
- The demo passage, its glosses, and the example texts on the method scale.
- How copy is organised per locale (dictionary objects, separate files).
- Metadata details, Open Graph image (text-only is fine), and the hero breakpoint.
- Drafting the final English and Spanish copy, following the tone above, for Pedro's review.

## Calls made by Claude (for Pedro to check)

- The demo uses the real reader's marks and states (known / learning) instead of the mockup's
  known / learning / new.
- Product snippets are live components from fixtures, not screenshots; they render in the page's language through optional labels and
  localized fixtures.
- In production, the waitlist stub refuses honestly ("The waitlist isn't open yet.") until
  storage exists.
- Footer, structure and draft copy as listed above.

## Later, out of scope

- Waitlist storage and the launch email (Resend or similar for sending).
- Deployment to the VPS.
- Logo (一 with a step) and favicon refresh.
- `/privacy` page (required later by the Chrome Web Store).
