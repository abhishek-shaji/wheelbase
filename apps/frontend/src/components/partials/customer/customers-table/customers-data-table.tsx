'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Table as TableType } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { Customer } from './columns';
import { CustomersTableSkeleton } from './customers-table-skeleton';

interface CustomersDataTableProps {
  table: TableType<Customer>;
  isLoading: boolean;
  data: Customer[];
  columns: any[];
}

export const CustomersDataTable = ({
  table,
  isLoading,
  data,
  columns,
}: CustomersDataTableProps) => {
  return (
    <Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-transparent">
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  style={{ width: header.getSize() }}
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
          <CustomersTableSkeleton
            pageSize={table.getState().pagination.pageSize}
            columnCount={columns.length}
          />
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
  );
};
