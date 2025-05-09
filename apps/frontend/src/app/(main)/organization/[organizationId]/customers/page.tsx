import type { Metadata } from 'next';
import { CustomersTable } from '@/components/partials/customer';

export const metadata: Metadata = {
  title: 'Customers List',
  description: 'List of customers',
};

export default function CustomersPage() {
  return (
    <div className="pt-8">
      <CustomersTable />
    </div>
  );
}
