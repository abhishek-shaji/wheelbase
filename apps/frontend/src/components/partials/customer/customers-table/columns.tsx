import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { RiUserLine, RiMoreLine } from '@remixicon/react';
import React, { useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { client } from '@/lib/openapi-fetch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';

export type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization_id: string;
  active?: boolean;
};

interface GetColumnsProps {
  data: Customer[];
  setData: React.Dispatch<React.SetStateAction<Customer[]>>;
}

export const getColumns = ({
  data,
  setData,
}: GetColumnsProps): ColumnDef<Customer>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
  },
  {
    header: 'Name',
    accessorKey: 'first_name',
    cell: ({ row }) => {
      const organizationId = row.original.organization_id;
      const fullName = `${row.original.first_name} ${row.original.last_name}`;

      return (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <RiUserLine className="text-primary" size={16} aria-hidden="true" />
          </div>
          <div>
            <Link
              href={`/organization/${organizationId}/customers/${row.original.id}`}
              className="font-medium text-primary hover:underline cursor-pointer"
            >
              {fullName}
            </Link>
          </div>
        </div>
      );
    },
    size: 180,
  },
  {
    header: 'Email',
    accessorKey: 'email',
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue('email')}</span>
    ),
    size: 220,
  },
  {
    header: 'Phone',
    accessorKey: 'phone',
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue('phone')}</span>
    ),
    size: 150,
  },
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <RowActions setData={setData} data={data} item={row.original} />
    ),
    size: 60,
  },
];

function RowActions({
  item,
  data,
  setData,
}: {
  setData: React.Dispatch<React.SetStateAction<Customer[]>>;
  data: Customer[];
  item: Customer;
}) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const params = useParams<{ organizationId: string }>();
  const router = useRouter();

  const handleEdit = () => {
    router.push(
      `/organization/${params.organizationId}/customers/${item.id}/edit`
    );
  };

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { response } = await client.DELETE(
        '/organizations/{organization_id}/customers/{customer_id}',
        {
          params: {
            path: {
              organization_id: params.organizationId,
              customer_id: item.id,
            },
          },
        }
      );

      if (response.status !== 204) {
        throw new Error('Failed to delete customer');
      }

      return item.id;
    },
    onSuccess: () => {
      startUpdateTransition(() => {
        const updatedData = data.filter((dataItem) => dataItem.id !== item.id);
        setData(updatedData);
        setShowDeleteDialog(false);
      });
      setShowDeleteDialog(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <RiMoreLine className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
            disabled={isUpdatePending}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the customer {item.first_name}{' '}
              {item.last_name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
