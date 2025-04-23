import { z } from 'zod';

export const vehicleSchema = z.object({
  registration_number: z
    .string()
    .min(1, 'Registration number is required')
    .max(50, 'Registration number must be at most 50 characters'),
  vin_number: z
    .string()
    .min(1, 'VIN number is required')
    .max(50, 'VIN number must be at most 50 characters'),
  is_new: z.boolean(),
  kms_driven: z.number().min(0, 'Kilometers driven cannot be negative'),
  brand_id: z.string().uuid('Invalid brand ID'),
  model: z
    .string()
    .min(1, 'Model is required')
    .max(50, 'Model must be at most 50 characters'),
  price: z.number().gt(0, 'Price must be greater than 0'),
  first_registration: z.date(),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
