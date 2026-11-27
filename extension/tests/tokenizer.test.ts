// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest';
import { baseReadings, initTokenizer, tokenize } from '../src/core/tokenizer';

describe('tokenizer', () => {
  beforeAll(async () => {
    await initTokenizer('node_modules/kuromoji/dict');
  }, 60_000);

  it('tokenizes a simple sentence', async () => {
    const tokens = await tokenize('猫を飼う');
    expect(tokens.map((t) => t.surface)).toEqual(['猫', 'を', '飼う']);
    expect(tokens[0].reading).toBe('ネコ');
    expect(tokens[0].basicForm).toBe('猫');
  });

  it('gives dictionary form for inflected verbs', async () => {
    const tokens = await tokenize('飼っている');
    expect(tokens[0].surface).toBe('飼っ');
    expect(tokens[0].basicForm).toBe('飼う');
  });

  it('exposes the POS sub-category', async () => {
    const tokens = await tokenize('食肉目の動物');
    expect(tokens.map((t) => t.posDetail)).toEqual(['一般', '接尾', '連体化', '一般']);
  });

  it('derives the dictionary-form reading from the token itself, then from the base form alone', async () => {
    const [vacant] = await tokenize('空いた席');
    expect(await baseReadings(vacant)).toEqual(['アク', 'スク']);
  });

  it('lists a single reading when both derivations agree', async () => {
    const [inflected] = await tokenize('飼っている');
    expect(await baseReadings(inflected)).toEqual(['カウ']);
  });

  it('keeps the isolated reading for irregular stems whose derived reading does not exist', async () => {
    const [come] = await tokenize('来た');
    expect(await baseReadings(come)).toEqual(['キル', 'クル']);
  });

  it('uses the surface reading when the token is already in dictionary form', async () => {
    const [noun] = await tokenize('猫を飼う');
    expect(await baseReadings(noun)).toEqual(['ネコ']);
  });
});
