export interface Settings {
  bikeCompensationPerKm: number;
  oneWayDistanceKm: number;
  carCostPerKm: number;
}

export const DEFAULT_SETTINGS: Settings = {
  bikeCompensationPerKm: 0.23,
  oneWayDistanceKm: 15,
  carCostPerKm: 0.45,
};

/**
 * Re-export the storage layer so existing call-sites of `loadSettings` etc.
 * keep working. New code should import from `./storage` directly.
 */
export { settingsStorage as storage } from './storage';
import { settingsStorage } from './storage';

export function loadSettings(): Settings {
  return settingsStorage.load();
}

export function saveSettings(settings: Settings): void {
  settingsStorage.save(settings);
}

export function hasSettings(): boolean {
  return settingsStorage.hasSaved();
}

export function validateSettings(settings: Partial<Settings>): { valid: boolean; errors: Partial<Record<keyof Settings, string>> } {
  const errors: Partial<Record<keyof Settings, string>> = {};

  if (settings.bikeCompensationPerKm !== undefined) {
    if (typeof settings.bikeCompensationPerKm !== 'number' || isNaN(settings.bikeCompensationPerKm)) {
      errors.bikeCompensationPerKm = 'Voer een geldig getal in';
    } else if (settings.bikeCompensationPerKm < 0) {
      errors.bikeCompensationPerKm = 'Moet positief zijn';
    } else if (settings.bikeCompensationPerKm > 10) {
      errors.bikeCompensationPerKm = 'Te hoog (max €10)';
    }
  }

  if (settings.oneWayDistanceKm !== undefined) {
    if (typeof settings.oneWayDistanceKm !== 'number' || isNaN(settings.oneWayDistanceKm)) {
      errors.oneWayDistanceKm = 'Voer een geldig getal in';
    } else if (settings.oneWayDistanceKm <= 0) {
      errors.oneWayDistanceKm = 'Moet groter dan 0 zijn';
    } else if (settings.oneWayDistanceKm > 500) {
      errors.oneWayDistanceKm = 'Te hoog (max 500 km)';
    }
  }

  if (settings.carCostPerKm !== undefined) {
    if (typeof settings.carCostPerKm !== 'number' || isNaN(settings.carCostPerKm)) {
      errors.carCostPerKm = 'Voer een geldig getal in';
    } else if (settings.carCostPerKm < 0) {
      errors.carCostPerKm = 'Moet positief zijn';
    } else if (settings.carCostPerKm > 10) {
      errors.carCostPerKm = 'Te hoog (max €10)';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function getDefaultSettings(): Settings {
  return { ...DEFAULT_SETTINGS };
}