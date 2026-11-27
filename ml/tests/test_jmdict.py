"""Item identity on JMdict entry ids: the Python side must match the extension's fixture."""

import json
import pathlib

import pytest

from nihon_ml.jmdict import Jmdict

_FIXTURE = (
    pathlib.Path(__file__).resolve().parents[2]
    / "extension"
    / "tests"
    / "fixtures"
    / "item-identity.json"
)
_DATA = json.loads(_FIXTURE.read_text(encoding="utf-8"))
_TRACKABLE_CASES = [c for c in _DATA["cases"] if c["trackable"]]


@pytest.fixture(scope="module")
def jmdict(tmp_path_factory) -> Jmdict:
    path = tmp_path_factory.mktemp("dict") / "jmdict.min.json"
    path.write_text(json.dumps(_DATA["entries"], ensure_ascii=False), encoding="utf-8")
    return Jmdict.load(path)


@pytest.mark.parametrize("case", _TRACKABLE_CASES, ids=lambda c: c["name"])
def test_resolution_matches_the_extension_fixture(jmdict, case):
    result = jmdict.resolve(case["basicForm"], case["baseReading"])
    expected = case["expected"]
    if expected is None:
        assert result is None
        return
    assert result is not None
    assert result.item_id == expected["itemId"]
    assert result.ambiguous == expected["ambiguous"]
    assert list(result.candidates) == expected.get("candidates", [])


def test_katakana_reading_matches_hiragana_kana(jmdict):
    result = jmdict.resolve("月", "ガツ")
    assert result is not None and result.item_id == "jmdict:2871532"


def test_surface_that_is_not_a_form_resolves_to_nothing(jmdict):
    assert jmdict.resolve("存在しない語", None) is None
