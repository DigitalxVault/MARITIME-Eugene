# Visual Guide - Dashboard Charts

## Chart Appearance

### MissionDistributionChart (Pie Chart)

```
┌─────────────────────────────────────────────┐
│ Missions by Difficulty                      │
├─────────────────────────────────────────────┤
│                                             │
│              ╱╲                            │
│           ╱█████╲                          │
│         ╱█████████╲                        │
│        █████████████   Easy: 50%           │
│       █████████████████                     │
│      ███████████████████                    │
│      ███████████████████  Medium: 30%      │
│       █████████████████                     │
│        █████████████   Hard: 20%           │
│         ╲█████████╱                        │
│           ╲█████╱                          │
│              ╲╱                            │
│                                             │
│   ● Easy   ● Medium   ● Hard              │
│                                             │
│   ┌─────────────┐                          │
│   │ Total: 100  │                          │
│   └─────────────┘                          │
└─────────────────────────────────────────────┘
```

### Features:
- **Interactive Tooltips**: Hover shows exact count and percentage
- **Color Coding**:
  - Easy: Green (#10b981)
  - Medium: Amber (#f59e0b)
  - Hard: Red (#ef4444)
- **Labels**: Display on chart segments
- **Legend**: Below chart with color indicators
- **Summary**: Total count below chart

### CompletionTrendChart (Area Chart)

```
┌─────────────────────────────────────────────┐
│ Completion Trends                           │
├─────────────────────────────────────────────┤
│                                             │
│ 30│                    ╱╲                  │
│   │                  ╱██╲                  │
│ 25│                ╱████╲   ╱╲            │
│   │              ╱██████╲ ╱██╲            │
│ 20│            ╱████████████╲              │
│   │          ╱██████████████╲              │
│ 15│        ╱████████████████╲              │
│   │      ╱██████████████████╲              │
│ 10│    ╱████████████████████╲              │
│   │  ╱██████████████████████╲              │
│  5│╱████████████████████████████           │
│   │                                         │
│  0├─────┬─────┬─────┬─────┬─────┬─────┤   │
│   Jan   Feb   Mar   Apr   May   Jun        │
│                                             │
│   ● Completions                            │
│                                             │
│   ┌──────────┬──────────┐                  │
│   │ Total: 120│ Avg: 20 │                  │
│   └──────────┴──────────┘                  │
└─────────────────────────────────────────────┘
```

### Features:
- **Gradient Fill**: Green gradient from top to bottom
- **Grid Lines**: Subtle dark grid for readability
- **Tooltips**: Show date and completion count
- **Smooth Curve**: Monotone interpolation for smooth lines
- **Summary Stats**: Total and average completions

## Layout Integration

### Desktop View (> 1024px)

```
┌────────────────────────────────────────────────────────────┐
│  Welcome back, Username!                                    │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐          │
│  │Total   │  │Active  │  │Compl.  │  │Total   │          │
│  │Missions│  │Players │  │Rate    │  │Compl.  │          │
│  │   50   │  │   25   │  │  75%   │  │  120   │          │
│  └────────┘  └────────┘  └────────┘  └────────┘          │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐       │
│  │ Missions by Difficulty│  │ Missions by Type     │       │
│  │                       │  │                      │       │
│  │    [PIE CHART]       │  │    [PIE CHART]       │       │
│  │                       │  │                      │       │
│  └──────────────────────┘  └──────────────────────┘       │
│                                                             │
│  ┌───────────────────────────────┐  ┌─────────────┐       │
│  │ Recent Activity               │  │ Top Players │       │
│  │                               │  │             │       │
│  │ [ACTIVITY FEED]               │  │ [LEADERBOARD│       │
│  │                               │  │              │       │
│  └───────────────────────────────┘  └─────────────┘       │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Mobile View (< 768px)

```
┌────────────────────┐
│  Welcome back!     │
├────────────────────┤
│  ┌──────────────┐ │
│  │Total Missions│ │
│  │     50       │ │
│  └──────────────┘ │
│  ┌──────────────┐ │
│  │Active Players│ │
│  │     25       │ │
│  └──────────────┘ │
│                    │
│  ┌──────────────┐ │
│  │ By Difficulty│ │
│  │              │ │
│  │ [PIE CHART]  │ │
│  │              │ │
│  └──────────────┘ │
│  ┌──────────────┐ │
│  │ By Type      │ │
│  │              │ │
│  │ [PIE CHART]  │ │
│  │              │ │
│  └──────────────┘ │
│                    │
│  [Activity Feed]   │
│  [Leaderboard]     │
└────────────────────┘
```

## Color Scheme

### Chart Colors

**Difficulty Distribution:**
- Easy: `#10b981` (Green) - Low difficulty
- Medium: `#f59e0b` (Amber) - Moderate difficulty
- Hard: `#ef4444` (Red) - High difficulty
- Extreme: `#0284c7` (Blue) - Expert level

**Type Distribution:**
- PVE: `#0284c7` (Primary Blue)
- PVP: `#d946ef` (Secondary Purple)
- Training: `#3b82f6` (Info Blue)
- Mission: `#0ea5e9` (Light Blue)

### Theme Integration

```css
Background:     bg-dark-900/50     (#0f172a with 50% opacity)
Border:         border-dark-800    (#1e293b)
Hover Border:   border-primary-500/50  (#0284c7 with 50% opacity)
Title Text:     text-dark-50       (#f8fafc)
Label Text:     text-dark-300      (#cbd5e1)
Secondary Text: text-dark-400      (#94a3b8)
Grid Lines:     #334155 at 30% opacity
```

## States

### Loading State
```
┌─────────────────────────────────────┐
│ Missions by Difficulty              │
├─────────────────────────────────────┤
│                                     │
│         ┌─────────────┐            │
│         │             │            │
│         │   ▓▓▓▓▓▓▓  │  (Pulsing  │
│         │   ▓▓▓▓▓▓▓  │   skeleton) │
│         │   ▓▓▓▓▓▓▓  │            │
│         │             │            │
│         └─────────────┘            │
│                                     │
└─────────────────────────────────────┘
```

### Empty State
```
┌─────────────────────────────────────┐
│ Missions by Difficulty              │
├─────────────────────────────────────┤
│                                     │
│              📊                     │
│                                     │
│        No data available            │
│                                     │
└─────────────────────────────────────┘
```

### Hover Interactions

**Chart Segment Hover:**
```
┌─────────────────────────────────────┐
│     ┌────────────────┐              │
│     │ Easy           │              │
│     │ Count: 50      │  ← Tooltip   │
│     │ Percentage: 50%│              │
│     └────────────────┘              │
│          ↓                          │
│       [Highlighted segment]         │
└─────────────────────────────────────┘
```

**Container Hover:**
- Border changes from `border-dark-800` to `border-primary-500/50`
- Smooth transition animation

## Accessibility

### Keyboard Navigation
- Tab to navigate between chart elements
- Arrow keys to move between data points
- Enter to activate tooltips

### Screen Reader Support
- ARIA labels on all chart elements
- Descriptive titles and legends
- Data tables as fallback

### Color Contrast
- All text meets WCAG 2.1 AA standards
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 for large text

## Animation Timeline

**Pie Chart:**
```
0ms ────────> 800ms
  Start        End
  (invisible) (fully rendered)

  Segments fade in and rotate into position
```

**Area Chart:**
```
0ms ────────> 1000ms
  Start          End
  (flat line)   (full data visualization)

  Line draws from left to right
  Area fill follows line animation
```

## Performance

- **Initial Render**: < 100ms
- **Animation Duration**: 800-1000ms
- **Tooltip Response**: < 16ms (60fps)
- **Resize Handling**: Debounced, < 150ms

## Browser Support

✓ Chrome 90+
✓ Firefox 88+
✓ Safari 14+
✓ Edge 90+
✓ Mobile Safari (iOS 14+)
✓ Chrome Mobile (Android 10+)
