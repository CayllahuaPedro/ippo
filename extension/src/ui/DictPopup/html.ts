import type { DictEntry, PosTagMap } from '../../core/types';
import type { PartResult } from '../../core/messages';
import { classifyPitch, type PitchPattern } from '../../core/pitch';
import { PITCH_COLOR_CSS, themeCss } from '../theme';

export interface PopupData {
  word: string;
  reading?: string;
  accentPos: number | null;
  entries: DictEntry[];
  posTags?: PosTagMap;
  parts?: PartResult[];
}

const PITCH_LABELS: Record<PitchPattern, string> = {
  heiban: 'Heiban',
  atamadaka: 'Atamadaka',
  nakadaka: 'Nakadaka',
  odaka: 'Odaka',
  unknown: 'Sin datos de acento',
};

const MAX_SENSES = 5;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!,
  );

const renderChip = (code: string, description?: string) =>
  `<span class="mjp-chip"${description ? ` title="${escapeHtml(description)}"` : ''}>${escapeHtml(code)}</span>`;

const renderParts = (parts: PartResult[] | undefined) => {
  if (!parts?.length) return '';
  const items = parts
    .map((p) => {
      const gloss = p.entries[0]?.senses[0]?.gloss[0];
      return `
        <li>
          <span class="mjp-part-word">${escapeHtml(p.word)}</span>
          ${p.reading ? `<span class="mjp-part-reading">${escapeHtml(p.reading)}</span>` : ''}
          ${gloss ? `<span class="mjp-part-gloss">${escapeHtml(gloss)}</span>` : ''}
        </li>`;
    })
    .join('');
  return `<div class="mjp-parts"><p class="mjp-parts-title">Partes</p><ul>${items}</ul></div>`;
};

export function renderPopupHtml(data: PopupData): string {
  const pattern = data.reading
    ? classifyPitch(data.reading, data.accentPos)
    : 'unknown';
  const accentPos =
    data.accentPos === null ? '' : `<span class="mjp-pill-pos">${data.accentPos}</span>`;

  const shown = data.entries[0]?.senses.slice(0, MAX_SENSES) ?? [];
  const hiddenCount =
    data.entries.reduce((total, e) => total + e.senses.length, 0) - shown.length;
  const senses = shown
    .map(
      (s) => `
      <li>
        ${s.pos.map((p) => renderChip(p, data.posTags?.[p])).join('')}
        <span class="mjp-gloss">${escapeHtml(s.gloss.join('; '))}</span>
      </li>`,
    )
    .join('');
  const more =
    hiddenCount > 0
      ? `<p class="mjp-more">${hiddenCount} ${hiddenCount === 1 ? 'acepción' : 'acepciones'} más</p>`
      : '';

  return `
    <div class="mjp-popup">
      <div class="mjp-head">
        <div class="mjp-headword">
          ${data.reading ? `<span class="mjp-reading">${escapeHtml(data.reading)}</span>` : ''}
          <span class="mjp-word">${escapeHtml(data.word)}</span>
        </div>
        <span class="mjp-pill mjp-${pattern}"><span class="mjp-pill-label">${PITCH_LABELS[pattern]}</span>${accentPos}</span>
      </div>
      ${
        data.entries.length === 0
          ? '<p class="mjp-nodef">No está en el diccionario</p>'
          : `<ol class="mjp-senses">${senses}</ol>${more}`
      }
      ${renderParts(data.parts)}
    </div>`;
}

export const POPUP_CSS = `
${themeCss(':host')}
.mjp-popup {
  position: fixed;
  z-index: 2147483647;
  box-sizing: border-box;
  width: max-content;
  min-width: 220px;
  max-width: 340px;
  max-height: 320px;
  overflow-y: auto;
  padding: 18px 20px 20px;
  background: var(--mjp-ground);
  color: var(--mjp-ink);
  border: 1px solid var(--mjp-hairline);
  border-radius: var(--mjp-radius-panel);
  box-shadow: var(--mjp-shadow-float);
  font: 400 14px/1.55 var(--mjp-font-ui);
  letter-spacing: normal;
  text-align: left;
  text-transform: none;
  scrollbar-width: thin;
  scrollbar-color: var(--mjp-faint) transparent;
}
.mjp-popup *, .mjp-popup *::before, .mjp-popup *::after { box-sizing: border-box; }
.mjp-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--mjp-hairline);
}
.mjp-headword { display: flex; flex-direction: column; min-width: 0; }
.mjp-reading {
  font: 400 13px/1.3 var(--mjp-font-jp);
  color: var(--mjp-muted);
  letter-spacing: 0.02em;
}
.mjp-word { font: 500 28px/1.15 var(--mjp-font-jp); letter-spacing: 0.01em; }
${PITCH_COLOR_CSS}
.mjp-unknown { color: var(--mjp-muted); }
.mjp-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: var(--mjp-radius-control);
  border: 1px solid currentColor;
  background: var(--mjp-ground);
  font: 500 12px/1.2 var(--mjp-font-ui);
}
.mjp-pill-label { color: var(--mjp-ink); }
.mjp-pill-pos {
  padding-left: 6px;
  border-left: 1px solid currentColor;
  color: var(--mjp-ink);
  font-variant-numeric: tabular-nums;
}
.mjp-senses { margin: 0; padding: 0; list-style: none; counter-reset: sense; }
.mjp-senses li {
  counter-increment: sense;
  position: relative;
  padding-left: 22px;
  margin-top: 8px;
}
.mjp-senses li:first-child { margin-top: 0; }
.mjp-senses li::before {
  content: counter(sense);
  position: absolute;
  left: 0;
  top: 0;
  color: var(--mjp-muted);
  font: 400 13px/1.55 var(--mjp-font-ui);
  font-variant-numeric: tabular-nums;
}
.mjp-chip {
  display: inline-block;
  margin: 0 4px 2px 0;
  padding: 0 6px;
  border: 1px solid var(--mjp-hairline);
  border-radius: 4px;
  color: var(--mjp-muted);
  font: 400 11px/1.6 var(--mjp-font-ui);
  vertical-align: 1px;
}
.mjp-chip[title] { cursor: help; }
.mjp-gloss { color: var(--mjp-ink); }
.mjp-more { margin: 10px 0 0 22px; color: var(--mjp-muted); font-size: 13px; }
.mjp-parts { margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--mjp-hairline); }
.mjp-parts-title {
  margin: 0 0 6px;
  color: var(--mjp-muted);
  font: 400 12px/1.3 var(--mjp-font-ui);
}
.mjp-parts ul { margin: 0; padding: 0; list-style: none; }
.mjp-parts li { display: flex; align-items: baseline; gap: 8px; margin-top: 4px; font-size: 13px; }
.mjp-parts li:first-child { margin-top: 0; }
.mjp-part-word { font: 500 15px/1.3 var(--mjp-font-jp); }
.mjp-part-reading { color: var(--mjp-muted); font-family: var(--mjp-font-jp); }
.mjp-part-gloss { color: var(--mjp-ink); }
.mjp-nodef { margin: 0; color: var(--mjp-muted); }
`;
