'use client';
import { Table } from '@tanstack/react-table';
import { X, Search, Settings2, RefreshCw, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { useI18n } from '@/hooks/use-i18n';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (values: string[]) => void;
  departmentFilter: string[];
  onDepartmentFilterChange: (values: string[]) => void;
  onRefresh: () => void;
  onExport: () => void;
  isLoading: boolean;
  registrationType: string;
  onCreateNew: () => void;
}

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Expired', value: 'expired' },
];

export function DataTableToolbar<TData>({
  table,
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  departmentFilter,
  onDepartmentFilterChange,
  onRefresh,
  onExport,
  isLoading,
  registrationType,
  onCreateNew,
}: DataTableToolbarProps<TData>) {
  const { t } = useI18n();
  const isFiltered = searchValue.length > 0 || statusFilter.length > 0 || departmentFilter.length > 0;

  // Ideally, get dynamic departments from a hook, but for now we'll mock a few or use empty array
  const departmentOptions = [
    { label: 'IT', value: 'IT' },
    { label: 'HR', value: 'HR' },
    { label: 'Manufacturing', value: 'Manufacturing' },
    { label: 'Logistics', value: 'Logistics' },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common', 'search')}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px] pl-8"
          />
        </div>
        <DataTableFacetedFilter
          title="Status"
          options={statusOptions}
          selectedValues={new Set(statusFilter)}
          onFilterChange={onStatusFilterChange}
        />
        <DataTableFacetedFilter
          title="Department"
          options={departmentOptions}
          selectedValues={new Set(departmentFilter)}
          onFilterChange={onDepartmentFilterChange}
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              onSearchChange('');
              onStatusFilterChange([]);
              onDepartmentFilterChange([]);
            }}
            className="h-8 px-2 lg:px-3"
          >
            Clear
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Settings2 className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm" className="h-8" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
        <Button variant="outline" size="sm" className="h-8" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button size="sm" className="h-8" onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>
    </div>
  );
}
