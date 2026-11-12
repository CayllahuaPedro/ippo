const RGB = /^rgba?\(\s*(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)(?:\s*[,/]\s*(\d*\.?\d+%?))?\s*\)$/;

const channel = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

function luminanceIfPainted(css: string): number | null {
  const m = RGB.exec(css.trim());
  if (!m) return null;
  const alpha = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
  if (alpha < 0.5) return null;
  return 0.2126 * channel(+m[1]) + 0.7152 * channel(+m[2]) + 0.0722 * channel(+m[3]);
}

export function isLightGround(backgrounds: string[]): boolean {
  for (const css of backgrounds) {
    const luminance = luminanceIfPainted(css);
    if (luminance !== null) return luminance > 0.5;
  }
  return true;
}

export function hostGroundIsLight(el: Element): boolean {
  const backgrounds: string[] = [];
  for (let node: Element | null = el; node; node = node.parentElement) {
    backgrounds.push(getComputedStyle(node).backgroundColor);
  }
  return isLightGround(backgrounds);
}
