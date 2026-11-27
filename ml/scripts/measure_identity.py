"""Measure how far UniDic (ml/) and IPADIC (extension) agree on content words and JMdict entries.

Reproduces the table in docs/superpowers/specs/2026-11-12-item-identity-jmdict-design.md. Rerun it
after a dictionary or tokenizer change.

Usage:
    python scripts/measure_identity.py [--n 2000] [--seed 20261112]
"""

import argparse
import csv
import json
import pathlib
import random
import subprocess
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from nihon_ml.jmdict import Jmdict
from nihon_ml.tokenize import _OOV_FRAME_POS2, _TRACKABLE_POS1, _tagger

_ML = pathlib.Path(__file__).resolve().parents[1]
_EXTENSION = _ML.parent / "extension"
_TATOEBA = _ML / "data" / "raw" / "tatoeba_jpn.tsv"
_JMDICT = _EXTENSION / "public" / "dict" / "jmdict.min.json"


def _sample_sentences(n: int, seed: int) -> list[str]:
    with _TATOEBA.open(encoding="utf-8", newline="") as f:
        sentences = [row[1] for row in csv.reader(f, delimiter="\t") if len(row) >= 2]
    return random.Random(seed).sample(sentences, n)


def _ipadic_spans(sentences: list[str]) -> list[list[dict]]:
    result = subprocess.run(
        ["npx", "tsx", "scripts/kuromoji-spans.ts"],
        cwd=_EXTENSION,
        input=json.dumps(sentences),
        capture_output=True,
        text=True,
        check=True,
    )
    return json.loads(result.stdout)


def _unidic_spans(sentence: str) -> list[dict]:
    spans, offset = [], 0
    for node in _tagger(sentence):
        offset += len(node.white_space)
        end = offset + len(node.surface)
        f = node.feature
        if f.pos1 in _TRACKABLE_POS1 and f.pos2 not in _OOV_FRAME_POS2:
            spans.append({"start": offset, "end": end, "lemma": f.lemma, "orthBase": f.orthBase})
        offset = end
    return spans


def _pct(part: int, whole: int) -> str:
    return f"{part / whole:.1%}" if whole else "n/a"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--n", type=int, default=2000)
    ap.add_argument("--seed", type=int, default=20261112)
    args = ap.parse_args()

    for path in (_TATOEBA, _JMDICT):
        if not path.exists():
            sys.exit(f"{path} not found; see ml/README.md for how to produce it")

    jmdict = Jmdict.load(_JMDICT)
    sentences = _sample_sentences(args.n, args.seed)
    ipadic = _ipadic_spans(sentences)

    unidic_total = ipadic_total = same_span = 0
    lemma_equal = orth_equal = both_resolve = overlap = same_single = 0
    for sentence, ip_spans in zip(sentences, ipadic, strict=True):
        uni_spans = _unidic_spans(sentence)
        unidic_total += len(uni_spans)
        ipadic_total += len(ip_spans)
        ip_by_span = {(s["start"], s["end"]): s for s in ip_spans}
        for uni in uni_spans:
            ip = ip_by_span.get((uni["start"], uni["end"]))
            if ip is None:
                continue
            same_span += 1
            lemma_equal += uni["lemma"] == ip["basicForm"]
            orth_equal += uni["orthBase"] == ip["basicForm"]
            uni_ids = {e["id"] for e in jmdict.entries_for(uni["orthBase"])}
            ip_ids = {e["id"] for e in jmdict.entries_for(ip["basicForm"])}
            if uni_ids and ip_ids:
                both_resolve += 1
                overlap += bool(uni_ids & ip_ids)
                same_single += len(uni_ids) == 1 and uni_ids == ip_ids

    print(f"Measured on {args.n} random Tatoeba sentences (seed {args.seed}), content words only")
    print(f"| Content spans identical, share of UniDic's | {_pct(same_span, unidic_total)} |")
    print(f"| Content spans identical, share of IPADIC's | {_pct(same_span, ipadic_total)} |")
    print(f"| Identical spans: UniDic lemma == IPADIC base form | {_pct(lemma_equal, same_span)} |")
    print(
        f"| Identical spans: UniDic orthBase == IPADIC base form | {_pct(orth_equal, same_span)} |"
    )
    print(f"| Both resolve to at least one JMdict entry | {_pct(both_resolve, same_span)} |")
    print(f"| Their candidate entries overlap | {_pct(overlap, both_resolve)} |")
    print(f"| Both land on the same single entry | {_pct(same_single, both_resolve)} |")


if __name__ == "__main__":
    main()
