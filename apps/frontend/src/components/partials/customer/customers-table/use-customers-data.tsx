'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { Customer } from './columns';
import { client } from '@/lib/openapi-fetch';
import { PaginationState } from '@tanstack/react-table';

export const useCustomersData = () => {
  const params = useParams<{ organizationId: string }>();
  const organizationId = params.organizationId;

  const [pageIndex, setPageIndex] = useQueryState(
    'page',
    parseAsInteger.withDefault(0)
  );
  const [pageSize, setPageSize] = useQueryState(
    'size',
    parseAsInteger.withDefault(10)
  );

  const pagination: PaginationState = {
    pageIndex: pageIndex,
    pageSize: pageSize,
  };

  const setPagination = useCallback(
    (
      updater: PaginationState | ((state: PaginationState) => PaginationState)
    ) => {
      const newPagination =
        typeof updater === 'function' ? updater(pagination) : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
    [pagination, setPageIndex, setPageSize]
  );

  const [searchTerm, setSearchTerm] = useQueryState(
    'search',
    parseAsString.withDefault('')
  );
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [debouncedSearchTerm] = useDebounce(localSearchTerm, 500);

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const customersQuery = useQuery({
    queryKey: ['customers', organizationId, pageIndex, pageSize, searchTerm],
    refetchOnMount: 'always',
    queryFn: async () => {
      const queryParams: Record<string, string> = {
        page: String(pageIndex + 1),
        size: String(pageSize),
      };

      if (searchTerm) {
        queryParams.search = searchTerm;
      }

      const { response, data } = await client.GET(
        '/organizations/{organization_id}/customers/',
        {
          params: {
            path: {
              organization_id: organizationId,
            },
            query: queryParams,
          },
        }
      );

      if (response.status !== 200 || !data) {
        throw new Error('Failed to fetch data');
      }

      // Simulate paginated response if the backend doesn't support it yet
      const paginatedData = {
        items: data,
        total: data.length,
        page: pageIndex + 1,
        size: pageSize,
        pages: Math.ceil(data.length / pageSize) || 1,
      };

      setTotal(paginatedData.total);
      setTotalPages(paginatedData.pages);

      return paginatedData.items || [];
    },
  });

  const data = customersQuery.data || [];
  const isLoading = customersQuery.isLoading;
  const queryClient = useQueryClient();

  const setData = useCallback(
    (newData: Customer[] | ((prev: Customer[]) => Customer[])) => {
      queryClient.setQueryData(
        ['customers', organizationId, pageIndex, pageSize, searchTerm],
        typeof newData === 'function' ? newData(data) : newData
      );
    },
    [queryClient, data, organizationId, pageIndex, pageSize, searchTerm]
  );

  const deleteRowsMutation = useMutation({
    mutationFn: async (rowIds: string[]) => {
      return rowIds;
    },
    onSuccess: (deletedIds) => {
      setData((currentData) =>
        currentData.filter((item) => !deletedIds.includes(item.id))
      );
    },
  });

  return {
    data,
    isLoading,
    setData,
    pagination,
    setPagination,
    localSearchTerm,
    setLocalSearchTerm,
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearchTerm(e.target.value);
    },
    handleSearchClear: () => {
      setLocalSearchTerm('');
      setSearchTerm('');
    },
    deleteRowsMutation,
    total,
    totalPages,
    searchTerm,
  };
};
