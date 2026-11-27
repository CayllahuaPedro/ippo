# Item Identity (JMdict Entry IDs) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every trackable token in the extension resolves to a `jmdict:<id>` item id with an explicit `ambiguous` flag, and `ml/` maps word-level resources to the same ids.

**Architecture:** A pure resolver (`resolveItem`) filters dictionary candidates by reading, then by the JMdict `common` flag. The background worker supplies candidates from IndexedDB, `analyzeText` attaches the result to each `RenderToken`. The dictionary build refuses to drop ids via a committed manifest. Python reuses the same `jmdict.min.json` and a shared fixture so both sides cannot drift.

**Tech Stack:** TypeScript, WXT, vitest, kuromoji (IPADIC), IndexedDB; Python, pytest, ruff.

**Spec:** `docs/superpowers/specs/2026-11-12-item-identity-jmdict-design.md`

## Scope

Identity layer only. The extension stores no exposure, lookup or card events yet, so "every record carries `item_id`" becomes a type (`ItemRef`) that future records embed. Out of scope: event storage, tokenizer changes, per-kanji and grammar items, re-running Phase 0.

## Global Constraints

- `item_id` format: `"jmdict:" + entry.id`, where `entry.id` is the JMdict sequence number kept as a **string**.
- Ambiguous pick: lowest sequence number, compared **numerically**, never lexicographically.
- Resolution order: candidates by base form (fallback surface) → reading filter (skip if it empties the set) → common filter (skip if it empties the set) → result.
- `common` on a `DictEntry` is entry-level: true if any `kana[].common` or `kanji[].common` is true.
- Trackable IPADIC `pos`: 名詞, 動詞, 形容詞, 副詞, 連体詞, 接続詞, 感動詞; excluding posDetail 固有名詞 and 数 (OOV frame only) and 非自立 for 名詞/動詞/形容詞.
- Generated artifacts are English. The existing build script's Spanish log lines stay as they are.
- Hooks are never `.tsx`; no redundant comments.
- CI has no `data/raw/` and no generated `jmdict.min.json`: tests must use committed fixtures only.

## Review Focus

- Existing installs already imported entries without `common`; the `imported` flag short-circuits re-import, so `common` filtering silently never applies for them. Test that a stale import triggers a re-import.
- An id above 9 vs 10 digits (`"999999"` vs `"1000000"`) in the ambiguous pick.
- A token whose base form is `*` (kuromoji unknown) must resolve to no id, not throw.
- An inflected token whose base-form reading cannot be derived must fall back to the unfiltered candidate set and be marked ambiguous when several remain.
- Merged compounds carry `parts`; the compound itself resolves, its parts do not get separate ids.
- Manifest check on a first build (no manifest) and on a rebuild that only adds ids must pass without a flag.

---

### Task 1: Carry `common` through the build and IndexedDB

**Files:**
- Modify: `extension/src/core/types.ts` (add `common: boolean` to `DictEntry`)
- Modify: `extension/src/data/transform.ts` (`RawWord` gains `common` on `kanji[]`/`kana[]`; `transformJmdict` sets `common`)
- Modify: `extension/src/core/db.ts` (`DB_VERSION` 1 → 2; recreate the `entries` store and clear `meta` on upgrade)
- Test: `extension/tests/transform.test.ts`, `extension/tests/db.test.ts`

**Interfaces:**
- Produces: `DictEntry.common: boolean`.

