import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/openapi-fetch';
import { DashboardStatistics } from '@/types';

export const useDashboardStatistics = (organizationId: string) => {
  return useQuery({
    queryKey: ['statistics', organizationId],
    queryFn: async (): Promise<DashboardStatistics> => {
      const { response, data } = await client.GET(
        `/organizations/{organization_id}/statistics/dashboard`,
        {
          params: {
            path: {
              organization_id: organizationId,
            },
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to fetch dashboard statistics');
      }

      return data as DashboardStatistics;
    },
  });
};
