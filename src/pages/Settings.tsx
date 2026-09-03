import { useSettings } from '../hooks/useSettings';
import { Save, Loader2, RotateCcw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Toast } from '../components/ui/Toast';

export function Settings() {
  const {
    settings,
    errors,
    isSaving,
    toast,
    updateField,
    validateAndSave,
    resetToDefaults,
    dismissToast,
  } = useSettings();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await validateAndSave();
  };

  const handleReset = () => {
    resetToDefaults();
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-heading-1 font-semibold text-text-primary tracking-tight">Settings</h1>
      </div>

      {/* Settings Form */}
      <Card variant="hover" padding="lg">
        <form onSubmit={handleSave} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Input
                label="Bicycle compensation per km"
                type="number"
                step="0.01"
                min="0"
                max="10"
                placeholder="0.23"
                value={settings.bikeCompensationPerKm}
                onChange={(e) => updateField('bikeCompensationPerKm', parseFloat(e.target.value) || 0)}
                error={errors.bikeCompensationPerKm}
                helperText="EUR per kilometer cycled"
              />
            </div>
            <div>
              <Input
                label="One-way commute distance"
                type="number"
                step="0.1"
                min="0.1"
                max="500"
                placeholder="15"
                value={settings.oneWayDistanceKm}
                onChange={(e) => updateField('oneWayDistanceKm', parseFloat(e.target.value) || 0)}
                error={errors.oneWayDistanceKm}
                helperText="Kilometers (one way)"
              />
            </div>
            <div>
              <Input
                label="Car cost per km"
                type="number"
                step="0.01"
                min="0"
                max="10"
                placeholder="0.45"
                value={settings.carCostPerKm}
                onChange={(e) => updateField('carCostPerKm', parseFloat(e.target.value) || 0)}
                error={errors.carCostPerKm}
                helperText="EUR per kilometer driven"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border-subtle flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              Reset to defaults
            </Button>
            <Button
              type="submit"
              size="lg"
              loading={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5" aria-hidden="true" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" aria-hidden="true" />
                  Save settings
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Toast notification */}
      {toast && (
        <Toast type={toast.type} message={toast.message} onDismiss={dismissToast} />
      )}
    </div>
  );
}