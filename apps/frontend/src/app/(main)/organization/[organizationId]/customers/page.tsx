'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/openapi-fetch';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusIcon, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function CustomersPage() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['customers', organizationId, searchTerm],
    queryFn: async () => {
      const { response, data } = await client.GET(
        '/organizations/{organization_id}/customers',
        {
          params: {
            path: {
              organization_id: organizationId,
            },
            query: searchTerm ? { search: searchTerm } : undefined,
          },
        }
      );

      if (response.status !== 200 || !data) {
        throw new Error('Failed to fetch customers');
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>

        <div className="flex items-center gap-4">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Button variant="outline" onClick={() => refetch()}>
              Search
            </Button>
          </div>

          <Button asChild>
            <Link href={`/organization/${organizationId}/customers/new`}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Customer
            </Link>
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data || data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No customers found. Create your first customer by clicking the
                &quot;Add Customer&quot; button.
              </TableCell>
            </TableRow>
          ) : (
            data.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.first_name}</TableCell>
                <TableCell>{customer.last_name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/organization/${organizationId}/customers/${customer.id}`}
                    >
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
