import { Bike, Car, MapPin, Route, Settings, ArrowRight } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { hasSettings } from '../lib/settings';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  const settingsConfigured = hasSettings();

  const handleConfigureSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-heading-1 font-semibold text-text-primary tracking-tight">
          Dashboard
        </h1>
        <p className="mt-2 text-body-lg text-text-secondary">
          Overview of your commuting activity.
        </p>
      </div>

      {/* Onboarding Card - shown when settings not configured */}
      {!settingsConfigured && (
        <Card variant="hover" padding="lg" className="border-accent-orange/30 bg-accent-orange/5">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 rounded-xl bg-accent-orange/10 border border-accent-orange/20 text-accent-orange">
                <Settings className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-text-primary">Configure your commute settings</CardTitle>
                <CardDescription className="mt-1">
                  Start by setting up your bicycle compensation, commute distance, and car cost per kilometer to see personalized insights.
                </CardDescription>
              </div>
              <Button
                              variant="primary"
                size="lg"
                onClick={handleConfigureSettings}
                className="flex-shrink-0 gap-2"
              >
                <Settings className="h-5 w-5" aria-hidden="true" />
                Configure settings
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Cycling days"
          value="—"
          accentColor="green"
          icon={<Bike className="h-6 w-6" aria-hidden="true" />}
        />
        <StatCard
          title="Car days"
          value="—"
          accentColor="red"
          icon={<Car className="h-6 w-6" aria-hidden="true" />}
        />
        <StatCard
          title="Cycling distance"
          value="— km"
          accentColor="blue"
          icon={<Route className="h-6 w-6" aria-hidden="true" />}
        />
        <StatCard
          title="Car distance"
          value="— km"
          accentColor="orange"
          icon={<MapPin className="h-6 w-6" aria-hidden="true" />}
        />
      </div>

      {/* Placeholder Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="hover" padding="lg">
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-heading-4 font-semibold text-text-primary">Weekly Overview</h2>
                <p className="mt-1 text-body-sm text-text-secondary">Your commute pattern this week</p>
              </div>
              <div className="p-3 rounded-xl bg-accent-green/10 border border-accent-green/20 text-accent-green">
                <Bike className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div className="space-y-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                  <span className="text-body text-text-secondary">{day}</span>
                  <span className="text-body text-text-muted">—</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="hover" padding="lg">
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-heading-4 font-semibold text-text-primary">Monthly Summary</h2>
                <p className="mt-1 text-body-sm text-text-secondary">Distance and cost overview</p>
              </div>
              <div className="p-3 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue">
                <Route className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div className="space-y-4">
                          {[
                { label: 'Total cycling distance', value: '— km' },
                { label: 'Total car distance', value: '— km' },
                { label: 'Cycling compensation', value: '€ —' },
                { label: 'Car costs', value: '€ —' },
                { label: 'Net savings', value: '€ —' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                  <span className="text-body text-text-secondary">{item.label}</span>
                  <span className="text-body font-medium text-text-primary tabular-nums">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}