'use client';

import { AppHeader } from '@/components/app-header';
import { ActionButtons } from '@/components/action-buttons';
import { usePathname } from 'next/navigation';
import { AddCustomerButton } from '@/components/buttons/add-customer-button';

interface CustomersLayoutProps {
  children: React.ReactNode;
}

export default function CustomersLayout({ children }: CustomersLayoutProps) {
  const pathname = usePathname();
  const isCreatePage = pathname.endsWith('/new');

  // Define breadcrumb items based on the current path
  const breadcrumbItems = isCreatePage
    ? [
        { label: 'Home', href: '/' },
        { label: 'Customers', href: pathname.replace('/new', '') },
        { label: 'Create', isCurrentPage: true },
      ]
    : [
        { label: 'Home', href: '/' },
        { label: 'Customers', isCurrentPage: true },
      ];

  return (
    <>
      <AppHeader
        breadcrumbItems={breadcrumbItems}
        actions={
          !isCreatePage && (
            <ActionButtons>
              <AddCustomerButton />
            </ActionButtons>
          )
        }
      />
      <main>{children}</main>
    </>
  );
}
