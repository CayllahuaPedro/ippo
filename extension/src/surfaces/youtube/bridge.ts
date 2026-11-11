import type { CaptionTrack } from './tracks';

export const BRIDGE_SOURCE = 'ippo';

export type ToIsolated =
  | { source: 'ippo'; type: 'timedtext-url'; videoId: string; url: string }
  | { source: 'ippo'; type: 'tracks'; videoId: string; tracks: CaptionTrack[]; isLive: boolean };

export type ToMain =
  | { source: 'ippo'; type: 'ensure-captions'; track: CaptionTrack }
  | { source: 'ippo'; type: 'restore-captions' }
  | { source: 'ippo'; type: 'request-state' };

export function isBridgeMessage<T extends { source: string }>(data: unknown): data is T {
  return typeof data === 'object' && data !== null && (data as { source?: unknown }).source === BRIDGE_SOURCE;
}

export function isTimedtextUrl(url: string): boolean {
  try {
    return new URL(url, 'https://www.youtube.com').pathname === '/api/timedtext';
  } catch {
    return false;
  }
}

interface RawTrack {
  languageCode?: unknown;
  kind?: unknown;
  name?: { simpleText?: unknown; runs?: { text?: unknown }[] };
}

function trackName(name: RawTrack['name']): string | undefined {
  const text = name?.simpleText ?? name?.runs?.[0]?.text;
  return typeof text === 'string' ? text : undefined;
}

function toTrack(raw: RawTrack): CaptionTrack | null {
  if (typeof raw?.languageCode !== 'string') return null;
  const track: CaptionTrack = { languageCode: raw.languageCode };
  if (raw.kind === 'asr') track.kind = 'asr';
  const name = trackName(raw.name);
  if (name !== undefined) track.name = name;
  return track;
}

export function extractTracks(playerResponse: unknown): { tracks: CaptionTrack[]; isLive: boolean } {
  const response = playerResponse as {
    videoDetails?: { isLive?: unknown };
    captions?: { playerCaptionsTracklistRenderer?: { captionTracks?: unknown } };
  } | null;
  const isLive = response?.videoDetails?.isLive === true;
  const rawTracks = response?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  if (!Array.isArray(rawTracks)) return { tracks: [], isLive };
  const tracks = rawTracks.map(toTrack).filter((t): t is CaptionTrack => t !== null);
  return { tracks, isLive };
}

const TO_MAIN_TYPES: ReadonlySet<unknown> = new Set<ToMain['type']>(['ensure-captions', 'restore-captions', 'request-state']);
const TO_ISOLATED_TYPES: ReadonlySet<unknown> = new Set<ToIsolated['type']>(['timedtext-url', 'tracks']);

export function isToMain(data: unknown): data is ToMain {
  return isBridgeMessage<ToMain>(data) && TO_MAIN_TYPES.has(data.type);
}

export function isToIsolated(data: unknown): data is ToIsolated {
  return isBridgeMessage<ToIsolated>(data) && TO_ISOLATED_TYPES.has(data.type);
}

export function watchVideoId(href: string): string | null {
  try {
    const url = new URL(href);
    return url.pathname === '/watch' ? url.searchParams.get('v') || null : null;
  } catch {
    return null;
  }
}
