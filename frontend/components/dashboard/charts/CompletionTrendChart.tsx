'use client';

/**
 * Completion Trend Chart Component
 * Line/area chart for displaying completion trends over time
 */

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TrendDataItem {
  period: string;
  completions: number;
  date?: string;
}

interface CompletionTrendChartProps {
  data?: TrendDataItem[];
  title: string;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];

    return (
      <div className="rounded-lg border border-dark-700 bg-dark-900/95 px-3 py-2 shadow-lg backdrop-blur-sm">
        <p className="text-sm font-semibold text-dark-50">{label}</p>
        <p className="text-xs text-dark-300">
          Completions: <span className="font-semibold text-success">{data.value}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Format axis labels
const formatXAxis = (value: string) => {
  // If it's a date string, format it nicely
  if (value.includes('-')) {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return value;
};

export default function CompletionTrendChart({
  data,
  title,
}: CompletionTrendChartProps) {
  // Loading state
  if (!data) {
    return (
      <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-dark-50">{title}</h3>
        <div className="flex h-64 items-center justify-center">
          <div className="h-48 w-full animate-pulse rounded bg-dark-700"></div>
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
            <div className="mb-2 text-4xl text-dark-600">📈</div>
            <p className="text-sm text-dark-400">No trend data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dark-800 bg-dark-900/50 p-6 shadow-sci-fi backdrop-blur-sm transition-all hover:border-primary-500/50">
      <h3 className="mb-4 text-lg font-semibold text-dark-50">{title}</h3>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis
            dataKey="period"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            tickFormatter={formatXAxis}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }}
            iconType="circle"
          />
          <Area
            type="monotone"
            dataKey="completions"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCompletions)"
            animationBegin={0}
            animationDuration={1000}
            name="Completions"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Summary stats */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-dark-800/50 bg-dark-800/20 px-4 py-2 text-center">
          <p className="text-xs text-dark-400">Total</p>
          <p className="font-semibold text-success">
            {data.reduce((sum, item) => sum + item.completions, 0)}
          </p>
        </div>
        <div className="rounded-lg border border-dark-800/50 bg-dark-800/20 px-4 py-2 text-center">
          <p className="text-xs text-dark-400">Average</p>
          <p className="font-semibold text-success">
            {(data.reduce((sum, item) => sum + item.completions, 0) / data.length).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
