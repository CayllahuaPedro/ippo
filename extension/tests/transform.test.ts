import { describe, it, expect } from 'vitest';
import { transformJmdict, transformPitch, transformPosTags } from '../src/data/transform';

describe('transformJmdict', () => {
  it('flattens a jmdict-simplified word', () => {
    const raw = [
      {
        id: '1467640',
        kanji: [{ text: '猫', common: false }],
        kana: [{ text: 'ねこ', common: false }, { text: 'ネコ', common: false }],
        sense: [
          { partOfSpeech: ['n'], gloss: [{ text: 'cat' }, { text: 'feline' }] },
        ],
      },
    ];
    expect(transformJmdict(raw)).toEqual([
      {
        id: '1467640',
        kanji: ['猫'],
        kana: ['ねこ', 'ネコ'],
        forms: ['猫', 'ねこ', 'ネコ'],
        common: false,
        senses: [{ pos: ['n'], gloss: ['cat', 'feline'] }],
      },
    ]);
  });

  it('marks an entry common when any kana form is common', () => {
    const raw = [
      {
        id: '1004190',
        kanji: [],
        kana: [{ text: 'こと', common: true }],
        sense: [{ partOfSpeech: ['n'], gloss: [{ text: 'thing' }] }],
      },
    ];
    expect(transformJmdict(raw)[0].common).toBe(true);
  });

  it('marks an entry common when any kanji form is common', () => {
    const raw = [
      {
        id: '1',
        kanji: [{ text: '猫', common: true }],
        kana: [{ text: 'ねこ', common: false }],
        sense: [{ partOfSpeech: ['n'], gloss: [{ text: 'cat' }] }],
      },
    ];
    expect(transformJmdict(raw)[0].common).toBe(true);
  });

  it('leaves an entry uncommon when no form is common', () => {
    const raw = [
      {
        id: '2',
        kanji: [{ text: '他', common: false }],
        kana: [{ text: 'ほか', common: false }],
        sense: [{ partOfSpeech: ['n'], gloss: [{ text: 'other' }] }],
      },
    ];
    expect(transformJmdict(raw)[0].common).toBe(false);
  });
});

describe('transformPosTags', () => {
  it('keeps only the tags used as a part of speech', () => {
    const words = [
      {
        id: '1',
        kanji: [],
        kana: [{ text: 'ねこ' }],
        sense: [{ partOfSpeech: ['n', 'adj-no'], gloss: [{ text: 'cat' }] }],
      },
    ];
    const tags = {
      n: 'noun (common) (futsuumeishi)',
      'adj-no': "nouns which may take the genitive case particle 'no'",
      ktb: 'Kantou-ben',
    };
    expect(transformPosTags(tags, words)).toEqual({
      n: 'noun (common) (futsuumeishi)',
      'adj-no': "nouns which may take the genitive case particle 'no'",
    });
  });
});

describe('transformPitch', () => {
  it('parses kanjium tsv lines into keys term|reading and term', () => {
    const txt = '猫\tねこ\t1\n花\tはな\t2\n';
    expect(transformPitch(txt)).toEqual({
      '猫|ねこ': 1, 猫: 1, '花|はな': 2, 花: 2,
    });
  });
  it('kana-only terms use the term as reading', () => {
    expect(transformPitch('ここ\t\t0\n')).toEqual({ 'ここ|ここ': 0, ここ: 0 });
  });
  it('takes first accent of a list and skips unparseable lines', () => {
    expect(transformPitch('端\tはし\t0,3\nx\ty\t(名)?\n\n')).toEqual({
      '端|はし': 0, 端: 0,
    });
  });
});
