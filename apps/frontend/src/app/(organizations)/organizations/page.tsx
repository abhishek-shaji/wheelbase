'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OrganizationList } from '@/components/partials/organization-list';

const OrganizationListPage = () => {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Organizations
          </h1>
          <Button asChild>
            <Link href="/organizations/new">Create</Link>
          </Button>
        </div>
        <OrganizationList />
      </div>
    </div>
  );
};

export default OrganizationListPage;
