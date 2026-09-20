import { useState, useCallback, useEffect } from 'react';
import { commuteStorage } from '../lib/storage';
import { getWorkdaysForMonth } from '../lib/belgianHolidays';
import { on } from '../lib/events';
import type { TransportType, CommuteDay } from '../lib/commute';

export function useCommute(year: number, month: number) {
  const [commuteDays, setCommuteDays] = useState<CommuteDay[]>([]);
  const [workdays, setWorkdays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load workdays and commute data when year/month changes
  const loadData = useCallback(async () => {
    setIsLoading(true);
    const wds = getWorkdaysForMonth(year, month);
    setWorkdays(wds);
    const data = await commuteStorage.loadMonth(year, month);
    setCommuteDays(data);
    setIsLoading(false);
  }, [year, month]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Listen to external commute updates (e.g., from other tabs or direct storage changes)
  useEffect(() => {
    const unsubscribe = on('commute', ({ year: y, month: m }) => {
      if (y === year && m === month) {
        loadData();
      }
    });
    return unsubscribe;
  }, [year, month, loadData]);

  const getTransportForDate = useCallback((date: string): TransportType | null => {
    const day = commuteDays.find(d => d.date === date);
    return day?.transportType ?? null;
  }, [commuteDays]);

  const setTransportForDate = useCallback(async (date: string, transportType: TransportType | null) => {
    if (transportType === null) {
      // Clear the selection locally
      setCommuteDays(prev => prev.filter(d => d.date !== date));
      // Note: Could add a remove function in storage if needed
    } else {
      await commuteStorage.upsertDay(year, month, date, transportType);
      setCommuteDays(prev => {
        const existingIndex = prev.findIndex(d => d.date === date);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { date, transportType };
          return updated;
        } else {
          return [...prev, { date, transportType }];
        }
      });
    }
  }, [year, month]);

  return {
    commuteDays,
    workdays,
    isLoading,
    getTransportForDate,
    setTransportForDate,
  };
}