'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '../../ui/button';
import { FormField } from '../../ui/form-field';
import { VehicleFormValues, vehicleSchema } from '@/schemas/vehicle';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/openapi-fetch';
import { Loader2 } from 'lucide-react';
import { SchemaVehicleCreate } from '@/types/__generated__/openapi';

const VehicleForm = () => {
  const router = useRouter();
  const params = useParams<{ organizationId: string }>();
  const organizationId = params.organizationId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registration_number: '',
      vin_number: '',
      is_new: false,
      kms_driven: 0,
      brand_id: '',
      organization_id: organizationId,
      model: '',
      price: 0,
      first_registration: new Date(),
    },
  });

  const isNew = watch('is_new');

  const onSubmit = async (formData: VehicleFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert date to ISO date string (yyyy-MM-dd) for API
      const first_registration = formData.first_registration
        .toISOString()
        .split('T')[0];

      // Create the vehicle data payload
      const vehicleData: SchemaVehicleCreate = {
        ...formData,
        first_registration,
      };

      // Make the API call using OpenAPI client
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

      router.push(`/organization/${organizationId}/vehicles`);
    } catch (err) {
      console.error('Error creating vehicle:', err);
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
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

        {error && (
          <div className="rounded-md bg-red-900/30 border border-red-700 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('organization_id')} />
          <FormField
            name="is_new"
            label="New Vehicle"
            type="switch"
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
          <FormField
            name="registration_number"
            label="Registration Number"
            placeholder="ABC123"
            register={register}
            errors={errors}
          />
          <FormField
            name="vin_number"
            label="VIN Number"
            placeholder="1HGCM82633A123456"
            register={register}
            errors={errors}
          />
          <FormField
            name="kms_driven"
            label="Kilometers Driven"
            type="number"
            placeholder="50000"
            register={register}
            errors={errors}
            disabled={isNew}
            defaultValue={isNew ? 0 : undefined}
          />
          <FormField
            name="brand_id"
            label="Brand"
            placeholder="Select a brand"
            register={register}
            errors={errors}
            type="select"
            options={brandOptions.data}
            watch={watch}
            setValue={setValue}
          />
          <FormField
            name="model"
            label="Model"
            placeholder="Corolla"
            register={register}
            errors={errors}
          />
          <FormField
            name="price"
            label="Price"
            type="number"
            placeholder="25000.50"
            step="0.01"
            register={register}
            errors={errors}
          />
          <FormField
            name="first_registration"
            label="First Registration Date"
            type="date"
            watch={watch}
            setValue={setValue}
            register={register}
            errors={errors}
          />
          <Button type="submit" className="w-full mt-3" disabled={isSubmitting}>
            {isSubmitting ? 'Creating vehicle...' : 'Create vehicle'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export { VehicleForm };
