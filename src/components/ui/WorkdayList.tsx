import { Calendar, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TransportSelect } from './TransportSelect';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { getHolidayName } from '../../lib/belgianHolidays';
import type { TransportType } from '../../lib/commute';

interface WorkdayListProps {
  workdays: string[];
  year: number;
  month: number;
  getTransportForDate: (date: string) => TransportType | null;
  onTransportChange: (date: string, transportType: TransportType | null) => void;
  isLoading?: boolean;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function WorkdayList({ 
  workdays, 
  year, 
  getTransportForDate, 
  onTransportChange,
  isLoading = false 
}: WorkdayListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading workdays">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-bg-card border border-border-subtle" />
        ))}
      </div>
    );
  }

  if (workdays.length === 0) {
    return (
      <div className="text-center py-12 rounded-2xl bg-bg-card border border-border-subtle">
        <Calendar className="h-12 w-12 mx-auto text-text-muted mb-4" aria-hidden="true" />
        <h3 className="text-heading-4 font-medium text-text-secondary mb-2">No workdays this month</h3>
        <p className="text-body text-text-muted">All days are weekends or holidays.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" role="list" aria-label="Workdays">
      {workdays.map((dateStr) => {
        const date = new Date(dateStr + 'T00:00:00');
        const dayName = DAY_NAMES[date.getDay()];
        const formattedDate = format(date, 'dd/MM/yyyy', { locale: nl });
        const holidayName = getHolidayName(dateStr, year);
        const isHoliday = !!holidayName;
        const transport = getTransportForDate(dateStr);
                const transportStyles = {
          bike: { color: 'text-accent-green', bg: 'bg-accent-green/10', icon: '🚲' },
          car: { color: 'text-accent-red', bg: 'bg-accent-red/10', icon: '🚗' },
          sick: { color: 'text-accent-orange', bg: 'bg-accent-orange/10', icon: '🤒' },
          vacation: { color: 'text-accent-blue', bg: 'bg-accent-blue/10', icon: '🌴' },
                };
                const transportInfo = transport ? transportStyles[transport] : null;

        return (
          <div
            key={dateStr}
            className={cn(
              'relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-200',
              'bg-bg-card border-border-subtle hover:border-border-muted hover:bg-bg-card-hover',
              isHoliday && 'border-accent-orange/30 bg-accent-orange/5'
            )}
            role="listitem"
          >
            {/* Date and day */}
            <div className="flex-shrink-0 w-36 flex flex-col items-start">
              <span className="text-caption font-medium text-text-muted uppercase tracking-wider">
                {dayName}
              </span>
              <span className="text-heading-4 font-semibold text-text-primary tabular-nums">
                {formattedDate}
              </span>
              {isHoliday && (
                <span className="text-caption text-accent-orange font-medium mt-1">
                  {holidayName}
                </span>
              )}
            </div>

            {/* Visual separator */}
            <div className="w-px h-8 bg-border-subtle mx-2" aria-hidden="true" />

            {/* Transport selection */}
            <div className="flex-1 min-w-0 max-w-xs">
              <TransportSelect
                value={transport}
                onChange={(value) => onTransportChange(dateStr, value)}
                aria-label={`Transport for ${formattedDate}`}
              />
            </div>

            {/* Selected transport indicator */}
            {transport && transportInfo && (
              <div className={cn(
                'flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
                transportInfo.color,
                transportInfo.bg
              )} aria-label={`Selected: ${transport}`}>
                <span aria-hidden="true">{transportInfo.icon}</span>
                <span className="hidden sm:inline">{transport.charAt(0).toUpperCase() + transport.slice(1)}</span>
              </div>
            )}

            {/* Subtle hover indicator */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted">
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        );
      })}
    </div>
  );
}