'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/openapi-fetch';
import { ArrowRightIcon, Loader2 } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

const OrganizationListPage = () => {
  const { isLoading, data = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { response, data } = await client.GET('/organizations/');

      if (response.status !== 200 || !data) {
        throw new Error('Failed to fetch brands');
      }

      return data;
    },
  });

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="grid grid-cols-1 gap-y-3 gap-x-4 animate-fade-in mt-5">
          {isLoading ? (
            <div className="h-screen w-full flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            data.map(({ id, name, email }) => (
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
                  <div>
                    <Link
                      className="block rounded-full text-blue-500 p-2 hover:bg-blue-500 hover:text-white hover:translate-y-[-2px] hover:shadow-lg transition mr-2 border border-gray-200 dark:border-gray-700/60 hover:border-blue-500"
                      href={`/organization/${id}`}
                    >
                      <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationListPage;
