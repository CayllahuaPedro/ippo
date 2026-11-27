import kuromoji from 'kuromoji';
import { hiraganaToKatakana } from './kana';
import type { TokenQuery } from './messages';

export interface JpToken {
  surface: string;
  reading?: string;
  basicForm: string;
  pos: string;
  posDetail: string;
  parts?: TokenQuery[];
}

type Tokenizer = kuromoji.Tokenizer<kuromoji.IpadicFeatures>;

let tokenizerPromise: Promise<Tokenizer> | null = null;

export function initTokenizer(dicPath: string): Promise<void> {
  if (!tokenizerPromise) {
    tokenizerPromise = new Promise((resolve, reject) => {
      kuromoji.builder({ dicPath }).build((err, tokenizer) => {
        if (err) {
          tokenizerPromise = null;
          reject(err);
        } else {
          resolve(tokenizer);
        }
      });
    });
  }
  return tokenizerPromise.then(() => undefined);
}

const isHiraganaOnly = (text: string): boolean => /^[\u3040-\u309f]*$/.test(text);

function readingFromSurface(t: JpToken): string | undefined {
  if (!t.reading) return undefined;
  let stem = 0;
  while (stem < t.surface.length && stem < t.basicForm.length && t.surface[stem] === t.basicForm[stem]) stem++;
  const surfaceTail = t.surface.slice(stem);
  const baseTail = t.basicForm.slice(stem);
  if (!isHiraganaOnly(surfaceTail) || !isHiraganaOnly(baseTail)) return undefined;
  const inflectedEnding = hiraganaToKatakana(surfaceTail);
  if (!t.reading.endsWith(inflectedEnding)) return undefined;
  return t.reading.slice(0, t.reading.length - inflectedEnding.length) + hiraganaToKatakana(baseTail);
}

const isolatedReadings = new Map<string, Promise<string | undefined>>();

function readingOfBaseForm(basicForm: string): Promise<string | undefined> {
  let cached = isolatedReadings.get(basicForm);
  if (!cached) {
    cached = tokenize(basicForm).then((parts) =>
      parts.every((p) => p.reading) ? parts.map((p) => p.reading).join('') : undefined,
    );
    isolatedReadings.set(basicForm, cached);
  }
  return cached;
}

export async function baseReadings(t: JpToken): Promise<string[]> {
  if (t.basicForm === t.surface) return t.reading ? [t.reading] : [];
  const readings = [readingFromSurface(t), await readingOfBaseForm(t.basicForm)];
  return [...new Set(readings.filter((r): r is string => r !== undefined))];
}

export async function tokenize(text: string): Promise<JpToken[]> {
  if (!tokenizerPromise) throw new Error('tokenizer not initialized');
  const tokenizer = await tokenizerPromise;
  return tokenizer.tokenize(text).map((tk) => ({
    surface: tk.surface_form,
    reading: tk.reading === '*' || tk.reading === undefined ? undefined : tk.reading,
    basicForm: tk.basic_form === '*' ? tk.surface_form : tk.basic_form,
    pos: tk.pos,
    posDetail: tk.pos_detail_1,
  }));
}
