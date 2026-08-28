'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ApprovalDelegate } from '@/types';

// Mock data
const MOCK_DELEGATIONS: ApprovalDelegate[] = [
  {
    id: 'del-001',
    fromUserId: 'user-001',
    toUserId: 'user-002',
    startDate: '2024-01-15',
    endDate: '2024-01-30',
    moduleScopes: ['VISITOR', 'ASSET'],
    reason: 'Annual leave',
    isActive: true,
  },
  {
    id: 'del-002',
    fromUserId: 'user-002',
    toUserId: 'user-003',
    startDate: '2024-01-20',
    endDate: '2024-02-01',
    moduleScopes: undefined,  // all modules
    reason: 'Sick leave',
    isActive: true,
  },
];

const MOCK_USERS = [
  { id: 'user-001', name: 'John Chen', email: 'john@company.com' },
  { id: 'user-002', name: 'Jane Smith', email: 'jane@company.com' },
  { id: 'user-003', name: 'Mike Johnson', email: 'mike@company.com' },
  { id: 'user-004', name: 'Sarah Lee', email: 'sarah@company.com' },
];

const MODULES = ['VISITOR', 'CONTRACTOR', 'ASSET', 'OVERTIME', 'VEHICLE', 'CAMERA', 'RESTRICTED_AREA', 'WORK_PERMIT'];

export default function DelegationsPage() {
  const [delegations, setDelegations] = useState<ApprovalDelegate[]>(MOCK_DELEGATIONS);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    fromUserId: '',
    toUserId: '',
    startDate: '',
    endDate: '',
    moduleScopes: [] as string[],
    reason: '',
  });

  const activeDelegations = useMemo(() => {
    const today = new Date();
    return delegations.filter((d) => {
      const start = new Date(d.startDate);
      const end = new Date(d.endDate);
      return start <= today && today <= end;
    });
  }, [delegations]);

  const handleCreate = () => {
    if (!formData.fromUserId || !formData.toUserId || !formData.startDate || !formData.endDate) {
      return;
    }

    const newDelegation: ApprovalDelegate = {
      id: `del-${Date.now()}`,
      fromUserId: formData.fromUserId,
      toUserId: formData.toUserId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      moduleScopes: formData.moduleScopes.length > 0 ? formData.moduleScopes : undefined,
      reason: formData.reason,
      isActive: true,
    };

    setDelegations([...delegations, newDelegation]);
    setFormData({
      fromUserId: '',
      toUserId: '',
      startDate: '',
      endDate: '',
      moduleScopes: [],
      reason: '',
    });
    setShowCreateDialog(false);
  };

  const handleDelete = (id: string) => {
    setDelegations(delegations.filter((d) => d.id !== id));
  };

  const getUserName = (userId: string) => {
    return MOCK_USERS.find((u) => u.id === userId)?.name || 'Unknown';
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Approval Delegations</h1>
          <p className="text-muted-foreground">Temporarily delegate approval authority during absence</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Delegation
        </Button>
      </div>

      {/* Active Delegations Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Delegations</p>
          <p className="text-2xl font-bold">{delegations.length}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Active Now</p>
          <p className="text-2xl font-bold">{activeDelegations.length}</p>
        </div>
      </div>

      {/* Delegations Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>From (Original Approver)</TableHead>
              <TableHead>To (Delegate)</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Modules</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {delegations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No delegations created
                </TableCell>
              </TableRow>
            ) : (
              delegations.map((delegation) => {
                const expired = isExpired(delegation.endDate);
                const isActive = activeDelegations.some((d) => d.id === delegation.id);
                const startDate = new Date(delegation.startDate).toLocaleDateString();
                const endDate = new Date(delegation.endDate).toLocaleDateString();

                return (
                  <TableRow key={delegation.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{getUserName(delegation.fromUserId)}</TableCell>
                    <TableCell className="font-medium">{getUserName(delegation.toUserId)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {startDate} → {endDate}
                    </TableCell>
                    <TableCell className="text-sm">
                      {delegation.moduleScopes ? (
                        <div className="flex flex-wrap gap-1">
                          {delegation.moduleScopes.map((mod) => (
                            <Badge key={mod} variant="outline" className="text-xs">
                              {mod}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          All Modules
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{delegation.reason}</TableCell>
                    <TableCell>
                      {expired ? (
                        <Badge variant="outline" className="bg-gray-100">
                          Expired
                        </Badge>
                      ) : isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(delegation.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Delegation</DialogTitle>
            <DialogDescription>
              Temporarily delegate your approval authority to another user
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="from-user">From (Your Role)</Label>
              <Select value={formData.fromUserId} onValueChange={(v) => setFormData({ ...formData, fromUserId: v })}>
                <SelectTrigger id="from-user">
                  <SelectValue placeholder="Select approver" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_USERS.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="to-user">To (Delegate)</Label>
              <Select value={formData.toUserId} onValueChange={(v) => setFormData({ ...formData, toUserId: v })}>
                <SelectTrigger id="to-user">
                  <SelectValue placeholder="Select delegate" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_USERS.filter((u) => u.id !== formData.fromUserId).map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                placeholder="e.g., Annual leave, Conference attendance"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>

            <div>
              <Label>Module Scopes (Optional - leave empty for all)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {MODULES.map((mod) => (
                  <label key={mod} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.moduleScopes.includes(mod)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, moduleScopes: [...formData.moduleScopes, mod] });
                        } else {
                          setFormData({
                            ...formData,
                            moduleScopes: formData.moduleScopes.filter((m) => m !== mod),
                          });
                        }
                      }}
                    />
                    <span className="text-sm">{mod}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Delegation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
