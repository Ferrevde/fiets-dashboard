import { useState, useEffect, useMemo, useCallback } from 'react';
import { useCommute } from './useCommute';
import { settingsStorage } from '../lib/storage';
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
  const [settings, setSettings] = useState<Settings>({ bikeCompensationPerKm: 0.25, oneWayDistanceKm: 5, carCostPerKm: 0.15 });

  // Load settings initially
  useEffect(() => {
    let mounted = true;
    settingsStorage.load().then(s => {
      if (mounted) setSettings(s);
    });
    return () => { mounted = false; };
  }, []);

  // Re-read settings whenever the storage layer signals a change.
  useEffect(() => {
    return on('settings', () => {
      settingsStorage.load().then(s => setSettings(s));
      setSettingsVersion((v) => v + 1);
    });
  }, []);

  const { commuteDays, workdays, isLoading } = useCommute(year, month);

  const monthly: MonthlyStats = useMemo(() => {
    return calculateMonthlyStats(year, month, commuteDays, settings, workdays.length);
  }, [year, month, commuteDays, settings, workdays.length]);

  const loadAllMonths = useCallback(async (): Promise<MonthData[]> => {
    const monthsData: MonthData[] = [];
    for (let m = 1; m <= 12; m++) {
      const total = getWorkdaysForMonth(year, m).length;
      // For the active month we already have the freshest data via
      // `useCommute`. For other months we read from storage.
      const days = m === month ? commuteDays : await commuteStorage.loadMonth(year, m);
      monthsData.push({ month: m, days, totalWorkdays: total });
    }
    return monthsData;
  }, [year, month, commuteDays]);

  const [yearly, setYearly] = useState<YearlyStats>({
    year,
    bikeDays: 0,
    carDays: 0,
    sickDays: 0,
    vacationDays: 0,
    cyclingDistanceKm: 0,
    carDistanceKm: 0,
    bikeCompensation: 0,
    carCost: 0,
    netSavings: 0,
    bikePercentage: 0,
    months: [],
  });

  useEffect(() => {
    let mounted = true;
    loadAllMonths().then(monthsData => {
      if (mounted) {
        setYearly(calculateYearlyStats(year, monthsData, settings));
      }
    });
    return () => { mounted = false; };
  }, [year, settings, settingsVersion, loadAllMonths]);

  return { monthly, yearly, settings, isLoading };
}