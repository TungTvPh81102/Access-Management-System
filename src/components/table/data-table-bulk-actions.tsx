'use client';
import { Check, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataTableBulkActionsProps {
  selectedCount: number;
  onApprove: () => void;
  onReject: () => void;
  onExport: () => void;
  onClearSelection: () => void;
}

export function DataTableBulkActions({
  selectedCount,
  onApprove,
  onReject,
  onExport,
  onClearSelection,
}: DataTableBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-md border bg-background px-4 py-2 shadow-md">
      <div className="text-sm font-medium">
        {selectedCount} row{selectedCount > 1 ? 's' : ''} selected
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onApprove} className="text-status-success">
          <Check className="mr-2 h-4 w-4" />
          Approve All
        </Button>
        <Button size="sm" variant="outline" onClick={onReject} className="text-status-danger">
          <X className="mr-2 h-4 w-4" />
          Reject All
        </Button>
        <Button size="sm" variant="outline" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Selected
        </Button>
      </div>
      <Button size="sm" variant="ghost" onClick={onClearSelection} className="ml-2">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
