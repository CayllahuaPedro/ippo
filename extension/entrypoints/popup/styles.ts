import { themeCss } from '../../src/ui/theme';

export const POPUP_PAGE_CSS = `
${themeCss(':root')}
:root { color-scheme: light dark; }
* { box-sizing: border-box; }
body {
  margin: 0;
  width: 280px;
  background: var(--mjp-ground);
  color: var(--mjp-ink);
  font: 400 14px/1.55 var(--mjp-font-ui);
}
.panel { display: flex; flex-direction: column; padding: 20px 20px 16px; }
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 18px;
  font: 500 22px/1.25 var(--mjp-font-ui);
}
.brand svg { width: 24px; height: 24px; flex-shrink: 0; }
.brand-step { stroke: var(--mjp-accent); }
button {
  border: 0;
  cursor: pointer;
  font-family: var(--mjp-font-ui);
}
button:focus-visible { outline: 2px solid var(--mjp-accent); outline-offset: 2px; }
.btn-primary {
  padding: 10px 18px;
  border-radius: var(--mjp-radius-control);
  background: var(--mjp-accent);
  color: var(--mjp-on-accent);
  font-size: 15px;
  font-weight: 400;
  line-height: 1.55;
  transition: background-color 0.12s;
}
.btn-primary:hover { background: var(--mjp-accent-hover); }
.btn-text {
  align-self: center;
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: var(--mjp-radius-control);
  background: none;
  color: var(--mjp-muted);
  font-size: 14px;
  font-weight: 400;
}
.btn-text:hover { color: var(--mjp-ink); }
.status {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 12px 0 0;
  padding-top: 12px;
  border-top: 1px solid var(--mjp-hairline);
  font-size: 13px;
  color: var(--mjp-muted);
}
.status[data-state='idle'] { display: none; }
.status-dot {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  margin-top: 7px;
  border-radius: 50%;
  background: currentColor;
}
.status[data-state='busy'] .status-dot,
.status[data-state='ok'] .status-dot { color: var(--mjp-accent); }
.status[data-state='error'] { color: var(--mjp-error); }
@media (prefers-reduced-motion: no-preference) {
  .status[data-state='busy'] .status-dot { animation: pulse 1s ease-in-out infinite; }
}
@keyframes pulse { 50% { opacity: 0.3; } }
.settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--mjp-hairline);
  font-size: 14px;
}
.setting-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; }
.setting-field { display: flex; flex-direction: column; gap: 6px; color: var(--mjp-muted); }
.setting-field select {
  padding: 7px 8px;
  border: 1px solid var(--mjp-hairline);
  border-radius: var(--mjp-radius-control);
  background: var(--mjp-ground);
  color: var(--mjp-ink);
  font: inherit;
}
.switch {
  appearance: none;
  flex-shrink: 0;
  position: relative;
  width: 36px;
  height: 20px;
  margin: 0;
  border-radius: 999px;
  background: var(--mjp-faint);
  cursor: pointer;
  transition: background-color 0.12s;
}
.switch::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--mjp-ground);
  transition: transform 0.12s;
}
.switch:checked { background: var(--mjp-accent); }
.switch:checked::after { transform: translateX(16px); }
.switch:focus-visible, .setting-field select:focus-visible { outline: 2px solid var(--mjp-accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  .btn-primary, .switch, .switch::after { transition-duration: 0.01ms; }
}
`;
