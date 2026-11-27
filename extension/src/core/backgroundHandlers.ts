import { isImported, importData, lookupEntries, getAccent } from './db';
import { hasKanji, katakanaToHiragana } from './kana';
import { resolveItem } from './item';
import type {
  AnnotateResult,
  ErrorResult,
  FindCompoundsResult,
  LookupResult,
  Msg,
  ResolveItemsResult,
  TokenQuery,
} from './messages';
import type { DictEntry, PitchMap, PosTagMap } from './types';

type AssetLoader = () => Promise<{ entries: DictEntry[]; pitch: PitchMap }>;
type PosTagLoader = () => Promise<PosTagMap>;

async function lookupByBasicFormOrSurface(db: IDBDatabase, query: TokenQuery) {
  const entries = await lookupEntries(db, query.basicForm);
  if (entries.length === 0 && query.surface !== query.basicForm) {
    return lookupEntries(db, query.surface);
  }
  return entries;
}

export async function handleBackgroundMessage(
  db: IDBDatabase,
  msg: Msg,
  loadAssets: AssetLoader,
  loadPosTags: PosTagLoader,
):Promise<{ ok: true } | AnnotateResult | FindCompoundsResult | ResolveItemsResult | LookupResult | ErrorResult | undefined> {
  switch (msg.type) {
    case 'ensure-imported': {
      if (!(await isImported(db))) {
        const { entries, pitch } = await loadAssets();
        await importData(db, entries, pitch);
      }
      return { ok: true };
    }
    case 'annotate': {
      const accents = await Promise.all(
        msg.tokens.map((t) =>
          getAccent(
            db,
            t.basicForm,
            t.reading ? katakanaToHiragana(t.reading) : undefined,
          ),
        ),
      );
      return { accents };
    }
    case 'resolve-items': {
      const items = await Promise.all(
        msg.tokens.map(async (query) => {
          const forms = new Map<string, DictEntry[]>();
          for (const form of new Set([query.basicForm, query.surface])) {
            forms.set(form, await lookupEntries(db, form));
          }
          return resolveItem(query, (form) => forms.get(form) ?? []);
        }),
      );
      return { items };
    }
    case 'find-compounds': {
      const matches = await Promise.all(
        msg.forms.map(async (form) => [form, (await lookupEntries(db, form))[0]] as const),
      );
      const found: Record<string, string> = {};
      for (const [form, entry] of matches) {
        if (entry) found[form] = hasKanji(form) ? (entry.kana[0] ?? form) : form;
      }
      return { found };
    }
    case 'lookup': {
      const entries = await lookupByBasicFormOrSurface(db, msg);
      const accentPos = await getAccent(
        db,
        msg.basicForm,
        msg.reading ? katakanaToHiragana(msg.reading) : undefined,
      );
      const allPosTags = await loadPosTags();
      const posTags = Object.fromEntries(
        entries
          .flatMap((e) => e.senses.flatMap((s) => s.pos))
          .filter((code) => code in allPosTags)
          .map((code) => [code, allPosTags[code]]),
      );
      if (!msg.parts) return { entries, accentPos, posTags };
      const parts = await Promise.all(
        msg.parts.map(async (part) => {
          const reading = part.reading ? katakanaToHiragana(part.reading) : undefined;
          const partEntries = await lookupByBasicFormOrSurface(db, part);
          const matchesReading = (e: DictEntry) => (reading && e.kana.includes(reading) ? 0 : 1);
          return {
            word: part.basicForm,
            reading,
            entries: partEntries.toSorted((a, b) => matchesReading(a) - matchesReading(b)),
          };
        }),
      );
      return { entries, accentPos, posTags, parts };
    }
    default:
      return undefined;
  }
}
