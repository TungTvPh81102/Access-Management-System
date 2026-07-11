'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RoleBadgeGroup } from '@/components/permission/role-badge-group';
import { SYSTEM_ROLES_MAP } from '@/constants/permission-system';

// Mock data - thực tế từ API
const MOCK_USERS = [
  {
    id: 'user-001',
    employeeId: 'EMP001',
    name: 'John Chen',
    email: 'john.chen@company.com',
    departmentId: 'dept-it',
    roleIds: ['role-dept-approver', 'role-asset-manager'],
    scopeDepartmentIds: ['dept-it', 'dept-hr'],
    status: 'active' as const,
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'user-002',
    employeeId: 'EMP002',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    departmentId: 'dept-hr',
    roleIds: ['role-hr-staff'],
    scopeDepartmentIds: ['dept-hr'],
    status: 'active' as const,
    lastLogin: '2024-01-14T14:20:00Z',
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
  },
  {
    id: 'user-003',
    employeeId: 'EMP003',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    departmentId: 'dept-security',
    roleIds: ['role-receptionist'],
    scopeDepartmentIds: ['dept-security'],
    status: 'inactive' as const,
    lastLogin: '2023-12-20T09:15:00Z',
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2023-12-20T00:00:00Z',
  },
];

const MOCK_DEPARTMENTS = [
  { id: 'dept-it', code: 'IT', name: 'IT Department' },
  { id: 'dept-hr', code: 'HR', name: 'HR Department' },
  { id: 'dept-security', code: 'SEC', name: 'Security Department' },
  { id: 'dept-ops', code: 'OPS', name: 'Operations Department' },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'locked'>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesDept = departmentFilter === 'all' || user.departmentId === departmentFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [searchTerm, statusFilter, departmentFilter]);

  const statusColor = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    locked: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage system users and their roles</p>
        </div>
        <Link href="/administration/users/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New User
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row items-start sm:items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium mb-1 block">Search</label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Name, email, or employee ID..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full sm:w-[200px]">
          <label className="text-sm font-medium mb-1 block">Status</label>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="locked">Locked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-[200px]">
          <label className="text-sm font-medium mb-1 block">Department</label>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {MOCK_DEPARTMENTS.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => {
              const dept = MOCK_DEPARTMENTS.find((d) => d.id === user.departmentId);
              const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never';

              return (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">{user.employeeId}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="text-sm">{dept?.name || 'Unknown'}</TableCell>
                  <TableCell>
                    <RoleBadgeGroup roleIds={user.roleIds} maxDisplay={2} />
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColor[user.status]} variant="secondary">
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/administration/users/${user.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No users found</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold">{MOCK_USERS.length}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Active Users</p>
          <p className="text-2xl font-bold">{MOCK_USERS.filter((u) => u.status === 'active').length}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">System Roles</p>
          <p className="text-2xl font-bold">{Array.from(SYSTEM_ROLES_MAP.values()).length}</p>
        </div>
      </div>
    </div>
  );
}
