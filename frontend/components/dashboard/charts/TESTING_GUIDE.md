# Testing Guide - Dashboard Charts

## Quick Start Testing

### 1. Visual Verification

Start the development server and navigate to the dashboard:

```bash
cd frontend
npm run dev
```

Visit: `http://localhost:3000/dashboard`

### 2. Check States

**Loading State:**
- Refresh the page and observe loading skeletons
- Should see pulsing circular placeholders

**Data State:**
- Wait for data to load
- Charts should render with actual analytics data
- Tooltips should appear on hover

**Empty State:**
- Temporarily modify API to return empty arrays
- Should see "No data available" message with icon

## Manual Test Cases

### Test Case 1: Data Rendering

**Objective:** Verify charts render correctly with real data

**Steps:**
1. Navigate to `/dashboard`
2. Wait for charts to load
3. Verify both charts appear
4. Check data matches backend response

**Expected Results:**
- ✓ Two pie charts visible
- ✓ "Missions by Difficulty" shows difficulty distribution
- ✓ "Missions by Type" shows type distribution
- ✓ Total counts match dashboard stats
- ✓ Percentages add up to 100%

**Sample Data Check:**
```javascript
// In browser console:
fetch('/api/analytics/overview')
  .then(r => r.json())
  .then(data => {
    console.log('Difficulty:', data.distributions.missionsByDifficulty);
    console.log('Type:', data.distributions.missionsByType);
  });
```

### Test Case 2: Interactive Elements

**Objective:** Verify tooltips and hover effects work

**Steps:**
1. Hover over pie chart segments
2. Hover over chart container
3. Hover over legend items

**Expected Results:**
- ✓ Tooltip appears on segment hover
- ✓ Tooltip shows: label, count, percentage
- ✓ Border glow on container hover
- ✓ Legend items are readable

### Test Case 3: Responsive Design

**Objective:** Verify charts work on different screen sizes

**Steps:**
1. Open dashboard on desktop (> 1024px)
2. Resize to tablet (768-1024px)
3. Resize to mobile (< 768px)
4. Test on actual mobile device

**Expected Results:**
- ✓ Desktop: 2-column grid
- ✓ Tablet: 2-column grid, slightly smaller
- ✓ Mobile: Single column, stacked
- ✓ Charts maintain aspect ratio
- ✓ Text remains readable at all sizes

### Test Case 4: Dark Theme

**Objective:** Verify dark theme styling

**Steps:**
1. View charts in default dark theme
2. Check all colors and borders
3. Verify text contrast

**Expected Results:**
- ✓ Background: Dark semi-transparent
- ✓ Border: Dark gray (`#1e293b`)
- ✓ Text: Light colors with good contrast
- ✓ Chart segments: Theme colors
- ✓ Grid lines: Subtle, visible but not distracting

### Test Case 5: Loading States

**Objective:** Verify loading behavior

**Steps:**
1. Throttle network to Slow 3G
2. Refresh dashboard
3. Observe loading sequence

**Expected Results:**
- ✓ Skeleton loaders appear immediately
- ✓ Skeletons have pulsing animation
- ✓ Charts replace skeletons smoothly
- ✓ No layout shift during load

### Test Case 6: Error Handling

**Objective:** Verify error states

**Steps:**
1. Stop backend server
2. Refresh dashboard
3. Observe error handling

**Expected Results:**
- ✓ Charts show loading state initially
- ✓ Graceful fallback if data unavailable
- ✓ No JavaScript errors in console
- ✓ Dashboard remains functional

### Test Case 7: Performance

**Objective:** Verify charts perform well

**Steps:**
1. Open DevTools Performance tab
2. Record page load
3. Analyze chart rendering time

**Expected Results:**
- ✓ Initial render < 100ms
- ✓ Animation smooth (60fps)
- ✓ No janky scrolling
- ✓ Memory usage stable

## Automated Testing Recommendations

