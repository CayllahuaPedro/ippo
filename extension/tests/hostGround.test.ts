import { describe, it, expect } from 'vitest';
import { isLightGround } from '../src/ui/hostGround';

describe('isLightGround', () => {
  it('treats white as light', () => {
    expect(isLightGround(['rgb(255, 255, 255)'])).toBe(true);
  });
  it('treats near-white as light', () => {
    expect(isLightGround(['rgb(245, 245, 248)'])).toBe(true);
  });
  it('treats dark indigo as dark', () => {
    expect(isLightGround(['rgb(20, 18, 43)'])).toBe(false);
  });
  it('skips transparent ancestors and uses the first painted one', () => {
    expect(isLightGround(['rgba(0, 0, 0, 0)', 'transparent', 'rgb(20, 18, 43)', 'rgb(255, 255, 255)'])).toBe(false);
  });
  it('falls back to white when nothing is painted', () => {
    expect(isLightGround(['rgba(0, 0, 0, 0)', 'transparent'])).toBe(true);
    expect(isLightGround([])).toBe(true);
  });
  it('parses rgba with alpha and ignores unparsable values', () => {
    expect(isLightGround(['rgba(10, 10, 10, 0.9)'])).toBe(false);
    expect(isLightGround(['nonsense', 'rgb(0, 0, 0)'])).toBe(false);
  });
});
