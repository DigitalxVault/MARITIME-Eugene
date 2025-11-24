#!/bin/bash

# Chart Implementation Verification Script
# Mission Control Dashboard - Recharts Integration

echo "🔍 Verifying Chart Implementation..."
echo "======================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
PASS=0
FAIL=0

# Helper functions
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $2 (missing: $1)"
        ((FAIL++))
    fi
}

check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $3"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $3"
        ((FAIL++))
    fi
}

# Change to project directory
cd "$(dirname "$0")"

echo "1. Checking Chart Component Files..."
echo "------------------------------------"
check_file "frontend/components/dashboard/charts/MissionDistributionChart.tsx" "MissionDistributionChart component"
check_file "frontend/components/dashboard/charts/CompletionTrendChart.tsx" "CompletionTrendChart component"
check_file "frontend/components/dashboard/charts/index.ts" "Chart exports index"
check_file "frontend/components/dashboard/charts/types.ts" "TypeScript types"
echo ""

echo "2. Checking Documentation Files..."
echo "----------------------------------"
check_file "frontend/components/dashboard/charts/README.md" "Component README"
check_file "frontend/components/dashboard/charts/VISUAL_GUIDE.md" "Visual guide"
check_file "frontend/components/dashboard/charts/TESTING_GUIDE.md" "Testing guide"
check_file "frontend/components/dashboard/charts/QUICK_REFERENCE.md" "Quick reference"
echo ""

echo "3. Checking Dashboard Integration..."
echo "------------------------------------"
check_content "frontend/app/dashboard/page.tsx" "MissionDistributionChart" "Import statement"
check_content "frontend/app/dashboard/page.tsx" "Missions by Difficulty" "Difficulty chart"
check_content "frontend/app/dashboard/page.tsx" "Missions by Type" "Type chart"
check_content "frontend/app/dashboard/page.tsx" "analytics?.distributions" "Data binding"
echo ""

echo "4. Checking Dependencies..."
echo "--------------------------"
if [ -f "frontend/package.json" ]; then
    if grep -q "recharts" "frontend/package.json"; then
        echo -e "${GREEN}✓${NC} Recharts dependency"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} Recharts dependency (not found in package.json)"
        ((FAIL++))
    fi
else
    echo -e "${RED}✗${NC} package.json not found"
    ((FAIL++))
fi
echo ""

echo "5. TypeScript Validation..."
echo "--------------------------"
cd frontend
if npm run type-check > /tmp/typecheck.log 2>&1; then
    echo -e "${GREEN}✓${NC} TypeScript compilation successful"
    ((PASS++))
else
    echo -e "${RED}✗${NC} TypeScript errors found"
    echo "See: /tmp/typecheck.log"
    ((FAIL++))
fi
cd ..
echo ""

echo "6. Checking Chart Component Structure..."
echo "----------------------------------------"
check_content "frontend/components/dashboard/charts/MissionDistributionChart.tsx" "PieChart" "Uses Recharts PieChart"
check_content "frontend/components/dashboard/charts/MissionDistributionChart.tsx" "Tooltip" "Has tooltip support"
check_content "frontend/components/dashboard/charts/MissionDistributionChart.tsx" "Legend" "Has legend support"
check_content "frontend/components/dashboard/charts/MissionDistributionChart.tsx" "ResponsiveContainer" "Is responsive"
echo ""

echo "7. Checking Theme Integration..."
echo "--------------------------------"
check_content "frontend/components/dashboard/charts/MissionDistributionChart.tsx" "bg-dark-900" "Dark theme background"
check_content "frontend/components/dashboard/charts/MissionDistributionChart.tsx" "border-dark-800" "Dark theme border"
check_content "frontend/components/dashboard/charts/MissionDistributionChart.tsx" "text-dark-50" "Dark theme text"
echo ""

echo "8. Checking Loading States..."
echo "-----------------------------"
check_content "frontend/components/dashboard/charts/MissionDistributionChart.tsx" "animate-pulse" "Loading skeleton"
check_content "frontend/components/dashboard/charts/MissionDistributionChart.tsx" "No data available" "Empty state"
echo ""

# Summary
echo ""
echo "======================================"
echo "Summary"
echo "======================================"
echo -e "Passed: ${GREEN}$PASS${NC}"
echo -e "Failed: ${RED}$FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed!${NC}"
    echo ""
    echo "Next Steps:"
    echo "1. Start dev server: cd frontend && npm run dev"
    echo "2. Visit: http://localhost:3000/dashboard"
    echo "3. Verify charts render correctly"
    echo "4. Test tooltips and interactions"
    echo "5. Check responsive design on mobile"
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed. Please review the errors above.${NC}"
    exit 1
fi
