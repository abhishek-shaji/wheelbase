'use client';

import { useMemo } from 'react';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { CustomersSearch } from './customers-search';
import { CustomersDeleteAction } from './customers-delete-action';
import { CustomersDataTable } from './customers-data-table';
import { CustomersPagination } from './customers-pagination';
import { useCustomersData } from './use-customers-data';
import { getColumns, Customer } from './columns';

const CustomersTable = () => {
  const {
    data,
    isLoading,
    setData,
    pagination,
    setPagination,
    localSearchTerm,
    handleSearchChange,
    handleSearchClear,
    deleteRowsMutation,
    total,
    totalPages,
  } = useCustomersData();

  const columns = useMemo(() => getColumns({ data, setData }), [data, setData]);

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);
    deleteRowsMutation.mutate(selectedIds);
    table.resetRowSelection();
  };

  const table = useReactTable<Customer>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    manualPagination: true,
    pageCount: totalPages,
  });

  const selectedRowsCount = table.getSelectedRowModel().rows.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CustomersSearch
            isLoading={isLoading}
            searchTerm={localSearchTerm}
            onSearchChange={handleSearchChange}
            onSearchClear={handleSearchClear}
          />
        </div>
        <div className="flex items-center gap-3">
          {!isLoading && selectedRowsCount > 0 && (
            <CustomersDeleteAction
              selectedRowsCount={selectedRowsCount}
              onDelete={handleDeleteRows}
            />
          )}
        </div>
      </div>
      <CustomersDataTable
        table={table}
        isLoading={isLoading}
        data={data}
        columns={columns}
      />
      {(data.length > 0 || isLoading) && (
        <CustomersPagination
          isLoading={isLoading}
          total={total}
          pageIndex={pagination.pageIndex}
          totalPages={totalPages}
          table={table}
        />
      )}
    </div>
  );
};

export default CustomersTable;
