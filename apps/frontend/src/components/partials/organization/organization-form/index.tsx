'use client';
import { FormField } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/openapi-fetch';
import { zodResolver } from '@hookform/resolvers/zod';
import { organizationSchema } from '@/components/partials/organization/organization-form/schema';
import { SchemaOrganizationCreate } from '@/types';
import { useRouter } from 'next/navigation';

const OrganizationForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const methods = useForm<SchemaOrganizationCreate>({
    resolver: zodResolver(organizationSchema),
    defaultValues: { name: '', email: '' },
  });
  const mutation = useMutation({
    mutationFn: async (data: SchemaOrganizationCreate) => {
      const { response } = await client.POST('/organizations/', { body: data });
      if (response.status !== 201) {
        throw new Error('Failed to create organization');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      router.push('/organizations');
    },
  });

  const onSubmit = (values: SchemaOrganizationCreate) => {
    mutation.mutate(values);
  };

  return (
    <>
      {mutation.error && (
        <div className="rounded-md bg-red-900/30 border border-red-700 p-4 text-sm text-red-400 mt-4">
          {mutation.error instanceof Error
            ? mutation.error.message
            : 'An unknown error occurred'}
        </div>
      )}
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="mt-4 space-y-6"
        >
          <FormField<SchemaOrganizationCreate>
            name="name"
            label="Name"
            placeholder="Organization name"
            disabled={mutation.isPending}
          />
          <FormField<SchemaOrganizationCreate>
            name="email"
            label="Email"
            type="email"
            placeholder="Email address"
            disabled={mutation.isPending}
          />
          <Button
            type="submit"
            className="w-full mt-2"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Create'
            )}
          </Button>
        </form>
      </FormProvider>
    </>
  );
};

export { OrganizationForm };
