"""JLPT list ingestion: headword → item_key normalization + level loading (spec §4)."""

from nihon_ml.jlpt.lists import (
    ITEM_CSV_HEADER,
    build_level_rows,
    headword_to_item_id,
    headword_to_item_key,
    load_jlpt_levels,
)
from nihon_ml.jmdict import Jmdict

_HEADER = "item_key,lemma,reading,pos,level,source_surface,source_reading"


def test_headword_resolves_to_single_item_key():
    assert headword_to_item_key("食べる") == "食べる|タベル|動詞"
    assert headword_to_item_key("猫") == "猫|ネコ|名詞"


def test_suru_headword_fuses_to_one_item():
    assert headword_to_item_key("勉強する") == "勉強する|ベンキョウスル|動詞"


def test_multitoken_headword_is_skipped():
    # An expression that tokenizes to several content tokens has no single identity → skip.
    assert headword_to_item_key("本を読む") is None


_NEKO = {
    "id": "1467640",
    "kanji": ["猫"],
    "kana": ["ねこ", "ネコ"],
    "forms": ["猫", "ねこ", "ネコ"],
    "common": True,
    "senses": [{"pos": ["n"], "gloss": ["cat"]}],
}


def test_headword_resolves_to_a_jmdict_item_id():
    assert headword_to_item_id("猫", "ねこ", Jmdict([_NEKO])) == "jmdict:1467640"


def test_headword_missing_from_the_dictionary_has_no_item_id():
    assert headword_to_item_id("謎語", "なぞご", Jmdict([_NEKO])) is None


def test_load_jlpt_levels_merges_per_level_csvs(tmp_path):
    (tmp_path / "n5.csv").write_text(
        _HEADER + "\n食べる|タベル|動詞,食べる,タベル,動詞,0,食べる,たべる\n",
        encoding="utf-8",
    )
    (tmp_path / "n3.csv").write_text(
        _HEADER + "\n経済|ケイザイ|名詞,経済,ケイザイ,名詞,2,経済,けいざい\n",
        encoding="utf-8",
    )
    lv = load_jlpt_levels(tmp_path)
    assert lv == {"食べる|タベル|動詞": 0, "経済|ケイザイ|名詞": 2}


def _entry(entry_id: str, kanji: str, kana: str) -> dict:
    return {
        "id": entry_id,
        "kanji": [kanji],
        "kana": [kana],
        "forms": [kanji, kana],
        "common": True,
        "senses": [{"pos": ["v5r"], "gloss": ["x"]}],
    }


def _rows_by_surface(rows: list[list]) -> dict[str, dict]:
    return {
        row[ITEM_CSV_HEADER.index("source_surface")]: dict(zip(ITEM_CSV_HEADER, row))
        for row in rows
    }


def test_multitoken_headword_with_a_jmdict_entry_still_gets_a_row():
    jmdict = Jmdict([_entry("1", "木曜日", "もくようび")])
    rows, stats = build_level_rows([("木曜日", "もくようび")], jmdict, ordinal=0)
    row = _rows_by_surface(rows)["木曜日"]
    assert row["item_id"] == "jmdict:1" and row["item_key"] == ""
    assert stats["skipped_multitoken"] == 0


def test_headwords_sharing_an_item_key_but_not_an_item_id_both_survive():
    jmdict = Jmdict([_entry("1", "撮る", "とる"), _entry("2", "取る", "とる")])
    rows, _ = build_level_rows([("取る", "とる"), ("撮る", "とる")], jmdict, ordinal=0)
    assert {r[ITEM_CSV_HEADER.index("item_id")] for r in rows} == {"jmdict:1", "jmdict:2"}


def test_a_headword_resolved_twice_to_the_same_item_id_is_kept_once():
    jmdict = Jmdict([_entry("2", "取る", "とる")])
    rows, _ = build_level_rows([("取る", "とる"), ("取る", "とる")], jmdict, ordinal=0)
    assert len(rows) == 1


def test_a_headword_with_neither_identity_is_skipped_and_counted():
    rows, stats = build_level_rows([("本を読む", "ほんをよむ")], Jmdict([]), ordinal=0)
    assert rows == [] and stats["skipped_multitoken"] == 1


def test_load_jlpt_levels_ignores_rows_without_an_item_key(tmp_path):
    (tmp_path / "n5.csv").write_text(
        ",".join(ITEM_CSV_HEADER)
        + "\n"
        + ",jmdict:1,False,木曜日,もくようび,名詞,0,木曜日,もくようび\n",
        encoding="utf-8",
    )
    assert load_jlpt_levels(tmp_path) == {}
