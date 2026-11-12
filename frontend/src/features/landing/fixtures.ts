import { comfortable, type Recommendation } from "@/features/discover";
import { dictionary, parseTokens, type DictionaryEntry, type Paragraph } from "@/features/reader";
import { settled, tutorThread, type TutorTurn } from "@/features/tutor";
import type { Locale } from "./types";

const lines = [
  "駅|えき#known@eki の 前|まえ#known@mae に 小|ちい/さな#learning@chiisana パン/屋|や#known@panya が あります#known@aru 。",
  "毎朝|まいあさ#known@maiasa 、 店|みせ#known@mise の 人|ひと#known@hito が 早起|はやお/き#learning@hayaoki して パン#known@pan を 焼|や/きます#learning@yaku 。",
  "香|かお/り#learning@kaori が 通|とお/り#learning@toori まで 広|ひろ/がります#learning@hirogaru 。",
];

export const demoParagraphs: Paragraph[] = [
  { id: "demo", tokens: parseTokens(lines.join(" ")) },
];

export type DemoEntry = { lemma: string; kana: string; gloss: Record<Locale, string> };

export const demoGlossary: Record<string, DemoEntry> = {
  eki: { lemma: "駅", kana: "えき", gloss: { en: "station", es: "estación" } },
  mae: { lemma: "前", kana: "まえ", gloss: { en: "front, in front of", es: "frente, delante de" } },
  chiisana: { lemma: "小さな", kana: "ちいさな", gloss: { en: "small, little", es: "pequeño" } },
  panya: { lemma: "パン屋", kana: "ぱんや", gloss: { en: "bakery", es: "panadería" } },
  aru: { lemma: "ある", kana: "ある", gloss: { en: "to be, to exist (things)", es: "haber, existir (cosas)" } },
  maiasa: { lemma: "毎朝", kana: "まいあさ", gloss: { en: "every morning", es: "cada mañana" } },
  mise: { lemma: "店", kana: "みせ", gloss: { en: "shop, store", es: "tienda" } },
  hito: { lemma: "人", kana: "ひと", gloss: { en: "person", es: "persona" } },
  hayaoki: { lemma: "早起き", kana: "はやおき", gloss: { en: "getting up early", es: "madrugar" } },
  pan: { lemma: "パン", kana: "ぱん", gloss: { en: "bread", es: "pan" } },
  yaku: { lemma: "焼く", kana: "やく", gloss: { en: "to bake, to grill", es: "hornear, asar" } },
  kaori: { lemma: "香り", kana: "かおり", gloss: { en: "scent, aroma", es: "aroma, fragancia" } },
  toori: { lemma: "通り", kana: "とおり", gloss: { en: "street, road", es: "calle" } },
  hirogaru: { lemma: "広がる", kana: "ひろがる", gloss: { en: "to spread, to extend", es: "extenderse, esparcirse" } },
};

type SnippetFixture = {
  shelfItem: Recommendation;
  entry: DictionaryEntry;
  tutorTurn: TutorTurn;
};

export const snippetFixtures: Record<Locale, SnippetFixture> = {
  en: {
    shelfItem: comfortable[0],
    entry: dictionary.yuki,
    tutorTurn: tutorThread[1],
  },
  es: {
    shelfItem: {
      ...comfortable[0],
      source: "NHK Easy News · con subtítulos",
      note: "11 palabras nuevas\n2 ya en tu SRS",
      imageDescription: "Imagen de NHK: andén nevado por la mañana",
    },
    entry: {
      ...dictionary.yuki,
      pitchLabel: "Acento 2",
      glosses: ["nieve"],
      kanji: {
        character: "雪",
        components: [
          { glyph: "⻗", meaning: "lluvia" },
          { glyph: "彐", meaning: "mano que barre" },
        ],
        readings: "セツ · ゆき",
      },
    },
    tutorTurn: {
      id: "seed-tutor-1",
      role: "tutor",
      blocks: [
        settled(
          {
            kind: "prose",
            text: "〜ていく añade dirección: el cambio se aleja de ti, con el tiempo. El color no desapareció de golpe, fue desvaneciéndose mientras el tren avanzaba.",
          },
          0,
        ),
        settled({ kind: "example", japanese: "色が消えていった", gloss: "fue desvaneciéndose" }, 1),
        settled(
          {
            kind: "prose",
            text: "〜ていた solo informaría de un estado que observaste. Si lo pones en su lugar, la nieve deja de moverse.",
          },
          2,
        ),
      ],
    },
  },
};
