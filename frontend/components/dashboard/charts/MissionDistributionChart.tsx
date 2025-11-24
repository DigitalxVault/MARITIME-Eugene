'use client';

/**
 * Mission Distribution Chart Component
 * Reusable pie/donut chart for displaying mission distributions (difficulty, type, etc.)
 */

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DataItem {
  [key: string]: string | number;
}

interface MissionDistributionChartProps {
  data?: DataItem[];
  title: string;
  dataKey: string;
  colors?: string[];
}

// Default color palette matching the theme
const DEFAULT_COLORS = [
  '#0284c7', // primary-500
  '#10b981', // success
  '#f59e0b', // warning
  '#ef4444', // error
  '#3b82f6', // info
  '#d946ef', // secondary-500
  '#0ea5e9', // primary-400
  '#86198f', // secondary-800
];

// Format labels for display (convert enum-style strings to readable format)
const formatLabel = (label: string): string => {
  if (!label) return 'Unknown';

  // Handle common enum formats like "PVE", "EASY", etc.
  return label
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const total = payload[0].payload.total || 0;
    const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0.0';

    return (
      <div className="rounded-lg border border-dark-700 bg-dark-900/95 px-3 py-2 shadow-lg backdrop-blur-sm">
        <p className="text-sm font-semibold text-dark-50">{data.name}</p>
        <p className="text-xs text-dark-300">
          Count: <span className="font-semibold text-primary-400">{data.value}</span>
        </p>
        <p className="text-xs text-dark-300">
          Percentage: <span className="font-semibold text-primary-400">{percentage}%</span>
        </p>
      </div>
    );
  }
  return null;
};

// Custom legend component
const renderLegend = (props: any) => {
  const { payload } = props;

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-3">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-dark-300">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function MissionDistributionChart({
  data,
  title,
  dataKey,
  colors = DEFAULT_COLORS,
}: MissionDistributionChartProps) {
  // Loading state
  if (!data) {
    return (
      <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-dark-50">{title}</h3>
        <div className="flex h-64 items-center justify-center">
          <div className="h-48 w-48 animate-pulse rounded-full bg-dark-700"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data.length) {
    return (
      <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-dark-50">{title}</h3>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-2 text-4xl text-dark-600">📊</div>
            <p className="text-sm text-dark-400">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  // Transform data for Recharts
  const total = data.reduce((sum, item) => sum + (item.count as number || 0), 0);

  const chartData = data.map((item) => ({
    name: formatLabel(item[dataKey] as string),
    value: item.count as number,
    total,
  }));

  return (
    <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6 shadow-sci-fi backdrop-blur-sm transition-all hover:border-primary-500/50">
      <h3 className="mb-4 text-lg font-semibold text-dark-50">{title}</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>

      {/* Summary stats */}
      <div className="mt-4 rounded-lg border border-dark-800/50 bg-dark-800/20 px-4 py-2 text-center">
        <p className="text-xs text-dark-400">
          Total: <span className="font-semibold text-primary-400">{total}</span>
        </p>
      </div>
    </div>
  );
}
