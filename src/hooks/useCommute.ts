import { useState, useCallback, useEffect } from 'react';
import { loadMonthCommute, updateCommuteDay, type TransportType, type CommuteDay } from '../lib/commute';
import { getWorkdaysForMonth } from '../lib/belgianHolidays';
import { on } from '../lib/events';

export function useCommute(year: number, month: number) {
  const [commuteDays, setCommuteDays] = useState<CommuteDay[]>([]);
  const [workdays, setWorkdays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to external commute updates (e.g., from other tabs or direct storage changes)
  useEffect(() => {
    const unsubscribe = on('commute', ({ year: y, month: m }) => {
      if (y === year && m === month) {
        const data = loadMonthCommute(year, month);
        setCommuteDays(data);
      }
    });
    return unsubscribe;
  }, [year, month]);

  // Load workdays and commute data when year/month changes
  useEffect(() => {
    setIsLoading(true);
    const wds = getWorkdaysForMonth(year, month);
    setWorkdays(wds);
    const data = loadMonthCommute(year, month);
    setCommuteDays(data);
    setIsLoading(false);
  }, [year, month]);

  const getTransportForDate = useCallback((date: string): TransportType | null => {
    const day = commuteDays.find(d => d.date === date);
    return day?.transportType ?? null;
  }, [commuteDays]);

  const setTransportForDate = useCallback((date: string, transportType: TransportType | null) => {
    if (transportType === null) {
      // Clear the selection
      setCommuteDays(prev => prev.filter(d => d.date !== date));
      // Note: We don't remove from localStorage here, just filter from state
      // Could add a remove function if needed
    } else {
      updateCommuteDay(year, month, date, transportType);
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