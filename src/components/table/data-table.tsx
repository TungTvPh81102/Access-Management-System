'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { DataTableToolbar } from './data-table-toolbar';
import { DataTablePagination } from './data-table-pagination';
import { DataTableBulkActions } from './data-table-bulk-actions';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalRows: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (sort: { field: string; direction: 'asc' | 'desc' } | undefined) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (values: string[]) => void;
  departmentFilter: string[];
  onDepartmentFilterChange: (values: string[]) => void;
  onRefresh: () => void;
  onExport?: () => void;
  onCreateNew: () => void;
  onRowClick?: (row: TData) => void;
  registrationType: string;
  tableId: string;
  emptyMessage?: string;
  emptyActionLabel?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalRows,
  pageSize,
  currentPage,
  totalPages,
  isLoading,
  isError,
  error,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  departmentFilter,
  onDepartmentFilterChange,
  onRefresh,
  onExport,
  onCreateNew,
  onRowClick,
  registrationType,
  tableId,
  emptyMessage = 'No data available',
  emptyActionLabel = 'Create New',
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  // Load column visibility from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem(`table-visibility-${tableId}`);
    if (saved) {
      try {
        setColumnVisibility(JSON.parse(saved));
      } catch (e) {}
    }
  }, [tableId]);

  // Save column visibility to localStorage when it changes
  React.useEffect(() => {
    localStorage.setItem(`table-visibility-${tableId}`, JSON.stringify(columnVisibility));
  }, [columnVisibility, tableId]);

  // Sync internal sorting state with external
  React.useEffect(() => {
    if (sorting.length > 0) {
      onSortChange({
        field: sorting[0].id,
        direction: sorting[0].desc ? 'desc' : 'asc',
      });
    } else {
      onSortChange(undefined);
    }
  }, [sorting, onSortChange]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: totalPages,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={onDepartmentFilterChange}
        onRefresh={onRefresh}
        onExport={onExport || (() => {})}
        isLoading={isLoading}
        registrationType={registrationType}
        onCreateNew={onCreateNew}
      />
      
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
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
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileWarning className="h-8 w-8 text-destructive" />
                    <p className="text-destructive font-medium">Failed to load data</p>
                    <p className="text-sm text-muted-foreground">{error?.message}</p>
                    <Button variant="outline" size="sm" onClick={onRefresh}>Try again</Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-48 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="rounded-full bg-muted p-3">
                      <FileWarning className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{emptyMessage}</p>
                    {onCreateNew && (
                      <Button onClick={onCreateNew} variant="outline" size="sm">
                        {emptyActionLabel}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination 
        table={table}
        totalRows={totalRows}
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />

      <DataTableBulkActions
        selectedCount={selectedCount}
        onApprove={() => {}}
        onReject={() => {}}
        onExport={() => {}}
        onClearSelection={() => setRowSelection({})}
      />
    </div>
  );
}
