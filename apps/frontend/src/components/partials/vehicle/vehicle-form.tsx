'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import React from 'react';

import { Button } from '../../ui/button';
import { FormField } from '../../ui/form-field';
import { VehicleFormValues, vehicleSchema } from '@/schemas/vehicle';
import { useQuery, useMutation } from '@tanstack/react-query';
import { client } from '@/lib/openapi-fetch';
import { Loader2 } from 'lucide-react';
import { SchemaVehicleCreate } from '@/types/__generated__/openapi';

const VehicleForm = () => {
  const router = useRouter();
  const params = useParams<{ organizationId: string }>();
  const organizationId = params.organizationId;

  const brandOptions = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { response, data } = await client.GET('/brands/');

      if (response.status !== 200 || !data) {
        throw new Error('Failed to fetch brands');
      }

      return data.map((brand) => ({ value: brand.id, label: brand.name }));
    },
  });

  const createVehicleMutation = useMutation({
    mutationFn: async (formData: VehicleFormValues) => {
      const first_registration = formData.first_registration
        .toISOString()
        .split('T')[0];

      const vehicleData: SchemaVehicleCreate = {
        ...formData,
        first_registration,
      };

      const { response, data } = await client.POST(
        `/organizations/{organization_id}/vehicles/`,
        {
          body: vehicleData,
          params: {
            path: {
              organization_id: organizationId,
            },
          },
        }
      );

      if (response.status !== 201 || !data) {
        throw new Error('Failed to create vehicle');
      }

      return data;
    },
    onSuccess: () => {
      router.push(`/organization/${organizationId}/vehicles`);
    },
  });

  const methods = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registration_number: '',
      vin_number: '',
      is_new: false,
      kms_driven: 0,
      brand_id: '',
      model: '',
      price: 0,
      first_registration: new Date(),
    },
  });

  const isNew = methods.watch('is_new');

  const onSubmit = (formData: VehicleFormValues) => {
    createVehicleMutation.mutate(formData);
  };

  if (brandOptions.isLoading) {
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
          <h1 className="text-2xl font-bold text-white">Add New Vehicle</h1>
          <p className="mt-2 text-gray-400">
            Fill in the details to add a new vehicle to the system.
          </p>
        </div>

        {createVehicleMutation.error && (
          <div className="rounded-md bg-red-900/30 border border-red-700 p-4 text-sm text-red-400">
            {createVehicleMutation.error instanceof Error
              ? createVehicleMutation.error.message
              : 'An unknown error occurred'}
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <FormField<VehicleFormValues>
              name="is_new"
              label="New Vehicle"
              type="switch"
              disabled={createVehicleMutation.isPending}
            />
            <FormField<VehicleFormValues>
              name="brand_id"
              label="Brand"
              placeholder="Select a brand"
              type="select"
              options={brandOptions.data}
              disabled={createVehicleMutation.isPending}
            />
            <FormField<VehicleFormValues>
              name="model"
              label="Model"
              placeholder="Corolla"
              disabled={createVehicleMutation.isPending}
            />
            <FormField<VehicleFormValues>
              name="registration_number"
              label="Registration Number"
              placeholder="ABC123"
              disabled={createVehicleMutation.isPending}
            />
            <FormField<VehicleFormValues>
              name="vin_number"
              label="VIN Number"
              placeholder="1HGCM82633A123456"
              disabled={createVehicleMutation.isPending}
            />
            <FormField<VehicleFormValues>
              name="kms_driven"
              label="Kilometers Driven"
              type="number"
              placeholder="50000"
              disabled={isNew || createVehicleMutation.isPending}
              defaultValue={isNew ? 0 : undefined}
            />
            <FormField<VehicleFormValues>
              name="price"
              label="Price"
              type="number"
              placeholder="25000.50"
              step="0.01"
              disabled={createVehicleMutation.isPending}
            />
            <FormField<VehicleFormValues>
              name="first_registration"
              label="First Registration Date"
              type="date"
              disabled={createVehicleMutation.isPending}
            />
            <Button
              type="submit"
              className="w-full mt-3"
              disabled={createVehicleMutation.isPending}
            >
              {createVehicleMutation.isPending
                ? 'Creating vehicle...'
                : 'Create vehicle'}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export { VehicleForm };
