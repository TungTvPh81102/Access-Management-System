'use client';

import { create } from 'zustand';
import type { User, ApprovalDelegate, Permission } from '@/types';
import { SYSTEM_ROLES_MAP, PERMISSIONS_MAP } from '@/constants/permission-system';

interface PermissionStoreState {
  currentUser: User | null;
  activeDelegations: ApprovalDelegate[];
  
  // Precomputed: toàn bộ permission IDs của user (union từ mọi role)
  effectivePermissionIds: Set<string>;
  
  // Precomputed: Map từ permission code → Permission
  effectivePermissions: Map<string, Permission>;

  // Actions
  setCurrentUser: (user: User | null) => void;
  setActiveDelegations: (delegations: ApprovalDelegate[]) => void;

  // Query methods
  hasPermission: (permissionCode: string, targetDepartmentId?: string) => boolean;
  hasAnyPermission: (permissionCodes: string[], targetDepartmentId?: string) => boolean;
  hasAllPermissions: (permissionCodes: string[], targetDepartmentId?: string) => boolean;
}

/**
 * Tính toán effectivePermissions dựa trên roles của user
 * Được gọi một lần khi login/switch user — KHÔNG gọi lại mỗi lần check
 */
const computeEffectivePermissions = (user: User | null): { ids: Set<string>; perms: Map<string, Permission> } => {
  const ids = new Set<string>();
  const perms = new Map<string, Permission>();

  if (!user) {
    return { ids, perms };
  }

  // Union tất cả permissionIds từ mọi role user có
  user.roleIds.forEach((roleId) => {
    const role = SYSTEM_ROLES_MAP.get(roleId);
    if (role) {
      role.permissionIds.forEach((permId) => {
        ids.add(permId);
      });
    }
  });

  // Build Map từ permission ID → Permission object
  ids.forEach((permId) => {
    const perm = PERMISSIONS_MAP.get(permId);
    if (perm) {
      perms.set(perm.code, perm);
    }
  });

  return { ids, perms };
};

export const usePermissionStore = create<PermissionStoreState>((set, get) => ({
  currentUser: null,
  activeDelegations: [],
  effectivePermissionIds: new Set(),
  effectivePermissions: new Map(),

  setCurrentUser: (user) => {
    const { ids, perms } = computeEffectivePermissions(user);
    set({
      currentUser: user,
      effectivePermissionIds: ids,
      effectivePermissions: perms,
    });
  },

  setActiveDelegations: (delegations) => {
    set({ activeDelegations: delegations });
  },

  /**
   * Kiểm tra user có permission được code cho không
   * @param permissionCode e.g., "VISITOR:approve:all"
   * @param targetDepartmentId bắt buộc nếu permission.scope === 'department'
   */
  hasPermission: (permissionCode: string, targetDepartmentId?: string): boolean => {
    const state = get();
    const { currentUser, effectivePermissions } = state;

    if (!currentUser) return false;

    const perm = effectivePermissions.get(permissionCode);
    if (!perm) return false;

    // Check scope
    if (perm.scope === 'own') {
      // Chỉ được tác động trên request của chính user
      return true; // thực tế cần kiểm tra tại UI/API level
    }

    if (perm.scope === 'department') {
      // Cần targetDepartmentId và nó phải nằm trong scopeDepartmentIds
      if (!targetDepartmentId) return false;
      return currentUser.scopeDepartmentIds.includes(targetDepartmentId);
    }

    if (perm.scope === 'all') {
      return true;
    }

    return false;
  },

  hasAnyPermission: (permissionCodes: string[], targetDepartmentId?: string): boolean => {
    const { hasPermission } = get();
    return permissionCodes.some((code) => hasPermission(code, targetDepartmentId));
  },

  hasAllPermissions: (permissionCodes: string[], targetDepartmentId?: string): boolean => {
    const { hasPermission } = get();
    return permissionCodes.every((code) => hasPermission(code, targetDepartmentId));
  },
}));
