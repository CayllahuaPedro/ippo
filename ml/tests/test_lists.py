"""JLPT list ingestion: headword → item_key normalization + level loading (spec §4)."""

from nihon_ml.jlpt.lists import headword_to_item_id, headword_to_item_key, load_jlpt_levels
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
