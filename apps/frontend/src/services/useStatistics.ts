import { useQuery } from '@tanstack/react-query';

export interface VehicleStatistics {
  total_count: number;
  available_count: number;
  avg_sold_price: number | null;
  fuel_type_distribution: Record<string, number>;
  brand_distribution: Record<string, number>;
  sales_by_month: Record<string, number>;
}

export interface CustomerStatistics {
  total_count: number;
  customers_by_month: Record<string, number>;
}

export interface DashboardStatistics {
  vehicles: VehicleStatistics;
  customers: CustomerStatistics;
  total_revenue: number;
  revenue_by_month: Record<string, number>;
}

const API_BASE_URL = 'http://localhost:8000';

export const useDashboardStatistics = (organizationId: string) => {
  return useQuery({
    queryKey: ['statistics', organizationId],
    queryFn: async (): Promise<DashboardStatistics> => {
      const response = await fetch(
        `${API_BASE_URL}/organizations/${organizationId}/statistics/dashboard`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard statistics');
      }

      return response.json();
    },
  });
};
