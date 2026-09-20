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

  // Listen to external commute updates (e.g., from other tabs)
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

  const setTransportForDate = useCallback((date: string, transportType: TransportType | null) => {
    // Compute the new days array
    const newDays = transportType === null
      ? commuteDays.filter(d => d.date !== date)
      : (() => {
          const existingIndex = commuteDays.findIndex(d => d.date === date);
          if (existingIndex >= 0) {
            const updated = [...commuteDays];
            updated[existingIndex] = { date, transportType: transportType! };
            return updated;
          } else {
            return [...commuteDays, { date, transportType: transportType! }];
          }
        })();

    // Update local state immediately
    setCommuteDays(newDays);
    // Persist the same computed array (don't re-read from KV!)
    commuteStorage.saveMonth(year, month, newDays).catch(console.error);
  }, [year, month, commuteDays]);

  return {
    commuteDays,
    workdays,
    isLoading,
    getTransportForDate,
    setTransportForDate,
  };
}