import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Bike, Car } from 'lucide-react';

interface TransportDonutChartProps {
  bikeDays: number;
  carDays: number;
}

export function TransportDonutChart({ bikeDays, carDays }: TransportDonutChartProps) {
  const total = bikeDays + carDays;
  const hasData = total > 0;
  const bikePct = hasData ? Math.round((bikeDays / total) * 100) : 0;

  const data = [
    { name: 'Bicycle', value: bikeDays, color: '#22c55e' },
    { name: 'Car', value: carDays, color: '#ef4444' },
  ];

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-heading-4 font-medium text-text-secondary">No commute data yet</p>
        <p className="mt-2 text-body text-text-muted">Select Bicycle or Car for a workday to see your transport split.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      {/* Donut */}
      <div className="relative w-56 h-56 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="85%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              animationDuration={600}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-heading-2 font-bold text-text-primary tabular-nums">{bikePct}%</span>
          <span className="text-body-sm text-text-secondary">by bike</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-center gap-3">
          <span className="inline-block w-3 h-3 rounded-full bg-[#22c55e]" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-body font-medium text-text-primary">
              <Bike className="h-4 w-4 text-accent-green" aria-hidden="true" />
              Bicycle
            </div>
            <div className="text-body-sm text-text-secondary">{bikeDays} days</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-block w-3 h-3 rounded-full bg-[#ef4444]" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-body font-medium text-text-primary">
              <Car className="h-4 w-4 text-accent-red" aria-hidden="true" />
              Car
            </div>
            <div className="text-body-sm text-text-secondary">{carDays} days</div>
          </div>
        </div>
      </div>
    </div>
  );
}