- [ ] **Step 1: Write failing tests.** In `transform.test.ts`: `transformJmdict` of a word with `kana: [{text:'こと', common:true}]` yields `common: true`; a word whose forms are all `common:false` yields `false`. In `db.test.ts`: opening a v1 database (created with the old schema and `imported: true`) and then `openDb()` leaves `isImported` returning `false`.
- [ ] **Step 2: Run** `cd extension && npx vitest run tests/transform.test.ts tests/db.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** `common` in `transformJmdict` and the v2 upgrade path in `openDb` (delete `entries` if it exists, recreate it with the `forms` index, clear `meta`).
- [ ] **Step 4: Run the same command.** Expected: PASS. Then `npm test` for the whole suite.
- [ ] **Step 5: Commit** `feat(extension): carry the JMdict common flag into the dictionary`.

### Task 2: Id-stability manifest in the dictionary build

**Files:**
- Create: `extension/src/data/idManifest.ts`
- Create: `extension/data/dict-manifest.json` (committed; written by the first build)
- Modify: `extension/scripts/build-dict.ts`
- Test: `extension/tests/idManifest.test.ts`

**Interfaces:**
- Produces:
  - `interface IdManifest { release: string; dictDate: string; ids: string[] }`
  - `checkIdStability(previous: IdManifest | null, nextIds: string[]): { missing: string[] }`

- [ ] **Step 1: Write failing tests** for `checkIdStability`: `null` previous → `missing: []`; previous `['1','2']` and next `['1','2','3']` → `[]`; next `['1']` → `['2']`.
- [ ] **Step 2: Run** `npx vitest run tests/idManifest.test.ts`. Expected: FAIL (module missing).
- [ ] **Step 3: Implement** `checkIdStability` with a `Set`.
- [ ] **Step 4: Wire into `build-dict.ts`.** Read `data/dict-manifest.json` if present. After `transformJmdict`, if `missing.length > 0` and `--allow-removed-ids` is not in `process.argv`, print the missing ids (first 20 plus the count) and `process.exit(1)` before writing any dictionary file. Otherwise write the manifest with `raw.version`, `raw.dictDate` and the sorted ids.
- [ ] **Step 5: Run** `npx vitest run tests/idManifest.test.ts`. Expected: PASS. Then run `npm run build:dict` locally (needs `data/raw/`): first run writes the manifest, second run passes unchanged.
- [ ] **Step 6: Commit** `feat(extension): fail the dictionary build when a JMdict id disappears`.

### Task 3: Pure item resolution

**Files:**
- Create: `extension/src/core/item.ts`
- Create: `extension/tests/fixtures/item-identity.json` (mini dictionary of hand-picked JMdict entries plus expected resolutions; shared with Task 5)
- Test: `extension/tests/item.test.ts`

**Interfaces:**
- Consumes: `DictEntry` (Task 1), `JpToken`.
- Produces:
  - `interface ItemRef { itemId: string; ambiguous: boolean; candidates?: string[] }`
  - `isTrackable(t: JpToken): boolean`
  - `resolveItem(query: { basicForm: string; surface: string; baseReading?: string }, entriesByForm: (form: string) => DictEntry[]): ItemRef | null`
  - `itemRefFromEntry(entry: DictEntry): ItemRef` (popup choice: `ambiguous: false`)

- [ ] **Step 1: Write the fixture and failing tests.** The fixture holds the entries for: 月 (つき and がつ, both candidates), 他, 生, その, こと, ある, する, 通る, 届ける, a compound (食肉目), plus each token's expected `{itemId, ambiguous}`. Tests assert, from the spec's Testing section: homograph 月 in 一月 resolves to the がつ entry and 月が to つき with `ambiguous:false` once the reading filter applies; 月 with no `baseReading` resolves to the common candidate with the lowest numeric id and `ambiguous:true` with `candidates` listing all remaining; `'999999'` beats `'1000000'`; inflected 通って and 届けた resolve through `basicForm`; a proper noun (`posDetail` 固有名詞) is not trackable; `basicForm: '*'` and an out-of-dictionary word return `null`; `itemRefFromEntry` returns `ambiguous:false`.
- [ ] **Step 2: Run** `npx vitest run tests/item.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** `isTrackable` and `resolveItem` following Global Constraints. Reading comparison is in hiragana (`katakanaToHiragana`); the filters skip themselves when they would empty the set.
- [ ] **Step 4: Run the same command.** Expected: PASS.
- [ ] **Step 5: Commit** `feat(extension): resolve tokens to JMdict item ids`.

### Task 4: Plug resolution into the extension pipeline

**Files:**
- Modify: `extension/src/core/messages.ts` (new `{ type: 'resolve-items'; tokens: ItemQuery[] }` message, `ResolveItemsResult { items: (ItemRef | null)[] }`)
- Modify: `extension/src/core/backgroundHandlers.ts` (handle `resolve-items` with `lookupEntries`; same base-form-then-surface lookup as `lookupByBasicFormOrSurface`)
- Modify: `extension/src/core/tokenizer.ts` (add `baseReading(t: JpToken): Promise<string | undefined>`: `t.reading` when `basicForm === surface`, otherwise the reading of tokenizing `basicForm` once, cached in a `Map`)
- Modify: `extension/src/core/analyze.ts` (`AnalyzeDeps.resolveItems`; call it only for trackable merged tokens)
- Modify: `extension/src/core/annotate.ts` (`RenderToken.item?: ItemRef`; `buildRenderTokens` takes the resolved items)
- Modify: `extension/entrypoints/content.ts`, `extension/entrypoints/youtube.content.ts` (provide `resolveItems` through `send`)
- Test: `extension/tests/analyze.test.ts`, `extension/tests/backgroundHandlers.test.ts`, `extension/tests/tokenizer.test.ts`

**Interfaces:**
- Consumes: `ItemRef`, `resolveItem`, `isTrackable` (Task 3).
- Produces: `RenderToken.item?: ItemRef`, present only for trackable, in-dictionary tokens.

