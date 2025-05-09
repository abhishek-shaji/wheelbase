import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { RiCarLine, RiMoreLine } from '@remixicon/react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDate, formatPrice } from '@/lib/formatters';
import { useRef, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { SchemaVehicleResponse, SchemaCustomerResponse } from '@/types';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { RiSearch2Line } from '@remixicon/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type Vehicle = SchemaVehicleResponse;
export type Customer = SchemaCustomerResponse;

interface GetColumnsProps {
  data: Vehicle[];
  setData: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  brands: Record<string, string>;
  customers: Record<string, string>;
}

export const getColumns = ({
  data,
  setData,
  brands,
  customers,
}: GetColumnsProps): ColumnDef<Vehicle>[] => [
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
    cell: ({ row }) => {
      row.getIsSelected();
      const isSold = row.original.sold_to_id !== null;
      if (isSold) {
        row.getCanSelect();
      }

      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      );
    },
    size: 28,
  },
  {
    header: 'Brand & Model',
    accessorKey: 'model',
    cell: ({ row }) => {
      const organizationId = row.original.organization_id;

      return (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <RiCarLine className="text-primary" size={16} aria-hidden="true" />
          </div>
          <div>
            <Link
              href={`/organization/${organizationId}/vehicles/${row.original.id}/edit`}
              className="font-medium text-primary hover:underline cursor-pointer"
            >
              {row.getValue('model')}
            </Link>
            <div className="text-xs text-muted-foreground">
              {brands[row.original.brand_id] || 'Unknown'}
            </div>
          </div>
        </div>
      );
    },
    size: 180,
  },
  {
    header: 'Registration',
    accessorKey: 'registration_number',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('registration_number')}</span>
    ),
    size: 130,
  },
  {
    header: 'Status',
    accessorKey: 'is_new',
    cell: ({ row }) => (
      <div className="flex items-center h-full">
        <Badge
          variant="outline"
          className={cn(
            'gap-1 py-0.5 px-2 text-sm',
            row.original.is_new
              ? 'text-primary-foreground'
              : 'text-muted-foreground'
          )}
        >
          {row.original.is_new ? 'New' : 'Used'}
        </Badge>
      </div>
    ),
    size: 90,
  },
  {
    header: 'Sale Status',
    accessorKey: 'sold_to_id',
    cell: ({ row }) => {
      const isSold = row.original.sold_to_id !== null;
      const soldToName =
        isSold && row.original.sold_to_id
          ? customers[row.original.sold_to_id]
          : null;
      const soldAt =
        isSold && row.original.sold_at
          ? formatDate(row.original.sold_at)
          : null;

      return (
        <div className="flex items-center h-full">
          {isSold ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="success"
                    className="gap-1 py-0.5 px-2 text-sm cursor-default"
                  >
                    Sold
                  </Badge>
                </TooltipTrigger>
                <TooltipContent
                  align="start"
                  sideOffset={-8}
                  className="space-y-1"
                >
                  <p className="text-xs">Sold to: {soldToName || 'Unknown'}</p>
                  {soldAt && <p className="text-xs">Date: {soldAt}</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Badge
              variant="outline"
              className="gap-1 py-0.5 px-2 text-sm text-muted-foreground"
            >
              Available
            </Badge>
          )}
        </div>
      );
    },
    size: 110,
  },
  {
    header: 'Price',
    accessorKey: 'price',
    cell: ({ row }) => (
      <span className="font-medium">{formatPrice(row.getValue('price'))}</span>
    ),
    size: 110,
  },
  {
    header: 'First Registration',
    accessorKey: 'first_registration',
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.getValue('first_registration'))}
      </span>
    ),
    size: 140,
  },
  {
    header: 'KMs Driven',
    accessorKey: 'kms_driven',
    size: 100,
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground font-mono">
        {row.getValue('kms_driven')?.toLocaleString()} KMs
      </span>
    ),
  },
  {
    header: 'VIN',
    accessorKey: 'vin_number',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground font-mono">
        {row.getValue('vin_number')}
      </span>
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

interface CustomerSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (customerId: string) => void;
  organizationId: string;
}

