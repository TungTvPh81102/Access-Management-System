'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ClipboardList, CheckSquare, FileText, 
  History, BarChart3, Settings2, Settings, Shield,
  UserCheck, HardHat, PackagePlus, PackageMinus, Truck,
  HandCoins, Clock, CalendarClock, Car, Camera, AlertTriangle,
  Timer, FileCheck, Users
} from 'lucide-react';

import { useI18n } from '@/hooks/use-i18n';
import { useUserStore } from '@/stores/user-store';
import { NAV_ITEMS } from '@/constants';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

const ICONS: Record<string, React.ElementType> = {
  LayoutDashboard, ClipboardList, CheckSquare, FileText, 
  History, BarChart3, Settings2, Settings,
  UserCheck, HardHat, PackagePlus, PackageMinus, Truck,
  HandCoins, Clock, CalendarClock, Car, Camera, AlertTriangle,
  Timer, FileCheck, Users
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { t } = useI18n();
  const { user } = useUserStore();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Shield className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{t('common', 'appName')}</span>
                  <span className="truncate text-xs">Access Management</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => {
              const Icon = ICONS[item.icon];
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              
              if (item.children) {
                return (
                  <Collapsible
                    key={item.labelKey}
                    asChild
                    defaultOpen={isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={t('nav', item.labelKey)}>
                          {Icon && <Icon />}
                          <span>{t('nav', item.labelKey)}</span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((subItem) => {
                            const SubIcon = ICONS[subItem.icon];
                            const isSubActive = pathname === subItem.route;
                            // Use 'registration' namespace for registration types, 'administration' for admin items
                            const namespace = item.labelKey === 'registration' ? 'registration' : 'administration';
                            return (
                              <SidebarMenuSubItem key={subItem.type}>
                                <SidebarMenuSubButton asChild isActive={isSubActive}>
                                  <Link href={subItem.route}>
                                    {SubIcon && <SubIcon className="h-4 w-4" />}
                                    <span>{t(namespace, subItem.labelKey)}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.labelKey}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive} 
                    tooltip={t('nav', item.labelKey)}
                    className="cursor-pointer"
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                      <span>{t('nav', item.labelKey)}</span>
                      {item.labelKey === 'approvalCenter' && (
                        <Badge variant="destructive" className="ml-auto rounded-full px-1.5 py-0 text-[10px]">
                          12
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.role}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
