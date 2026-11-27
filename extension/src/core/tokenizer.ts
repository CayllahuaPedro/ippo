import kuromoji from 'kuromoji';
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

const baseReadings = new Map<string, Promise<string | undefined>>();

export function baseReading(t: JpToken): Promise<string | undefined> {
  if (t.basicForm === t.surface) return Promise.resolve(t.reading);
  let cached = baseReadings.get(t.basicForm);
  if (!cached) {
    cached = tokenize(t.basicForm).then((parts) =>
      parts.every((p) => p.reading) ? parts.map((p) => p.reading).join('') : undefined,
    );
    baseReadings.set(t.basicForm, cached);
  }
  return cached;
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
