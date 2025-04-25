import type { Metadata } from 'next';
import VehiclesTable from '@/components/vehicles-table';

export const metadata: Metadata = {
  title: 'Vehicles List',
  description: 'List of vehicles',
};

export default function VehiclesPage() {
  return (
    <div className="pt-8">
      <VehiclesTable />
    </div>
  );
}
