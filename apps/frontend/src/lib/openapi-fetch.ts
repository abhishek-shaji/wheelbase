import createClient from 'openapi-fetch';
import { paths } from '@/types';

export const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: 'include',
});
