import createClient from 'openapi-fetch';
import { paths } from '@/types';

export const client = createClient<paths>({
  baseUrl: process.env.API_BASE_URL,
  credentials: 'include',
});
