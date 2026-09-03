import { TransportDonutChart } from '../components/charts/TransportDonutChart';
import { MonthlyCyclingChart } from '../components/charts/MonthlyCyclingChart';
import { Bike, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useStats } from '../hooks/useStats';
import { formatKm, formatEUR } from '../lib/formatting';

export function Dashboard() {
  const { yearly } = useStats(2026, 1);
  const hasData = yearly.bikeDays > 0 || yearly.carDays > 0 || yearly.sickDays > 0 || yearly.vacationDays > 0;

  const monthlyCyclingData = yearly.months.map((m, i) => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    bikeDays: m.bikeDays,
  }));


  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-heading-1 font-semibold text-text-primary tracking-tight">Dashboard</h1>
        <p className="mt-2 text-body-lg text-text-secondary">Overview of your commuting activity.</p>
      </div>

      {/* Donut + Yearly stats at top */}
      {hasData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Card variant="hover" padding="lg">
            <CardContent>
              <h2 className="text-heading-4 font-semibold text-text-primary mb-4">Transport split</h2>
              <div className="flex items-center gap-6">
                <div className="flex-1 flex justify-center">
                  <TransportDonutChart bikeDays={yearly.bikeDays} carDays={yearly.carDays} />
                </div>
                <div className="flex-shrink-0 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-accent-green" aria-hidden="true" />
                    <span className="text-sm font-medium text-text-primary">Bicycle</span>
                    <span className="text-sm font-semibold text-text-primary tabular-nums">{yearly.bikeDays}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-accent-red" aria-hidden="true" />
                    <span className="text-sm font-medium text-text-primary">Car</span>
                    <span className="text-sm font-semibold text-text-primary tabular-nums">{yearly.carDays}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="hover" padding="lg">
            <CardContent>
              <h2 className="text-heading-4 font-semibold text-text-primary mb-4">Yearly statistics</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Cycling days', value: yearly.bikeDays, color: 'bg-accent-green/10 text-accent-green border-accent-green/20' },
                  { label: 'Car days', value: yearly.carDays, color: 'bg-accent-red/10 text-accent-red border-accent-red/20' },
                  { label: 'Sick days', value: yearly.sickDays, color: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20' },
                  { label: 'Vacation days', value: yearly.vacationDays, color: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20' },
                  { label: 'Cycling distance', value: formatKm(yearly.cyclingDistanceKm), color: 'bg-accent-green/10 text-accent-green border-accent-green/20' },
                  { label: 'Car distance', value: formatKm(yearly.carDistanceKm), color: 'bg-accent-red/10 text-accent-red border-accent-red/20' },
                  { label: 'Bicycle compensation', value: formatEUR(yearly.bikeCompensation), color: 'bg-accent-green/10 text-accent-green border-accent-green/20' },
                  { label: 'Estimated car cost', value: formatEUR(yearly.carCost), color: 'bg-accent-red/10 text-accent-red border-accent-red/20' },
                ].map((item, i) => (
                  <div key={i} className={`p-3 rounded-xl border ${item.color}`}>
                    <div className="text-xs text-text-muted mb-1">{item.label}</div>
                    <div className="text-lg font-semibold tabular-nums">{item.value}</div>
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
            <Button variant="primary" size="lg" onClick={() => window.location.href = '/months'} className="mt-6 gap-2">
              Go to Months
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Monthly Cycling Chart */}
      <Card variant="hover" padding="lg">
        <CardContent>
          <h2 className="text-heading-4 font-semibold text-text-primary mb-2">Cycling days per month</h2>
          <p className="text-body-sm text-text-secondary mb-6">Bicycle days for each month of 2026</p>
          <MonthlyCyclingChart data={monthlyCyclingData} />
        </CardContent>
      </Card>
    </div>
  );
}