import { describe, it, expect, vi } from 'vitest';
import fixture from './fixtures/item-identity.json';
import { isTrackable, itemRefFromEntry, resolveItem } from '../src/core/item';
import type { DictEntry } from '../src/core/types';
import type { JpToken } from '../src/core/tokenizer';

const entries = fixture.entries as DictEntry[];
const byForm = (form: string) => entries.filter((e) => e.forms.includes(form));

describe('item identity fixture', () => {
  it.each(fixture.cases)('$name', (c) => {
    const token: JpToken = {
      surface: c.surface,
      basicForm: c.basicForm,
      pos: c.pos,
      posDetail: c.posDetail,
    };
    expect(isTrackable(token)).toBe(c.trackable);
    if (!c.trackable) return;
    const ref = resolveItem(
      { basicForm: c.basicForm, surface: c.surface, baseReading: c.baseReading ?? undefined },
      byForm,
    );
    expect(ref).toEqual(c.expected);
  });
});

describe('resolveItem', () => {
  it('never looks up the unknown-word placeholder as a form', () => {
    const lookup = vi.fn(() => []);
    expect(resolveItem({ basicForm: '*', surface: 'ﾎﾞｯﾄ' }, lookup)).toBeNull();
    expect(lookup).not.toHaveBeenCalledWith('*');
  });

  it('falls back to the surface form when the base form is not in the dictionary', () => {
    const ref = resolveItem({ basicForm: '*', surface: '食肉目' }, byForm);
    expect(ref?.itemId).toBe('jmdict:1883210');
  });
});

describe('isTrackable', () => {
  it.each(['助詞', '助動詞', '記号', '接頭詞', 'フィラー'])('ignores %s', (pos) => {
    expect(isTrackable({ surface: 'x', basicForm: 'x', pos, posDetail: '*' })).toBe(false);
  });

  it.each([['動詞', '非自立'], ['形容詞', '非自立'], ['名詞', '数']])('ignores %s %s', (pos, posDetail) => {
    expect(isTrackable({ surface: 'x', basicForm: 'x', pos, posDetail })).toBe(false);
  });

  it.each(['名詞', '動詞', '形容詞', '副詞', '連体詞', '接続詞', '感動詞'])('tracks %s', (pos) => {
    expect(isTrackable({ surface: 'x', basicForm: 'x', pos, posDetail: '一般' })).toBe(true);
  });
});

describe('itemRefFromEntry', () => {
  it('records a popup choice as unambiguous', () => {
    expect(itemRefFromEntry(entries[0])).toEqual({ itemId: `jmdict:${entries[0].id}`, ambiguous: false });
  });
});
