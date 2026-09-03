import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TRANSPORT_INFO, type TransportType } from '../../lib/commute';

interface TransportSelectProps {
  value: TransportType | null;
  onChange: (value: TransportType | null) => void;
  disabled?: boolean;
  className?: string;
  compact?: boolean;
}

const TRANSPORT_OPTIONS: { value: TransportType; label: string }[] = [
  { value: 'bike', label: 'Bicycle' },
  { value: 'car', label: 'Car' },
  { value: 'sick', label: 'Sick' },
  { value: 'vacation', label: 'Vacation' },
];

export function TransportSelect({ value, onChange, disabled = false, className, compact }: TransportSelectProps) {
  const selectedInfo = value ? TRANSPORT_INFO[value] : null;
  void selectedInfo;

  return (
    <div className="relative">
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value as TransportType | null)}
        disabled={disabled}
        className={cn(
          'appearance-none w-full px-2.5 rounded-lg border bg-bg-card',
          'text-text-primary placeholder-text-muted',
          compact ? 'py-1 text-xs pr-7' : 'py-1.5 text-sm pr-8',
          'focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors',
          className
        )}
        aria-label="Select transport type"
      >
        <option value="">Select</option>
        {TRANSPORT_OPTIONS.map(({ value: val, label }) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>
      
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDown className={cn('h-4 w-4 text-text-muted', disabled && 'opacity-50')} aria-hidden="true" />
      </div>
    </div>
  );
}