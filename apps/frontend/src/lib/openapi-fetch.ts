import createClient from 'openapi-fetch';
import { paths } from '@/types';

export const client = createClient<paths>({
  baseUrl: `http://localhost:8000`,
  credentials: 'include',
});
