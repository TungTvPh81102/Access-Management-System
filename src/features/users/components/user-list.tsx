'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/hooks/use-i18n';

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  isActive: boolean;
  permissionGroupIds: string[];
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'John Chen',
    email: 'john.chen@company.com',
    department: 'IT Department',
    role: 'manager',
    isActive: true,
    permissionGroupIds: ['group-registration-mgr', 'group-approval-officer'],
    createdAt: '2024-01-01',
  },
  {
    id: 'user-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    department: 'HR',
    role: 'hr_staff',
    isActive: true,
    permissionGroupIds: ['group-hr-staff'],
    createdAt: '2024-01-02',
  },
  {
    id: 'user-003',
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    department: 'Security',
    role: 'security',
    isActive: true,
    permissionGroupIds: ['group-registration-mgr', 'group-approval-officer'],
    createdAt: '2024-01-03',
  },
  {
    id: 'user-004',
    name: 'Lisa Brown',
    email: 'lisa.brown@company.com',
    department: 'Reception',
    role: 'receptionist',
    isActive: false,
    permissionGroupIds: ['group-registration-mgr'],
    createdAt: '2024-01-04',
  },
];

export function UserList() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const { t } = useI18n();

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = showInactive || user.isActive;
    return matchesSearch && matchesActive;
  });

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      security: 'bg-purple-100 text-purple-800',
      hr_staff: 'bg-green-100 text-green-800',
      receptionist: 'bg-yellow-100 text-yellow-800',
      employee: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Button
            variant={showInactive ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowInactive(!showInactive)}
            className="flex items-center gap-2"
          >
            {showInactive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {showInactive ? 'Show Active Only' : 'Show All'}
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Permission Groups</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.permissionGroupIds.length > 0 ? (
                      user.permissionGroupIds.map((groupId) => (
                        <Badge key={groupId} variant="secondary" className="text-xs">
                          {groupId.split('-')[1]?.slice(0, 3).toUpperCase()}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">None</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
}
