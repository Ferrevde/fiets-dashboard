import { useState, useMemo } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { useCommute } from '../hooks/useCommute';
import { useStats } from '../hooks/useStats';
import { WorkdayList } from '../components/ui/WorkdayList';
import { StatCard } from '../components/ui/StatCard';
import { Bike, Car, Route, MapPin, Banknote, TrendingDown } from 'lucide-react';
import { formatKm, formatEUR } from '../lib/formatting';
import { TransportDonutChart } from '../components/charts/TransportDonutChart';
import { hasAnyCommuteActivity } from '../lib/calculations';

const months = [
  { key: 'january', label: 'January', short: 'Jan', number: 1 },
  { key: 'february', label: 'February', short: 'Feb', number: 2 },
  { key: 'march', label: 'March', short: 'Mar', number: 3 },
  { key: 'april', label: 'April', short: 'Apr', number: 4 },
  { key: 'may', label: 'May', short: 'May', number: 5 },
  { key: 'june', label: 'June', short: 'Jun', number: 6 },
  { key: 'july', label: 'July', short: 'Jul', number: 7 },
  { key: 'august', label: 'August', short: 'Aug', number: 8 },
  { key: 'september', label: 'September', short: 'Sep', number: 9 },
  { key: 'october', label: 'October', short: 'Oct', number: 10 },
  { key: 'november', label: 'November', short: 'Nov', number: 11 },
  { key: 'december', label: 'December', short: 'Dec', number: 12 },
] as const;

type MonthKey = typeof months[number]['key'];

