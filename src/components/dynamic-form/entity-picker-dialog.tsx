'use client';
import * as React from 'react';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEmployees, useDepartments, useCompanies } from '@/hooks/use-entity-data';

interface EntityPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: 'employee' | 'department' | 'company' | 'asset' | 'visitor';
  onSelect: (entity: Record<string, unknown>) => void;
}

export function EntityPickerDialog({ open, onOpenChange, entityType, onSelect }: EntityPickerDialogProps) {
  const [search, setSearch] = React.useState('');
  
  const { data: employees, isLoading: loadingEmps } = useEmployees(search);
  const { data: departments, isLoading: loadingDepts } = useDepartments();
  const { data: companies, isLoading: loadingComps } = useCompanies();

  let data: Record<string, unknown>[] = [];
  let columns: { key: string; label: string }[] = [];
  let isLoading = false;

  switch (entityType) {
    case 'employee':
      data = employees || [];
      columns = [
        { key: 'employeeId', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'department', label: 'Department' },
      ];
      isLoading = loadingEmps;
      break;
    case 'department':
      data = (departments || []).filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
      columns = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
      ];
      isLoading = loadingDepts;
      break;
    case 'company':
      data = (companies || []).filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
      columns = [
        { key: 'name', label: 'Company Name' },
        { key: 'contactPerson', label: 'Contact' },
      ];
      isLoading = loadingComps;
      break;
    default:
      data = [];
      break;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="capitalize">Select {entityType}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 my-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
        </div>
        <div className="rounded-md border h-[300px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map(col => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">No results found</TableCell>
                </TableRow>
              ) : (
                data.map((item, i) => (
                  <TableRow 
                    key={item.id || i} 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => {
                      onSelect(item);
                      onOpenChange(false);
                    }}
                  >
                    {columns.map(col => (
                      <TableCell key={col.key}>{item[col.key]}</TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
