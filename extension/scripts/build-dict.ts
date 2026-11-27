import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { transformJmdict, transformPitch, transformPosTags } from '../src/data/transform';
import { checkIdStability, type IdManifest } from '../src/data/idManifest';

const JMDICT_RAW = 'data/raw/jmdict-eng.json';
const ACCENTS_RAW = 'data/raw/accents.txt';
const MANIFEST = 'data/dict-manifest.json';
const ALLOW_REMOVED_IDS = '--allow-removed-ids';

for (const f of [JMDICT_RAW, ACCENTS_RAW]) {
  if (!existsSync(f)) {
    console.error(`Falta ${f} — ver README de data/ para descargarlo`);
    process.exit(1);
  }
}

mkdirSync('public/dict', { recursive: true });

const raw = JSON.parse(readFileSync(JMDICT_RAW, 'utf8'));
const entries = transformJmdict(raw.words);

const previous: IdManifest | null = existsSync(MANIFEST)
  ? JSON.parse(readFileSync(MANIFEST, 'utf8'))
  : null;
const { missing } = checkIdStability(
  previous,
  entries.map((e) => e.id),
);
if (missing.length > 0 && !process.argv.includes(ALLOW_REMOVED_IDS)) {
  console.error(
    `${missing.length} JMdict ids from the manifest are gone (${missing.slice(0, 20).join(', ')}). ` +
      `Decide what happens to the data that points at them, then rebuild with ${ALLOW_REMOVED_IDS}.`,
  );
  process.exit(1);
}
const manifest: IdManifest = {
  release: raw.version,
  dictDate: raw.dictDate,
  ids: entries.map((e) => e.id).sort((a, b) => Number(a) - Number(b)),
};
writeFileSync(MANIFEST, JSON.stringify(manifest));
writeFileSync('public/dict/jmdict.min.json', JSON.stringify(entries));
console.log(`jmdict.min.json: ${entries.length} entradas`);

const posTags = transformPosTags(raw.tags, raw.words);
writeFileSync('public/dict/pos-tags.json', JSON.stringify(posTags));
console.log(`pos-tags.json: ${Object.keys(posTags).length} categorías`);

const pitch = transformPitch(readFileSync(ACCENTS_RAW, 'utf8'));
writeFileSync('public/dict/pitch.json', JSON.stringify(pitch));
console.log(`pitch.json: ${Object.keys(pitch).length} claves`);