export function Months() {
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>('january');
  const [currentYear, setCurrentYear] = useState(2026);

  const handleMonthSelect = (monthKey: MonthKey) => {
    setSelectedMonth(monthKey);
  };

  const handleYearChange = (delta: number) => {
    setCurrentYear(prev => prev + delta);
  };

  const selectedMonthData = months.find(m => m.key === selectedMonth);
  const selectedMonthNumber = selectedMonthData?.number ?? 1;

  // Use the commute hook for the selected month/year
  const {
    workdays,
    isLoading,
    getTransportForDate,
    setTransportForDate,
  } = useCommute(currentYear, selectedMonthNumber);

  const { monthly } = useStats(currentYear, selectedMonthNumber);

  // Calculate stats
  const stats = useMemo(() => {
    let bikeDays = 0;
    let carDays = 0;
    
    workdays.forEach(date => {
      const transport = getTransportForDate(date);
      if (transport === 'bike') bikeDays++;
      else if (transport === 'car') carDays++;
    });
    
    return {
      totalWorkdays: workdays.length,
      bikeDays,
      carDays,
    };
  }, [workdays, getTransportForDate]);

  const hasData = hasAnyCommuteActivity(monthly);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-heading-1 font-semibold text-text-primary tracking-tight">
            Months
          </h1>
          <p className="mt-2 text-body-lg text-text-secondary">
            Track your daily commute.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleYearChange(-1)}
            aria-label="Previous year"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <span className="text-heading-4 font-semibold text-text-primary tabular-nums w-20 text-center">
            {currentYear}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleYearChange(1)}
            aria-label="Next year"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Month Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {months.map((month) => {
          const isSelected = selectedMonth === month.key;
          
          return (
            <button
              key={month.key}
              onClick={() => handleMonthSelect(month.key)}
              className={cn(
                'relative group',
                'p-4 sm:p-6',
                'rounded-2xl',
                'border-2',
                'transition-all duration-200 ease-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-main',
                isSelected
                  ? 'bg-bg-card-hover border-accent-green/50 shadow-[0_0_0_1px_theme(colors.accent-green)]'
                  : 'bg-bg-card border-border-subtle hover:border-border-muted hover:bg-bg-card-hover',
                'text-left'
              )}
              aria-current={isSelected ? 'true' : 'false'}
              aria-pressed={isSelected}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-caption font-medium text-text-muted uppercase tracking-wider">
                    {month.short}
                  </span>
                  <p className="mt-1 text-heading-4 font-semibold text-text-primary">
                    {month.label}
                  </p>
                </div>
                {isSelected && (
                  <div className="flex-shrink-0 ml-3 p-1.5 rounded-full bg-accent-green/10 text-accent-green">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </div>
                )}
              </div>
              
              {/* Hover indicator */}
              <div className={cn(
                'absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl',
                'transition-all duration-200 ease-out',
                isSelected
                  ? 'bg-accent-green scale-x-100 opacity-100'
                  : 'bg-transparent scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 group-hover:bg-accent-green/30'
              )} />
            </button>
          );
        })}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Cycling days"
          value={monthly.bikeDays}
          accentColor="green"
          icon={<Bike className="h-6 w-6" aria-hidden="true" />}
        />
        <StatCard
          title="Car days"
          value={monthly.carDays}
          accentColor="red"
          icon={<Car className="h-6 w-6" aria-hidden="true" />}
        />
        <StatCard
          title="Cycling distance"
          value={formatKm(monthly.cyclingDistanceKm)}
          accentColor="blue"
          icon={<Route className="h-6 w-6" aria-hidden="true" />}
        />
        <StatCard
          title="Car distance"
          value={formatKm(monthly.carDistanceKm)}
          accentColor="orange"
          icon={<MapPin className="h-6 w-6" aria-hidden="true" />}
        />
        <StatCard
          title="Bicycle compensation"
          value={formatEUR(monthly.bikeCompensation)}
          accentColor="green"
          icon={<Banknote className="h-6 w-6" aria-hidden="true" />}
        />
        <StatCard
          title="Estimated car cost"
          value={formatEUR(monthly.carCost)}
          accentColor="red"
          icon={<TrendingDown className="h-6 w-6" aria-hidden="true" />}
        />
      </div>

      {/* Empty state when no commute data yet */}
      {!hasData && (
        <Card variant="hover" padding="lg" className="border-border-subtle bg-bg-card/50">
          <CardContent className="py-10 text-center">
            <p className="text-heading-4 font-medium text-text-secondary">No commute data yet</p>
            <p className="mt-2 text-body text-text-muted">Select transport for your workdays to see statistics.</p>
          </CardContent>
        </Card>
      )}

      {/* Transport Donut */}
      <Card variant="hover" padding="lg">
        <CardContent>
          <h3 className="text-heading-4 font-semibold text-text-primary mb-4">Transport split</h3>
          <TransportDonutChart bikeDays={monthly.bikeDays} carDays={monthly.carDays} />
        </CardContent>
      </Card>

      {/* Statistics Table */}
      {hasData && (
        <Card variant="hover" padding="lg">
          <CardContent>
            <h3 className="text-heading-4 font-semibold text-text-primary mb-4">Monthly statistics</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle text-text-secondary">
                    <th className="text-left py-2 font-medium">Metric</th>
                    <th className="text-right py-2 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  <tr><td className="py-2 text-text-secondary">Cycling distance</td><td className="py-2 text-right font-medium tabular-nums">{formatKm(monthly.cyclingDistanceKm)}</td></tr>
                  <tr><td className="py-2 text-text-secondary">Car distance</td><td className="py-2 text-right font-medium tabular-nums">{formatKm(monthly.carDistanceKm)}</td></tr>
                  <tr><td className="py-2 text-text-secondary">Cycling days</td><td className="py-2 text-right font-medium tabular-nums">{monthly.bikeDays}</td></tr>
                  <tr><td className="py-2 text-text-secondary">Car days</td><td className="py-2 text-right font-medium tabular-nums">{monthly.carDays}</td></tr>
                  <tr><td className="py-2 text-text-secondary">Sick days</td><td className="py-2 text-right font-medium tabular-nums">{monthly.sickDays}</td></tr>
                  <tr><td className="py-2 text-text-secondary">Vacation days</td><td className="py-2 text-right font-medium tabular-nums">{monthly.vacationDays}</td></tr>
                  <tr><td className="py-2 text-text-secondary">Bicycle compensation</td><td className="py-2 text-right font-medium tabular-nums">{formatEUR(monthly.bikeCompensation)}</td></tr>
                  <tr><td className="py-2 text-text-secondary">Estimated car cost</td><td className="py-2 text-right font-medium tabular-nums">{formatEUR(monthly.carCost)}</td></tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Month Details & Workday List */}
      <Card variant="hover" padding="lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-accent-green/10 border border-accent-green/20 text-accent-green">
                <CalendarDays className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <p className="text-body-sm text-text-secondary">Selected Month</p>
                <p className="text-heading-3 font-semibold text-text-primary">
                  {selectedMonthData?.label} {currentYear}
                </p>
              </div>
            </div>
            <div className="text-right sm:text-left">
              <p className="text-body-sm text-text-secondary">Workdays</p>
              <p className="text-heading-3 font-semibold text-text-primary tabular-nums">
                {stats.totalWorkdays}
              </p>
            </div>
            <div className="text-right sm:text-left">
              <p className="text-body-sm text-text-secondary">Cycling days</p>
              <p className="text-heading-3 font-semibold text-accent-green tabular-nums">
                {stats.bikeDays}
              </p>
            </div>
            <div className="text-right sm:text-left">
              <p className="text-body-sm text-text-secondary">Car days</p>
              <p className="text-heading-3 font-semibold text-accent-red tabular-nums">
                {stats.carDays}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <WorkdayList
            workdays={workdays}
            year={currentYear}
            month={selectedMonthNumber}
            getTransportForDate={getTransportForDate}
            onTransportChange={setTransportForDate}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}