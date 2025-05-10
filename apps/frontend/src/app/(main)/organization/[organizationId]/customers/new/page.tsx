import { CustomerForm } from '@/components/partials/customer/customer-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Customer - Wheelbase',
};

export default function NewCustomerPage() {
  return <CustomerForm />;
}