### Unit Tests (Jest + React Testing Library)

**MissionDistributionChart.test.tsx:**

```typescript
import { render, screen } from '@testing-library/react';
import MissionDistributionChart from './MissionDistributionChart';

describe('MissionDistributionChart', () => {
  const mockData = [
    { difficulty: 'EASY', count: 10 },
    { difficulty: 'MEDIUM', count: 5 },
    { difficulty: 'HARD', count: 2 },
  ];

  test('renders loading state when data is undefined', () => {
    render(
      <MissionDistributionChart
        title="Test Chart"
        data={undefined}
        dataKey="difficulty"
      />
    );
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  test('renders empty state when data is empty array', () => {
    render(
      <MissionDistributionChart
        title="Test Chart"
        data={[]}
        dataKey="difficulty"
      />
    );
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  test('renders chart with data', () => {
    render(
      <MissionDistributionChart
        title="Test Chart"
        data={mockData}
        dataKey="difficulty"
      />
    );
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    expect(screen.getByText(/Total: 17/)).toBeInTheDocument();
  });

  test('formats labels correctly', () => {
    const { container } = render(
      <MissionDistributionChart
        title="Test Chart"
        data={mockData}
        dataKey="difficulty"
      />
    );
    // Check that EASY becomes "Easy", MEDIUM becomes "Medium"
    expect(container.textContent).toMatch(/Easy|Medium|Hard/);
  });

  test('uses custom colors when provided', () => {
    const customColors = ['#ff0000', '#00ff00', '#0000ff'];
    render(
      <MissionDistributionChart
        title="Test Chart"
        data={mockData}
        dataKey="difficulty"
        colors={customColors}
      />
    );
    // Verify custom colors are applied (implementation-specific)
  });
});
```

**CompletionTrendChart.test.tsx:**

```typescript
import { render, screen } from '@testing-library/react';
import CompletionTrendChart from './CompletionTrendChart';

describe('CompletionTrendChart', () => {
  const mockData = [
    { period: '2024-01-01', completions: 10 },
    { period: '2024-01-02', completions: 15 },
    { period: '2024-01-03', completions: 12 },
  ];

  test('renders loading state when data is undefined', () => {
    render(
      <CompletionTrendChart title="Test Chart" data={undefined} />
    );
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  test('renders empty state when data is empty', () => {
    render(
      <CompletionTrendChart title="Test Chart" data={[]} />
    );
    expect(screen.getByText('No trend data available')).toBeInTheDocument();
  });

  test('renders chart with data', () => {
    render(
      <CompletionTrendChart title="Test Chart" data={mockData} />
    );
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  test('calculates summary stats correctly', () => {
    render(
      <CompletionTrendChart title="Test Chart" data={mockData} />
    );
    // Total: 10 + 15 + 12 = 37
    expect(screen.getByText('37')).toBeInTheDocument();
    // Average: 37 / 3 = 12.3
    expect(screen.getByText(/12\.3/)).toBeInTheDocument();
  });
});
```

### Integration Tests (Playwright/Cypress)

