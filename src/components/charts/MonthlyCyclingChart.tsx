import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MonthlyData {
  month: string;
  bikeDays: number;
}

interface MonthlyCyclingChartProps {
  data: MonthlyData[];
}

export function MonthlyCyclingChart({ data }: MonthlyCyclingChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    const value = payload[0]?.value ?? 0;

    return (
      <div
        style={{
          backgroundColor: '#18181B',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '10px 12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          fontSize: '13px',
        }}
      >
        {/* Month */}
        <div
          style={{
            color: '#fafafa',
            fontWeight: 600,
            marginBottom: '4px',
          }}
        >
          {label ?? ''}
        </div>

        {/* Cycling Days */}
        <div
          style={{
            color: '#22c55e',
          }}
        >
          Cycling Days: {value}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-72 md:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <XAxis
            dataKey="month"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            axisLine={{ stroke: '#27272a' }}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />

          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            content={<CustomTooltip />}
          />

          <Bar
            dataKey="bikeDays"
            radius={[6, 6, 0, 0]}
            animationDuration={500}
          >
            {data.map((_, i) => (
              <Cell
                key={`cell-${i}`}
                fill="#22c55e"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}