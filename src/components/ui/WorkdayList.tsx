import { Calendar } from 'lucide-react';
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
    <div className="space-y-2" role="list" aria-label="Workdays">
      {/* Two-row calendar layout */}
      <div className="grid grid-cols-2 gap-2">
        {workdays.map((dateStr) => {
          const date = new Date(dateStr + 'T00:00:00');
          const dayName = DAY_NAMES[date.getDay()];
          const formattedDate = format(date, 'dd/MM', { locale: nl });
          const holidayName = getHolidayName(dateStr, year);
          const isHoliday = !!holidayName;
          const transport = getTransportForDate(dateStr);
          const transportStyles = {
            bike: { color: 'text-accent-green', bg: 'bg-accent-green/10', icon: '🚲' },
            car: { color: 'text-accent-red', bg: 'bg-accent-red/10', icon: '🚗' },
            sick: { color: 'text-accent-orange', bg: 'bg-accent-orange/10', icon: '🤒' },
            vacation: { color: 'text-accent-blue', bg: 'bg-accent-blue/10', icon: '🌴' },
          };
          void transportStyles;
          const transportInfo = transport ? transportStyles[transport] : null;
  void transportInfo;

          return (
            <div
              key={dateStr}
              className={cn(
                'group relative flex items-center gap-2 p-2 rounded-lg border transition-all duration-200',
                'bg-bg-card border-border-subtle hover:border-border-muted hover:bg-bg-card-hover',
                isHoliday && 'border-accent-orange/30 bg-accent-orange/5'
              )}
              role="listitem"
            >
                <div className="flex-shrink-0 w-20 flex flex-col">
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{dayName}</span>
                  <span className="text-sm font-semibold text-text-primary tabular-nums">{formattedDate}</span>
                  {isHoliday && (
                    <span className="text-xs text-accent-orange font-medium leading-none">{holidayName}</span>
                  )}
                </div>
                <div className="w-px h-6 bg-border-subtle" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <TransportSelect
                    value={transport}
                    onChange={(value) => onTransportChange(dateStr, value)}
                    aria-label={`Transport for ${formattedDate}`}
                    compact
                  />
                </div>
                {transport && (
                  <div className={cn('flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs font-medium', transport === 'bike' ? 'text-accent-green bg-accent-green/10' : transport === 'car' ? 'text-accent-red bg-accent-red/10' : transport === 'sick' ? 'text-accent-orange bg-accent-orange/10' : 'text-accent-blue bg-accent-blue/10')} aria-label={`Selected: ${transport}`}>
                    <span aria-hidden="true" className="text-base">{transport === 'bike' ? '🚲' : transport === 'car' ? '🚗' : transport === 'sick' ? '🤒' : '🌴'}</span>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}