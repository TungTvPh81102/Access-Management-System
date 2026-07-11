'use client';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/lib/api/endpoints';

export const entityKeys = {
  all: ['entities'] as const,
  departments: () => [...entityKeys.all, 'departments'] as const,
  companies: () => [...entityKeys.all, 'companies'] as const,
  employees: (search?: string) => [...entityKeys.all, 'employees', search] as const,
};

export function useDepartments() {
  return useQuery({
    queryKey: entityKeys.departments(),
    queryFn: () => api.fetchDepartments(),
  });
}

export function useCompanies() {
  return useQuery({
    queryKey: entityKeys.companies(),
    queryFn: () => api.fetchCompanies(),
  });
}

export function useEmployees(search?: string) {
  return useQuery({
    queryKey: entityKeys.employees(search),
    queryFn: () => api.fetchEmployees(search),
  });
}
