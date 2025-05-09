'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/openapi-fetch';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';

const organizationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

const OrganizationForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const methods = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: { name: '', email: '' },
  });

  const mutation = useMutation({
    mutationFn: async (data: OrganizationFormValues) => {
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

  const onSubmit = (values: OrganizationFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Create Organization
        </h2>
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
            <FormField<OrganizationFormValues>
              name="name"
              label="Name"
              placeholder="Organization name"
              disabled={mutation.isPending}
            />
            <FormField<OrganizationFormValues>
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
      </div>
    </div>
  );
};

export default OrganizationForm;
