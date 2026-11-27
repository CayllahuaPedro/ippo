import { katakanaToHiragana } from './kana';
import type { JpToken } from './tokenizer';
import type { DictEntry } from './types';

export interface ItemRef {
  itemId: string;
  ambiguous: boolean;
  candidates?: string[];
}

export interface ItemQuery {
  basicForm: string;
  surface: string;
  baseReadings: string[];
}

const ITEM_NAMESPACE = 'jmdict:';
const UNKNOWN_BASE_FORM = '*';
const TRACKABLE_POS = new Set(['名詞', '動詞', '形容詞', '副詞', '連体詞', '接続詞', '感動詞']);
const UNTRACKED_DETAILS = new Set(['固有名詞', '数', '非自立', '接尾']);

export function isTrackable(t: JpToken): boolean {
  return TRACKABLE_POS.has(t.pos) && !UNTRACKED_DETAILS.has(t.posDetail);
}

const toItemId = (entry: DictEntry): string => `${ITEM_NAMESPACE}${entry.id}`;
const byNumericId = (a: DictEntry, b: DictEntry): number => Number(a.id) - Number(b.id);

function candidatesFor(query: ItemQuery, entriesByForm: (form: string) => DictEntry[]): DictEntry[] {
  const forms = query.basicForm === UNKNOWN_BASE_FORM ? [query.surface] : [query.basicForm, query.surface];
  for (const form of forms) {
    const found = entriesByForm(form);
    if (found.length > 0) return found;
  }
  return [];
}

function keepIfAny<T>(items: T[], keep: (item: T) => boolean): T[] {
  const kept = items.filter(keep);
  return kept.length > 0 ? kept : items;
}

export function resolveItem(
  query: ItemQuery,
  entriesByForm: (form: string) => DictEntry[],
): ItemRef | null {
  let candidates = candidatesFor(query, entriesByForm);
  if (candidates.length === 0) return null;

  const matching = query.baseReadings
    .map(katakanaToHiragana)
    .map((reading) => candidates.filter((e) => e.kana.some((k) => katakanaToHiragana(k) === reading)))
    .find((matches) => matches.length > 0);
  if (matching) candidates = matching;
  if (candidates.length > 1) candidates = keepIfAny(candidates, (e) => e.common);

  const sorted = candidates.toSorted(byNumericId);
  if (sorted.length === 1) return { itemId: toItemId(sorted[0]), ambiguous: false };
  return { itemId: toItemId(sorted[0]), ambiguous: true, candidates: sorted.map(toItemId) };
}

export function itemRefFromEntry(entry: DictEntry): ItemRef {
  return { itemId: toItemId(entry), ambiguous: false };
}
