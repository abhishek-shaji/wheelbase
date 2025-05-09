import { z } from 'zod';

export const customerSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be at most 50 characters'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be at most 50 characters'),
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required')
    .max(100, 'Email must be at most 100 characters'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .max(20, 'Phone number must be at most 20 characters'),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
