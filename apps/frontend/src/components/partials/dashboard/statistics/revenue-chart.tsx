'use client';

import { useId } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { CustomTooltipContent } from '@/components/charts-extra';
import { Badge } from '@/components/ui/badge';
import { DashboardStatistics } from '@/types';

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

interface RevenueChartProps {
  data: DashboardStatistics;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const id = useId();

  const revenueByDay = data.revenue_by_month || {};
  const chartData = Object.entries(revenueByDay).map(([dateStr, revenue]) => {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
    });
    return {
      date: formattedDate,
      fullDate: dateStr,
      revenue,
    };
  });

  chartData.sort(
    (a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
  );

  const totalRevenue = data.total_revenue || 0;
  let growthPercentage = 0;

  if (chartData.length >= 2) {
    const latestRevenueSum = chartData
      .slice(-3)
      .reduce((sum, item) => sum + item.revenue, 0);
    const earlierRevenueSum = chartData
      .slice(0, 3)
      .reduce((sum, item) => sum + item.revenue, 0);

    if (earlierRevenueSum > 0) {
      growthPercentage =
        ((latestRevenueSum - earlierRevenueSum) / earlierRevenueSum) * 100;
    }
  }

  const formatRevenue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SEK',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <CardTitle>Last 7 Days Revenue</CardTitle>
            <div className="flex items-start gap-2">
              <div className="font-semibold text-2xl">
                {formatRevenue(totalRevenue)}
              </div>
              <Badge
                className={`mt-1.5 ${
                  growthPercentage >= 0
                    ? 'bg-emerald-500/24 text-emerald-500'
                    : 'bg-red-500/24 text-red-500'
                } border-none`}
              >
                {growthPercentage >= 0 ? '+' : ''}
                {growthPercentage.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-60 w-full [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-[var(--chart-1)]/15"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            maxBarSize={36}
            margin={{ left: 10, right: 12, top: 12, bottom: 5 }}
          >
            <defs>
              <linearGradient id={`${id}-gradient`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" />
                <stop offset="100%" stopColor="var(--chart-2)" />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="2 2"
              stroke="var(--border)"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={12}
              stroke="var(--border)"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatRevenue(value)}
              width={60}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <CustomTooltipContent
                  colorMap={{
                    revenue: 'var(--chart-1)',
                  }}
                  labelMap={{
                    revenue: 'Revenue',
                  }}
                  dataKeys={['revenue']}
                  valueFormatter={(value) => formatRevenue(value)}
                />
              }
            />
            <Bar dataKey="revenue" fill={`url(#${id}-gradient)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
