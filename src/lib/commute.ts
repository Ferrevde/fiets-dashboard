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

export async function loadMonthCommute(year: number, month: number): Promise<CommuteDay[]> {
  return commuteStorage.loadMonth(year, month);
}

export async function saveMonthCommute(year: number, month: number, days: CommuteDay[]): Promise<boolean> {
  return commuteStorage.saveMonth(year, month, days);
}

export async function updateCommuteDay(year: number, month: number, date: string, transportType: TransportType): Promise<boolean> {
  return commuteStorage.upsertDay(year, month, date, transportType);
}

export async function getCommuteDay(year: number, month: number, date: string): Promise<TransportType | null> {
  const day = await commuteStorage.find(year, month, date);
  return day?.transportType ?? null;
}

export async function clearAllCommuteData(): Promise<void> {
  return commuteStorage.clearAll();
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
