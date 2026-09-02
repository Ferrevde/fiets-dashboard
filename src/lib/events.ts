/**
 * Tiny event bus for storage changes.
 *
 * Both `settingsStorage.save` and `commuteStorage.upsertDay` emit events
 * through this bus so any React hook can re-read its data without prop
 * drilling or context. In a future D1-backed world this layer becomes a
 * thin wrapper around server-side fetches - the event API stays the same.
 */

type Listener<T> = (payload: T) => void;

interface StorageEventMap {
  settings: { settings: unknown };
  commute: { year: number; month: number };
}

const listeners: Partial<Record<keyof StorageEventMap, Set<Listener<any>>>> = {};

export function emit<K extends keyof StorageEventMap>(
  channel: K,
  payload: StorageEventMap[K],
): void {
  (listeners[channel] as Set<Listener<any>> | undefined)?.forEach((listener) => listener(payload));
}

export function on<K extends keyof StorageEventMap>(
  channel: K,
  listener: Listener<StorageEventMap[K]>,
): () => void {
  const set = (listeners[channel] ??= new Set()) as Set<Listener<any>>;
  set.add(listener as Listener<any>);
  return () => set.delete(listener as Listener<any>);
}