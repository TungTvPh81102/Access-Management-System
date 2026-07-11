import type { Permission, PermissionGroup } from '@/types';

/**
 * Functional Permission Groups
 * Users can have multiple permission groups to combine different functional areas
 */
export const PERMISSION_GROUPS: Record<string, PermissionGroup> = {
  DASHBOARD_VIEWER: {
    id: 'group-dashboard-viewer',
    name: 'Dashboard Viewer',
    description: 'Can view dashboard and statistics',
    permissions: ['view_dashboard'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  REGISTRATION_MANAGER: {
    id: 'group-registration-mgr',
    name: 'Registration Manager',
    description: 'Can create and manage all registration types',
    permissions: [
      'view_dashboard',
      'manage_registrations',
      'manage_visitors',
      'manage_contractors',
      'manage_assets',
      'manage_vehicles',
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  APPROVAL_OFFICER: {
    id: 'group-approval-officer',
    name: 'Approval Officer',
    description: 'Can approve and review registration requests',
    permissions: [
      'view_dashboard',
      'approve_requests',
      'view_history',
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  ADMIN_PANEL: {
    id: 'group-admin-panel',
    name: 'System Administrator',
    description: 'Full access to system administration',
    permissions: [
      'view_dashboard',
      'manage_registrations',
      'approve_requests',
      'manage_users',
      'manage_workflows',
      'view_reports',
      'view_history',
      'manage_settings',
      'manage_visitors',
      'manage_contractors',
      'manage_assets',
      'manage_vehicles',
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  REPORTER: {
    id: 'group-reporter',
    name: 'Report Viewer',
    description: 'Can view reports and history data',
    permissions: [
      'view_dashboard',
      'view_reports',
      'view_history',
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  HR_STAFF: {
    id: 'group-hr-staff',
    name: 'HR Staff',
    description: 'Manages employee registrations and contractors',
    permissions: [
      'view_dashboard',
      'manage_registrations',
      'manage_contractors',
      'view_history',
      'approve_requests',
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
};

/**
 * Role-based default permission groups
 * This maps traditional roles to their default permission groups
 */
export const ROLE_DEFAULT_GROUPS: Record<string, string[]> = {
  admin: [
    PERMISSION_GROUPS.ADMIN_PANEL.id,
  ],
  manager: [
    PERMISSION_GROUPS.REGISTRATION_MANAGER.id,
    PERMISSION_GROUPS.APPROVAL_OFFICER.id,
  ],
  security: [
    PERMISSION_GROUPS.REGISTRATION_MANAGER.id,
    PERMISSION_GROUPS.APPROVAL_OFFICER.id,
  ],
  employee: [
    PERMISSION_GROUPS.DASHBOARD_VIEWER.id,
  ],
  receptionist: [
    PERMISSION_GROUPS.REGISTRATION_MANAGER.id,
  ],
  hr_staff: [
    PERMISSION_GROUPS.HR_STAFF.id,
  ],
};

/**
 * Get all permissions for a user based on their permission groups
 */
export function getUserPermissions(groupIds: string[]): Set<Permission> {
  const permissions = new Set<Permission>();
  
  groupIds.forEach(groupId => {
    const group = Object.values(PERMISSION_GROUPS).find(g => g.id === groupId);
    if (group) {
      group.permissions.forEach(p => permissions.add(p));
    }
  });
  
  return permissions;
}

/**
 * Check if user has specific permission
 */
export function hasPermission(userGroupIds: string[], requiredPermission: Permission): boolean {
  const permissions = getUserPermissions(userGroupIds);
  return permissions.has(requiredPermission);
}

/**
 * Check if user has any of the required permissions
 */
export function hasAnyPermission(userGroupIds: string[], requiredPermissions: Permission[]): boolean {
  const permissions = getUserPermissions(userGroupIds);
  return requiredPermissions.some(p => permissions.has(p));
}

/**
 * Check if user has all required permissions
 */
export function hasAllPermissions(userGroupIds: string[], requiredPermissions: Permission[]): boolean {
  const permissions = getUserPermissions(userGroupIds);
  return requiredPermissions.every(p => permissions.has(p));
}
