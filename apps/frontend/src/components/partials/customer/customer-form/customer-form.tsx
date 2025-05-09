'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import React from 'react';

import { Button } from '../../../ui/button';
import { FormField } from '../../../ui/form-field';
import { CustomerFormValues, customerSchema } from '@/schemas/customer';
import { useQuery, useMutation } from '@tanstack/react-query';
import { client } from '@/lib/openapi-fetch';
import { Loader2 } from 'lucide-react';

const CustomerForm = () => {
  const router = useRouter();
  const params = useParams<{ organizationId: string; customerId?: string }>();
  const organizationId = params.organizationId;
  const customerId = params.customerId;
  const isEditing = !!customerId;

  const methods = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
    },
  });

  const customerQuery = useQuery({
    queryKey: ['customer', organizationId, customerId],
    queryFn: async () => {
      if (!customerId) return null;

      const { response, data } = await client.GET(
        '/organizations/{organization_id}/customers/{customer_id}',
        {
          params: {
            path: {
              organization_id: organizationId,
              customer_id: customerId,
            },
          },
        }
      );

      if (response.status !== 200 || !data) {
        throw new Error('Failed to fetch customer');
      }

      return data;
    },
    enabled: !!customerId,
  });

  React.useEffect(() => {
    if (customerQuery.data && customerId) {
      methods.reset(customerQuery.data);
    }
  }, [customerQuery.data, customerId, methods]);

  const createCustomerMutation = useMutation({
    mutationFn: async (formData: CustomerFormValues) => {
      const { response, data } = await client.POST(
        '/organizations/{organization_id}/customers',
        {
          body: formData,
          params: {
            path: {
              organization_id: organizationId,
            },
          },
        }
      );

      if (response.status !== 201 || !data) {
        throw new Error('Failed to create customer');
      }

      return data;
    },
    onSuccess: () => {
      router.push(`/organization/${organizationId}/customers`);
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: async (formData: CustomerFormValues) => {
      if (!customerId) throw new Error('Customer ID is missing');

      const { response, data } = await client.PUT(
        '/organizations/{organization_id}/customers/{customer_id}',
        {
          body: formData,
          params: {
            path: {
              organization_id: organizationId,
              customer_id: customerId,
            },
          },
        }
      );

      if (response.status !== 200 || !data) {
        throw new Error('Failed to update customer');
      }

      return data;
    },
    onSuccess: () => {
      router.push(`/organization/${organizationId}/customers`);
    },
  });

  const isPending = isEditing
    ? updateCustomerMutation.isPending
    : createCustomerMutation.isPending;
  const error = isEditing
    ? updateCustomerMutation.error
    : createCustomerMutation.error;

  const onSubmit = (formData: CustomerFormValues) => {
    if (isEditing) {
      updateCustomerMutation.mutate(formData);
    } else {
      createCustomerMutation.mutate(formData);
    }
  };

  if (isEditing && customerQuery.isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="rounded-lg p-6 shadow-md">
      <div className="flex w-full flex-col space-y-6">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Customer' : 'Add New Customer'}
          </h1>
          <p className="mt-2 text-gray-400">
            {isEditing
              ? 'Update the details of this customer.'
              : 'Fill in the details to add a new customer to the system.'}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-900/30 border border-red-700 p-4 text-sm text-red-400">
            {error instanceof Error
              ? error.message
              : 'An unknown error occurred'}
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <FormField<CustomerFormValues>
              name="first_name"
              label="First Name"
              placeholder="John"
              disabled={isPending}
            />
            <FormField<CustomerFormValues>
              name="last_name"
              label="Last Name"
              placeholder="Doe"
              disabled={isPending}
            />
            <FormField<CustomerFormValues>
              name="email"
              label="Email"
              type="email"
              placeholder="john.doe@example.com"
              disabled={isPending}
            />
            <FormField<CustomerFormValues>
              name="phone"
              label="Phone Number"
              placeholder="+1234567890"
              disabled={isPending}
            />
            <Button type="submit" className="w-full mt-3" disabled={isPending}>
              {isPending
                ? isEditing
                  ? 'Updating customer...'
                  : 'Creating customer...'
                : isEditing
                ? 'Update customer'
                : 'Create customer'}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export { CustomerForm };
