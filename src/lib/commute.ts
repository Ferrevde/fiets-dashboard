/**
 * Commute Data Model and Storage
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

const STORAGE_KEY = 'fiets-dashboard-commute';

/**
 * Get storage key for a specific year/month
 */
function getMonthKey(year: number, month: number): string {
  return `${STORAGE_KEY}-${year}-${month}`;
}

/**
 * Load commute data for a specific month
 */
export function loadMonthCommute(year: number, month: number): CommuteDay[] {
  try {
    const stored = localStorage.getItem(getMonthKey(year, month));
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.days || [];
  } catch {
    return [];
  }
}

/**
 * Save commute data for a specific month
 */
export function saveMonthCommute(year: number, month: number, days: CommuteDay[]): void {
  const data: MonthCommuteData = { year, month, days };
  localStorage.setItem(getMonthKey(year, month), JSON.stringify(data));
}

/**
 * Update a single day's transport type
 */
export function updateCommuteDay(year: number, month: number, date: string, transportType: TransportType): void {
  const days = loadMonthCommute(year, month);
  const existingIndex = days.findIndex(d => d.date === date);
  
  if (existingIndex >= 0) {
    days[existingIndex] = { date, transportType };
  } else {
    days.push({ date, transportType });
  }
  
  saveMonthCommute(year, month, days);
}

/**
 * Get transport type for a specific date
 */
export function getCommuteDay(year: number, month: number, date: string): TransportType | null {
  const days = loadMonthCommute(year, month);
  const day = days.find(d => d.date === date);
  return day?.transportType ?? null;
}

/**
 * Clear all commute data (for testing/reset)
 */
export function clearAllCommuteData(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_KEY)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
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