- [ ] **Step 1: Write failing tests.** `analyze.test.ts`: with a fake `resolveItems`, a trackable noun gets `item`, a particle and a proper noun get none, and `resolveItems` receives one entry per trackable token only; a merged compound is resolved once and its `parts` carry no `item`; when `resolveItems` throws, tokens render without `item` and a warning is logged (same pattern as `findCompoundsSafely`). `backgroundHandlers.test.ts`: `resolve-items` returns the ref for a known form and `null` for an unknown one. `tokenizer.test.ts`: `baseReading` of an inflected verb returns the dictionary-form reading and is computed once per `basicForm`.
- [ ] **Step 2: Run** `npx vitest run tests/analyze.test.ts tests/backgroundHandlers.test.ts tests/tokenizer.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** the message, handler, `baseReading`, the `analyzeText` step and `RenderToken.item`. Do not add `item` to the DOM dataset in `render.ts`; nothing reads it yet.
- [ ] **Step 4: Run the same command, then `npm test` and `npm run check`.** Expected: PASS.
- [ ] **Step 5: Commit** `feat(extension): attach item ids to analysed tokens`.

### Task 5: Python mapping and JLPT item ids

**Files:**
- Create: `ml/nihon_ml/jmdict.py`
- Modify: `ml/nihon_ml/jlpt/lists.py` (add `headword_to_item_id`)
- Modify: `ml/scripts/fetch_jlpt_lists.py` (write an `item_id` column next to `item_key`)
- Test: `ml/tests/test_jmdict.py`, `ml/tests/test_lists.py`

**Interfaces:**
- Consumes: `extension/tests/fixtures/item-identity.json` (Task 3) and `extension/public/dict/jmdict.min.json` for the real run.
- Produces:
  - `class Jmdict` with `Jmdict.load(path: pathlib.Path) -> Jmdict` and `resolve(surface: str, reading: str | None) -> Resolution | None`
  - `@dataclass(frozen=True) class Resolution: item_id: str; ambiguous: bool; candidates: tuple[str, ...]`
  - `headword_to_item_id(surface: str, reading: str | None, jmdict: Jmdict) -> str | None`

- [ ] **Step 1: Write failing tests.** `test_jmdict.py` loads the shared fixture's mini dictionary and asserts every pinned `(surface, reading) → (itemId, ambiguous)` pair from the fixture, including the numeric tiebreak. `test_lists.py`: `headword_to_item_id("猫", "ねこ", jmdict)` returns the fixture id; an unmatched headword returns `None`.
- [ ] **Step 2: Run** `cd ml && pytest tests/test_jmdict.py tests/test_lists.py -v`. Expected: FAIL.
- [ ] **Step 3: Implement** `Jmdict` mirroring the TypeScript steps 1–3 (no tokenizer; `surface` is used as the form). `item_id` strings carry the `jmdict:` prefix.
- [ ] **Step 4: Run the same command, then `ruff check . && ruff format --check .`.** Expected: PASS.
- [ ] **Step 5: Run** `python scripts/fetch_jlpt_lists.py` against the real dictionary and check the printed counts against the spec (98.2 % unique, 0.4 % ambiguous, 1.4 % unmatched of 6,803). A large deviation is a bug to investigate, not to commit.
- [ ] **Step 6: Commit** `feat(ml): map JLPT headwords to JMdict item ids`.

### Task 6: Move the measurement into the repo

**Files:**
- Create: `ml/scripts/measure_identity.py`
- Create: `extension/scripts/kuromoji-spans.mjs` (reads sentences on stdin, prints kuromoji content spans as JSON)
- Modify: `ml/README.md` (how to rerun after a dictionary or tokenizer change)

**Interfaces:**
- Produces: a command that prints the spec's table (span agreement, lemma vs base-form agreement, JMdict coverage, candidate overlap, same-single-entry rate) for N random Tatoeba sentences with a fixed seed.

- [ ] **Step 1: Implement** the Node helper and the Python driver; defaults `--n 2000 --seed 20261112` so the first run reproduces the spec's numbers.
- [ ] **Step 2: Run** `python ml/scripts/measure_identity.py` and compare with the spec's table. Expected: within rounding of the table; if not, say so in the PR.
- [ ] **Step 3: Commit** `chore(ml): keep the item identity measurement reproducible`.

---

## Self-review

- **Spec coverage:** id format and numeric tiebreak (Tasks 3, 5), trackable tokens (3), resolution steps incl. `common` (1, 3), ambiguity recorded (3, 4), Python side (5), dictionary version check (2), fixture and cross-language tests (3, 5), measurement in repo (6). "Every record carries `item_id`" is narrowed to the `ItemRef` type; events do not exist yet (see Scope).
- **Type consistency:** `ItemRef`, `resolveItem`, `isTrackable` and `Resolution` are defined once and referenced by name.
- **Proportion:** six tasks, no function bodies except where the spec pins behavior.
