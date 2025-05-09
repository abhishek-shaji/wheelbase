'use client';

import { AppHeader } from '@/components/app-header';
import { usePathname } from 'next/navigation';

interface OrganizationLayoutProps {
  children: React.ReactNode;
}

export default function OrganizationLayout({
  children,
}: OrganizationLayoutProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  // If we're in a deeper path (vehicles, customers, etc.), don't render the header here
  // Those sections have their own layout with headers
  const isRootPath = pathSegments.length <= 2; // "/organization/[id]" has 2 segments

  const breadcrumbItems = isRootPath
    ? [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', isCurrentPage: true },
      ]
    : [];

  return (
    <>
      {isRootPath && <AppHeader breadcrumbItems={breadcrumbItems} />}
      {children}
    </>
  );
}
