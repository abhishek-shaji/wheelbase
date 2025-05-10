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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
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
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import {
  RiCloseCircleLine,
  RiDeleteBinLine,
  RiErrorWarningLine,
  RiFilter3Line,
  RiSearch2Line,
} from '@remixicon/react';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { client } from '@/lib/openapi-fetch';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  useQueryState,
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
  parseAsBoolean,
} from 'nuqs';
import { useDebounce } from 'use-debounce';
import {
  getColumns,
  Vehicle,
  Customer,
} from '@/components/partials/vehicle/vehicles-table/columns';

interface PaginatedVehicleResponse {
  items: Vehicle[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const VehiclesTable = () => {
  const id = useId();
  const params = useParams<{ organizationId: string }>();
  const organizationId = params.organizationId;

  const [pageIndex, setPageIndex] = useQueryState(
    'page',
    parseAsInteger.withDefault(0)
  );
  const [pageSize, setPageSize] = useQueryState(
    'size',
    parseAsInteger.withDefault(10)
  );

  const pagination: PaginationState = {
    pageIndex: pageIndex,
    pageSize: pageSize,
  };

  const setPagination = useCallback(
    (
      updater: PaginationState | ((state: PaginationState) => PaginationState)
    ) => {
      const newPagination =
        typeof updater === 'function' ? updater(pagination) : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
    [pagination, setPageIndex, setPageSize]
  );

  const [searchTerm, setSearchTerm] = useQueryState(
    'search',
    parseAsString.withDefault('')
  );
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [debouncedSearchTerm] = useDebounce(localSearchTerm, 500);

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const [isNewFilter, setIsNewFilter] = useQueryState(
    'isNew',
    parseAsArrayOf(parseAsBoolean).withDefault([])
  );

  const [isSoldFilter, setIsSoldFilter] = useQueryState(
    'isSold',
    parseAsArrayOf(parseAsBoolean).withDefault([])
  );

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  const brandsQuery = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { response, data } = await client.GET('/brands/');

      if (response.status !== 200 || !data) {
        throw new Error('Failed to fetch brands');
      }

      const brandMap: Record<string, string> = {};
      data.forEach((brand) => {
        brandMap[brand.id] = brand.name;
      });

      return brandMap;
    },
  });

  const customersQuery = useQuery({
    queryKey: ['customers', organizationId],
    queryFn: async () => {
      const { response, data } = await client.GET(
        '/organizations/{organization_id}/customers/',
        {
          params: {
            path: {
              organization_id: organizationId,
            },
          },
        }
      );

      if (response.status !== 200 || !data) {
        throw new Error('Failed to fetch customers');
      }

      const customerMap: Record<string, string> = {};
      data.forEach((customer: Customer) => {
        customerMap[
          customer.id
        ] = `${customer.first_name} ${customer.last_name}`;
      });

      return customerMap;
    },
  });

  const brands = brandsQuery.data || {};
  const customers = customersQuery.data || {};

  const vehiclesQuery = useQuery({
    queryKey: [
      'vehicles',
      organizationId,
      pageIndex,
      pageSize,
      searchTerm,
      isNewFilter,
      isSoldFilter,
    ],
    refetchOnMount: 'always',
    queryFn: async () => {
      const queryParams: Record<string, string> = {
        page: (pageIndex + 1).toString(),
        size: pageSize.toString(),
      };

      if (searchTerm) {
        queryParams.search = searchTerm;
      }

      if (isNewFilter.length > 0) {
        queryParams['is_new'] = isNewFilter.join(',');
      }

      if (isSoldFilter.length > 0) {
        queryParams['is_sold'] = isSoldFilter.join(',');
      }

      const { response, data } = await client.GET(
        '/organizations/{organization_id}/vehicles/',
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
        throw new Error('Failed to fetch data');
      }

      const paginatedData = data as unknown as PaginatedVehicleResponse;
      setTotal(paginatedData.total);
      setTotalPages(paginatedData.pages);
      return paginatedData.items || [];
    },
  });

  const data = vehiclesQuery.data || [];
  const isLoading = vehiclesQuery.isLoading;
  const queryClient = useQueryClient();

  const setData = useCallback(
    (newData: Vehicle[] | ((prev: Vehicle[]) => Vehicle[])) => {
      queryClient.setQueryData(
        [
          'vehicles',
          organizationId,
          pageIndex,
          pageSize,
          searchTerm,
          isNewFilter,
          isSoldFilter,
        ],
        typeof newData === 'function' ? newData(data) : newData
      );
    },
    [
      queryClient,
      data,
      organizationId,
      pageIndex,
      pageSize,
      searchTerm,
      isNewFilter,
      isSoldFilter,
    ]
  );

  const columns = useMemo(
    () => getColumns({ data, setData, brands, customers }),
    [data, setData, brands, customers]
  );

  const deleteRowsMutation = useMutation({
    mutationFn: async () => {
      const selectedRows = table.getSelectedRowModel().rows;
      return selectedRows.map((row) => row.original.id);
    },
    onSuccess: (deletedIds) => {
      setData((currentData) =>
        currentData.filter((item) => !deletedIds.includes(item.id))
      );
      table.resetRowSelection();
    },
  });

