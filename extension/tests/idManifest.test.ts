import { describe, it, expect } from 'vitest';
import { checkIdStability, type IdManifest } from '../src/data/idManifest';

const previous: IdManifest = { release: '3.6.2', dictDate: '2026-06-29', ids: ['1', '2'] };

describe('checkIdStability', () => {
  it('passes the first build, when there is no manifest yet', () => {
    expect(checkIdStability(null, ['1', '2'])).toEqual({ missing: [] });
  });

  it('passes a rebuild that only adds ids', () => {
    expect(checkIdStability(previous, ['1', '2', '3'])).toEqual({ missing: [] });
  });

  it('reports every id that disappeared', () => {
    expect(checkIdStability(previous, ['1'])).toEqual({ missing: ['2'] });
  });
});
