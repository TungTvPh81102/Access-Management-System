'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { DataTable } from '@/components/table/data-table';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { StatusBadge } from '@/components/workflow/status-badge';
import { useRegistrations } from '@/features/registrations/api';
import type { Registration } from '@/types';

export function VisitorList() {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [departmentFilter, setDepartmentFilter] = React.useState<string[]>([]);
  const [sort, setSort] = React.useState<{ field: string; direction: 'asc' | 'desc' } | undefined>();

  const { data, isLoading, isError, error, refetch } = useRegistrations('visitor', {
    page,
    pageSize,
    search,
    filters: [
      { field: 'status', value: statusFilter },
      { field: 'applicantDepartment', value: departmentFilter },
    ],
    sort,
  });

  const columns: ColumnDef<Registration>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: 'visitorName',
      accessorFn: (row) => row.data.visitorName,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Visitor Name" />,
      enableSorting: true,
    },
    {
      id: 'visitorCompany',
      accessorFn: (row) => row.data.visitorCompany,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Company" />,
      enableSorting: true,
    },
    {
      id: 'visitDate',
      accessorFn: (row) => row.data.visitDate,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Visit Date" />,
      cell: ({ row }) => {
        const val = row.getValue('visitDate') as string;
        return val ? format(new Date(val), 'MMM d, yyyy') : '-';
      },
      enableSorting: true,
    },
    {
      accessorKey: 'hostName',
      accessorFn: (row) => row.data.hostName,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Host" />,
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
      enableSorting: true,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
      cell: ({ row }) => format(new Date(row.getValue('createdAt')), 'MMM d, yyyy'),
      enableSorting: true,
    },
  ];

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visitor Management</h1>
        <p className="text-muted-foreground">Manage and track visitor access requests.</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        totalRows={data?.total || 0}
        pageSize={pageSize}
        currentPage={page}
        totalPages={data?.totalPages || 0}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSortChange={setSort}
        searchValue={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={setDepartmentFilter}
        onRefresh={refetch}
        onCreateNew={() => router.push('/registrations/visitor/create')}
        onRowClick={(row) => router.push(`/registrations/visitor/${row.id}`)}
        registrationType="visitor"
        tableId="visitor-table"
        emptyMessage="No visitor requests found"
      />
    </div>
  );
}
