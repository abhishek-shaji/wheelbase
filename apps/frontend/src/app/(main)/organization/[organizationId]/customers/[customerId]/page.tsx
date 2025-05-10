import type { Metadata } from 'next';

import { CustomerForm } from '@/components/partials/customer/customer-form';

export const metadata: Metadata = {
  title: 'Create Customer - Wheelbase',
};

export default function EditCustomerPage() {
  return <CustomerForm />;
}
