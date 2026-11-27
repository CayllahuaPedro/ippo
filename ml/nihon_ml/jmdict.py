"""Item identity on JMdict entry ids, mirroring `extension/src/core/item.ts`.

`item_id` is `"jmdict:" + entry id`. Resolution has no tokenizer: a form (and optionally its
hiragana reading) is looked up in the same `jmdict.min.json` the extension ships, so both sides
share one dictionary version. The shared fixture in `extension/tests/fixtures` keeps them aligned.
"""

import json
import pathlib
from dataclasses import dataclass

_NAMESPACE = "jmdict:"
_KATAKANA_FIRST, _KATAKANA_LAST, _KANA_OFFSET = 0x30A1, 0x30F6, 0x60


@dataclass(frozen=True)
class Resolution:
    item_id: str
    ambiguous: bool
    candidates: tuple[str, ...]


def _to_hiragana(text: str) -> str:
    return "".join(
        chr(ord(c) - _KANA_OFFSET) if _KATAKANA_FIRST <= ord(c) <= _KATAKANA_LAST else c
        for c in text
    )


def _keep_if_any(items: list[dict], keep) -> list[dict]:
    kept = [item for item in items if keep(item)]
    return kept or items


class Jmdict:
    def __init__(self, entries: list[dict]):
        self._by_form: dict[str, list[dict]] = {}
        for entry in entries:
            for form in entry["forms"]:
                self._by_form.setdefault(form, []).append(entry)

    @classmethod
    def load(cls, path: pathlib.Path) -> "Jmdict":
        return cls(json.loads(pathlib.Path(path).read_text(encoding="utf-8")))

    def resolve(self, form: str, reading: str | None) -> Resolution | None:
        candidates = self._by_form.get(form, [])
        if not candidates:
            return None
        if reading:
            wanted = _to_hiragana(reading)
            candidates = _keep_if_any(
                candidates, lambda e: any(_to_hiragana(k) == wanted for k in e["kana"])
            )
        if len(candidates) > 1:
            candidates = _keep_if_any(candidates, lambda e: e.get("common", False))
        ordered = sorted(candidates, key=lambda e: int(e["id"]))
        ids = tuple(f"{_NAMESPACE}{e['id']}" for e in ordered)
        if len(ids) == 1:
            return Resolution(ids[0], False, ())
        return Resolution(ids[0], True, ids)
