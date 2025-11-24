# Charts Quick Reference

## 🚀 Getting Started

### Start Development Server
```bash
cd frontend
npm run dev
# Visit: http://localhost:3000/dashboard
```

### Verify Charts
1. Navigate to dashboard
2. Wait for data to load
3. Check both pie charts appear
4. Hover to see tooltips

## 📊 Available Components

### MissionDistributionChart
**Purpose:** Display distribution data as pie chart

**Import:**
```tsx
import { MissionDistributionChart } from '@/components/dashboard/charts';
```

**Basic Usage:**
```tsx
<MissionDistributionChart
  title="Missions by Difficulty"
  data={analytics?.distributions?.missionsByDifficulty}
  dataKey="difficulty"
/>
```

**With Custom Colors:**
```tsx
<MissionDistributionChart
  title="Custom Chart"
  data={myData}
  dataKey="category"
  colors={['#10b981', '#f59e0b', '#ef4444']}
/>
```

**Data Format:**
```typescript
[
  { difficulty: 'EASY', count: 10 },
  { difficulty: 'MEDIUM', count: 5 },
  { difficulty: 'HARD', count: 2 }
]
```

### CompletionTrendChart
**Purpose:** Display trends over time as area chart

**Import:**
```tsx
import { CompletionTrendChart } from '@/components/dashboard/charts';
```

**Basic Usage:**
```tsx
<CompletionTrendChart
  title="Completion Trends"
  data={trendData}
/>
```

**Data Format:**
```typescript
[
  { period: '2024-01-01', completions: 15 },
  { period: '2024-01-02', completions: 23 },
  { period: '2024-01-03', completions: 18 }
]
```

## 🎨 Theme Colors

### Default Chart Palette
```typescript
const COLORS = [
  '#0284c7', // Primary Blue
  '#10b981', // Success Green
  '#f59e0b', // Warning Amber
  '#ef4444', // Error Red
  '#3b82f6', // Info Blue
  '#d946ef', // Secondary Purple
];
```

### Semantic Colors
```typescript
// Difficulty Chart
colors={[
  '#10b981', // Easy - Green
  '#f59e0b', // Medium - Amber
  '#ef4444', // Hard - Red
  '#0284c7', // Extreme - Blue
]}

// Type Chart
colors={[
  '#0284c7', // PVE - Primary
  '#d946ef', // PVP - Secondary
  '#3b82f6', // Training - Info
  '#0ea5e9', // Mission - Light Blue
]}
```

## 🔧 Common Customizations

### Change Chart Size
```tsx
<ResponsiveContainer width="100%" height={400}>
  {/* Chart content */}
</ResponsiveContainer>
```

### Modify Animation Speed
```tsx
<Pie
  animationBegin={0}
  animationDuration={1200} // Default: 800ms
  // ... other props
/>
```

### Custom Tooltip
```tsx
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.[0]) {
    return (
      <div className="custom-tooltip">
        {/* Your custom content */}
      </div>
    );
  }
  return null;
};

<Tooltip content={<CustomTooltip />} />
```

## 🐛 Troubleshooting

### Charts Not Rendering
**Problem:** Blank space where charts should be
**Solution:**
1. Check browser console for errors
2. Verify data is not `undefined`
3. Ensure Recharts is imported correctly
4. Check API response format

### Tooltips Not Working
**Problem:** No tooltip on hover
**Solution:**
1. Verify z-index settings
2. Check for overlapping elements
3. Ensure chart has proper height/width
4. Test in different browsers

### Colors Not Applying
**Problem:** Charts use default colors
**Solution:**
1. Verify `colors` prop is passed
2. Check color format (hex strings)
3. Ensure array length matches data
4. Inspect with DevTools

### Loading State Stuck
**Problem:** Skeleton loader persists
**Solution:**
1. Check API endpoint is reachable
2. Verify data format matches expected
3. Check React Query configuration
4. Look for JavaScript errors

## 📱 Responsive Breakpoints

```css
/* Mobile First */
< 768px:   Single column, full width
768-1024px: Two columns, tablet layout
> 1024px:   Two columns, desktop layout
```

## ⚡ Performance Tips

### Optimize Large Datasets
```tsx
// Limit data points
const limitedData = data.slice(0, 10);

<MissionDistributionChart
  data={limitedData}
  // ...
/>
```

### Disable Animations (if needed)
```tsx
<Pie
  animationBegin={0}
  animationDuration={0}
  isAnimationActive={false}
  // ...
/>
```

### Lazy Load Charts
```tsx
import dynamic from 'next/dynamic';

const MissionDistributionChart = dynamic(
  () => import('@/components/dashboard/charts/MissionDistributionChart'),
  { ssr: false }
);
```

## 📐 Layout Examples

### Side by Side
```tsx
<div className="grid gap-6 md:grid-cols-2">
  <MissionDistributionChart {...props1} />
  <MissionDistributionChart {...props2} />
</div>
```

### Stacked
```tsx
<div className="space-y-6">
  <MissionDistributionChart {...props1} />
  <MissionDistributionChart {...props2} />
</div>
```

### Three Columns
```tsx
<div className="grid gap-6 md:grid-cols-3">
  <MissionDistributionChart {...props1} />
  <MissionDistributionChart {...props2} />
  <CompletionTrendChart {...props3} />
</div>
```

## 🧪 Testing Commands

```bash
# Type check
npm run type-check

# Build
npm run build

# Lint
npm run lint

# Run tests (if configured)
npm test
```

## 📚 Documentation Files

- **README.md**: Full component documentation
- **VISUAL_GUIDE.md**: Visual appearance guide
- **TESTING_GUIDE.md**: Testing procedures
- **QUICK_REFERENCE.md**: This file
- **types.ts**: TypeScript definitions

## 🔗 Useful Links

- Recharts Docs: https://recharts.org/
- Tailwind CSS: https://tailwindcss.com/
- Next.js: https://nextjs.org/
- React Query: https://tanstack.com/query/

## 💡 Pro Tips

1. **Always handle loading state**: Pass `undefined` to show skeleton
2. **Empty arrays show empty state**: Return `[]` when no data
3. **Use semantic colors**: Match colors to meaning (green=good, red=bad)
4. **Test on mobile**: Charts must work on small screens
5. **Tooltips add value**: Always include meaningful tooltip data
6. **Responsive by default**: Use ResponsiveContainer
7. **Animate wisely**: Smooth animations improve UX
8. **Document custom charts**: Add comments for maintainability

## ⚠️ Common Mistakes

❌ **Hardcoding data** → ✅ Use props/API data
❌ **Skipping loading state** → ✅ Show skeleton while loading
❌ **Ignoring empty state** → ✅ Handle empty arrays gracefully
❌ **Fixed width/height** → ✅ Use ResponsiveContainer
❌ **Default colors** → ✅ Use theme colors
❌ **No tooltips** → ✅ Add informative tooltips
❌ **Forgetting mobile** → ✅ Test responsive design

## 🎯 Quick Checklist

- [ ] Component renders without errors
- [ ] Loading state shows skeleton
- [ ] Empty state shows message
- [ ] Data renders correctly
- [ ] Tooltips work on hover
- [ ] Colors match theme
- [ ] Responsive on mobile
- [ ] Animations are smooth
- [ ] No TypeScript errors
- [ ] Production build succeeds

## 📞 Need Help?

1. Check documentation files in this directory
2. Review Recharts official docs
3. Inspect browser console for errors
4. Test with sample data first
5. Verify API response format
6. Check component props are correct

---

**Quick Start:** Import → Pass data → Customize colors → Done! 🎉
