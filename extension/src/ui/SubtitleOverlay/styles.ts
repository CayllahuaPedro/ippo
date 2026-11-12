import { DARK_THEME_VARS, PITCH_COLORS_ON_DARK } from '../theme';

const PITCH_COLOR_ON_DARK_CSS = Object.entries(PITCH_COLORS_ON_DARK)
  .map(([pattern, color]) => `.mjp-${pattern} { color: ${color}; }`)
  .join('\n  ');

export const OVERLAY_CSS = `
  :host {
    ${DARK_THEME_VARS}
    --mjp-overlay-bottom: 12%;
    position: absolute;
    inset: auto 0 var(--mjp-overlay-bottom) 0;
    z-index: 59;
    display: flex;
    justify-content: center;
    pointer-events: none;
    container-type: inline-size;
    transition: inset 0.25s ease;
  }
  :host([data-mjp-controls-hidden]) {
    --mjp-overlay-bottom: 4%;
  }
  :host([data-mjp-suppressed]) {
    display: none;
  }
  .mjp-sub {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4cqw;
    max-width: 80%;
    text-align: center;
  }
  .mjp-sub-line {
    margin: 0;
    padding: 0.4em 0.8em;
    border-radius: var(--mjp-radius-control);
    background: rgb(20 18 43 / 0.88);
    color: var(--mjp-ink);
    line-height: 1.35;
    overflow-wrap: anywhere;
  }
  .mjp-sub-primary {
    font-family: var(--mjp-font-jp);
    font-size: clamp(16px, 3.2cqw, 48px);
    font-weight: 500;
  }
  .mjp-sub-secondary {
    font-family: var(--mjp-font-ui);
    font-size: clamp(13px, 2.2cqw, 34px);
    font-weight: 400;
    color: var(--mjp-muted);
  }
  .mjp-token {
    pointer-events: auto;
    cursor: pointer;
    border-radius: 3px;
  }
  .mjp-token:hover {
    background: var(--mjp-tint);
  }
  ${PITCH_COLOR_ON_DARK_CSS}
`;
