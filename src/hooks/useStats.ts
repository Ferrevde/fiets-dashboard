import { useState, useEffect, useMemo, useCallback } from 'react';
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
 * Receives commute data from parent (via useCommute) to avoid duplicate hooks.
 * If commute data not provided, loads from storage (for Dashboard page).
 */
export function useStats(
  year: number,
  month: number,
  commuteDays?: CommuteDay[],
  workdays?: string[],
  isLoading?: boolean
) {
  const [settingsVersion, setSettingsVersion] = useState(0);
  const [settings, setSettings] = useState<Settings>({ bikeCompensationPerKm: 0.25, oneWayDistanceKm: 5, carCostPerKm: 0.15 });
  const [localWorkdays, setLocalWorkdays] = useState<string[]>([]);
  const [localCommuteDays, setLocalCommuteDays] = useState<CommuteDay[]>([]);
  const [localIsLoading, setLocalIsLoading] = useState(true);

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

  // If commute data not provided (Dashboard), load from storage
  const useLocalData = !commuteDays;
  
  useEffect(() => {
    if (!useLocalData) return;
    let mounted = true;
    const load = async () => {
      setLocalIsLoading(true);
      const wds = getWorkdaysForMonth(year, month);
      setLocalWorkdays(wds);
      const data = await commuteStorage.loadMonth(year, month);
      if (mounted) {
        setLocalCommuteDays(data);
        setLocalIsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [year, month, useLocalData]);

  const effectiveCommuteDays = commuteDays ?? localCommuteDays;
  const effectiveWorkdays = workdays ?? localWorkdays;
  const effectiveIsLoading = isLoading ?? localIsLoading;

  const monthly: MonthlyStats = useMemo(() => {
    return calculateMonthlyStats(year, month, effectiveCommuteDays, settings, effectiveWorkdays.length);
  }, [year, month, effectiveCommuteDays, settings, effectiveWorkdays.length]);

  const loadAllMonths = useCallback(async (): Promise<MonthData[]> => {
    const monthsData: MonthData[] = [];
    for (let m = 1; m <= 12; m++) {
      const total = getWorkdaysForMonth(year, m).length;
      // For the active month we already have the freshest data via parent.
      // For other months we read from storage.
      const days = m === month ? effectiveCommuteDays : await commuteStorage.loadMonth(year, m);
      monthsData.push({ month: m, days, totalWorkdays: total });
    }
    return monthsData;
  }, [year, month, effectiveCommuteDays]);

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

  return { monthly, yearly, settings, isLoading: effectiveIsLoading };
}