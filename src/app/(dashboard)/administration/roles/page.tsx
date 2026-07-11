'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Users, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Define and manage system roles with permissions</p>
        </div>
        <Button className="gap-2 h-10 px-4" disabled>
          <Plus className="h-4 w-4" />
          New Role (Coming Soon)
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Roles List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">System Roles</CardTitle>
            <CardDescription>{SYSTEM_ROLES.length} predefined roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {SYSTEM_ROLES.map((role) => {
              const userCount = MOCK_ROLE_USER_COUNTS[role.id] || 0;
              const isSelected = selectedRole?.id === role.id;

              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{role.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{role.description}</p>
                    </div>
                    {role.isSystemRole && (
                      <Lock className="h-3 w-3 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {userCount} user{userCount !== 1 ? 's' : ''}
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Role Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedRole && (
            <>
              {/* Role Info Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">{selectedRole.name}</h2>
                      </div>
                      <p className="text-muted-foreground">{selectedRole.description}</p>
                    </div>
                    {selectedRole.isSystemRole && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800">
                        <Lock className="h-3 w-3 mr-1" />
                        System Role
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-muted-foreground font-medium">Total Permissions</p>
                      <p className="text-3xl font-bold mt-2">{selectedRole.permissionIds.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950 dark:to-purple-900/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                      <p className="text-sm text-muted-foreground font-medium">Assigned Users</p>
                      <p className="text-3xl font-bold mt-2">{MOCK_ROLE_USER_COUNTS[selectedRole.id] || 0}</p>
                    </div>
                  </div>

                  {selectedRole.isSystemRole && (
                    <div className="p-4 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-sm text-amber-900 dark:text-amber-400">
                        This is a system role and cannot be modified. It includes all permissions necessary for its function.
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => setShowPermissionDialog(true)}
                    variant={selectedRole.isSystemRole ? 'outline' : 'default'}
                    disabled={selectedRole.isSystemRole}
                    className="w-full"
                  >
                    View Permission Matrix
                  </Button>
                </CardContent>
              </Card>

              {/* Permissions Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Permission Summary by Action</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['read', 'create', 'update', 'delete', 'approve', 'export'].map((action) => {
                      const count = selectedRole.permissionIds.filter((id) => id.includes(`:${action}:`)).length;
                      return (
                        <div key={action} className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs font-medium text-muted-foreground capitalize mb-2">{action}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold">{count}</p>
                            {count > 0 && <Badge className="text-xs">Active</Badge>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
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
