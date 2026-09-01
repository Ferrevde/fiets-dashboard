/**
 * Belgian Public Holidays Utility
 * Calculates all official Belgian public holidays for a given year
 */

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

/**
 * Calculate Easter Sunday for a given year using the Anonymous Gregorian algorithm
 * Returns date as YYYY-MM-DD string
 */
function calculateEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

/**
 * Add days to a date and return new date string (YYYY-MM-DD)
 */
function addDays(date: Date, days: number): string {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get all Belgian public holidays for a given year
 */
export function getBelgianHolidays(year: number): Holiday[] {
  const holidays: Holiday[] = [];
  const easter = calculateEasterSunday(year);

  // Fixed date holidays
  const fixedHolidays: { month: number; day: number; name: string }[] = [
    { month: 1, day: 1, name: 'Nieuwjaar' }, // New Year's Day
    { month: 5, day: 1, name: 'Dag van de Arbeid' }, // Labour Day
    { month: 7, day: 21, name: 'Nationale Feestdag' }, // Belgian National Day
    { month: 8, day: 15, name: 'O.L.V. Hemelvaart' }, // Assumption Day
    { month: 11, day: 1, name: 'Allerheiligen' }, // All Saints' Day
    { month: 11, day: 11, name: 'Wapenstilstand' }, // Armistice Day
    { month: 12, day: 25, name: 'Kerstdag' }, // Christmas Day
  ];

  fixedHolidays.forEach(({ month, day, name }) => {
    const date = new Date(year, month - 1, day);
    holidays.push({ date: formatDate(date), name });
  });

  // Easter-based holidays
  holidays.push({ date: addDays(easter, 1), name: 'Paasmaandag' }); // Easter Monday
  holidays.push({ date: addDays(easter, 39), name: 'O.L.V. Hemelvaart' }); // Ascension Day (39 days after Easter)
  holidays.push({ date: addDays(easter, 50), name: 'Pinkstermaandag' }); // Whit Monday (50 days after Easter)

  // Sort by date
  holidays.sort((a, b) => a.date.localeCompare(b.date));

  return holidays;
}

/**
 * Check if a date is a Belgian public holiday
 */
export function isBelgianHoliday(date: string, year: number): boolean {
  const holidays = getBelgianHolidays(year);
  return holidays.some(h => h.date === date);
}

/**
 * Get holiday name for a date if it's a holiday
 */
export function getHolidayName(date: string, year: number): string | null {
  const holidays = getBelgianHolidays(year);
  const holiday = holidays.find(h => h.date === date);
  return holiday?.name ?? null;
}

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
export function isWeekend(date: string): boolean {
  const day = new Date(date).getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

/**
 * Check if a date is a valid workday (Mon-Fri, not a holiday)
 */
export function isWorkday(date: string, year: number): boolean {
  return !isWeekend(date) && !isBelgianHoliday(date, year);
}

/**
 * Generate all workdays for a given month and year
 * Returns array of date strings (YYYY-MM-DD)
 */
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

/**
 * Get all workdays for a year grouped by month
 */
export function getWorkdaysForYear(year: number): Record<number, string[]> {
  const result: Record<number, string[]> = {};
  for (let month = 1; month <= 12; month++) {
    result[month] = getWorkdaysForMonth(year, month);
  }
  return result;
}