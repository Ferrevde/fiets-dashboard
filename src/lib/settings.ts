export interface Settings {
  bikeCompensationPerKm: number;
  oneWayDistanceKm: number;
  carCostPerKm: number;
}

const SETTINGS_KEY = 'fiets-dashboard-settings';

const DEFAULT_SETTINGS: Settings = {
  bikeCompensationPerKm: 0.23,
  oneWayDistanceKm: 15,
  carCostPerKm: 0.45,
};

export function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(stored);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function hasSettings(): boolean {
  return localStorage.getItem(SETTINGS_KEY) !== null;
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
  return DEFAULT_SETTINGS;
}