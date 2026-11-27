import { describe, it, expect, vi, afterEach } from 'vitest';
import { analyzeText, type AnalyzeDeps } from '../src/core/analyze';
import { classifyPitch } from '../src/core/pitch';
import type { JpToken } from '../src/core/tokenizer';
import type { TokenQuery } from '../src/core/messages';
import type { ItemQuery, ItemRef } from '../src/core/item';

const compoundTokens: JpToken[] = [
  { surface: '食肉', basicForm: '食肉', reading: 'ショクニク', pos: '名詞', posDetail: '一般' },
  { surface: '目', basicForm: '目', reading: 'モク', pos: '名詞', posDetail: '接尾' },
  { surface: 'の', basicForm: 'の', reading: 'ノ', pos: '助詞', posDetail: '連体化' },
];

function makeDeps(overrides: Partial<AnalyzeDeps> = {}): AnalyzeDeps {
  return {
    tokenize: async () => compoundTokens,
    findCompounds: async () => ({ 食肉目: 'しょくにくもく' }),
    annotate: async () => ({ accents: [4, null] }),
    baseReadings: async (t) => (t.reading ? [t.reading] : []),
    resolveItems: async (queries) => queries.map(() => null),
    ...overrides,
  };
}

afterEach(() => vi.restoreAllMocks());

describe('analyzeText', () => {
  it('merges a compound and annotates it as one token', async () => {
    const annotated: TokenQuery[][] = [];
    const out = await analyzeText(
      '食肉目の',
      makeDeps({
        annotate: async (tokens) => {
          annotated.push(tokens);
          return { accents: [4, null] };
        },
      }),
    );
    expect(annotated).toEqual([
      [
        { basicForm: '食肉目', surface: '食肉目', reading: 'ショクニクモク' },
        { basicForm: 'の', surface: 'の', reading: 'ノ' },
      ],
    ]);
    expect(out[0].pattern).toBe(classifyPitch('しょくにくもく', 4));
    expect(out[0].parts).toHaveLength(2);
    expect(out[1].parts).toBeUndefined();
  });

  it('sends no compound lookup when there are no candidates', async () => {
    const findCompounds = vi.fn(async () => ({}));
    const out = await analyzeText(
      'の',
      makeDeps({ tokenize: async () => [compoundTokens[2]], findCompounds, annotate: async () => ({ accents: [null] }) }),
    );
    expect(findCompounds).not.toHaveBeenCalled();
    expect(out).toHaveLength(1);
  });

  it('annotates unmerged and warns once when the compound lookup fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = new Error('boom');
    const annotated: TokenQuery[][] = [];
    const out = await analyzeText(
      '食肉目の',
      makeDeps({
        findCompounds: async () => {
          throw error;
        },
        annotate: async (tokens) => {
          annotated.push(tokens);
          return { accents: [null, null, null] };
        },
      }),
    );
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith('[ippo] compound lookup failed, annotating unmerged', error);
    expect(annotated[0].map((t) => t.surface)).toEqual(['食肉', '目', 'の']);
    expect(out.map((t) => t.surface)).toEqual(['食肉', '目', 'の']);
  });

  describe('item resolution', () => {
    const cat: JpToken = { surface: '猫', basicForm: '猫', reading: 'ネコ', pos: '名詞', posDetail: '一般' };
    const particle: JpToken = { surface: 'を', basicForm: 'を', reading: 'ヲ', pos: '助詞', posDetail: '格助詞' };
    const tokyo: JpToken = { surface: '東京', basicForm: '東京', reading: 'トウキョウ', pos: '名詞', posDetail: '固有名詞' };
    const catRef: ItemRef = { itemId: 'jmdict:1467640', ambiguous: false };

    it('resolves trackable tokens only and attaches the result', async () => {
      const queries: ItemQuery[][] = [];
      const out = await analyzeText(
        '猫を東京',
        makeDeps({
          tokenize: async () => [cat, particle, tokyo],
          findCompounds: async () => ({}),
          annotate: async () => ({ accents: [1, null, null] }),
          resolveItems: async (q) => {
            queries.push(q);
            return [catRef];
          },
        }),
      );
      expect(queries).toEqual([[{ basicForm: '猫', surface: '猫', baseReadings: ['ネコ'] }]]);
      expect(out[0].item).toEqual(catRef);
      expect(out[1].item).toBeUndefined();
      expect(out[2].item).toBeUndefined();
    });

    it('resolves a merged compound once and gives its parts no item', async () => {
      const queries: ItemQuery[][] = [];
      const out = await analyzeText(
        '食肉目の',
        makeDeps({
          resolveItems: async (q) => {
            queries.push(q);
            return [catRef];
          },
        }),
      );
      expect(queries[0].map((q) => q.surface)).toEqual(['食肉目']);
      expect(out[0].item).toEqual(catRef);
      expect(out[0].parts?.every((p) => !('item' in p))).toBe(true);
    });

    it('renders tokens without ids and warns when item resolution fails', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const error = new Error('boom');
      const out = await analyzeText(
        '猫',
        makeDeps({
          tokenize: async () => [cat],
          findCompounds: async () => ({}),
          annotate: async () => ({ accents: [1] }),
          resolveItems: async () => {
            throw error;
          },
        }),
      );
      expect(warn).toHaveBeenCalledWith('[ippo] item resolution failed, annotating without ids', error);
      expect(out[0].item).toBeUndefined();
      expect(out[0].surface).toBe('猫');
    });

    it('sends the base-form readings of an inflected token', async () => {
      const queries: ItemQuery[][] = [];
      const inflected: JpToken = { surface: '飼っ', basicForm: '飼う', reading: 'カッ', pos: '動詞', posDetail: '自立' };
      await analyzeText(
        '飼っ',
        makeDeps({
          tokenize: async () => [inflected],
          findCompounds: async () => ({}),
          annotate: async () => ({ accents: [1] }),
          baseReadings: async () => ['カウ'],
          resolveItems: async (q) => {
            queries.push(q);
            return [catRef];
          },
        }),
      );
      expect(queries[0]).toEqual([{ basicForm: '飼う', surface: '飼っ', baseReadings: ['カウ'] }]);
    });
  });
});
