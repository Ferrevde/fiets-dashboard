import { useState, useEffect, useMemo, useCallback } from 'react';
import { useCommute } from './useCommute';
import { loadSettings } from '../lib/settings';
import { on } from '../lib/events';
import { getWorkdaysForMonth } from '../lib/belgianHolidays';
import { commuteStorage } from '../lib/storage';
import {
  calculateMonthlyStats,
  calculateYearlyStats,
  type MonthlyStats,
  type YearlyStats,
} from '../lib/calculations';
import type { Settings } from '../lib/settings';
import type { CommuteDay } from '../lib/commute';

interface MonthData {
  month: number;
  days: CommuteDay[];
  totalWorkdays: number;
}

/**
 * Provides live monthly and yearly statistics for a given year.
 *
 * The monthly breakdown is recomputed automatically when the user changes
 * a transport selection (via `useCommute`) or when settings change in
 * another tab/component (via the storage event bus).
 */
export function useStats(year: number, month: number) {
  const [settingsVersion, setSettingsVersion] = useState(0);

  // Re-read settings whenever the storage layer signals a change.
  useEffect(() => {
    return on('settings', () => setSettingsVersion((v) => v + 1));
  }, []);

  const { commuteDays, workdays, isLoading } = useCommute(year, month);

  const settings: Settings = useMemo(() => loadSettings(), [settingsVersion]);

  const monthly: MonthlyStats = useMemo(() => {
    return calculateMonthlyStats(year, month, commuteDays, settings, workdays.length);
  }, [year, month, commuteDays, settings, workdays.length]);

  const loadAllMonths = useCallback((): MonthData[] => {
    return Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      const total = getWorkdaysForMonth(year, m).length;
      // For the active month we already have the freshest data via
      // `useCommute`. For other months we read from storage.
      const days = m === month ? commuteDays : commuteStorage.loadMonth(year, m);
      return { month: m, days, totalWorkdays: total };
    });
  }, [year, month, commuteDays]);

  const yearly: YearlyStats = useMemo(() => {
    return calculateYearlyStats(year, loadAllMonths(), settings);
  }, [year, settings, settingsVersion, loadAllMonths]);

  return { monthly, yearly, settings, isLoading };
}