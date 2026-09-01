import { useSettings } from '../hooks/useSettings';
import { Save, Loader2, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
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
        <h1 className="text-heading-1 font-semibold text-text-primary tracking-tight">
          Settings
        </h1>
        <p className="mt-2 text-body-lg text-text-secondary">
          Configure your commute information.
        </p>
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

      {/* Additional Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="hover" padding="lg">
          <CardHeader>
            <CardTitle>About these settings</CardTitle>
            <CardDescription>
              These values are used to calculate your commuting costs and potential savings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-bg-main border border-border-subtle">
              <p className="text-body-sm font-medium text-text-primary mb-2">Bicycle compensation</p>
              <p className="text-body text-text-secondary">
                The amount you receive per kilometer cycled to work. In the Netherlands, this is typically €0.23/km (2024 rate).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-bg-main border border-border-subtle">
              <p className="text-body-sm font-medium text-text-primary mb-2">Commute distance</p>
              <p className="text-body text-text-secondary">
                The one-way distance from your home to your workplace. This is used to calculate round-trip distances.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-bg-main border border-border-subtle">
              <p className="text-body-sm font-medium text-text-primary mb-2">Car cost per km</p>
              <p className="text-body text-text-secondary">
                The estimated cost per kilometer for driving your car, including fuel, maintenance, depreciation, and insurance.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card variant="hover" padding="lg">
          <CardHeader>
            <CardTitle>Calculation preview</CardTitle>
            <CardDescription>
              Based on your current settings (20 workdays/month)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-bg-main border border-border-subtle">
              <div className="flex items-center justify-between">
                <span className="text-body text-text-secondary">Monthly cycling compensation</span>
                <span className="text-body font-semibold text-accent-green tabular-nums">
                  € {(settings.bikeCompensationPerKm * settings.oneWayDistanceKm * 2 * 20).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-bg-main border border-border-subtle">
              <div className="flex items-center justify-between">
                <span className="text-body text-text-secondary">Monthly car cost</span>
                <span className="text-body font-semibold text-accent-red tabular-nums">
                  € {(settings.carCostPerKm * settings.oneWayDistanceKm * 2 * 20).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-bg-main border border-border-subtle">
              <div className="flex items-center justify-between">
                <span className="text-body text-text-secondary">Potential monthly savings</span>
                <span className="text-body font-semibold text-text-primary tabular-nums">
                  € {(
                    (settings.carCostPerKm - settings.bikeCompensationPerKm) * 
                    settings.oneWayDistanceKm * 2 * 20
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toast notification */}
      {toast && (
        <Toast type={toast.type} message={toast.message} onDismiss={dismissToast} />
      )}
    </div>
  );
}