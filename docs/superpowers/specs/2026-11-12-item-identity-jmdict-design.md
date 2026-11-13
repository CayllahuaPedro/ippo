# Item Identity — JMdict Entry IDs, Computed in the Extension

Status: design, pending approval (2026-11-12). Supersedes §1 "Item identity" of
`2026-06-17-item-model-contract-design.md`. Its §2 (comprehension aggregation) still holds, now
keyed by the identity defined here.

## Why

Every piece of learner data Ippo will collect — exposures, lookups, cards, reviews — is keyed by
item. The learner model (`p_know`) and the calibration study join that data with word-level
priors (JLPT lists, frequency). If two parts of the system compute different keys for the same
word, the join silently drops rows and the study measures nothing.

Today there are two identities:

- `ml/` computes `item_key = lemma|lForm|pos1` with fugashi + UniDic.
- The extension tokenizes with kuromoji + IPADIC and looks words up in JMdict by base form.

Measured on 2,000 random Tatoeba sentences (seed 20261112), content words only:

| Measure | Result |
| --- | --- |
| Content spans identical between the two tokenizers | 91.5 % of UniDic's, 77.2 % of IPADIC's |
| On identical spans, UniDic `lemma` == IPADIC base form | 61.2 % |
| On identical spans, UniDic `orthBase` == IPADIC base form | 99.0 % |
| Both resolve to at least one JMdict entry | 99.5 % |
| Their candidate entries overlap | 98.8 % |
| Both land on the same single entry | 69.4 % |

The UniDic lemma normalizes orthography (其の for その, 為る for する, 事 for こと); IPADIC keeps
the written form. Part-of-speech names also differ by dictionary. The extension cannot reproduce
`item_key`.

## Goals

- One canonical item id, the same wherever it is read.
- Computed where the data is produced: the extension, offline.
- Stable across dictionary rebuilds.
- Ambiguity recorded, never guessed silently.

## Non-goals

- Changing the tokenizer. kuromoji + IPADIC stays.
- Re-running Phase 0 on the new identity. Phase 0 artifacts keep `item_key` as history.
- Grammar items. Particles and auxiliaries stay out of the item space, as in the contract.
- Per-kanji items (still v2).

## Anti-goals

- An id that a learner cannot recognize. The id must correspond to the dictionary entry they see
  in the popup and mine.
- Resolving a homograph by picking the first match without saying so in the data.

## Approaches considered

1. **JMdict entry id, computed in the extension — chosen.** All learner data is produced in the
   extension, so the identity is computed there and stored in every event and card. Python never
   re-tokenizes logged text; it maps its word-level resources to entry ids by dictionary lookup.
   The JLPT lists map with 98.2 % unique matches (0.4 % ambiguous, 1.4 % unmatched, 6,803 items).
   Cost: passive exposures on homographs need disambiguation by reading, and some stay ambiguous.
2. **IPADIC on the Python side too.** Cheapest: one tokenizer, one key. Rejected: the key is a
   raw kuromoji string with no orthographic normalization, and homographs (月 がつ/つき) collapse
   into one key.
3. **UniDic inside the extension.** Keeps the original contract. Rejected: tens of MB added to an
   extension that already ships a 46 MB JMdict, a MeCab-to-WASM port, and the popup still needs
   JMdict anyway.

## Design

### The id

`item_id` is the JMdict entry sequence number with a namespace prefix (`"jmdict:1255430"`), taken
from the `id` field already present in `extension/public/dict/jmdict.min.json`. The prefix costs
nothing now and keeps room for other item spaces later (per-kanji, grammar points) without
collisions. JMdict sequence numbers are
stable across releases; an entry that is merged or withdrawn upstream is the only way an id
changes meaning, and that is handled by the rebuild check below.

### Trackable tokens

Same intent as the contract: learnable content words. On IPADIC this means `pos` in 名詞, 動詞,
形容詞, 副詞, 連体詞, 接続詞, 感動詞, excluding 名詞-固有名詞 and 名詞-数 (they still count toward
the OOV gate) and excluding non-independent forms (動詞-非自立, 名詞-非自立, 形容詞-非自立) that
behave as grammar. The exact mapping is pinned by the fixture test, not by this prose.

Merged compounds (the extension's existing JMdict compound merging) are one token and resolve to
the compound's entry.

### Resolution

For each trackable token, in order:

1. **Candidates**: entries whose forms contain the token's base form; if none, its surface form
   (the extension's current fallback).
2. **Reading filter**: keep candidates whose kana include the token's base-form reading. For an
   uninflected token that is kuromoji's reading; for an inflected one, the reading of the base
   form (the builder chooses how to derive it, e.g. tokenizing the base form once and caching).
   If the filter would remove every candidate, keep the unfiltered set.
3. **Common filter**: if more than one remains, keep those marked common in JMdict. This needs the
   `common` flag, which the raw `jmdict-eng.json` has (`kana[].common`, `kanji[].common`) and the
   build currently drops; carry it into `jmdict.min.json`.
4. **Result**: one candidate → `item_id` set, `ambiguous: false`. Several → `item_id` set to the
   remaining candidate with the lowest sequence number (deterministic) and `ambiguous: true`, with the full `candidates` list kept. None →
   the token is out of dictionary and gets no `item_id`.

When the learner opens the popup and picks an entry (lookup, mining), that choice is
authoritative: the event records the chosen `item_id` with `ambiguous: false`.

### What every record carries

Exposure and lookup events, and cards, store `item_id`, `ambiguous`, and `candidates` when
ambiguous. The study can then report results with and without ambiguous exposures instead of
discovering the problem afterwards.

### Python side

A function in `ml/` maps a `(surface, reading)` pair to entry ids by dictionary lookup — no
tokenizer. JLPT lists and, later, frequency tables gain an `item_id` column. It reads the same
`jmdict.min.json` the extension ships, so both sides share one dictionary version. The existing
`item_key` stays for Phase 0 artifacts and is not used for learner data.

### Dictionary version

`jmdict.min.json` records the JMdict release it was built from. A rebuild compares the old and new
id sets and fails loudly if an id that existed before disappears, so no logged id ever points at
nothing without someone deciding what to do about it.

## Testing

- A fixture test in the extension pins expected `item_id` and `ambiguous` for known-hard tokens:
  homographs (月 in 一月 and 月が, 他, 生), kana-written words (その, こと, ある), する-verbs,
  inflected forms (通って, 届けた), a merged compound, a proper noun (no id), and an
  out-of-dictionary word. It runs in CI.
- A Python test maps a fixed sample of JLPT list rows and asserts the ids the extension test pins
  for the same words, so the two sides cannot drift apart unnoticed.
- The measurement that produced the table above moves into the repo (`ml/scripts/`, with its
  small Node helper for the kuromoji side) so it can be rerun after a dictionary or tokenizer
  change.

## Calls made without asking

- The `jmdict:` namespace prefix on ids.
- Lowest sequence number as the deterministic pick among ambiguous candidates.
- Python reads the extension's `jmdict.min.json` directly, so there is one dictionary file.

## Left to the builder

- How to derive the base-form reading of inflected tokens.
- Where `resolveItem` lives in `extension/src/core/` and how it plugs into `analyzeText`.
- The storage shape of the dictionary-version check.
