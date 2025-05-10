'use client';

import { RevenueChart } from './revenue-chart';
import { VehicleStats } from './vehicle-stats';
import { CustomerStats } from './customer-stats';
import { DashboardProvider } from './provider';

export function DashboardStatistics() {
  return (
    <DashboardProvider>
      {({ data }) => (
        <>
          {data && (
            <>
              <RevenueChart data={data} />
              <VehicleStats data={data.vehicles} />
              <CustomerStats data={data.customers} />
            </>
          )}
        </>
      )}
    </DashboardProvider>
  );
}
