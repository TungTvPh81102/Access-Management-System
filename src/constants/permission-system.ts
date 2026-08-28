import type { Module, Permission, Role } from '@/types';

// ========== MODULES ==========
export const MODULES: Module[] = [
  {
    id: 'mod-visitor',
    code: 'VISITOR',
    name: 'Visitor Management',
    description: 'Quản lý khách vãng lai',
    actions: ['read', 'create', 'update', 'delete', 'approve', 'export'],
  },
  {
    id: 'mod-contractor',
    code: 'CONTRACTOR',
    name: 'Contractor Management',
    description: 'Quản lý nhà thầu',
    actions: ['read', 'create', 'update', 'delete', 'approve', 'export'],
  },
  {
    id: 'mod-asset',
    code: 'ASSET',
    name: 'Asset Management',
    description: 'Quản lý tài sản',
    actions: ['read', 'create', 'update', 'delete', 'approve', 'export'],
  },
  {
    id: 'mod-overtime',
    code: 'OVERTIME',
    name: 'Overtime Management',
    description: 'Quản lý làm thêm giờ',
    actions: ['read', 'create', 'update', 'approve', 'export'],
  },
  {
    id: 'mod-vehicle',
    code: 'VEHICLE',
    name: 'Vehicle Management',
    description: 'Quản lý phương tiện',
    actions: ['read', 'create', 'update', 'delete', 'approve', 'export'],
  },
  {
    id: 'mod-camera',
    code: 'CAMERA',
    name: 'Camera Access',
    description: 'Quản lý cấp phép camera',
    actions: ['read', 'create', 'approve', 'export'],
  },
  {
    id: 'mod-restricted',
    code: 'RESTRICTED_AREA',
    name: 'Restricted Area Access',
    description: 'Quản lý quyền vào khu vực hạn chế',
    actions: ['read', 'create', 'approve', 'export'],
  },
  {
    id: 'mod-work-permit',
    code: 'WORK_PERMIT',
    name: 'Work Permit',
    description: 'Quản lý giấy phép làm việc',
    actions: ['read', 'create', 'approve', 'export'],
  },
];

// ========== PERMISSIONS (Module:Action:Scope) ==========
const generatePermissions = (): Permission[] => {
  const permissions: Permission[] = [];
  let permId = 1;

  MODULES.forEach((module) => {
    module.actions.forEach((action) => {
      // Generate all scope variants
      const scopes: Array<'all' | 'department' | 'own'> = 
        action === 'approve' 
          ? ['all', 'department']  // approver thường cần "all" hoặc "department"
          : action === 'read'
          ? ['all', 'department', 'own']
          : action === 'delete'
          ? ['all']  // delete thường full access
          : ['all', 'department'];

      scopes.forEach((scope) => {
        permissions.push({
          id: `perm-${permId++}`,
          code: `${module.code}:${action}:${scope}`,
          moduleCode: module.code,
          action: action as any,
          scope,
          description: `${scope === 'all' ? 'Full' : scope === 'department' ? 'Department' : 'Own'} ${action} for ${module.name}`,
        });
      });
    });
  });

  return permissions;
};

export const PERMISSIONS = generatePermissions();

// Helper: lấy permission IDs cho một module:action combo
export const getPermissionIds = (moduleCode: string, action: string, scopes: Array<'all' | 'department' | 'own'> = ['all']) => {
  return PERMISSIONS.filter((p) => p.moduleCode === moduleCode && p.action === action && scopes.includes(p.scope)).map((p) => p.id);
};

// ========== SYSTEM ROLES ==========
export const SYSTEM_ROLES: Role[] = [
  {
    id: 'role-super-admin',
    name: 'Super Admin',
    description: 'Full system access, cannot be modified',
    permissionIds: PERMISSIONS.map((p) => p.id),  // all permissions
    isSystemRole: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'role-dept-approver',
    name: 'Department Approver',
    description: 'Can approve requests within assigned departments',
    permissionIds: PERMISSIONS.filter((p) => p.action === 'approve').map((p) => p.id),
    isSystemRole: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'role-receptionist',
    name: 'Receptionist',
    description: 'Can create visitor registrations, limited access',
    permissionIds: [
      ...getPermissionIds('VISITOR', 'read', ['department']),
      ...getPermissionIds('VISITOR', 'create', ['all']),
    ],
    isSystemRole: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'role-employee',
    name: 'Employee',
    description: 'Can view dashboard and create own requests',
    permissionIds: [
      ...getPermissionIds('VISITOR', 'read', ['department', 'own']),
      ...getPermissionIds('OVERTIME', 'create', ['own']),
    ],
    isSystemRole: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'role-reporter',
    name: 'Reporter',
    description: 'Read-only access to reports and history',
    permissionIds: PERMISSIONS.filter((p) => p.action === 'read').map((p) => p.id),
    isSystemRole: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'role-asset-manager',
    name: 'Asset Manager',
    description: 'Full control over asset-related operations',
    permissionIds: [
      ...getPermissionIds('ASSET', 'read', ['all']),
      ...getPermissionIds('ASSET', 'create', ['all']),
      ...getPermissionIds('ASSET', 'update', ['all']),
      ...getPermissionIds('ASSET', 'delete', ['all']),
      ...getPermissionIds('ASSET', 'approve', ['all']),
    ],
    isSystemRole: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'role-hr-staff',
    name: 'HR Staff',
    description: 'Manage contractor and overtime approvals',
    permissionIds: [
      ...getPermissionIds('CONTRACTOR', 'read', ['department']),
      ...getPermissionIds('CONTRACTOR', 'create', ['department']),
      ...getPermissionIds('CONTRACTOR', 'approve', ['department']),
      ...getPermissionIds('OVERTIME', 'read', ['department']),
      ...getPermissionIds('OVERTIME', 'approve', ['department']),
    ],
    isSystemRole: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Index by ID for quick lookup
export const SYSTEM_ROLES_MAP = new Map(SYSTEM_ROLES.map((r) => [r.id, r]));
export const MODULES_MAP = new Map(MODULES.map((m) => [m.code, m]));
export const PERMISSIONS_MAP = new Map(PERMISSIONS.map((p) => [p.id, p]));
