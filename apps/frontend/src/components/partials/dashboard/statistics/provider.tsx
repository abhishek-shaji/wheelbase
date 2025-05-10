'use client';

import { ReactNode } from 'react';
import {
  useDashboardStatistics,
  DashboardStatistics,
} from '@/services/useStatistics';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';

interface DashboardProviderProps {
  children: (props: { data: DashboardStatistics }) => ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
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
}
