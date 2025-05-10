'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

interface CustomersTableSkeletonProps {
  pageSize: number;
  columnCount: number;
}

export const CustomersTableSkeleton = ({
  pageSize,
  columnCount,
}: CustomersTableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: pageSize }).map((_, index) => (
        <TableRow
          key={`skeleton-${index}`}
          className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg h-px"
        >
          {/* Checkbox column */}
          <TableCell className="h-[inherit]">
            <Skeleton className="h-4 w-4" />
          </TableCell>

          {/* Name column */}
          <TableCell className="h-[inherit]">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </TableCell>

          {/* Email column */}
          <TableCell className="h-[inherit]">
            <Skeleton className="h-4 w-32" />
          </TableCell>

          {/* Phone column */}
          <TableCell className="h-[inherit]">
            <Skeleton className="h-4 w-24" />
          </TableCell>

          {/* Actions column */}
          <TableCell className="h-[inherit]">
            <div className="flex justify-end">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
