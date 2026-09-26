/**
 * Belgian Public Holidays Utility
 * Calculates all official Belgian public holidays for a given year
 * DISABLED: All weekdays Mon-Fri are now workdays. User marks holidays manually.
 */

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

export function getBelgianHolidays(_year: number): Holiday[] {
  return [];
}

export function isBelgianHoliday(_date: string, _year: number): boolean {
  return false;
}

export function getHolidayName(_date: string, _year: number): string | null {
  return null;
}

export function isWeekend(date: string): boolean {
  const day = new Date(date).getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

export function isWorkday(date: string, _year: number): boolean {
  return !isWeekend(date);
}

export function getWorkdaysForMonth(year: number, month: number): string[] {
  const workdays: string[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (isWorkday(dateStr, year)) {
      workdays.push(dateStr);
    }
  }

  return workdays;
}

export function getWorkdaysForYear(year: number): Record<number, string[]> {
  const result: Record<number, string[]> = {};
  for (let month = 1; month <= 12; month++) {
    result[month] = getWorkdaysForMonth(year, month);
  }
  return result;
}