import { useState, useCallback, useEffect } from 'react';
import type { Settings } from '../lib/settings';
import { loadSettings, saveSettings, validateSettings, getDefaultSettings } from '../lib/settings';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({ bikeCompensationPerKm: 0.25, oneWayDistanceKm: 5, carCostPerKm: 0.15 });
  const [errors, setErrors] = useState<Partial<Record<keyof Settings, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load settings on mount
  useEffect(() => {
    let mounted = true;
    loadSettings().then(s => {
      if (mounted) setSettings(s);
    });
    return () => { mounted = false; };
  }, []);

  const updateField = useCallback(<K extends keyof Settings>(field: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateAndSave = useCallback(async () => {
    const validation = validateSettings(settings);
    setErrors(validation.errors);
    
    if (!validation.valid) {
      setToast({ type: 'error', message: 'Controleer de invoervelden' });
      return false;
    }

    setIsSaving(true);
    try {
      await saveSettings(settings);
      setToast({ type: 'success', message: 'Instellingen opgeslagen' });
      return true;
    } catch {
      setToast({ type: 'error', message: 'Opslaan mislukt' });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [settings]);

  const resetToDefaults = useCallback(async () => {
    const defaults = getDefaultSettings();
    setSettings(defaults);
    setErrors({});
    await saveSettings(defaults);
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    settings,
    errors,
    isSaving,
    toast,
    updateField,
    validateAndSave,
    resetToDefaults,
    dismissToast,
  };
}