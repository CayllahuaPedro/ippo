import type { LockedRecommendation, Recommendation } from "./types";

/* Stand-in shelves, shaped like the /mining selection re-ranked by expected
   comprehension. */

export const comfortable: Recommendation[] = [
  {
    id: "rec-v1",
    kind: "video",
    extent: "4 min",
    japaneseTitle: "雪の朝、電車が止まった",
    source: "NHK Easy News · subtitled",
    forecast: { expected: 93, low: 88, high: 96 },
    note: "11 new words\n2 already in your SRS",
    imageDescription: "NHK news still: snowy morning platform",
  },
  {
    id: "rec-a1",
    kind: "article",
    extent: "800 chars",
    japaneseTitle: "猫と暮らす、静かな一日",
    source: "Curated blog · plain style",
    forecast: { expected: 95, low: 91, high: 98 },
    note: "6 new words\nno kanji above N4",
    imageDescription: "Photo: cat on a windowsill",
  },
  {
    id: "rec-b1",
    kind: "book",
    extent: "Vol. 1",
    japaneseTitle: "となりの町の四つ葉",
    source: "Manga · furigana throughout",
    forecast: { expected: 91, low: 85, high: 95 },
    note: "heavy spoken forms\n1,100 words per volume",
    imageDescription: "Book cover: slice-of-life manga",
  },
];

export const stretch: Recommendation[] = [
  {
    id: "rec-v2",
    kind: "video",
    extent: "12 min",
    japaneseTitle: "〜ていく と 〜てくる",
    source: "Grammar channel",
    forecast: { expected: 84, low: 76, high: 90 },
    note: "exactly what you looked up today",
    imageDescription: "Grammar lesson thumbnail",
  },
  {
    id: "rec-a2",
    kind: "article",
    extent: "1,400 chars",
    japaneseTitle: "春の便り — コラム抜粋",
    source: "Newspaper column",
    forecast: { expected: 78, low: 66, high: 88 },
    note: "62 new words · dense kanji",
    imageDescription: "Newspaper column photo",
  },
  {
    id: "rec-b2",
    kind: "book",
    extent: "Ch. 1 free",
    japaneseTitle: "風の丘の郵便屋",
    source: "Young-adult fiction",
    forecast: { expected: 81, low: 72, high: 88 },
    note: "240 new words over 9 chapters",
    imageDescription: "Novel cover: young-adult fiction",
  },
];

export const locked: LockedRecommendation[] = [
  { id: "rec-l1", japaneseTitle: "コンビニの夜", expectedComprehension: 62 },
  { id: "rec-l2", japaneseTitle: "機械の街", expectedComprehension: 54 },
];
