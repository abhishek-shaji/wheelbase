'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import React, { useEffect } from 'react';

import { Button } from '../../../ui/button';
import { FormField } from '../../../ui/form-field';
import { VehicleFormValues, vehicleSchema } from '@/schemas/vehicle';
import { useQuery, useMutation } from '@tanstack/react-query';
import { client } from '@/lib/openapi-fetch';
import { Loader2 } from 'lucide-react';
import { SchemaVehicleCreate } from '@/types/__generated__/openapi';

const VehicleForm = () => {
  const router = useRouter();
  const params = useParams<{ organizationId: string; vehicleId?: string }>();
  const organizationId = params.organizationId;
  const vehicleId = params.vehicleId;
  const isEditing = !!vehicleId;

  const methods = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registration_number: '',
      vin_number: '',
      is_new: false,
      kms_driven: 0,
      brand_id: '',
      model: '',
      model_year: new Date().getFullYear(),
      fuel_type: 'electric',
      color: '',
      description: '',
      price: 0,
      first_registration: new Date(),
    },
  });

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

  const vehicleQuery = useQuery({
    queryKey: ['vehicle', organizationId, vehicleId],
    queryFn: async () => {
      if (!vehicleId) return null;

      const { response, data } = await client.GET(
        '/organizations/{organization_id}/vehicles/{vehicle_id}',
        {
          params: {
            path: {
              organization_id: organizationId,
              vehicle_id: vehicleId,
            },
          },
        }
      );

      if (response.status !== 200 || !data) {
        throw new Error('Failed to fetch vehicle');
      }

      return data;
    },
    enabled: !!vehicleId,
  });

  useEffect(() => {
    if (vehicleQuery.data && vehicleId && brandOptions.data) {
      const vehicle = vehicleQuery.data;

      // Ensure brand_id is a string
      const formData = {
        ...vehicle,
        brand_id: String(vehicle.brand_id),
        first_registration: new Date(vehicle.first_registration),
      };

      console.log('Setting form data:', formData);
      console.log('Available brand options:', brandOptions.data);

      // Use setTimeout to ensure the form reset happens after the brand options have been fully loaded
      setTimeout(() => {
        methods.reset(formData);
        // Explicitly set the brand_id value
        methods.setValue('brand_id', String(vehicle.brand_id));
      }, 0);
    }
  }, [vehicleQuery.data, vehicleId, methods, brandOptions.data]);

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

  const updateVehicleMutation = useMutation({
    mutationFn: async (formData: VehicleFormValues) => {
      if (!vehicleId) throw new Error('Vehicle ID is missing');

      const first_registration = formData.first_registration
        .toISOString()
        .split('T')[0];

      const vehicleData: SchemaVehicleCreate = {
        ...formData,
        first_registration,
      };

      const { response, data } = await client.PUT(
        `/organizations/{organization_id}/vehicles/{vehicle_id}`,
        {
          body: vehicleData,
          params: {
            path: {
              organization_id: organizationId,
              vehicle_id: vehicleId,
            },
          },
        }
      );

      if (response.status !== 200 || !data) {
        throw new Error('Failed to update vehicle');
      }

      return data;
    },
    onSuccess: () => {
      router.push(`/organization/${organizationId}/vehicles`);
    },
  });

  const isNew = methods.watch('is_new');
  const isPending = isEditing
    ? updateVehicleMutation.isPending
    : createVehicleMutation.isPending;
  const error = isEditing
    ? updateVehicleMutation.error
    : createVehicleMutation.error;

  const onSubmit = (formData: VehicleFormValues) => {
    if (isEditing) {
      updateVehicleMutation.mutate(formData);
    } else {
      createVehicleMutation.mutate(formData);
    }
  };

  if (brandOptions.isLoading || (isEditing && vehicleQuery.isLoading)) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const fuelTypeOptions = [
    { value: 'electric', label: 'Electric' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'petrol', label: 'Petrol' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  return (
    <div className="rounded-lg p-6 shadow-md">
      <div className="flex w-full flex-col space-y-6">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h1>
          <p className="mt-2 text-gray-400">
            {isEditing
              ? 'Update the details of this vehicle.'
              : 'Fill in the details to add a new vehicle to the system.'}
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
            <FormField<VehicleFormValues>
              name="is_new"
              label="New Vehicle"
              type="switch"
              disabled={isPending}
            />
            <FormField<VehicleFormValues>
              name="brand_id"
              label="Brand"
              placeholder="Select a brand"
              type="select"
              options={brandOptions.data || []}
              disabled={isPending}
            />
            <FormField<VehicleFormValues>
              name="model"
              label="Model"
              placeholder="Corolla"
              disabled={isPending}
            />
            <FormField<VehicleFormValues>
              name="description"
              label="Description (Optional)"
              type="textarea"
              placeholder="Add details about the vehicle condition, features, etc."
              disabled={isPending}
            />
            <FormField<VehicleFormValues>
              name="model_year"
              label="Model Year"
              type="number"
              disabled={isPending}
            />
            <FormField<VehicleFormValues>
              name="fuel_type"
              label="Fuel Type"
              type="select"
              options={fuelTypeOptions}
              disabled={isPending}
            />
            <FormField<VehicleFormValues>
              name="registration_number"
              label="Registration Number"
              placeholder="ABC123"
              disabled={isPending}
            />
            <FormField<VehicleFormValues>
              name="vin_number"
              label="VIN Number"
              placeholder="1HGCM82633A123456"
              disabled={isPending}
            />
            <FormField<VehicleFormValues>
              name="kms_driven"
              label="Kilometers Driven"
              type="number"
              placeholder="50000"
              disabled={isNew || isPending}
              defaultValue={isNew ? 0 : undefined}
            />
            <FormField<VehicleFormValues>
              name="color"
              label="Color (Optional)"
              placeholder="Red"
              disabled={isPending}
            />
            <FormField<VehicleFormValues>
              name="price"
              label="Price"
              type="number"
              placeholder="25000.50"
              step="0.01"
              disabled={isPending}
            />
            <FormField<VehicleFormValues>
              name="first_registration"
              label="First Registration Date"
              type="date"
              disabled={isPending}
            />
            <Button type="submit" className="w-full mt-3" disabled={isPending}>
              {isPending
                ? isEditing
                  ? 'Updating vehicle...'
                  : 'Creating vehicle...'
                : isEditing
                ? 'Update vehicle'
                : 'Create vehicle'}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export { VehicleForm };
