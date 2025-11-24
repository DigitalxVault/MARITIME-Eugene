# Dashboard Charts Documentation

## Overview

This directory contains reusable chart components built with Recharts for the Mission Control Dashboard. The components are designed to match the dark sci-fi theme and provide interactive data visualizations.

## Components

### 1. MissionDistributionChart

A reusable pie chart component for displaying distribution data (e.g., missions by difficulty, missions by type).

**Features:**
- Pie chart with customizable colors
- Interactive tooltips showing count and percentage
- Legend with color-coded labels
- Loading skeleton state
- Empty state with icon
- Dark theme compatible
- Responsive design
- Summary stats below chart

**Props:**
```typescript
interface MissionDistributionChartProps {
  data?: DataItem[];      // Array of distribution data
  title: string;          // Chart title
  dataKey: string;        // Key to use for labels (e.g., 'difficulty', 'type')
  colors?: string[];      // Optional custom color palette
}
```

**Data Format:**
```javascript
[
  { difficulty: 'EASY', count: 5 },
  { difficulty: 'MEDIUM', count: 10 },
  { difficulty: 'HARD', count: 3 }
]
```

**Usage:**
```tsx
<MissionDistributionChart
  title="Missions by Difficulty"
  data={analytics?.distributions?.missionsByDifficulty}
  dataKey="difficulty"
  colors={['#10b981', '#f59e0b', '#ef4444', '#0284c7']}
/>
```

### 2. CompletionTrendChart

An area chart component for displaying completion trends over time.

**Features:**
- Area chart with gradient fill
- Grid lines for better readability
- Interactive tooltips with formatted dates
- X/Y axis with custom formatting
- Loading skeleton state
- Empty state with icon
- Dark theme compatible
- Responsive design
- Summary stats (total and average)

**Props:**
```typescript
interface CompletionTrendChartProps {
  data?: TrendDataItem[];  // Array of trend data
  title: string;           // Chart title
}

interface TrendDataItem {
  period: string;          // Time period label or date
  completions: number;     // Number of completions
  date?: string;          // Optional ISO date string
}
```

**Data Format:**
```javascript
[
  { period: '2024-01-01', completions: 15 },
  { period: '2024-01-02', completions: 23 },
  { period: '2024-01-03', completions: 18 }
]
```

**Usage:**
```tsx
<CompletionTrendChart
  title="Completion Trends"
  data={trendData}
/>
```

## Color Palette

The components use the Mission Control theme colors:

```javascript
const COLORS = {
  primary: '#0284c7',    // Primary blue
  success: '#10b981',    // Green
  warning: '#f59e0b',    // Amber
  error: '#ef4444',      // Red
  info: '#3b82f6',       // Blue
  secondary: '#d946ef',  // Purple
};
```

## States

### Loading State
Both components display animated skeleton loaders while data is being fetched.

### Empty State
When no data is available, components show a friendly message with an icon.

### Error Handling
If data is undefined, the loading state is shown. If data is an empty array, the empty state is shown.

## Responsive Design

Charts are fully responsive:
- **Mobile (< 768px)**: Single column layout
- **Tablet (768px - 1024px)**: Two column grid
- **Desktop (> 1024px)**: Two column grid with increased chart size

## Dark Theme

All charts are designed for the dark sci-fi theme:
- Dark backgrounds: `bg-dark-900/50`
- Border colors: `border-dark-800`
- Text colors: `text-dark-50` (titles), `text-dark-300` (labels), `text-dark-400` (secondary)
- Hover effects: `hover:border-primary-500/50`
- Grid lines: `stroke="#334155" opacity={0.3}`

## Animations

Charts feature smooth animations:
- Pie chart: 800ms animation duration
- Area chart: 1000ms animation duration
- All animations use `animationBegin={0}` for immediate start

## Integration with Dashboard

The charts are integrated into `/app/dashboard/page.tsx`:

```tsx
{/* Analytics Charts */}
<div className="mb-8 grid gap-6 md:grid-cols-2">
  <MissionDistributionChart
    title="Missions by Difficulty"
    data={analytics?.distributions?.missionsByDifficulty}
    dataKey="difficulty"
    colors={['#10b981', '#f59e0b', '#ef4444', '#0284c7']}
  />
  <MissionDistributionChart
    title="Missions by Type"
    data={analytics?.distributions?.missionsByType}
    dataKey="type"
    colors={['#0284c7', '#d946ef', '#3b82f6', '#0ea5e9']}
  />
</div>
```

## Testing Recommendations

### Unit Tests
1. **Component Rendering**
   - Test loading state renders skeleton
   - Test empty state renders message
   - Test data renders chart correctly

2. **Data Transformation**
   - Verify label formatting (ENUM → Readable)
   - Verify percentage calculations
   - Verify color assignment

3. **Accessibility**
   - Test keyboard navigation
   - Verify ARIA labels
   - Check color contrast ratios

### Integration Tests
1. **Dashboard Integration**
   - Verify charts receive analytics data
   - Test loading state coordination
   - Verify responsive layout

2. **User Interactions**
   - Test tooltip display on hover
   - Verify legend interactions
   - Test chart animations

### Visual Regression Tests
1. Take screenshots of:
   - Loading state
   - Empty state
   - Charts with data
   - Mobile/tablet/desktop layouts

## Performance Considerations

1. **Data Transformation**: Done once during render, not in render loop
2. **Memoization**: Consider using `useMemo` for expensive calculations if data updates frequently
3. **Animation**: Animations are hardware-accelerated where possible
4. **Responsive**: Uses `ResponsiveContainer` for efficient resizing

## Future Enhancements

Potential improvements:
1. **Export Charts**: Add button to export as PNG/SVG
2. **Interactive Filters**: Click legend items to filter data
3. **Drill-Down**: Click chart sections to view detailed data
4. **Date Range Selector**: For trend charts
5. **Custom Tooltips**: More detailed information on hover
6. **Print Styles**: Optimize for printing/PDF export
7. **Real-time Updates**: WebSocket integration for live data

## Dependencies

- `recharts@3.5.0`: Chart library
- `react@19.0.0`: React framework
- `next@15.0.4`: Next.js framework
- `tailwindcss@3.4.16`: Styling

## File Structure

```
components/dashboard/charts/
├── MissionDistributionChart.tsx  # Pie chart component
├── CompletionTrendChart.tsx      # Area chart component
├── types.ts                       # TypeScript type definitions
├── index.ts                       # Export barrel file
└── README.md                      # This file
```

## Support

For issues or questions, refer to:
- Recharts documentation: https://recharts.org/
- Mission Control Dashboard documentation
- Project issue tracker
