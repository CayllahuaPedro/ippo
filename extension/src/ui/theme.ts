import type { PitchPattern } from '../core/pitch';

type PitchColors = Record<Exclude<PitchPattern, 'unknown'>, string>;

export const PITCH_COLORS: PitchColors = {
  heiban: '#053fb3',
  atamadaka: '#87371d',
  nakadaka: '#9f8504',
  odaka: '#0c9780',
};

export const PITCH_COLORS_ON_DARK: PitchColors = {
  heiban: '#6f9bff',
  atamadaka: '#ff8a66',
  nakadaka: '#e0c040',
  odaka: '#3fd0b0',
};

const pitchRules = (colors: PitchColors) =>
  Object.entries(colors)
    .map(([pattern, color]) => `.mjp-${pattern} { color: ${color}; }`)
    .join('\n');

export const PITCH_COLOR_CSS = `${pitchRules(PITCH_COLORS)}
@media (prefers-color-scheme: dark) {
${pitchRules(PITCH_COLORS_ON_DARK)}
}`;

export const FONTS_CSS_PATH = '/fonts/fonts.css';

const LIGHT_VARS = `
  --mjp-ground: #ffffff;
  --mjp-wash: #f7f7fa;
  --mjp-ink: #1b1547;
  --mjp-muted: #4b5165;
  --mjp-faint: #636880;
  --mjp-hairline: #e6e7ee;
  --mjp-accent: #6b5ce7;
  --mjp-accent-hover: #5a4bd6;
  --mjp-tint: #efedfc;
  --mjp-on-accent: #ffffff;
  --mjp-error: #b42318;
  --mjp-shadow-float: 0 12px 32px -12px rgb(27 21 71 / 0.18);
`;

export const DARK_VARS = `
  --mjp-ground: #14122b;
  --mjp-wash: #1c1a38;
  --mjp-ink: #e8e6f5;
  --mjp-muted: #a5a3bd;
  --mjp-faint: #8f8daa;
  --mjp-hairline: #2c2948;
  --mjp-accent: #8b7ff0;
  --mjp-accent-hover: #a296f5;
  --mjp-tint: #252050;
  --mjp-on-accent: #14122b;
  --mjp-error: #ff8f85;
  --mjp-shadow-float: 0 16px 40px -12px rgb(0 0 0 / 0.55);
`;

const SHAPE_AND_TYPE_VARS = `
  --mjp-radius-panel: 12px;
  --mjp-radius-control: 8px;
  --mjp-font-ui: 'Ippo Figtree', Figtree, system-ui, -apple-system, 'Segoe UI', sans-serif;
  --mjp-font-jp: 'Ippo Zen Kaku Gothic New', 'Zen Kaku Gothic New', 'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', sans-serif;
`;

export const themeCss = (selector: string) => `
${selector} {${LIGHT_VARS}${SHAPE_AND_TYPE_VARS}}
@media (prefers-color-scheme: dark) {
  ${selector} {${DARK_VARS}}
}`;

export const DARK_THEME_VARS = `${DARK_VARS}${SHAPE_AND_TYPE_VARS}`;
