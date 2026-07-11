'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserList } from '@/features/users/components/user-list';
import { PermissionGroupManager } from '@/features/users/components/permission-group-manager';

export default function UsersPage() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-gray-600 mt-1">Manage users, roles, and permission groups</p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="permissions">Permission Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UserList />
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <PermissionGroupManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
