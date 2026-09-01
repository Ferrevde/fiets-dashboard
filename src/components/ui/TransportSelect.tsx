import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TRANSPORT_INFO, type TransportType } from '../../lib/commute';

interface TransportSelectProps {
  value: TransportType | null;
  onChange: (value: TransportType | null) => void;
  disabled?: boolean;
  className?: string;
}

const TRANSPORT_OPTIONS: { value: TransportType; label: string }[] = [
  { value: 'bike', label: 'Bicycle' },
  { value: 'car', label: 'Car' },
  { value: 'sick', label: 'Sick' },
  { value: 'vacation', label: 'Vacation' },
];

export function TransportSelect({ value, onChange, disabled = false, className }: TransportSelectProps) {
  const selectedInfo = value ? TRANSPORT_INFO[value] : null;

  return (
    <div className="relative">
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value as TransportType | null)}
        disabled={disabled}
        className={cn(
          'appearance-none w-full px-3 py-2 pr-10 rounded-lg border bg-bg-card',
          'text-text-primary placeholder-text-muted',
          'focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors',
          className
        )}
        aria-label="Select transport type"
      >
        <option value="">Select transport</option>
        {TRANSPORT_OPTIONS.map(({ value: val, label }) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>
      
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
        {selectedInfo && (
          <span className={cn('flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium', selectedInfo.color, selectedInfo.bgColor)}>
            {selectedInfo.icon}
            {selectedInfo.label}
          </span>
        )}
        <ChevronDown className={cn('h-4 w-4 text-text-muted', disabled && 'opacity-50')} aria-hidden="true" />
      </div>
    </div>
  );
}