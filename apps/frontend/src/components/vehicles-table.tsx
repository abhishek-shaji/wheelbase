'use client';

import { cn } from '@/lib/utils';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiErrorWarningLine,
  RiCloseCircleLine,
  RiDeleteBinLine,
  RiBardLine,
  RiFilter3Line,
  RiSearch2Line,
  RiCheckLine,
  RiMoreLine,
  RiCarLine,
} from '@remixicon/react';
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
  useCallback,
} from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { client } from '@/lib/openapi-fetch';
import { SchemaVehicleResponse } from '@/types/__generated__/openapi';
import { formatPrice, formatDate } from '@/lib/formatters';
import { useParams } from 'next/navigation';

type Vehicle = SchemaVehicleResponse;

interface PaginatedVehicleResponse {
  items: Vehicle[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const isNewFilterFn: FilterFn<Vehicle> = (
  row,
  columnId,
  filterValue: boolean[]
) => {
  if (!filterValue?.length) return true;
  const isNew = row.getValue(columnId) as boolean;
  return filterValue.includes(isNew);
};

interface GetColumnsProps {
  data: Vehicle[];
  setData: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  brands: Record<string, string>;
}

const getColumns = ({
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
    enableSorting: false,
    enableHiding: false,
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
    enableHiding: false,
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
    filterFn: isNewFilterFn,
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
    enableHiding: false,
  },
];

export default function VehiclesTable() {
  const id = useId();
  const params = useParams<{ organizationId: string }>();
  const organizationId = params.organizationId;
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewFilter, setIsNewFilter] = useState<boolean[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'model',
      desc: false,
    },
  ]);

  const [data, setData] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const columns = useMemo(
    () => getColumns({ data, setData, brands }),
    [data, brands]
  );

  const fetchVehicles = useCallback(async () => {
    try {
      setIsLoading(true);

      const queryParams: Record<string, string> = {
        page: String(pagination.pageIndex + 1), // Convert to 1-based index
        size: String(pagination.pageSize),
      };

      if (searchTerm) {
        queryParams.search = searchTerm;
      }

      if (isNewFilter.length === 1) {
        queryParams.is_new = String(isNewFilter[0]);
      }

      const { response, data } = await client.GET(
        '/organizations/{organization_id}/vehicles/',
        {
          params: {
            path: {
              organization_id: organizationId,
            },
            // @ts-expect-error: Type definition issue with query parameters
            query: queryParams,
          },
        }
      );

      if (response.status !== 200 || !data) {
        throw new Error('Failed to fetch data');
      }

      // Cast the response to our paginated type
      const paginatedData = data as unknown as PaginatedVehicleResponse;
      setData(paginatedData.items || []);
      setTotal(paginatedData.total);
      setTotalPages(paginatedData.pages);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [organizationId, pagination, searchTerm, isNewFilter]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const { response, data } = await client.GET('/brands/');

        if (response.status !== 200 || !data) {
          throw new Error('Failed to fetch brands');
        }

        const brandMap: Record<string, string> = {};
        data.forEach((brand) => {
          brandMap[brand.id] = brand.name;
        });

        setBrands(brandMap);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    }

    fetchBrands();
  }, []);

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const updatedData = data.filter(
      (item) => !selectedRows.some((row) => row.original.id === item.id)
    );
    setData(updatedData);
    table.resetRowSelection();
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        setPagination(updater(pagination));
      } else {
        setPagination(updater);
      }
    },
    manualPagination: true, // Tell table we're handling pagination ourselves
    pageCount: totalPages,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  const isNewColumn = table.getColumn('is_new');
  const isNewFacetedValues = isNewColumn?.getFacetedUniqueValues();
  const isNewFilterValue = isNewColumn?.getFilterValue();

  const handleIsNewChange = (checked: boolean, value: boolean) => {
    setIsNewFilter((prev) => {
      if (checked) {
        return prev.includes(value) ? prev : [...prev, value];
      } else {
        return prev.filter((v) => v !== value);
      }
    });
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search input clear
  const handleSearchClear = () => {
    setSearchTerm('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Search input */}
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                'peer min-w-60 ps-9 bg-background bg-gradient-to-br from-accent/60 to-accent',
                Boolean(searchTerm) && 'pe-9'
              )}
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by model, registration, or VIN"
              type="text"
              aria-label="Search vehicles"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/60 peer-disabled:opacity-50">
              <RiSearch2Line size={20} aria-hidden="true" />
            </div>
            {Boolean(searchTerm) && (
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/60 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear search"
                onClick={handleSearchClear}
              >
                <RiCloseCircleLine size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Filter dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-muted-foreground"
              >
                <RiFilter3Line size={16} />
                Filters
                {isNewFilter.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 rounded-full px-1.5"
                  >
                    {isNewFilter.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-56 p-4" sideOffset={-8}>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Vehicle Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox
                        id="filter-new"
                        checked={isNewFilter.includes(true)}
                        onCheckedChange={(checked) =>
                          handleIsNewChange(!!checked, true)
                        }
                      />
                      <label
                        htmlFor="filter-new"
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        New vehicles
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="filter-used"
                        checked={isNewFilter.includes(false)}
                        onCheckedChange={(checked) =>
                          handleIsNewChange(!!checked, false)
                        }
                      />
                      <label
                        htmlFor="filter-used"
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Used vehicles
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Delete button */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto" variant="outline">
                  <RiDeleteBinLine
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Delete
                  <span className="-me-1 ms-1 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                    aria-hidden="true"
                  >
                    <RiErrorWarningLine className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{' '}
                      {table.getSelectedRowModel().rows.length} selected{' '}
                      {table.getSelectedRowModel().rows.length === 1
                        ? 'vehicle'
                        : 'vehicles'}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Table */}
      <Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                    className="relative h-9 select-none bg-sidebar border-y border-border first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg"
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className={cn(
                          header.column.getCanSort() &&
                            'flex h-full cursor-pointer select-none items-center gap-2'
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          if (
                            header.column.getCanSort() &&
                            (e.key === 'Enter' || e.key === ' ')
                          ) {
                            e.preventDefault();
                            header.column.getToggleSortingHandler()?.(e);
                          }
                        }}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: (
                            <RiArrowUpSLine
                              className="shrink-0 opacity-60"
                              size={16}
                              aria-hidden="true"
                            />
                          ),
                          desc: (
                            <RiArrowDownSLine
                              className="shrink-0 opacity-60"
                              size={16}
                              aria-hidden="true"
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <tbody aria-hidden="true" className="table-row h-1"></tbody>
        <TableBody>
          {isLoading ? (
            <TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="border-0 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg h-px hover:bg-accent/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="last:py-0 h-[inherit]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <tbody aria-hidden="true" className="table-row h-1"></tbody>
      </Table>

      {/* Pagination */}
      {data.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <p
            className="flex-1 whitespace-nowrap text-sm text-muted-foreground"
            aria-live="polite"
          >
            Page{' '}
            <span className="text-foreground">{pagination.pageIndex + 1}</span>{' '}
            of <span className="text-foreground">{totalPages}</span>
            {total > 0 && (
              <>
                {' '}
                · <span className="text-foreground">{total}</span> vehicles
              </>
            )}
          </p>
          <Pagination className="w-auto">
            <PaginationContent className="gap-3">
              <PaginationItem>
                <Button
                  variant="outline"
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  Previous
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
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
  const params = useParams<{ organizationId: string }>();

  const handleIsNewToggle = () => {
    startUpdateTransition(() => {
      const updatedData = data.map((dataItem) => {
        if (dataItem.id === item.id) {
          return {
            ...dataItem,
            is_new: !item.is_new,
          };
        }
        return dataItem;
      });
      setData(updatedData);
    });
  };

  const handleDelete = async () => {
    try {
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

      if (response.status === 204) {
        startUpdateTransition(() => {
          const updatedData = data.filter(
            (dataItem) => dataItem.id !== item.id
          );
          setData(updatedData);
          setShowDeleteDialog(false);
        });
      } else {
        console.error('Failed to delete vehicle');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
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
              disabled={isUpdatePending}
            >
              {item.is_new ? 'Mark as used' : 'Mark as new'}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            className="dark:data-[variant=destructive]:focus:bg-destructive/10"
          >
            Delete
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
            <AlertDialogCancel disabled={isUpdatePending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isUpdatePending}
              className="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
