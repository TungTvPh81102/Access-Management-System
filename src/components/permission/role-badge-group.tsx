'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SYSTEM_ROLES_MAP } from '@/constants/permission-system';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RoleBadgeGroupProps {
  roleIds: string[];
  maxDisplay?: number;  // default 3
}

/**
 * Hiển thị role dạng badge group, "+N more" nếu quá limit
 */
export function RoleBadgeGroup({ roleIds, maxDisplay = 3 }: RoleBadgeGroupProps) {
  const displayRoles = roleIds.slice(0, maxDisplay);
  const hiddenCount = Math.max(0, roleIds.length - maxDisplay);

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-1 items-center">
        {displayRoles.map((roleId) => {
          const role = SYSTEM_ROLES_MAP.get(roleId);
          if (!role) return null;

          return (
            <Tooltip key={roleId}>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="cursor-help">
                  {role.name}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{role.name}</p>
                <p className="text-xs text-muted-foreground">{role.description}</p>
                <p className="text-xs mt-1">{role.permissionIds.length} permissions</p>
              </TooltipContent>
            </Tooltip>
          );
        })}

        {hiddenCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="cursor-help">
                +{hiddenCount} more
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                {roleIds.slice(maxDisplay).map((roleId) => {
                  const role = SYSTEM_ROLES_MAP.get(roleId);
                  return (
                    <div key={roleId} className="text-xs">
                      <p className="font-semibold">{role?.name}</p>
                    </div>
                  );
                })}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
