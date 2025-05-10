'use client';

import React, { ReactNode } from 'react';
import { useDashboardStatistics } from '@/services/useStatistics';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';
import { DashboardStatistics } from '@/types';

interface DashboardProviderProps {
  children: (props: { data: DashboardStatistics }) => ReactNode;
}

const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { data, isLoading, error } = useDashboardStatistics(organizationId);

  if (isLoading) {
    return (
      <div className="grid auto-rows-min @2xl:grid-cols-2 *:-ms-px *:-mt-px -m-px gap-4">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  return <>{children({ data })}</>;
};

export { DashboardProvider };
