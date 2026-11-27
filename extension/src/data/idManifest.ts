export interface IdManifest {
  release: string;
  dictDate: string;
  ids: string[];
}

export function checkIdStability(
  previous: IdManifest | null,
  nextIds: string[],
): { missing: string[] } {
  if (!previous) return { missing: [] };
  const next = new Set(nextIds);
  return { missing: previous.ids.filter((id) => !next.has(id)) };
}
