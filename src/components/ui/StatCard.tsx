import { type ReactNode } from 'react';
import { Card } from './Card';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  accentColor: 'green' | 'red' | 'orange' | 'blue';
  trend?: {
    value: string;
    label: string;
    positive?: boolean;
  };
}

const accentStyles = {
  green: 'text-accent-green bg-accent-green/10 border-accent-green/20',
  red: 'text-accent-red bg-accent-red/10 border-accent-red/20',
  orange: 'text-accent-orange bg-accent-orange/10 border-accent-orange/20',
  blue: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
};

export function StatCard({ title, value, icon, accentColor, trend }: StatCardProps) {
  return (
    <Card variant="hover" padding="lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-body-sm text-text-secondary font-medium">{title}</p>
          <p className="mt-2 text-heading-1 font-semibold text-text-primary tabular-nums">{value}</p>
          {trend && (
            <div className="mt-3 flex items-center gap-1.5">
              <span className={cn(
                'text-body-sm font-medium',
                trend.positive ? 'text-accent-green' : 'text-accent-red'
              )}>
                {trend.value}
              </span>
              <span className="text-body-sm text-text-muted">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-xl border flex-shrink-0',
          accentStyles[accentColor]
        )}>
          {icon}
        </div>
      </div>
    </Card>
  );
}