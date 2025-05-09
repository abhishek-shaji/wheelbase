'use client';

import { AppHeader } from '@/components/app-header';
import { ActionButtons } from '@/components/action-buttons';
import { usePathname } from 'next/navigation';
import { AddVehicleButton } from '@/components/buttons/add-vehicle-button';

interface VehiclesLayoutProps {
  children: React.ReactNode;
}

export default function VehiclesLayout({ children }: VehiclesLayoutProps) {
  const pathname = usePathname();
  const isCreatePage = pathname.endsWith('/new');

  // Define breadcrumb items based on the current path
  const breadcrumbItems = isCreatePage
    ? [
        { label: 'Home', href: '/' },
        { label: 'Vehicles', href: pathname.replace('/new', '') },
        { label: 'Create', isCurrentPage: true },
      ]
    : [
        { label: 'Home', href: '/' },
        { label: 'Vehicles', isCurrentPage: true },
      ];

  return (
    <>
      <AppHeader
        breadcrumbItems={breadcrumbItems}
        actions={
          !isCreatePage && (
            <ActionButtons>
              <AddVehicleButton />
            </ActionButtons>
          )
        }
      />
      <main>{children}</main>
    </>
  );
}
