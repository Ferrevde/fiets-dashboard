/**
 * Calculation Layer
 *
 * Pure functions that derive statistics from stored commute data and
 * settings. No I/O, no React - only deterministic computations so they
 * can be unit-tested and reused everywhere.
 */

import type { CommuteDay, TransportType } from './commute';
import type { Settings } from './settings';
import { commuteStorage } from './storage';

// ----- Types ---------------------------------------------------------------

export interface MonthlyStats {
  year: number;
  month: number;

  /** Total workdays in the month (Mon-Fri, excluding Belgian holidays). */
  totalWorkdays: number;

  /** Number of days marked as bike. */
  bikeDays: number;

  /** Number of days marked as car. */
  carDays: number;

  /** Number of days marked as sick. */
  sickDays: number;

  /** Number of days marked as vacation. */
  vacationDays: number;

  /** Number of workdays with no selection yet. */
  unselectedDays: number;

  /** Total cycling distance in km (round-trip per bike day). */
  cyclingDistanceKm: number;

  /** Total car distance in km (round-trip per car day). */
  carDistanceKm: number;

  /** Total distance covered in km. */
  totalDistanceKm: number;

  /** Earnings from cycling compensation in EUR. */
  bikeCompensation: number;

  /** Estimated cost of car usage in EUR. */
  carCost: number;

  /** Net: bikeCompensation - carCost. */
  netSavings: number;

  /** Percentage of selected workdays that were bike (0-100). */
  bikePercentage: number;
}

export interface YearlyStats {
  year: number;
  bikeDays: number;
  carDays: number;
  sickDays: number;
  vacationDays: number;
  cyclingDistanceKm: number;
  carDistanceKm: number;
  bikeCompensation: number;
  carCost: number;
  netSavings: number;
  bikePercentage: number;
  months: MonthlyStats[];
}

// ----- Core math -----------------------------------------------------------

export function calculateRoundTripDistance(settings: Settings): number {
  return safe(settings.oneWayDistanceKm) * 2;
}

export function calculateBikeCompensation(distanceKm: number, settings: Settings): number {
  return safe(distanceKm) * safe(settings.bikeCompensationPerKm);
}

export function calculateCarCost(distanceKm: number, settings: Settings): number {
  return safe(distanceKm) * safe(settings.carCostPerKm);
}

export function calculateBikePercentage(bikeDays: number, carDays: number): number {
  const total = bikeDays + carDays;
  if (total === 0) return 0;
  return (bikeDays / total) * 100;
}

// ----- Aggregations --------------------------------------------------------

function safe(n: number): number {
  return Number.isFinite(n) ? n : 0;
}

function emptyStats(year: number, month: number, totalWorkdays: number): MonthlyStats {
  return {
    year,
    month,
    totalWorkdays,
    bikeDays: 0,
    carDays: 0,
    sickDays: 0,
    vacationDays: 0,
    unselectedDays: totalWorkdays,
    cyclingDistanceKm: 0,
    carDistanceKm: 0,
    totalDistanceKm: 0,
    bikeCompensation: 0,
    carCost: 0,
    netSavings: 0,
    bikePercentage: 0,
  };
}

/**
 * Calculate stats for a single month given the commute days and settings.
 * `totalWorkdays` should be the count of Mon-Fri days minus Belgian holidays.
 */
export function calculateMonthlyStats(
  year: number,
  month: number,
  days: CommuteDay[],
  settings: Settings,
  totalWorkdays: number,
): MonthlyStats {
  const stats = emptyStats(year, month, totalWorkdays);

  const roundTrip = calculateRoundTripDistance(settings);

  for (const day of days) {
    switch (day.transportType) {
      case 'bike': {
        stats.bikeDays += 1;
        stats.cyclingDistanceKm = safe(stats.cyclingDistanceKm) + roundTrip;
        stats.bikeCompensation = safe(stats.bikeCompensation) + calculateBikeCompensation(roundTrip, settings);
        break;
      }
      case 'car': {
        stats.carDays += 1;
        stats.carDistanceKm = safe(stats.carDistanceKm) + roundTrip;
        stats.carCost = safe(stats.carCost) + calculateCarCost(roundTrip, settings);
        break;
      }
      case 'sick': {
        stats.sickDays += 1;
        break;
      }
      case 'vacation': {
        stats.vacationDays += 1;
        break;
      }
    }
  }

  const selectedCount = stats.bikeDays + stats.carDays + stats.sickDays + stats.vacationDays;
  stats.unselectedDays = Math.max(0, totalWorkdays - selectedCount);
  stats.totalDistanceKm = safe(stats.cyclingDistanceKm) + safe(stats.carDistanceKm);
  stats.netSavings = safe(stats.bikeCompensation) - safe(stats.carCost);
  stats.bikePercentage = calculateBikePercentage(stats.bikeDays, stats.carDays);

  return stats;
}

/**
 * Convenience: load the month from storage and compute stats.
 */
export function calculateMonthlyStatsFromStorage(
  year: number,
  month: number,
  settings: Settings,
  totalWorkdays: number,
): MonthlyStats {
  const days = commuteStorage.loadMonth(year, month);
  return calculateMonthlyStats(year, month, days, settings, totalWorkdays);
}

/**
 * Aggregate stats across all 12 months of a year.
 */
export function calculateYearlyStats(
  year: number,
  monthsData: { month: number; days: CommuteDay[]; totalWorkdays: number }[],
  settings: Settings,
): YearlyStats {
  const monthly = monthsData.map(({ month, days, totalWorkdays }) =>
    calculateMonthlyStats(year, month, days, settings, totalWorkdays),
  );

  const result: YearlyStats = {
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
    months: monthly,
  };

  for (const m of monthly) {
    result.bikeDays += m.bikeDays;
    result.carDays += m.carDays;
    result.sickDays += m.sickDays;
    result.vacationDays += m.vacationDays;
    result.cyclingDistanceKm = safe(result.cyclingDistanceKm) + m.cyclingDistanceKm;
    result.carDistanceKm = safe(result.carDistanceKm) + m.carDistanceKm;
    result.bikeCompensation = safe(result.bikeCompensation) + m.bikeCompensation;
    result.carCost = safe(result.carCost) + m.carCost;
  }
  result.netSavings = safe(result.bikeCompensation) - safe(result.carCost);
  result.bikePercentage = calculateBikePercentage(result.bikeDays, result.carDays);

  return result;
}

/**
 * Sum a numeric field across all 12 months for a given year.
 */
export function sumYearlyField<K extends keyof MonthlyStats>(
  year: number,
  field: K,
  monthsData: { month: number; days: CommuteDay[]; totalWorkdays: number }[],
  settings: Settings,
): number {
  return calculateYearlyStats(year, monthsData, settings).months.reduce(
    (acc, m) => safe(acc) + safe(m[field] as unknown as number),
    0,
  );
}

// ----- Utility: empty-state check ------------------------------------------

export function hasAnyCommuteActivity(stats: MonthlyStats): boolean {
  return (
    stats.bikeDays > 0 ||
    stats.carDays > 0 ||
    stats.sickDays > 0 ||
    stats.vacationDays > 0
  );
}

export function hasCommuteData(days: CommuteDay[]): boolean {
  return days.length > 0;
}

export type { TransportType };