import { buildRenderTokens, type RenderToken } from './annotate';
import { compoundCandidates, mergeCompounds } from './compounds';
import { isTrackable, type ItemQuery, type ItemRef } from './item';
import type { AnnotateResult, TokenQuery } from './messages';
import type { JpToken } from './tokenizer';

export interface AnalyzeDeps {
  tokenize(text: string): Promise<JpToken[]>;
  findCompounds(forms: string[]): Promise<Record<string, string>>;
  annotate(tokens: TokenQuery[]): Promise<AnnotateResult>;
  baseReadings(token: JpToken): Promise<string[]>;
  resolveItems(queries: ItemQuery[]): Promise<(ItemRef | null)[]>;
}

async function findCompoundsSafely(
  tokens: JpToken[],
  deps: AnalyzeDeps,
): Promise<Record<string, string>> {
  const candidates = compoundCandidates(tokens);
  if (candidates.length === 0) return {};
  try {
    return await deps.findCompounds(candidates);
  } catch (error) {
    console.warn('[ippo] compound lookup failed, annotating unmerged', error);
    return {};
  }
}

async function resolveTrackableItems(
  tokens: JpToken[],
  deps: AnalyzeDeps,
): Promise<(ItemRef | null)[]> {
  const trackable = tokens.flatMap((token, index) => (isTrackable(token) ? [{ token, index }] : []));
  if (trackable.length === 0) return [];
  try {
    const queries = await Promise.all(
      trackable.map(async ({ token }) => ({
        basicForm: token.basicForm,
        surface: token.surface,
        baseReadings: await deps.baseReadings(token),
      })),
    );
    const resolved = await deps.resolveItems(queries);
    const items: (ItemRef | null)[] = tokens.map(() => null);
    trackable.forEach(({ index }, i) => {
      items[index] = resolved[i] ?? null;
    });
    return items;
  } catch (error) {
    console.warn('[ippo] item resolution failed, annotating without ids', error);
    return [];
  }
}

export async function analyzeText(
  text: string,
  deps: AnalyzeDeps,
): Promise<RenderToken[]> {
  const tokens = await deps.tokenize(text);
  const merged = mergeCompounds(tokens, await findCompoundsSafely(tokens, deps));
  const { accents } = await deps.annotate(
    merged.map((t) => ({
      basicForm: t.basicForm,
      surface: t.surface,
      reading: t.reading,
    })),
  );
  return buildRenderTokens(merged, accents, await resolveTrackableItems(merged, deps));
}
