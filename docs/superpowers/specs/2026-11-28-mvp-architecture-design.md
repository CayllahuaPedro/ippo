# MVP Architecture — Accounts, Cards and Sync

Status: approved (2026-11-28). Replaces the "Request flow", "Data stores" and
"Deployment" sections of `docs/architecture.md` once approved.

## Why

The first public version needs five features: dual subtitles on YouTube and Netflix, custom
popup dictionaries, an EPUB reader, an Anki-style SRS, and one-click mining from the popup into
that SRS. Mining happens in the extension; reviewing and reading happen in the web app. One deck
has to be visible from both, so cards live on a server behind a real account (Google login),
for users from the waitlist, not only the author.

Today nothing can hold that: the only live route is `POST /tutor`, `app/db/` is empty, there is
no auth, and nothing is deployed.

## Goals

- One account (Google) shared by the web app and the extension.
- One deck per user, written from the extension (mining) and read and reviewed from the web app.
- Security handled by maintained libraries, not hand-written code.
- Every card and review carries the JMdict item identity (`ItemRef`), so the learner model can
  be trained on real review data later.
- Deployable by one person to one VPS.

## Non-goals (MVP)

- Offline reviewing. Reviews need a connection; only mining tolerates being offline.
- Screenshots and audio on cards.
- Logging exposures and lookups for the learner model (paused; reviews are logged from day one).
- Storing users' EPUB files on the server.
- Email/password login, teams, sharing decks.

## Anti-goals

- A second auth system for the extension. Both clients use the same session authority.
- Exposing the Python service to the internet.
- Two hand-maintained copies of the API types.

## Approaches considered

1. **TypeScript product API (Hono + Better Auth) with Python as an internal ML service — chosen.**
   Better Auth is a maintained, batteries-included auth library the author already knows; Hono
   gives a typed RPC client the web app and the extension import directly. Python keeps what it
   is good at (tokenization research, the classifier, the learner model, the tutor) and has no
   auth surface because nothing outside the server can reach it.
2. **FastAPI + Authlib with own sessions.** One language on the server and ML next to the data.
   Rejected: FastAPI ships no security layer, so sessions, CSRF and rate limiting would be
   written by hand; the clients would need generated types.
3. **Django + django-allauth.** Security is built in and ML stays in-process. Rejected: a new
   framework to learn, no Better Auth, generated client types.

FastAPI Users was not considered: it is in maintenance mode.

## Design

### Units

```
ippo/
├── api/         NEW  Hono + Better Auth + Drizzle on Bun — the only public backend
├── backend/          FastAPI — internal ML service: /tutor today, /classify later
├── ml/               research and ETL (unchanged)
├── frontend/         Next.js — reader, SRS, discover, tutor
└── extension/        WXT — popup, mining, subtitles, dictionaries
```

Bun is the runtime and package manager for `api/`. A root `package.json` `workspaces` field
links `api`, `frontend` and `extension`, so the clients import `AppType` from `@ippo/api` for the
Hono RPC client. Python units stay outside the workspace.

### Request flow

```
frontend ──cookie──►  api (Hono)  ──internal token──►  backend (FastAPI, private network)
extension ─bearer──►    │                                   └─► Anthropic
                        ▼
                     Postgres
```

- **Web:** Better Auth session cookie, shared by `ippo.<tld>` and `api.ippo.<tld>` (same site).
- **Extension:** the Better Auth `bearer` plugin. The user signs in on the web app; the web app
  hands the session token to the extension through `externally_connectable` (only the web
  origin may message the extension). The background worker stores it and sends
  `Authorization: Bearer`. `chrome-extension://<id>` is a trusted origin for CORS.
- **Tutor:** the API streams the SSE response from the Python service through to the client, so
  the client never talks to Python.
- **Service-to-service:** the API calls Python with a shared secret header; the Python service
  listens only on the internal Docker network.

### Data model (Postgres, Drizzle)

