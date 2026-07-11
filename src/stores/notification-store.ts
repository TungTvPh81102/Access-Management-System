'use client';
import { create } from 'zustand';
import type { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const initialNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'New Visitor Request',
    message: 'John Smith from ABC Corp wants to visit.',
    type: 'info',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n2',
    title: 'Asset Out Approved',
    message: 'Your request to take out 2 Laptops has been approved.',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'n3',
    title: 'Overtime Request Rejected',
    message: 'Overtime for Team A was rejected by Manager.',
    type: 'error',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: initialNotifications,
  get unreadCount() {
    return initialNotifications.filter((n) => !n.read).length;
  },
  addNotification: (notification) => set((state) => {
    const newNotif: Notification = {
      ...notification,
      id: `n${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const newNotifications = [newNotif, ...state.notifications];
    return {
      notifications: newNotifications,
      unreadCount: newNotifications.filter((n) => !n.read).length,
    };
  }),
  markAsRead: (id) => set((state) => {
    const newNotifications = state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    return {
      notifications: newNotifications,
      unreadCount: newNotifications.filter((n) => !n.read).length,
    };
  }),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
    unreadCount: 0,
  })),
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
