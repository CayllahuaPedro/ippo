import 'fake-indexeddb/auto';
import { describe, it, expect, beforeAll } from 'vitest';
import { openDb, importData, isImported, lookupEntries, getAccent } from '../src/core/db';
import type { DictEntry } from '../src/core/types';

const entries: DictEntry[] = [
  {
    id: '1',
    kanji: ['猫'],
    kana: ['ねこ'],
    forms: ['猫', 'ねこ'],
    common: true,
    senses: [{ pos: ['n'], gloss: ['cat'] }],
  },
];
const pitch = { '猫|ねこ': 1, 猫: 1 };

describe('db schema upgrade', () => {
  it('drops a version-1 import so the dictionary is imported again with the common flag', async () => {
    const v1 = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open('migaku-jp-upgrade', 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        db.createObjectStore('entries', { keyPath: 'id' }).createIndex('forms', 'forms', { multiEntry: true });
        db.createObjectStore('pitch');
        db.createObjectStore('meta').put(true, 'imported');
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    v1.close();

    const upgraded = await openDb('migaku-jp-upgrade');
    expect(await isImported(upgraded)).toBe(false);
    upgraded.close();
  });
});

describe('db', () => {
  let db: IDBDatabase;

  beforeAll(async () => {
    db = await openDb();
  });

  it('starts not imported', async () => {
    expect(await isImported(db)).toBe(false);
  });

  it('imports and looks up by any form', async () => {
    await importData(db, entries, pitch);
    expect(await isImported(db)).toBe(true);
    expect((await lookupEntries(db, '猫'))[0].senses[0].gloss).toEqual(['cat']);
    expect((await lookupEntries(db, 'ねこ'))[0].id).toBe('1');
    expect(await lookupEntries(db, '犬')).toEqual([]);
  });

  it('gets accent with reading fallback', async () => {
    expect(await getAccent(db, '猫', 'ねこ')).toBe(1);
    expect(await getAccent(db, '猫')).toBe(1);
    expect(await getAccent(db, '犬', 'いぬ')).toBeNull();
  });
});
