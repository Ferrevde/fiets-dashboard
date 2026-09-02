/**
 * Formatting utilities using Belgian (nl-BE) locale.
 *
 * Centralized here so a future locale change is a single-file edit.
 */

const numberFormatter = new Intl.NumberFormat('nl-BE', {
  maximumFractionDigits: 0,
});

const numberFormatterDecimals = new Intl.NumberFormat('nl-BE', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

const currencyFormatter = new Intl.NumberFormat('nl-BE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

/**
 * Format a distance value in kilometers using Belgian locale.
 * Example: 864 -> "864 km", 1248.5 -> "1.249 km"
 */
export function formatKm(value: number, withUnit = true): string {
  const safe = Number.isFinite(value) ? value : 0;
  const formatted = numberFormatter.format(safe);
  return withUnit ? `${formatted} km` : formatted;
}

/**
 * Format a decimal number using Belgian locale (no unit).
 * Example: 18.567 -> "18,57"
 */
export function formatNumber(value: number, decimals = 0): string {
  const safe = Number.isFinite(value) ? value : 0;
  if (decimals > 0) {
    return numberFormatterDecimals.format(safe);
  }
  return numberFormatter.format(safe);
}

/**
 * Format a value as Euro currency using Belgian locale.
 * Example: 250.56 -> "€ 250,56"
 */
export function formatEUR(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  // Belgian formatting: symbol prefix, space, then amount with comma decimal.
  return currencyFormatter.format(safe).replace('\u00A0', ' ');
}

/**
 * Format a percentage using Belgian locale.
 * Example: 72 -> "72 %"
 */
export function formatPercent(value: number, decimals = 0): string {
  const safe = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('nl-BE', {
    style: 'percent',
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(safe / 100);
}