**dashboard-charts.spec.ts:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Dashboard Charts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="mission-distribution-chart"]');
  });

  test('displays both distribution charts', async ({ page }) => {
    const difficultyChart = page.locator('text=Missions by Difficulty');
    const typeChart = page.locator('text=Missions by Type');

    await expect(difficultyChart).toBeVisible();
    await expect(typeChart).toBeVisible();
  });

  test('shows tooltip on hover', async ({ page }) => {
    // Hover over first chart
    const chart = page.locator('.recharts-pie-sector').first();
    await chart.hover();

    // Tooltip should appear
    const tooltip = page.locator('.recharts-tooltip-wrapper');
    await expect(tooltip).toBeVisible();
  });

  test('is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Charts should stack vertically
    const charts = page.locator('[data-testid*="chart"]');
    const count = await charts.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('handles loading state', async ({ page }) => {
    // Throttle network
    await page.route('**/api/analytics/overview', route => {
      setTimeout(() => route.continue(), 3000);
    });

    await page.reload();

    // Should show loading skeleton
    const skeleton = page.locator('.animate-pulse');
    await expect(skeleton).toBeVisible();
  });
});
```

### Visual Regression Tests (Percy/Chromatic)

```typescript
import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Chart Visual Regression', () => {
  test('matches baseline screenshot', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="mission-distribution-chart"]');

    // Wait for animations to complete
    await page.waitForTimeout(1000);

    await percySnapshot(page, 'Dashboard Charts - Desktop');
  });

  test('mobile layout matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="mission-distribution-chart"]');

    await percySnapshot(page, 'Dashboard Charts - Mobile');
  });
});
```

## Accessibility Testing

### Keyboard Navigation
```bash
# Manual test sequence
1. Tab to first chart
2. Tab through chart elements
3. Arrow keys to navigate data
4. Enter to activate tooltips
5. Escape to close tooltips
```

### Screen Reader Testing
```bash
# VoiceOver (macOS)
CMD + F5 to enable
Navigate to charts
Verify all labels are read correctly

# NVDA (Windows)
Ctrl + Alt + N to start
Navigate to dashboard
Verify chart descriptions
```

### Color Contrast
```bash
# Use browser DevTools
1. Inspect chart elements
2. Check contrast ratios
3. Verify WCAG 2.1 AA compliance
4. Test with color blindness simulators
```

## Performance Testing

### Lighthouse Audit
```bash
# Run Lighthouse in Chrome DevTools
1. Open DevTools
2. Navigate to Lighthouse tab
3. Generate report
4. Check Performance score (target: >90)
```

### Bundle Size Analysis
```bash
npm run build
npx @next/bundle-analyzer
# Verify Recharts bundle is tree-shaken
# Check for unnecessary dependencies
```

### Memory Profiling
```bash
# Chrome DevTools Memory tab
1. Take heap snapshot before charts load
2. Take snapshot after charts load
3. Compare memory usage
4. Target: < 5MB for charts
```

## Common Issues & Solutions

### Issue 1: Charts not rendering
**Symptoms:** Blank space where charts should be
**Solution:** Check browser console for errors, verify Recharts import

### Issue 2: Tooltips not appearing
**Symptoms:** No tooltip on hover
**Solution:** Verify z-index, check for overlapping elements

### Issue 3: Performance lag
**Symptoms:** Slow rendering, janky animations
**Solution:** Reduce animation duration, optimize data transformation

### Issue 4: Responsive layout broken
**Symptoms:** Charts overlap or overflow on mobile
**Solution:** Check grid classes, verify ResponsiveContainer

### Issue 5: Colors not matching theme
**Symptoms:** Charts use default Recharts colors
**Solution:** Verify color props are passed correctly

## Test Data Generator

For testing purposes, use this data generator:

```typescript
// utils/test-data-generator.ts
export function generateChartTestData() {
  return {
    distributions: {
      missionsByDifficulty: [
        { difficulty: 'EASY', count: 15 },
        { difficulty: 'MEDIUM', count: 25 },
        { difficulty: 'HARD', count: 10 },
        { difficulty: 'EXTREME', count: 5 },
      ],
      missionsByType: [
        { type: 'PVE', count: 30 },
        { type: 'PVP', count: 15 },
        { type: 'TRAINING', count: 10 },
      ],
    },
  };
}
```

## Reporting Bugs

When reporting chart-related bugs, include:

1. **Screenshot/Video:** Visual evidence of the issue
2. **Browser/Device:** Browser version and device type
3. **Console Logs:** Any JavaScript errors
4. **Data Payload:** Sample of API response
5. **Steps to Reproduce:** Detailed reproduction steps
6. **Expected vs Actual:** What should happen vs what happens
