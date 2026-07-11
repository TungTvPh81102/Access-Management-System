'use client';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/lib/api/endpoints';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  monthly: () => [...dashboardKeys.all, 'monthly'] as const,
  department: () => [...dashboardKeys.all, 'department'] as const,
  status: () => [...dashboardKeys.all, 'status'] as const,
  activities: () => [...dashboardKeys.all, 'activities'] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => api.fetchDashboardStats(),
  });
}

export function useMonthlyData() {
  return useQuery({
    queryKey: dashboardKeys.monthly(),
    queryFn: () => api.fetchMonthlyData(),
  });
}

export function useDepartmentData() {
  return useQuery({
    queryKey: dashboardKeys.department(),
    queryFn: () => api.fetchDepartmentData(),
  });
}

export function useStatusData() {
  return useQuery({
    queryKey: dashboardKeys.status(),
    queryFn: () => api.fetchStatusData(),
  });
}

export function useRecentActivities() {
  return useQuery({
    queryKey: dashboardKeys.activities(),
    queryFn: () => api.fetchRecentActivities(),
  });
}
