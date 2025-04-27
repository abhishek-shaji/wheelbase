import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { RiCarLine, RiMoreLine } from '@remixicon/react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDate, formatPrice } from '@/lib/formatters';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { useState, useTransition } from 'react';
import { useParams } from 'next/navigation';
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
import { SchemaVehicleResponse } from '@/types';

export type Vehicle = SchemaVehicleResponse;

interface GetColumnsProps {
  data: Vehicle[];
  setData: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  brands: Record<string, string>;
}

export const getColumns = ({
  data,
  setData,
  brands,
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
    header: 'Brand & Model',
    accessorKey: 'model',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <RiCarLine className="text-primary" size={16} aria-hidden="true" />
        </div>
        <div>
          <div className="font-medium">{row.getValue('model')}</div>
          <div className="text-xs text-muted-foreground">
            {brands[row.original.brand_id] || 'Unknown'}
          </div>
        </div>
      </div>
    ),
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
    cell: ({ row }) => {
      const kmsDriven = row.getValue('kms_driven') as number;
      // Calculate percentage based on a max of 200,000 km
      const percentage = Math.min(100, (kmsDriven / 200000) * 100);

      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-full w-full items-center">
                <Progress className="h-1 max-w-14" value={percentage} />
              </div>
            </TooltipTrigger>
            <TooltipContent align="start" sideOffset={-8}>
              <p>{kmsDriven.toLocaleString()} km</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    size: 100,
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
  const params = useParams<{ organizationId: string }>();

  // Toggle is_new status mutation
  const toggleIsNewMutation = useMutation({
    mutationFn: async () => {
      // In a real implementation, this would call an API to update the vehicle
      // For now, we're just updating the local state
      return { ...item, is_new: !item.is_new };
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
  });

  const handleIsNewToggle = () => {
    toggleIsNewMutation.mutate();
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
              aria-label="Edit item"
            >
              <RiMoreLine className="size-5" size={20} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={handleIsNewToggle}
              disabled={toggleIsNewMutation.isPending || isUpdatePending}
            >
              {toggleIsNewMutation.isPending
                ? 'Updating...'
                : item.is_new
                ? 'Mark as used'
                : 'Mark as new'}
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
    </>
  );
}
