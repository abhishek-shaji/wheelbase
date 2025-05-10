import React from 'react';
import { OrganizationForm } from '@/components/partials/organization/organization-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Organization | WheelBase',
};

const CreateOrganizationPage = () => {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Create Organization
        </h2>
        <OrganizationForm />
      </div>
    </div>
  );
};

export default CreateOrganizationPage;
