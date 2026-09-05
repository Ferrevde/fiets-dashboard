/**
 * Storage Abstraction Layer
 *
 * This module is the single point of contact with localStorage. UI components
 * and hooks should call these functions instead of touching localStorage directly.
 *
 * The interface is intentionally close to what a Cloudflare D1 backend would expose,
 * so a future migration can swap the implementation without touching UI code.
 */

import type { Settings } from './settings';
import { DEFAULT_SETTINGS, validateSettings } from './settings';
import type { CommuteDay, TransportType, MonthCommuteData } from './commute';
import { emit } from './events';

const STORAGE_PREFIX = 'fiets-dashboard';
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

// ----- Keys ----------------------------------------------------------------

const KEYS = {
  settings: `${STORAGE_PREFIX}-settings`,
  commute: (year: number, month: number) => `${STORAGE_PREFIX}-commute-${year}-${month}`,
} as const;

// ----- Internal helpers ----------------------------------------------------

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// ----- Settings ------------------------------------------------------------

export const settingsStorage = {
  load(): Settings {
    const raw = safeGetItem(KEYS.settings);
    if (!raw) return { ...DEFAULT_SETTINGS };
    try {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  },

  save(settings: Settings): boolean {
    // Re-validate before persisting; we never store invalid data
    const { valid } = validateSettings(settings);
    if (!valid) return false;
    const ok = safeSetItem(KEYS.settings, JSON.stringify(settings));
    if (ok) emit('settings', { settings });
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ settings }) }).catch(() => {});
    }, 500);
    return ok;
  },

  hasSaved(): boolean {
    return safeGetItem(KEYS.settings) !== null;
  },

  clear(): void {
    safeRemoveItem(KEYS.settings);
  },
};

// ----- Commute -------------------------------------------------------------

export const commuteStorage = {
  loadMonth(year: number, month: number): CommuteDay[] {
    const raw = safeGetItem(KEYS.commute(year, month));
    if (!raw) return [];
    try {
      const parsed: MonthCommuteData = JSON.parse(raw);
      return Array.isArray(parsed.days) ? parsed.days : [];
    } catch {
      return [];
    }
  },

  saveMonth(year: number, month: number, days: CommuteDay[]): boolean {
    const data: MonthCommuteData = { year, month, days };
    const ok = safeSetItem(KEYS.commute(year, month), JSON.stringify(data));
    if (ok) emit('commute', { year, month });
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ year, month, days }) }).catch(() => {});
    }, 500);
    return ok;
  },

  /**
   * Upsert a single day's transport selection. Returns the updated day list.
   */
  upsertDay(year: number, month: number, date: string, transportType: TransportType): CommuteDay[] {
    const days = commuteStorage.loadMonth(year, month);
    const existingIndex = days.findIndex(d => d.date === date);
    if (existingIndex >= 0) {
      days[existingIndex] = { date, transportType };
    } else {
      days.push({ date, transportType });
    }
    commuteStorage.saveMonth(year, month, days);
    return days;
  },

  /**
   * Remove a single day's selection. Returns the updated day list.
   */
  removeDay(year: number, month: number, date: string): CommuteDay[] {
    const days = commuteStorage.loadMonth(year, month).filter(d => d.date !== date);
    commuteStorage.saveMonth(year, month, days);
    return days;
  },

  clearAll(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(`${STORAGE_PREFIX}-commute-`)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(safeRemoveItem);
    } catch {
      // ignore
    }
  },
};

// ----- Re-exports for convenience ------------------------------------------

export type { Settings, CommuteDay, TransportType, MonthCommuteData };