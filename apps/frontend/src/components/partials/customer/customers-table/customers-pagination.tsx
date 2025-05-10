'use client';

import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Table } from '@tanstack/react-table';
import { Customer } from './columns';

interface CustomersPaginationProps {
  isLoading: boolean;
  total: number;
  pageIndex: number;
  totalPages: number;
  table: Table<Customer>;
}

export const CustomersPagination = ({
  isLoading,
  total,
  pageIndex,
  totalPages,
  table,
}: CustomersPaginationProps) => {
  return (
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
                · <span className="text-foreground">{total}</span> customers
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
  );
};
