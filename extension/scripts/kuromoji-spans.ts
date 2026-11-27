import { readFileSync } from 'node:fs';
import { initTokenizer, tokenize } from '../src/core/tokenizer';
import { isTrackable } from '../src/core/item';

interface Span {
  start: number;
  end: number;
  basicForm: string;
}

const sentences: string[] = JSON.parse(readFileSync(0, 'utf8'));
await initTokenizer('node_modules/kuromoji/dict');

const spansPerSentence: Span[][] = [];
for (const sentence of sentences) {
  const spans: Span[] = [];
  let offset = 0;
  for (const token of await tokenize(sentence)) {
    const end = offset + token.surface.length;
    if (isTrackable(token)) spans.push({ start: offset, end, basicForm: token.basicForm });
    offset = end;
  }
  spansPerSentence.push(spans);
}
process.stdout.write(JSON.stringify(spansPerSentence));
