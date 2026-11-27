"""JLPT list ingestion (spec §4).

Tanos lists give surface + reading but no POS, so a naive lookup would miss conjugations and
fail to split homographs. The fix: run every headword through the *same* fugashi pipeline as the
corpus to derive its item_key, keeping one identity function across list and text. Headwords that
don't resolve to a single content token are skipped (and counted upstream, not silently dropped).
"""

import csv
import pathlib

from nihon_ml.jmdict import Jmdict
from nihon_ml.tokenize import TRACKABLE, tokens

_LEVEL_FILES = {"n5": 0, "n4": 1, "n3": 2, "n2": 3, "n1": 4}

ITEM_CSV_HEADER = [
    "item_key",
    "item_id",
    "item_ambiguous",
    "lemma",
    "reading",
    "pos",
    "level",
    "source_surface",
    "source_reading",
]


def headword_to_item_key(surface: str) -> str | None:
    content = [t for t in tokens(surface) if t.frame_bucket == TRACKABLE]
    if len(content) != 1:
        return None
    return content[0].item_key


def headword_to_item_id(surface: str, reading: str | None, jmdict: Jmdict) -> str | None:
    resolution = jmdict.resolve(surface, reading)
    return resolution.item_id if resolution else None


def build_level_rows(
    headwords: list[tuple[str, str]], jmdict: Jmdict, ordinal: int
) -> tuple[list[list], dict]:
    """One CSV row per distinct headword identity.

    A headword is kept when it has a UniDic `item_key` or a JMdict `item_id`. Rows are deduped on
    `item_id` when there is one, so two words that UniDic collapses into one lemma both survive.
    """
    rows: list[list] = []
    seen: set[str] = set()
    stats = {"skipped_multitoken": 0, "unique": 0, "ambiguous": 0, "unmatched": 0}
    for surface, source_reading in headwords:
        key = headword_to_item_key(surface)
        resolution = jmdict.resolve(surface, source_reading or None)
        if key is None and resolution is None:
            stats["skipped_multitoken"] += 1
            continue
        identity = resolution.item_id if resolution else key
        if identity in seen:
            continue
        seen.add(identity)
        if resolution is None:
            stats["unmatched"] += 1
        else:
            stats["ambiguous" if resolution.ambiguous else "unique"] += 1
        lemma, reading, pos = key.split("|") if key else ("", "", "")
        rows.append(
            [
                key or "",
                resolution.item_id if resolution else "",
                resolution.ambiguous if resolution else "",
                lemma,
                reading,
                pos,
                ordinal,
                surface,
                source_reading,
            ]
        )
    return rows, stats


def load_jlpt_levels(csv_dir: pathlib.Path) -> dict[str, int]:
    levels: dict[str, int] = {}
    for stem, level in _LEVEL_FILES.items():
        path = pathlib.Path(csv_dir) / f"{stem}.csv"
        if not path.exists():
            continue
        with path.open(encoding="utf-8") as f:
            for row in csv.DictReader(f):
                key = row["item_key"]
                if not key:
                    continue
                # A key can appear across lists (homograph, or fugashi collapsing two
                # surfaces to one lemma). It's known as soon as its easiest level is reached,
                # so the minimum level wins — never inflate difficulty by taking a later list.
                prev = levels.get(key)
                if prev is None or level < prev:
                    levels[key] = level
    return levels
