import { TransportDonutChart } from '../components/charts/TransportDonutChart';
import { MonthlyCyclingChart } from '../components/charts/MonthlyCyclingChart';
import { Bike, Car, MapPin, Route, Settings, ArrowRight, Banknote, TrendingDown, Percent } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { hasSettings } from '../lib/settings';
import { useNavigate } from 'react-router-dom';
import { useStats } from '../hooks/useStats';
import { formatKm, formatEUR } from '../lib/formatting';

export function Dashboard() {
  const navigate = useNavigate();
  const settingsConfigured = hasSettings();
  const { yearly } = useStats(2026, 1);
  const hasData = yearly.bikeDays > 0 || yearly.carDays > 0 || yearly.sickDays > 0 || yearly.vacationDays > 0;

  const monthlyCyclingData = yearly.months.map((m, i) => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    bikeDays: m.bikeDays,
  }));

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
          value={yearly.bikeDays}
          accentColor="green"
          icon={<Bike className="h-6 w-6" aria-hidden="true" />}
        />
        <StatCard
          title="Car days"
          value={yearly.carDays}
          accentColor="red"
          icon={<Car className="h-6 w-6" aria-hidden="true" />}
        />
        <StatCard
          title="Cycling distance"
          value={formatKm(yearly.cyclingDistanceKm)}
          accentColor="blue"
          icon={<Route className="h-6 w-6" aria-hidden="true" />}
        />
        <StatCard
          title="Car distance"
          value={formatKm(yearly.carDistanceKm)}
          accentColor="orange"
          icon={<MapPin className="h-6 w-6" aria-hidden="true" />}
        />
        <StatCard
          title="Bicycle compensation"
          value={formatEUR(yearly.bikeCompensation)}
          accentColor="green"
          icon={<Banknote className="h-6 w-6" aria-hidden="true" />}
        />
        <StatCard
          title="Estimated car cost"
          value={formatEUR(yearly.carCost)}
          accentColor="red"
          icon={<TrendingDown className="h-6 w-6" aria-hidden="true" />}
        />
        <StatCard
          title="Cycling percentage"
          value={`${yearly.bikePercentage.toFixed(0)}%`}
          accentColor="blue"
          icon={<Percent className="h-6 w-6" aria-hidden="true" />}
        />
      </div>

      {/* Monthly Cycling Chart */}
      <Card variant="hover" padding="lg">
        <CardContent>
          <h2 className="text-heading-4 font-semibold text-text-primary mb-2">Cycling days per month</h2>
          <p className="text-body-sm text-text-secondary mb-6">Bicycle days for each month of 2026</p>
          <MonthlyCyclingChart data={monthlyCyclingData} />
        </CardContent>
      </Card>

      {/* Transport Donut + Yearly Stats */}
      {hasData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="hover" padding="lg">
            <CardContent>
              <h2 className="text-heading-4 font-semibold text-text-primary mb-4">Transport split</h2>
              <TransportDonutChart bikeDays={yearly.bikeDays} carDays={yearly.carDays} />
            </CardContent>
          </Card>

          <Card variant="hover" padding="lg">
            <CardContent>
              <h2 className="text-heading-4 font-semibold text-text-primary mb-4">Yearly statistics</h2>
              <div className="space-y-3">
                {[
                  { label: 'Cycling days', value: yearly.bikeDays },
                  { label: 'Car days', value: yearly.carDays },
                  { label: 'Sick days', value: yearly.sickDays },
                  { label: 'Vacation days', value: yearly.vacationDays },
                  { label: 'Cycling distance', value: formatKm(yearly.cyclingDistanceKm) },
                  { label: 'Car distance', value: formatKm(yearly.carDistanceKm) },
                  { label: 'Bicycle compensation', value: formatEUR(yearly.bikeCompensation) },
                  { label: 'Estimated car cost', value: formatEUR(yearly.carCost) },
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
      ) : (
        <Card variant="hover" padding="lg" className="border-border-subtle bg-bg-card/50">
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-accent-green/10 border border-accent-green/20 text-accent-green flex items-center justify-center mb-6">
              <Bike className="h-8 w-8" aria-hidden="true" />
            </div>
            <h2 className="text-heading-3 font-semibold text-text-primary">Start tracking your commute</h2>
            <p className="mt-2 text-body text-text-secondary">Select Bicycle or Car for your workdays to see your statistics here.</p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/months')}
              className="mt-6 gap-2"
            >
              Go to Months
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}