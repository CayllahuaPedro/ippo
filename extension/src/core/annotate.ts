import type { JpToken } from './tokenizer';
import { classifyPitch, type PitchPattern } from './pitch';
import { furigana } from './furigana';
import { katakanaToHiragana } from './kana';
import type { ItemRef } from './item';
import type { TokenQuery } from './messages';

export interface RenderToken {
  surface: string;
  ruby: string | null;
  pattern: PitchPattern;
  basicForm: string;
  reading?: string;
  parts?: TokenQuery[];
  item?: ItemRef;
}

export function buildRenderTokens(
  tokens: JpToken[],
  accents: (number | null)[],
  items: (ItemRef | null | undefined)[] = [],
): RenderToken[] {
  return tokens.map((t, i) => {
    const reading = t.reading ? katakanaToHiragana(t.reading) : undefined;
    const accent = accents[i] ?? null;
    return {
      surface: t.surface,
      ruby: furigana(t.surface, t.reading).ruby,
      pattern: reading ? classifyPitch(reading, accent) : 'unknown',
      basicForm: t.basicForm,
      reading,
      ...(t.parts && { parts: t.parts }),
      ...(items[i] && { item: items[i] }),
    };
  });
}
