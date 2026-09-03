import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCommute } from '../hooks/useCommute';
import { useStats } from '../hooks/useStats';
import { WorkdayList } from '../components/ui/WorkdayList';
import { TransportDonutChart } from '../components/charts/TransportDonutChart';
import { formatKm, formatEUR } from '../lib/formatting';
import { hasAnyCommuteActivity } from '../lib/calculations';

const months = [
  { key: 'january', label: 'January', number: 1 },
  { key: 'february', label: 'February', number: 2 },
  { key: 'march', label: 'March', number: 3 },
  { key: 'april', label: 'April', number: 4 },
  { key: 'may', label: 'May', number: 5 },
  { key: 'june', label: 'June', number: 6 },
  { key: 'july', label: 'July', number: 7 },
  { key: 'august', label: 'August', number: 8 },
  { key: 'september', label: 'September', number: 9 },
  { key: 'october', label: 'October', number: 10 },
  { key: 'november', label: 'November', number: 11 },
  { key: 'december', label: 'December', number: 12 },
] as const;

type MonthKey = typeof months[number]['key'];

export function Months() {
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>('january');
  const [currentYear, setCurrentYear] = useState(2026);

  const selectedMonthData = months.find(m => m.key === selectedMonth);
  const selectedMonthNumber = selectedMonthData?.number ?? 1;

  const { workdays, isLoading, getTransportForDate, setTransportForDate } = useCommute(currentYear, selectedMonthNumber);
  const { monthly } = useStats(currentYear, selectedMonthNumber);
  const hasData = hasAnyCommuteActivity(monthly);

  return (
    <div className="space-y-4">
      {/* Header + dropdown + year */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-heading-1 font-semibold text-text-primary tracking-tight">Months</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setCurrentYear(y => y - 1)} aria-label="Previous year"><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-heading-4 font-semibold text-text-primary tabular-nums w-16 text-center">{currentYear}</span>
          <Button variant="ghost" size="sm" onClick={() => setCurrentYear(y => y + 1)} aria-label="Next year"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Compact calendar-style month selector */}
      <div className="flex items-center gap-3">
        <label htmlFor="month-select" className="text-body-sm font-medium text-text-secondary">Month</label>
        <div className="flex gap-1.5 flex-wrap max-w-md">
          {months.map(m => (
            <button
              key={m.key}
              onClick={() => setSelectedMonth(m.key)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 border',
                selectedMonth === m.key
                  ? 'bg-bg-card-hover text-text-primary border-border-muted shadow-sm'
                  : 'bg-bg-card text-text-secondary border-border-subtle hover:border-border-muted hover:text-text-primary'
              )}
              aria-pressed={selectedMonth === m.key}
            >
              {m.label.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Two-column compact layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left: daily list */}
        <div className="lg:col-span-3">
          <Card variant="hover" padding="md">
            <CardContent className="p-0">
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

        {/* Right: donut + stats */}
        <div className="lg:col-span-2 space-y-4">
          <Card variant="hover" padding="md">
            <CardContent>
              <h3 className="text-heading-4 font-semibold text-text-primary mb-3">Transport split</h3>
              {hasData ? (
                <TransportDonutChart bikeDays={monthly.bikeDays} carDays={monthly.carDays} />
              ) : (
                <div className="text-center py-4 text-text-muted text-body-sm">No commute data yet</div>
              )}
            </CardContent>
          </Card>

          <Card variant="hover" padding="md">
            <CardContent className="space-y-1.5">
              <div className="flex items-center justify-between text-sm"><span className="text-text-secondary">Workdays</span><span className="font-medium tabular-nums">{workdays.length}</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-text-secondary">Bike days</span><span className="font-medium tabular-nums">{monthly.bikeDays}</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-text-secondary">Car days</span><span className="font-medium tabular-nums">{monthly.carDays}</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-text-secondary">Sick</span><span className="font-medium text-text-muted tabular-nums">{monthly.sickDays}</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-text-secondary">Vacation</span><span className="font-medium text-text-muted tabular-nums">{monthly.vacationDays}</span></div>
              <div className="border-t border-border-subtle pt-1.5 flex items-center justify-between text-sm"><span className="text-text-secondary">Cycling distance</span><span className="font-medium tabular-nums">{formatKm(monthly.cyclingDistanceKm)}</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-text-secondary">Car distance</span><span className="font-medium tabular-nums">{formatKm(monthly.carDistanceKm)}</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-text-secondary">Compensation</span><span className="font-medium tabular-nums">{formatEUR(monthly.bikeCompensation)}</span></div>
              <div className="flex items-center justify-between text-sm"><span className="text-text-secondary">Car cost</span><span className="font-medium tabular-nums">{formatEUR(monthly.carCost)}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}