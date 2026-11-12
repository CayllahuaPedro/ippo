import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const OUT = 'public/fonts';
const SOURCES = [
  { pkg: 'zen-kaku-gothic-new', family: 'Ippo Zen Kaku Gothic New', files: ['japanese-400', 'japanese-500', 'latin-400', 'latin-500'] },
  { pkg: 'figtree', family: 'Ippo Figtree', files: ['latin-400', 'latin-500'] },
];

if (!existsSync('node_modules/@fontsource/figtree')) {
  console.warn('fontsource packages not found; run npm install first');
  process.exit(0);
}
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const css = SOURCES.flatMap(({ pkg, family, files }) =>
  files.map((name) => {
    const dir = `node_modules/@fontsource/${pkg}`;
    return readFileSync(`${dir}/${name}.css`, 'utf8')
      .replace(/font-family: '[^']+'/g, `font-family: '${family}'`)
      .replace(/, url\([^)]+\.woff\) format\('woff'\)/g, '')
      .replace(/url\(\.\/files\/([^)]+\.woff2)\)/g, (_, file) => {
        copyFileSync(`${dir}/files/${file}`, `${OUT}/${file}`);
        return `url(./${file})`;
      });
  }),
).join('\n');

writeFileSync(`${OUT}/fonts.css`, css);
console.log(`Fonts copied to ${OUT}/`);
