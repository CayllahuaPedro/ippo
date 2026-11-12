# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: a Japanese learner at roughly JLPT N5–N3 who reads native material as part of an
immersion routine, on desktop and on a phone. The job is to read a passage they can mostly
follow, understand the parts they cannot, and decide which words are worth learning next.

Secondary: people evaluating the project as a portfolio piece (engineers, hiring managers).
They are served by a real, usable tool; the interface is not designed as a showcase for them.
The machine-learning story lives in the README and demos.

## Product Purpose

Nihon AI is a comprehensible-input reading app. It models what the learner knows and uses that
model to decide what they read, which words are worth mining, and how the AI tutor explains
things to them. Success means the learner spends their time on text slightly above their level
and leaves each session understanding more than they did going in.

## Positioning

Difficulty is a function of learner × text, not a property of the text. Other tools label a
passage "N3"; Nihon AI estimates how much of it *this* learner will understand. Two notions are
kept separate and never fused: absolute difficulty (JLPT level, gated by OOV, plus frequency)
and personal difficulty (expected comprehension from the learner model). When a passage falls
outside what the classifier can judge, it abstains and says so instead of guessing.

## Operating Context

- Reading sessions with long-form Japanese: tokenized text, furigana, per-word knowledge states
  (`known`, `learning`, `selected`) and word popups.
- Discovering what to read next, ranked by expected personal comprehension.
- Asking a level-aware tutor about a word, grammar point or sentence; answers stream in blocks,
  and Japanese sentences arrive whole, never character by character.

## Capabilities and Constraints

- Implemented surfaces: Reader (`/reader`), Discover (`/discover`), Tutor (`/tutor`), home (`/`).
  Reader and Discover render from fixture data today.
- Tutor streams over SSE from `POST /tutor`; without a configured backend it serves canned
  answers and states that on screen. That disclosure must survive any redesign.
- Stack is fixed: Next.js 15, React 19, Tailwind v4, tokens in `frontend/src/app/globals.css`.
  Feature boundaries under `frontend/src/features/` are enforced by dependency-cruiser.
- Japanese typography is a first-class constraint: ruby/furigana, mixed kana/kanji/Latin text,
  and readable sizes for dense kanji.
- Open decision: the navigation set. Built today: Reader, Discover, Tutor. Mentioned elsewhere
  but not built: SRS, Mining queue, Progress. The backend for mining and progress is stubbed.

## Brand Commitments

- Name: **Nihon AI**, everywhere (UI, repo, README). The earlier "Yabai" name is retired.
- Honesty is part of the voice: the product states when data is a fixture, when the tutor is
  offline and when the classifier abstains. It never presents a guess as an answer.

## Evidence on Hand

- Fixture passage and Discover shelves in `frontend/src/features/{reader,discover}/`.
- No real users, testimonials, usage metrics or learner data exist. Do not invent them.

## Product Principles

1. Reading comes first. Every element on a reading surface must help the learner understand the
   text or step out of the way.
2. Personal over absolute. Show what the learner is likely to understand, and keep it visibly
   separate from the text's objective level.
3. Say what you don't know. Abstentions, fixtures and offline states are shown, not hidden.
4. A real tool, not a demo. Design decisions favour daily use over first-impression spectacle.

## Accessibility & Inclusion

No standard has been stated by the user. Inferred floor: WCAG AA contrast and body text of at
least 14px, given dense kanji and furigana. After the 2026-11-06 redesign, `impeccable detect`
reports 0 findings on every route at 1440 and 390 widths.
