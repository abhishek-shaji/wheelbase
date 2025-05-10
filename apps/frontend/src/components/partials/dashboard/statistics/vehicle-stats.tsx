'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardStatistics } from '@/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface VehicleStatsProps {
  data: DashboardStatistics['vehicles'];
}

function calculatePercentage(
  value: number,
  distribution: Record<string, number>
) {
  const total = Object.values(distribution).reduce(
    (sum, count) => sum + (count as number),
    0
  );
  return total > 0 ? (value / total) * 100 : 0;
}

const VehicleStats = ({ data }: VehicleStatsProps) => {
  const fuelTypeData = Object.entries(data.fuel_type_distribution || {}).map(
    ([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
      percentage: calculatePercentage(value, data.fuel_type_distribution),
    })
  );

  const totalVehicles = Object.values(data.fuel_type_distribution || {}).reduce(
    (sum, count) => sum + (count as number),
    0
  );

  return (
    <Card className="gap-5">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <CardTitle>Fuel Type Distribution</CardTitle>
            <div className="flex items-start gap-2">
              <div className="font-semibold text-2xl">{totalVehicles}</div>
              <Badge className="mt-1.5 bg-emerald-500/24 text-emerald-500 border-none">
                Vehicles
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {fuelTypeData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-xs"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="text-[13px]/3 text-muted-foreground/50">
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex gap-1 h-5">
          {fuelTypeData.map((item, index) => (
            <div
              key={index}
              className="h-full"
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
            ></div>
          ))}
        </div>
        <div>
          <div className="text-[13px]/3 text-muted-foreground/50 mb-3">
            Vehicle Fuel Types
          </div>
          <ul className="text-sm divide-y divide-border">
            {fuelTypeData.map((item, index) => (
              <li key={index} className="py-2 flex items-center gap-2">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                ></span>
                <span className="grow text-muted-foreground">{item.name}</span>
                <span className="text-[13px]/3 font-medium text-foreground/70">
                  {item.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export { VehicleStats };
