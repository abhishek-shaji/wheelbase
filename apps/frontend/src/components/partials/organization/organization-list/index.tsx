'use client';

import { ArrowRightIcon, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';

import { client } from '@/lib/openapi-fetch';

export const OrganizationList = () => {
  const {
    isLoading,
    data: organizations = [],
    refetch,
  } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { response, data } = await client.GET('/organizations/');

      if (response.status !== 200 || !data) {
        throw new Error('Failed to fetch organizations');
      }

      return data;
    },
    enabled: true,
  });

  const deleteOrganization = useMutation({
    mutationFn: async (id: string) => {
      const { response, data } = await client.DELETE(
        '/organizations/{organization_id}',
        {
          params: { path: { organization_id: id } },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to delete organization');
      }

      return data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = (id: string) => {
    if (
      confirm(
        'Are you sure you want to delete this organization? This action cannot be undone.'
      )
    ) {
      deleteOrganization.mutate(id);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-y-3 gap-x-4 animate-fade-in mt-5">
      {isLoading ? (
        <div className="h-screen w-full flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : organizations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            No organizations found.
          </p>
        </div>
      ) : (
        organizations.map(({ id, name, email }) => (
          <div
            className="relative flex items-center rounded-md border border-gray-200 px-4 py-3 shadow-xs dark:border-gray-800"
            key={id}
          >
            <div className="ml-6 flex justify-between items-center w-full">
              <div>
                <p className="flex items-center justify-between gap-2">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                    {name}
                  </span>
                </p>
                <p className="flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {email}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full text-blue-500 hover:bg-blue-500 hover:text-white hover:translate-y-[-2px] hover:shadow-lg transition mr-2 hover:border-blue-500"
                  asChild
                >
                  <Link href={`/organization/${id}`}>
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full text-red-500 hover:bg-red-500 hover:text-white hover:translate-y-[-2px] hover:shadow-lg transition hover:border-red-500"
                  onClick={() => handleDelete(id)}
                  disabled={deleteOrganization.isPending}
                >
                  {deleteOrganization.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
