'use client';
import { create } from 'zustand';
import type { User } from '@/types';
import { ROLE_DEFAULT_GROUPS } from '@/constants/permissions';

interface UserState {
  user: User;
  switchUser: (user: User) => void;
}

const defaultUser: User = {
  id: 'user-001',
  name: 'John Chen',
  email: 'john.chen@company.com',
  department: 'IT Department',
  role: 'manager',
  employeeId: 'EMP001',
  permissionGroupIds: ROLE_DEFAULT_GROUPS.manager,
  isActive: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

export const useUserStore = create<UserState>((set) => ({
  user: defaultUser,
  switchUser: (user) => set({ user }),
}));
