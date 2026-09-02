/**
 * Commute Data Model
 */

export type TransportType = 'bike' | 'car' | 'sick' | 'vacation';

export interface CommuteDay {
  date: string; // YYYY-MM-DD
  transportType: TransportType;
}

export interface MonthCommuteData {
  year: number;
  month: number; // 1-12
  days: CommuteDay[];
}

/**
 * Re-export storage functions so existing call-sites keep working.
 * New code should import from `./storage` directly.
 */
import { commuteStorage } from './storage';

export function loadMonthCommute(year: number, month: number): CommuteDay[] {
  return commuteStorage.loadMonth(year, month);
}

export function saveMonthCommute(year: number, month: number, days: CommuteDay[]): void {
  commuteStorage.saveMonth(year, month, days);
}

export function updateCommuteDay(year: number, month: number, date: string, transportType: TransportType): void {
  commuteStorage.upsertDay(year, month, date, transportType);
}

export function getCommuteDay(year: number, month: number, date: string): TransportType | null {
  const days = commuteStorage.loadMonth(year, month);
  const day = days.find(d => d.date === date);
  return day?.transportType ?? null;
}

export function clearAllCommuteData(): void {
  commuteStorage.clearAll();
}

/**
 * Transport type display info
 */
export const TRANSPORT_INFO: Record<TransportType, { label: string; icon: string; color: string; bgColor: string }> = {
  bike: { label: 'Bicycle', icon: '🚲', color: 'text-accent-green', bgColor: 'bg-accent-green/10 border-accent-green/20' },
  car: { label: 'Car', icon: '🚗', color: 'text-accent-red', bgColor: 'bg-accent-red/10 border-accent-red/20' },
  sick: { label: 'Sick', icon: '🤒', color: 'text-accent-orange', bgColor: 'bg-accent-orange/10 border-accent-orange/20' },
  vacation: { label: 'Vacation', icon: '🌴', color: 'text-accent-blue', bgColor: 'bg-accent-blue/10 border-accent-blue/20' },
};