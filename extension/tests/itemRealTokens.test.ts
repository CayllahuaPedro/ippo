// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest';
import fixture from './fixtures/item-identity.json';
import { baseReadings, initTokenizer, tokenize } from '../src/core/tokenizer';
import { isTrackable, resolveItem } from '../src/core/item';
import type { DictEntry } from '../src/core/types';

const entries = fixture.entries as DictEntry[];
const byForm = (form: string) => entries.filter((e) => e.forms.includes(form));

const trackableSurfaces = async (text: string) =>
  (await tokenize(text)).filter(isTrackable).map((t) => t.surface);

describe('item identity on real kuromoji tokens', () => {
  beforeAll(async () => {
    await initTokenizer('node_modules/kuromoji/dict');
  }, 60_000);

  it.each([
    ['書かせた', ['書か']],
    ['私たち', ['私']],
    ['降りそう', ['降り']],
  ])('keeps grammar suffixes out of %s', async (text, expected) => {
    expect(await trackableSurfaces(text)).toEqual(expected);
  });

  it('resolves an inflected 空い to あく instead of the isolated reading すく', async () => {
    const [vacant] = await tokenize('空いた席');
    const ref = resolveItem(
      { basicForm: vacant.basicForm, surface: vacant.surface, baseReadings: await baseReadings(vacant) },
      byForm,
    );
    expect(ref).toEqual({ itemId: 'jmdict:1586270', ambiguous: false });
  });

  it('resolves 一月 as one token to the month-of-January entry', async () => {
    const [january] = await tokenize('一月');
    const ref = resolveItem(
      { basicForm: january.basicForm, surface: january.surface, baseReadings: await baseReadings(january) },
      byForm,
    );
    expect(ref?.itemId).toBe('jmdict:1162120');
  });
});
