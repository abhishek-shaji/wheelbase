import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - DealerHub',
};

import { DashboardStatistics } from '@/components/partials/dashboard/statistics';

export default function Page() {
  return (
    <div className="grid auto-rows-min @2xl:grid-cols-2 *:-ms-px *:-mt-px -m-px">
      <DashboardStatistics />
    </div>
  );
}
