import { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

const months = [
  { key: 'january', label: 'January', short: 'Jan' },
  { key: 'february', label: 'February', short: 'Feb' },
  { key: 'march', label: 'March', short: 'Mar' },
  { key: 'april', label: 'April', short: 'Apr' },
  { key: 'may', label: 'May', short: 'May' },
  { key: 'june', label: 'June', short: 'Jun' },
  { key: 'july', label: 'July', short: 'Jul' },
  { key: 'august', label: 'August', short: 'Aug' },
  { key: 'september', label: 'September', short: 'Sep' },
  { key: 'october', label: 'October', short: 'Oct' },
  { key: 'november', label: 'November', short: 'Nov' },
  { key: 'december', label: 'December', short: 'Dec' },
] as const;

export function Months() {
  const [selectedMonth, setSelectedMonth] = useState<string>('january');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const handleMonthSelect = (monthKey: string) => {
    setSelectedMonth(monthKey);
  };

  const handleYearChange = (delta: number) => {
    setCurrentYear(prev => prev + delta);
  };

  const selectedMonthData = months.find(m => m.key === selectedMonth);

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

      {/* Selected Month Details */}
      <Card variant="hover" padding="lg">
        <CardContent>
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
              <p className="text-heading-3 font-semibold text-text-primary tabular-nums">—</p>
            </div>
            <div className="text-right sm:text-left">
              <p className="text-body-sm text-text-secondary">Cycling days</p>
              <p className="text-heading-3 font-semibold text-accent-green tabular-nums">—</p>
            </div>
            <div className="text-right sm:text-left">
              <p className="text-body-sm text-text-secondary">Car days</p>
              <p className="text-heading-3 font-semibold text-accent-red tabular-nums">—</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border-subtle">
            <p className="text-body text-text-muted text-center">
              Select a month above to view and track your daily commute. Workday tracking coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}