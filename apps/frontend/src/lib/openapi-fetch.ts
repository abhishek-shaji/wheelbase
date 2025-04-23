import createClient from 'openapi-fetch';
import { paths } from '@/types';

export const client = createClient<paths>({
  baseUrl: `/api`,
  credentials: 'include',
});
