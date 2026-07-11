'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { PermissionMatrix } from '@/components/permission/permission-matrix';
import { SYSTEM_ROLES } from '@/constants/permission-system';

// Mock: count of users with each role
const MOCK_ROLE_USER_COUNTS: Record<string, number> = {
  'role-super-admin': 2,
  'role-dept-approver': 5,
  'role-receptionist': 3,
  'role-employee': 25,
  'role-reporter': 4,
  'role-asset-manager': 2,
  'role-hr-staff': 3,
};

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState(SYSTEM_ROLES[0]);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Roles</h1>
          <p className="text-muted-foreground">Manage system roles and permissions</p>
        </div>
        <Button className="gap-2" disabled>
          <Plus className="h-4 w-4" />
          New Role (Coming Soon)
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Roles List */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-4 space-y-2">
            <h2 className="font-semibold mb-4">System Roles</h2>
            {SYSTEM_ROLES.map((role) => {
              const userCount = MOCK_ROLE_USER_COUNTS[role.id] || 0;
              const isSelected = selectedRole?.id === role.id;

              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-transparent hover:bg-muted'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{role.name}</p>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </div>
                    {role.isSystemRole && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        System
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {userCount} users
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Role Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedRole && (
            <>
              {/* Role Info Card */}
              <div className="border rounded-lg p-6 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">{selectedRole.name}</h2>
                    {selectedRole.isSystemRole && (
                      <Badge variant="secondary">System Role</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{selectedRole.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium mb-1">Permissions</p>
                    <p className="text-2xl font-bold">{selectedRole.permissionIds.length}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Assigned Users</p>
                    <p className="text-2xl font-bold">
                      {MOCK_ROLE_USER_COUNTS[selectedRole.id] || 0}
                    </p>
                  </div>
                </div>

                {selectedRole.isSystemRole && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-sm text-amber-900">
                      ⚠️ This is a system role and cannot be modified. It includes all permissions necessary for its function.
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => setShowPermissionDialog(true)}
                  variant={selectedRole.isSystemRole ? 'outline' : 'default'}
                  disabled={selectedRole.isSystemRole}
                >
                  View Permission Matrix
                </Button>
              </div>

              {/* Permissions Summary */}
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold">Permission Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {['read', 'create', 'update', 'delete', 'approve', 'export'].map((action) => {
                    const count = selectedRole.permissionIds.filter((id) => id.includes(`:${action}:`)).length;
                    return (
                      <div key={action} className="flex justify-between items-center">
                        <span className="capitalize text-muted-foreground">{action}</span>
                        <Badge variant={count > 0 ? 'default' : 'outline'}>
                          {count}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Permission Matrix Dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRole?.name} - Permission Matrix</DialogTitle>
            <DialogDescription>
              Shows all permissions assigned to this role. System roles cannot be modified.
            </DialogDescription>
          </DialogHeader>

          {selectedRole && (
            <div className="space-y-4">
              <PermissionMatrix
                selectedPermissionIds={selectedRole.permissionIds}
                readOnly={true}
                showSystemRoleWarning={selectedRole.isSystemRole}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