  const handleDeleteRows = () => {
    deleteRowsMutation.mutate();
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination,
    },
  });

  const handleIsNewChange = (checked: boolean, value: boolean) => {
    setIsNewFilter((prev) => {
      if (checked) {
        return prev.includes(value) ? prev : [...prev, value];
      } else {
        return prev.filter((v) => v !== value);
      }
    });
  };

  const handleIsSoldChange = (checked: boolean, value: boolean) => {
    setIsSoldFilter((prev) => {
      if (checked) {
        return prev.includes(value) ? prev : [...prev, value];
      } else {
        return prev.filter((v) => v !== value);
      }
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleSearchClear = () => {
    setLocalSearchTerm('');
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
                Boolean(localSearchTerm) && 'pe-9'
              )}
              value={localSearchTerm}
              onChange={handleSearchChange}
              placeholder="Search by model, registration, or VIN"
              type="text"
              aria-label="Search vehicles"
              disabled={isLoading}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/60 peer-disabled:opacity-50">
              {isLoading ? (
                <Skeleton className="h-5 w-5 rounded-full" />
              ) : (
                <RiSearch2Line size={20} aria-hidden="true" />
              )}
            </div>
            {Boolean(localSearchTerm) && !isLoading && (
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/60 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear search"
                onClick={handleSearchClear}
              >
                <RiCloseCircleLine size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Delete button */}
          {!isLoading && table.getSelectedRowModel().rows.length > 0 && (
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
          <Popover>
            <PopoverTrigger asChild>
              {isLoading ? (
                <Skeleton className="h-9 w-24" />
              ) : (
                <Button variant="outline">
                  <RiFilter3Line
                    className="size-5 -ms-1.5 text-muted-foreground/60"
                    size={20}
                    aria-hidden="true"
                  />
                  Filter
                  {(isNewFilter.length > 0 || isSoldFilter.length > 0) && (
                    <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                      {isNewFilter.length + isSoldFilter.length}
                    </span>
                  )}
                </Button>
              )}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto min-w-36 p-3">
              <div className="space-y-4">
                <div className="text-xs font-medium uppercase text-muted-foreground/60">
                  Vehicle Status
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="filter-new"
                      checked={isNewFilter.includes(true)}
                      onCheckedChange={(checked) =>
                        handleIsNewChange(!!checked, true)
                      }
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="filter-new"
                      className="flex grow justify-between gap-2 font-normal"
                    >
                      New vehicles
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="filter-used"
                      checked={isNewFilter.includes(false)}
                      onCheckedChange={(checked) =>
                        handleIsNewChange(!!checked, false)
                      }
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="filter-used"
                      className="flex grow justify-between gap-2 font-normal"
                    >
                      Used vehicles
                    </label>
                  </div>
                </div>
                <div>
                  <div className="mb-1 font-medium">Sale Status</div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${id}-filter-sold`}
                        checked={isSoldFilter.includes(true)}
                        onCheckedChange={(checked) =>
                          handleIsSoldChange(!!checked, true)
                        }
                      />
                      <label
                        htmlFor={`${id}-filter-sold`}
                        className="cursor-pointer text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Sold
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${id}-filter-unsold`}
                        checked={isSoldFilter.includes(false)}
                        onCheckedChange={(checked) =>
                          handleIsSoldChange(!!checked, false)
                        }
                      />
                      <label
                        htmlFor={`${id}-filter-unsold`}
                        className="cursor-pointer text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Available
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
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
            Array.from({ length: pagination.pageSize }).map((_, index) => (
              <TableRow
                key={`skeleton-${index}`}
                className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg h-px"
              >
                {/* Checkbox column */}
                <TableCell className="h-[inherit]">
                  <Skeleton className="h-4 w-4" />
                </TableCell>

                {/* Brand & Model column */}
                <TableCell className="h-[inherit]">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </TableCell>

                {/* Registration column */}
                <TableCell className="h-[inherit]">
                  <Skeleton className="h-4 w-20" />
                </TableCell>

                {/* Status column */}
                <TableCell className="h-[inherit]">
                  <Skeleton className="h-5 w-12" />
                </TableCell>

                {/* Price column */}
                <TableCell className="h-[inherit]">
                  <Skeleton className="h-4 w-16" />
                </TableCell>

                {/* First Registration column */}
                <TableCell className="h-[inherit]">
                  <Skeleton className="h-4 w-24" />
                </TableCell>

                {/* KMs Driven column */}
                <TableCell className="h-[inherit]">
                  <Skeleton className="h-1 w-14" />
                </TableCell>

                {/* VIN column */}
                <TableCell className="h-[inherit]">
                  <Skeleton className="h-3 w-32" />
                </TableCell>

                {/* Actions column */}
                <TableCell className="h-[inherit]">
                  <div className="flex justify-end">
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const isSold = row.original.sold_to_id !== null;
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(isSold && 'bg-muted/25')}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: `${cell.column.getSize()}px`,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
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
      {(data.length > 0 || isLoading) && (
        <div className="flex items-center justify-between gap-3">
          <div
            className="flex-1 whitespace-nowrap text-sm text-muted-foreground"
            aria-live="polite"
          >
            {isLoading ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              <>
                Page <span className="text-foreground">{pageIndex + 1}</span> of{' '}
                <span className="text-foreground">{totalPages}</span>
                {total > 0 && (
                  <>
                    {' '}
                    · <span className="text-foreground">{total}</span> vehicles
                  </>
                )}
              </>
            )}
          </div>
          <Pagination className="w-auto">
            <PaginationContent className="gap-3">
              <PaginationItem>
                {isLoading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <Button
                    variant="outline"
                    className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Go to previous page"
                  >
                    Previous
                  </Button>
                )}
              </PaginationItem>
              <PaginationItem>
                {isLoading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <Button
                    variant="outline"
                    className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Go to next page"
                  >
                    Next
                  </Button>
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default VehiclesTable;