function CustomerSelectDialog({
  open,
  onOpenChange,
  onSelect,
  organizationId,
}: CustomerSelectDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers', organizationId, searchTerm],
    queryFn: async () => {
      const queryParams: Record<string, string> = {};

      if (searchTerm) {
        queryParams.search = searchTerm;
      }

      const { response, data } = await client.GET(
        '/organizations/{organization_id}/customers',
        {
          params: {
            path: {
              organization_id: organizationId,
            },
            query: queryParams,
          },
        }
      );

      if (response.status !== 200 || !data) {
        throw new Error('Failed to fetch customers');
      }

      return data as Customer[];
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleConfirm = () => {
    if (selectedCustomerId) {
      onSelect(selectedCustomerId);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Select Customer</AlertDialogTitle>
          <AlertDialogDescription>
            Select a customer who purchased this vehicle.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Input
              ref={inputRef}
              className="w-full ps-9"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search for customer..."
              autoFocus
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/60">
              <RiSearch2Line size={20} aria-hidden="true" />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto rounded-md border border-border">
            {isLoading ? (
              <div className="flex h-20 items-center justify-center">
                <div className="animate-pulse text-muted-foreground">
                  Loading...
                </div>
              </div>
            ) : customers.length > 0 ? (
              <div className="space-y-1 p-1">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => setSelectedCustomerId(customer.id)}
                    className={cn(
                      'flex cursor-pointer items-center rounded-md px-2 py-2',
                      selectedCustomerId === customer.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    )}
                  >
                    <div>
                      <div className="font-medium">
                        {customer.first_name} {customer.last_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {customer.email} · {customer.phone}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-20 items-center justify-center">
                <div className="text-muted-foreground">No customers found</div>
              </div>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!selectedCustomerId}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RowActions({
  setData,
  data,
  item,
}: {
  setData: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  data: Vehicle[];
  item: Vehicle;
}) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const params = useParams<{ organizationId: string }>();
  const router = useRouter();

  // Mark as sold mutation
  const markAsSoldMutation = useMutation({
    mutationFn: async (customerId: string) => {
      const { response, data } = await client.POST(
        '/organizations/{organization_id}/vehicles/{vehicle_id}/mark-as-sold',
        {
          params: {
            path: {
              organization_id: params.organizationId,
              vehicle_id: item.id,
            },
          },
          body: {
            sold_to_id: customerId,
          },
        }
      );

      if (response.status !== 200 || !data) {
        throw new Error('Failed to mark vehicle as sold');
      }

      return data as Vehicle;
    },
    onSuccess: (updatedVehicle) => {
      startUpdateTransition(() => {
        const updatedData = data.map((dataItem) => {
          if (dataItem.id === item.id) {
            return updatedVehicle;
          }
          return dataItem;
        });
        setData(updatedData);
      });
    },
    onError: (error) => {
      console.error('Error marking vehicle as sold:', error);
    },
  });

  // Mark as unsold mutation
  const markAsUnsoldMutation = useMutation({
    mutationFn: async () => {
      const { response, data } = await client.POST(
        '/organizations/{organization_id}/vehicles/{vehicle_id}/mark-as-unsold',
        {
          params: {
            path: {
              organization_id: params.organizationId,
              vehicle_id: item.id,
            },
          },
        }
      );

      if (response.status !== 200 || !data) {
        throw new Error('Failed to mark vehicle as unsold');
      }

      return data as Vehicle;
    },
    onSuccess: (updatedVehicle) => {
      startUpdateTransition(() => {
        const updatedData = data.map((dataItem) => {
          if (dataItem.id === item.id) {
            return updatedVehicle;
          }
          return dataItem;
        });
        setData(updatedData);
      });
    },
    onError: (error) => {
      console.error('Error marking vehicle as unsold:', error);
    },
  });

  const handleCustomerSelect = (customerId: string) => {
    markAsSoldMutation.mutate(customerId);
  };

  const handleMarkAsUnsold = () => {
    markAsUnsoldMutation.mutate();
  };

  const handleEdit = () => {
    router.push(
      `/organization/${params.organizationId}/vehicles/${item.id}/edit`
    );
  };

  // Delete vehicle mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { response } = await client.DELETE(
        '/organizations/{organization_id}/vehicles/{vehicle_id}',
        {
          params: {
            path: {
              organization_id: params.organizationId,
              vehicle_id: item.id,
            },
          },
        }
      );

      if (response.status !== 204) {
        throw new Error('Failed to delete vehicle');
      }
    },
    onSuccess: () => {
      startUpdateTransition(() => {
        const updatedData = data.filter((dataItem) => dataItem.id !== item.id);
        setData(updatedData);
        setShowDeleteDialog(false);
      });
    },
    onError: (error) => {
      console.error('Error deleting vehicle:', error);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="shadow-none text-muted-foreground/60"
              aria-label="Actions"
            >
              <RiMoreLine className="size-5" size={20} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              onClick={
                item.sold_to_id !== null
                  ? handleMarkAsUnsold
                  : () => setShowCustomerDialog(true)
              }
              disabled={
                markAsSoldMutation.isPending ||
                markAsUnsoldMutation.isPending ||
                isUpdatePending
              }
            >
              {markAsSoldMutation.isPending || markAsUnsoldMutation.isPending
                ? 'Updating...'
                : item.sold_to_id !== null
                ? 'Mark as unsold'
                : 'Mark as sold'}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            className="dark:data-[variant=destructive]:focus:bg-destructive/10"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              vehicle.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteMutation.isPending || isUpdatePending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending || isUpdatePending}
              className="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CustomerSelectDialog
        open={showCustomerDialog}
        onOpenChange={setShowCustomerDialog}
        onSelect={handleCustomerSelect}
        organizationId={params.organizationId}
      />
    </>
  );
}