- Better Auth tables: `user`, `session`, `account`, `verification`.
- `deck(id, user_id, name, created_at)`. One default deck per user; more decks later.
- `card(id, user_id, deck_id, item_id, item_ambiguous, word, reading, gloss, sentence,
  source_kind, source_title, source_url, source_position, created_at, updated_at, deleted_at)`
  - `item_id` is the `jmdict:<id>` from `ItemRef`; unique per `(user_id, item_id)`.
  - `source_kind` is one of `youtube`, `netflix`, `web`, `epub`; `source_position` is a video
    timestamp or a book location.
  - `gloss` is a snapshot of the definition at mining time, so a card never depends on the
    client's dictionary version.
- `card_schedule(card_id, due, stability, difficulty, reps, lapses, state, last_review)`:
  the FSRS state.
- `review_log(id, card_id, user_id, rating, reviewed_at, elapsed_days, scheduled_days)`:
  append-only. This is the learner model's future training data.

### SRS

FSRS (the algorithm Anki uses) through `ts-fsrs`, run **on the server** when a review is
submitted: `POST /reviews` writes the log row and the new schedule in one transaction. The
server is the only scheduler, so two devices can never disagree about when a card is due.

### Mining and sync

- The popup's mine button sends `POST /cards` with the `ItemRef` of the entry the learner picked
  (unambiguous by definition), the word, the reading, the gloss snapshot and the context
  sentence with its source.
- Mining a word already in the deck returns the existing card instead of a duplicate.
- **Offline:** the extension writes the request to an IndexedDB outbox and flushes it when the
  connection returns; each request carries a client-generated id so a retry cannot create a
  second card.
- Card edits are last-write-wins on `updated_at`. Reviews never conflict: they are appended.

### Reader and EPUB

The EPUB is parsed and tokenized **in the browser** (the same kuromoji pipeline the extension
uses) and kept in IndexedDB. The server stores book metadata and reading position only. Mining
from the reader uses the same `POST /cards`.

### Custom dictionaries

Imported in the extension in the Yomitan dictionary format (zip with `term_bank_*.json`), the
format learners already have, and stored in the extension's IndexedDB next to JMdict. Not synced
in the MVP.

### Netflix

Extension only: a content script reads the subtitle track and reuses the existing subtitle
overlay. No server impact.

### Deployment

One VPS, Docker Compose: Caddy (TLS and reverse proxy) → `api`, `frontend`; `backend` and
Postgres on the internal network only. Nightly `pg_dump` to off-server storage. Secrets in env
files outside the repo.

### Security

- Sessions, CSRF protection, Google OAuth and rate limiting come from Better Auth.
- Every API route checks the session and scopes queries by `user_id`; a test per route proves a
  user cannot read or write another user's cards.
- CORS allowlist: the web origin and the extension origin only.
- Request bodies validated with Zod at the route.

## Docs to update when this is approved

- `docs/architecture.md`: replace request flow, data stores and deployment; it also still says
  "no CI workflow", which is false.
- `README.md`: status table (extension talks to the API; SQLite → Postgres), architecture
  diagram, roadmap ("exportable to Anki" → built-in SRS), test counts (extension 312, ml 51).
- `PRODUCT.md`: platform is web + Chrome extension; the navigation decision is made (SRS is in).
- `backend/README.md`: the service is internal.
- `extension/README.md`: it is no longer offline-only; "Anki export" under Status.
- `docs/superpowers/specs/2026-06-17-item-model-contract-design.md`: mark §1 superseded by the
  item identity spec.

## Calls made without asking

- Bearer token through `externally_connectable` for the extension, rather than shared cookies.
- Server-side FSRS; no offline reviewing in the MVP.
- One card per word per user.
- EPUBs stay on the device; custom dictionaries stay in the extension.
- Caddy and Docker Compose on the VPS.

## Left to the builder

- Hono route layout and Drizzle migration tooling.
- Whether `frontend/` and `extension/` also move from npm to Bun for installs and CI.
- The outbox flush policy (backoff, batch size).
- The web app's sign-in page design.
