'use client';
import { create } from 'zustand';
import type { User } from '@/types';

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
};

export const useUserStore = create<UserState>((set) => ({
  user: defaultUser,
  switchUser: (user) => set({ user }),
}));
