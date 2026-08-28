'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PERMISSION_GROUPS } from '@/constants/permissions';
import type { Permission } from '@/types';

const PERMISSION_LABELS: Record<Permission, string> = {
  view_dashboard: 'View Dashboard',
  manage_registrations: 'Manage Registrations',
  approve_requests: 'Approve Requests',
  view_reports: 'View Reports',
  manage_users: 'Manage Users',
  manage_workflows: 'Manage Workflows',
  view_history: 'View History',
  manage_settings: 'Manage Settings',
  manage_visitors: 'Manage Visitors',
  manage_contractors: 'Manage Contractors',
  manage_assets: 'Manage Assets',
  manage_vehicles: 'Manage Vehicles',
};

export function PermissionGroupManager() {
  const [selectedGroup, setSelectedGroup] = useState(Object.values(PERMISSION_GROUPS)[0]);
  const groups = Object.values(PERMISSION_GROUPS);

  const getPermissionColor = (permission: Permission) => {
    const type = permission.split('_')[0];
    const colors: Record<string, string> = {
      view: 'bg-blue-100 text-blue-800',
      manage: 'bg-purple-100 text-purple-800',
      approve: 'bg-green-100 text-green-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Groups List */}
      <div className="lg:col-span-1 space-y-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Permission Groups</h3>
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                selectedGroup.id === group.id
                  ? 'bg-primary/10 border-primary'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-sm">{group.name}</div>
              <div className="text-xs text-gray-500">{group.permissions.length} permissions</div>
            </button>
          ))}
        </div>
      </div>

      {/* Group Details */}
      <div className="lg:col-span-2 rounded-lg border bg-white p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{selectedGroup.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{selectedGroup.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-3">Permissions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedGroup.permissions.map((permission) => (
                <div
                  key={permission}
                  className={`flex items-center p-3 rounded-lg border ${getPermissionColor(permission)}`}
                >
                  <div className="flex-1 text-sm font-medium">
                    {PERMISSION_LABELS[permission as Permission]}
                  </div>
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="w-4 h-4"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
