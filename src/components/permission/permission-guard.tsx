'use client';

import React from 'react';
import { usePermissionStore } from '@/stores/permission-store';

interface PermissionGuardProps {
  code: string;                    // e.g., "VISITOR:approve:all"
  targetDepartmentId?: string;     // bắt buộc nếu permission.scope = "department"
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * PermissionGuard: Ẩn/hiện UI dựa trên permission
 * 
 * ⚠️ IMPORTANT: Chỉ dùng để ẩn/hiện UI, KHÔNG phải bảo mật thật sự.
 * Mọi enforcement thật sự PHẢI nằm ở backend (API authorization, database constraints)
 * 
 * @example
 * <PermissionGuard code="VISITOR:approve:all">
 *   <ApproveButton />
 * </PermissionGuard>
 * 
 * <PermissionGuard 
 *   code="ASSET:delete:department" 
 *   targetDepartmentId={asset.departmentId}
 *   fallback={<p>No permission</p>}
 * >
 *   <DeleteButton />
 * </PermissionGuard>
 */
export function PermissionGuard({
  code,
  targetDepartmentId,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const hasPermission = usePermissionStore((state) => state.hasPermission);

  const allowed = hasPermission(code, targetDepartmentId);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
