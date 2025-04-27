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
  model_year: z.number().int().min(1900, 'Model year must be 1900 or later'),
  fuel_type: z.enum(['electric', 'diesel', 'petrol', 'hybrid']),
  color: z
    .string()
    .max(50, 'Color must be at most 50 characters')
    .optional()
    .nullable(),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional()
    .nullable(),
  price: z.number().gt(0, 'Price must be greater than 0'),
  first_registration: z.date(),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
