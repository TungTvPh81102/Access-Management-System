'use client';

import React, { useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { MODULES, PERMISSIONS_MAP } from '@/constants/permission-system';
import type { ModuleAction } from '@/types';

interface PermissionMatrixProps {
  selectedPermissionIds: string[];
  onPermissionChange?: (permissionIds: string[]) => void;
  readOnly?: boolean;
  showSystemRoleWarning?: boolean;
}

/**
 * Bảng checkbox Module × Action × Scope
 * Dùng để assign permissions cho role
 */
export function PermissionMatrix({
  selectedPermissionIds,
  onPermissionChange,
  readOnly = false,
  showSystemRoleWarning = false,
}: PermissionMatrixProps) {
  // Group permissions by Module
  const modulePermissions = useMemo(() => {
    const grouped = new Map<string, Map<string, { scopes: Array<'all' | 'department' | 'own'>; ids: string[] }>>();

    MODULES.forEach((module) => {
      const actionMap = new Map<string, { scopes: Array<'all' | 'department' | 'own'>; ids: string[] }>();

      module.actions.forEach((action) => {
        const scopes: Array<'all' | 'department' | 'own'> = [];
        const ids: string[] = [];

        selectedPermissionIds.forEach((permId) => {
          const perm = PERMISSIONS_MAP.get(permId);
          if (perm && perm.moduleCode === module.code && perm.action === action) {
            scopes.push(perm.scope);
            ids.push(permId);
          }
        });

        if (scopes.length > 0 || !readOnly) {
          actionMap.set(action, { scopes, ids });
        }
      });

      if (actionMap.size > 0) {
        grouped.set(module.code, actionMap);
      }
    });

    return grouped;
  }, [selectedPermissionIds]);

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    if (readOnly) return;

    let newIds = [...selectedPermissionIds];
    if (checked) {
      newIds.push(permissionId);
    } else {
      newIds = newIds.filter((id) => id !== permissionId);
    }
    onPermissionChange?.(newIds);
  };

  if (showSystemRoleWarning) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
        <Badge variant="secondary" className="mb-2">System Role</Badge>
        <p className="text-sm text-amber-900">
          System roles cannot be modified. This role includes all permissions by default.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted border-b">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">Module</th>
            <th className="px-4 py-2 text-left font-semibold">Read</th>
            <th className="px-4 py-2 text-left font-semibold">Create</th>
            <th className="px-4 py-2 text-left font-semibold">Update</th>
            <th className="px-4 py-2 text-left font-semibold">Delete</th>
            <th className="px-4 py-2 text-left font-semibold">Approve</th>
            <th className="px-4 py-2 text-left font-semibold">Export</th>
          </tr>
        </thead>
        <tbody>
          {MODULES.map((module) => (
            <tr key={module.code} className="border-b hover:bg-muted/50">
              <td className="px-4 py-2 font-medium">
                <div>
                  <p>{module.name}</p>
                  <p className="text-xs text-muted-foreground">{module.code}</p>
                </div>
              </td>
              {(['read', 'create', 'update', 'delete', 'approve', 'export'] as ModuleAction[]).map((action) => {
                // Find 'all' scope permission for this module:action
                const permId = Array.from(PERMISSIONS_MAP.values()).find(
                  (p) => p.moduleCode === module.code && p.action === action && p.scope === 'all'
                )?.id;

                if (!permId) {
                  return <td key={action} className="px-4 py-2" />;
                }

                const isChecked = selectedPermissionIds.includes(permId);

                return (
                  <td key={action} className="px-4 py-2">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => handlePermissionToggle(permId, !!checked)}
                      disabled={readOnly}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
