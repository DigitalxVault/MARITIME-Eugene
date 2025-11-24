'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MissionDistributionChartProps {
  title: string;
  data: Array<{
    difficulty?: string;
    type?: string;
    count: number;
  }> | undefined;
  dataKey: 'difficulty' | 'type';
  colors: string[];
}

export function MissionDistributionChart({
  title,
  data,
  dataKey,
  colors
}: MissionDistributionChartProps) {
  // Handle loading or empty data states
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-cyan-500/20 bg-slate-900/50 p-6 backdrop-blur-sm">
        <h3 className="mb-4 text-lg font-semibold text-cyan-400">{title}</h3>
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-slate-400">No data available</p>
        </div>
      </div>
    );
  }

  // Prepare data for the chart
  const chartData = data.map((item, index) => ({
    name: item[dataKey] || 'Unknown',
    value: item.count,
    color: colors[index % colors.length],
  }));

  // Custom label for pie chart
  const renderLabel = (entry: any) => {
    return `${entry.name}: ${entry.value}`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-cyan-500/30 bg-slate-800 p-3 shadow-lg">
          <p className="text-sm font-medium text-cyan-400">{payload[0].name}</p>
          <p className="text-sm text-slate-300">
            Count: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-lg border border-cyan-500/20 bg-slate-900/50 p-6 backdrop-blur-sm">
      <h3 className="mb-4 text-lg font-semibold text-cyan-400">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-sm text-slate-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
